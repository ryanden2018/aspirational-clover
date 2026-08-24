using System;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;

namespace aspirational_clover.Tests;

public class DocumentControllerIntegrationTests : IClassFixture<WebApplicationFactory<aspirational_clover.Server.Program>>
{
    private readonly WebApplicationFactory<aspirational_clover.Server.Program> _factory;

    public DocumentControllerIntegrationTests(WebApplicationFactory<aspirational_clover.Server.Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Get_ReturnsSeededForecasts()
    {
        var client = _factory.CreateClient();

        var res = await client.GetAsync("/Document");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);

        var body = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);
        Assert.True(doc.RootElement.ValueKind == JsonValueKind.Array, "Response should be a JSON array");
        Assert.True(doc.RootElement.GetArrayLength() >= 5, "Expected at least 5 seeded items");
    }

    [Fact]
    public async Task Post_Put_Delete_Workflow()
    {
        var client = _factory.CreateClient();

        var newItem = new
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(7)),
            TemperatureC = 42,
            Summary = "Integration Test"
        };

        var json = JsonSerializer.Serialize(newItem);
        var postRes = await client.PostAsync("/Document", new StringContent(json, Encoding.UTF8, "application/json"));
        Assert.Equal(HttpStatusCode.Created, postRes.StatusCode);

        var createdBody = await postRes.Content.ReadAsStringAsync();
        using var createdDoc = JsonDocument.Parse(createdBody);
        var id = createdDoc.RootElement.GetProperty("id").GetInt32();

        // GET by id
        var getRes = await client.GetAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.OK, getRes.StatusCode);

        // PUT update
        var updated = new
        {
            Id = id,
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(8)),
            TemperatureC = 10,
            Summary = "Updated"
        };

        var putJson = JsonSerializer.Serialize(updated);
        var putRes = await client.PutAsync($"/Document/{id}", new StringContent(putJson, Encoding.UTF8, "application/json"));
        Assert.Equal(HttpStatusCode.NoContent, putRes.StatusCode);

        var getRes2 = await client.GetAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.OK, getRes2.StatusCode);
        var getBody2 = await getRes2.Content.ReadAsStringAsync();
        using var getDoc2 = JsonDocument.Parse(getBody2);
        Assert.Equal("Updated", getDoc2.RootElement.GetProperty("summary").GetString());

        // DELETE
        var delRes = await client.DeleteAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.NoContent, delRes.StatusCode);

        var getRes3 = await client.GetAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.NotFound, getRes3.StatusCode);
    }
}
