using System;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;
using aspirational_clover.Server.DTOs;

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

        var initialRotationAngle = 125;

        var getNewItem = (int rotationAngle, int documentId, int layerId, int circleId) => new
        {
            Id = documentId,
            DocumentSlug = "test-doc",
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow,
            Layers = new[]
            {
                new
                {
                    Id = layerId,
                    DocumentId = documentId,
                    Name = "layer-1",
                    Hidden = false,
                    ZIndex = 0,
                    Shapes = new[]
                    {
                        new
                        {
                            Circle = new
                            {
                                Id = circleId,
                                LayerId = layerId,
                                FillColorFrom = "#FF0000",
                                FillColorTo = "#A1A1A1",
                                FillAngle = 220,
                                CenterX = 30,
                                CenterY = 20,
                                Radius = 5,
                                RotationAngle = rotationAngle,
                                RotationCenterOffsetX = 2,
                                RotationCenterOffsetY = 3,
                                SkewX = -32,
                                SkewY = 41
                            },
                        }
                    }
                }
            }
        };

        var newItem = getNewItem(initialRotationAngle, 0, 0, 0);

        // POST newItem
        var json = JsonSerializer.Serialize(newItem);
        var postRes = await client.PostAsync("/Document", new StringContent(json, Encoding.UTF8, "application/json"));
        Assert.Equal(HttpStatusCode.Created, postRes.StatusCode);

        var createdBody = await postRes.Content.ReadAsStringAsync();
        using var createdDoc = JsonDocument.Parse(createdBody);
        var id = createdDoc.RootElement.GetProperty("id").GetInt32();
        var layerId = createdDoc.RootElement.GetProperty("layers")[0].GetProperty("id").GetInt32();
        var circleId = createdDoc.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("id").GetInt32();

        // GET by id
        var getRes = await client.GetAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.OK, getRes.StatusCode);

        var getBody = await getRes.Content.ReadAsStringAsync();
        using var getDoc = JsonDocument.Parse(getBody);
        Assert.Equal(getDoc.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("rotationAngle").GetInt32(),
            initialRotationAngle);

        // PUT update
        var updateRotationAngle = 87;
        var updated = getNewItem(updateRotationAngle, id, layerId, circleId);

        var putJson = JsonSerializer.Serialize(updated);
        var putRes = await client.PutAsync($"/Document/{id}", new StringContent(putJson, Encoding.UTF8, "application/json"));
        Assert.Equal(HttpStatusCode.NoContent, putRes.StatusCode);

        var getRes2 = await client.GetAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.OK, getRes2.StatusCode);
        var getBody2 = await getRes2.Content.ReadAsStringAsync();
        using var getDoc2 = JsonDocument.Parse(getBody2);

        Assert.Equal(getDoc2.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("rotationAngle").GetInt32(),
            updateRotationAngle);

        // DELETE
        var delRes = await client.DeleteAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.NoContent, delRes.StatusCode);

        var getRes3 = await client.GetAsync($"/Document/{id}");
        Assert.Equal(HttpStatusCode.NotFound, getRes3.StatusCode);
    }
}
