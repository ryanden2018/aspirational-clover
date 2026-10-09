using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;
using System.Collections.Generic;

namespace aspirational_clover.Tests;

public class DocumentControllerIntegrationTests : IClassFixture<WebApplicationFactory<aspirational_clover.Server.Program>>
{
    private readonly WebApplicationFactory<aspirational_clover.Server.Program> _factory;

    public DocumentControllerIntegrationTests(WebApplicationFactory<aspirational_clover.Server.Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetSamples_ReturnsSampleData()
    {
        var client = _factory.CreateClient();

        var res = await client.GetAsync("/api/document/samples");

        Assert.Equal(HttpStatusCode.OK, res.StatusCode);

        var body = await res.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(body);
        Assert.True(doc.RootElement.ValueKind == JsonValueKind.Array, "Response should be a JSON array");
    }

    private async Task<string> getCsrfToken(HttpClient client)
    {
        var csrfTokenRes = await client.GetAsync("/api/token/create");
        return await csrfTokenRes.Content.ReadAsStringAsync();
    }

    [Fact]
    public async Task Post_Put_Workflow()
    {
        var client = _factory.CreateClient();

        var initialRotationAngle = 125;

        var documentSlug = Guid.NewGuid().ToString();

        var getNewItem = (int rotationAngle, int documentId, int layerId, int circleId) => new DocumentDTO
        {
            Id = documentId,
            DocumentSlug = documentSlug,
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow,
            Layers = new List<LayerDTO>
            {
                new LayerDTO
                {
                    Id = layerId,
                    DocumentId = documentId,
                    Name = "layer-1",
                    Hidden = false,
                    ZIndex = 0,
                    Shapes = new List<ShapeDTO>
                    {
                        new ShapeDTO
                        {
                            Circle = new Circle
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

        var postHttpContent = new StringContent(json, Encoding.UTF8, "application/json");
        postHttpContent.Headers.Add("X-CSRF-Token", await getCsrfToken(client));
        var postRes = await client.PostAsync("/api/document", postHttpContent);
        Assert.Equal(HttpStatusCode.Created, postRes.StatusCode);

        var createdBody = await postRes.Content.ReadAsStringAsync();
        using var createdDoc = JsonDocument.Parse(createdBody);
        var id = createdDoc.RootElement.GetProperty("id").GetInt32();
        var layerId = createdDoc.RootElement.GetProperty("layers")[0].GetProperty("id").GetInt32();
        var circleId = createdDoc.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("id").GetInt32();

        // GET by id
        var getRes = await client.GetAsync($"/api/document/{id}");
        Assert.Equal(HttpStatusCode.OK, getRes.StatusCode);

        var getBody = await getRes.Content.ReadAsStringAsync();
        using var getDoc = JsonDocument.Parse(getBody);
        Assert.Equal(getDoc.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("rotationAngle").GetInt32(),
            initialRotationAngle);

        // PUT update
        var updateRotationAngle = 87;
        var updated = getNewItem(updateRotationAngle, id, layerId, circleId);

        var putJson = JsonSerializer.Serialize(updated);
        var putHttpContent = new StringContent(putJson, Encoding.UTF8, "application/json");
        putHttpContent.Headers.Add("X-CSRF-Token", await getCsrfToken(client));
        var putRes = await client.PutAsync($"/api/document/{id}", putHttpContent);
        Assert.Equal(HttpStatusCode.NoContent, putRes.StatusCode);

        var getRes2 = await client.GetAsync($"/api/document/{id}");
        Assert.Equal(HttpStatusCode.OK, getRes2.StatusCode);
        var getBody2 = await getRes2.Content.ReadAsStringAsync();
        using var getDoc2 = JsonDocument.Parse(getBody2);

        Assert.Equal(getDoc2.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("rotationAngle").GetInt32(),
            updateRotationAngle);
    }

    [Fact]
    public async Task Add_Shape_Workflow()
    {
        var client = _factory.CreateClient();

        var documentSlug = Guid.NewGuid().ToString();

        var postPayload = new DocumentDTO
        {
            Id = 0,
            DocumentSlug = documentSlug,
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow,
            Layers = new List<LayerDTO>
            {
                new LayerDTO
                {
                    Id = 0,
                    DocumentId = 0,
                    Name = "layer-1",
                    Hidden = false,
                    ZIndex = 0,
                    Shapes = new List<ShapeDTO>
                    {
                        new ShapeDTO
                        {
                            Circle = new Circle
                            {
                                Id = 0,
                                LayerId = 0,
                                FillColorFrom = "#000000",
                                FillColorTo = "",
                                FillAngle = 0,
                                CenterX = 0,
                                CenterY = 0,
                                Radius = 1,
                                RotationAngle = 0,
                                RotationCenterOffsetX = 0,
                                RotationCenterOffsetY = 0,
                                SkewX = 0,
                                SkewY = 0
                            },
                        }
                    }
                }
            }
        };

        var getPutPayload = (int documentId, int layerId, int circleId) => new DocumentDTO
        {
            Id = documentId,
            DocumentSlug = documentSlug,
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow,
            Layers = new List<LayerDTO>
            {
                new LayerDTO
                {
                    Id = layerId,
                    DocumentId = documentId,
                    Name = "layer-1",
                    Hidden = false,
                    ZIndex = 0,
                    Shapes = new List<ShapeDTO>
                    {
                        new ShapeDTO
                        {
                            Circle = new Circle
                            {
                                Id = circleId,
                                LayerId = layerId,
                                FillColorFrom = "#000000",
                                FillColorTo = "",
                                FillAngle = 0,
                                CenterX = 0,
                                CenterY = 0,
                                Radius = 1,
                                RotationAngle = 0,
                                RotationCenterOffsetX = 0,
                                RotationCenterOffsetY = 0,
                                SkewX = 0,
                                SkewY = 0
                            },
                        },
                        new ShapeDTO
                        {
                            Rectangle = new Rectangle
                            {
                                Id = 0,
                                LayerId = layerId,
                                FillColorFrom = "#000000",
                                FillColorTo = "",
                                X = 0,
                                Y = 0,
                                Width = 1,
                                Height = 1,
                                RotationAngle = 0,
                                RotationCenterOffsetX = 0,
                                RotationCenterOffsetY = 0,
                                SkewX = 0,
                                SkewY = 0,
                            }
                        }
                    }
                }
            }
        };


    }
}
