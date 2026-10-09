using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

namespace aspirational_clover.Tests;

public class DocumentControllerIntegrationTests : IClassFixture<WebApplicationFactory<Server.Program>>
{
    private readonly WebApplicationFactory<Server.Program> _factory;

    public DocumentControllerIntegrationTests(WebApplicationFactory<Server.Program> factory)
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

    private async Task postPutWorkflow(float initialRotationAngle, Func<DocumentDTO, DocumentDTO> updater, float expectedValue, Func<JsonDocument, float> assertionChecker)
    {
        var client = _factory.CreateClient();

        var documentSlug = Guid.NewGuid().ToString();

        var getNewItem = (int documentId, int layerId, int circleId) => new DocumentDTO
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
                                RotationAngle = initialRotationAngle,
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

        var newItem = getNewItem(0, 0, 0);

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
        Assert.Equal(initialRotationAngle, (float) getDoc.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("rotationAngle").GetDecimal());

        // PUT update
        var updated = updater(getNewItem(id, layerId, circleId));

        var putJson = JsonSerializer.Serialize(updated);
        var putHttpContent = new StringContent(putJson, Encoding.UTF8, "application/json");
        putHttpContent.Headers.Add("X-CSRF-Token", await getCsrfToken(client));
        var putRes = await client.PutAsync($"/api/document/{id}", putHttpContent);
        Assert.Equal(HttpStatusCode.NoContent, putRes.StatusCode);

        var getRes2 = await client.GetAsync($"/api/document/{id}");
        Assert.Equal(HttpStatusCode.OK, getRes2.StatusCode);
        var getBody2 = await getRes2.Content.ReadAsStringAsync();
        using var getDoc2 = JsonDocument.Parse(getBody2);

        Assert.Equal(expectedValue, assertionChecker(getDoc2));
    }

    [Fact]
    public async Task Update_Shape_Workflow()
    {
        var initialRotationAngle = 125f;
        var updateRotationAngle = 87f;
        await postPutWorkflow(initialRotationAngle, doc =>
        {
            var shape = doc?.Layers[0]?.Shapes[0];
            if (shape?.Circle != null)
            {
                shape.Circle.RotationAngle = updateRotationAngle;
            }
            return doc;
        }, updateRotationAngle, doc => (float) doc.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("rotationAngle").GetDecimal());
    }

    [Fact]
    public async Task Delete_Shape_Workflow()
    {
        var initialRotationAngle = 38f;
        await postPutWorkflow(initialRotationAngle, doc =>
        {
            doc.Layers[0].Shapes.RemoveAt(0);
            return doc;
        }, 0f, doc =>
        {
            var shapes = doc.RootElement.GetProperty("layers")[0].GetProperty("shapes");
            if (shapes.ValueKind != JsonValueKind.Array) return -1f;
            return shapes.GetArrayLength();
        });
    }

    [Fact]
    public async Task Update_Layer_Workflow()
    {
        var initialRotationAngle = 48f;
        var updateZIndex = 12004f;
        await postPutWorkflow(initialRotationAngle, doc =>
        {
            doc.Layers[0].ZIndex = (int)updateZIndex;
            return doc;
        }, updateZIndex, doc => (float)doc.RootElement.GetProperty("layers")[0].GetProperty("zIndex").GetDecimal());
    }

    [Fact]
    public async Task Add_Shape_Workflow()
    {
        var initialRotationAngle = 62f;
        var rectangleWidth = 5.2f;
        await postPutWorkflow(initialRotationAngle, doc =>
        {
            var layer = doc.Layers[0];
            if (layer == null || layer.Shapes == null) return doc;
            var layerId = layer.Id;
            layer.Shapes.Add(new ShapeDTO
            {
                Rectangle = new Rectangle
                {
                    Id = 0,
                    LayerId = layerId,
                    FillColorFrom = "#000000",
                    FillColorTo = "",
                    X = 0,
                    Y = 0,
                    Width = rectangleWidth,
                    Height = 1,
                    RotationAngle = 0,
                    RotationCenterOffsetX = 0,
                    RotationCenterOffsetY = 0,
                    SkewX = 0,
                    SkewY = 0,
                }
            });
            return doc;
        }, rectangleWidth, doc =>
        {
            var shapes = doc.RootElement.GetProperty("layers")[0].GetProperty("shapes");
            for (int i = 0; i < 2; i++)
            {
                var shape = shapes[i];
                var rectangle = shape.GetProperty("rectangle");
                if (rectangle.ValueKind != JsonValueKind.Null)
                {
                    return (float)rectangle.GetProperty("width").GetDecimal();
                }
            }
            return -1f;
        });
    }

    [Fact]
    public async Task Add_Layer_Workflow()
    {
        var initialRotationAngle = 62f;
        var rectangleWidth = 8.7f;
        await postPutWorkflow(initialRotationAngle, doc =>
        {
            var layer = new LayerDTO
            {
                Id = 0,
                DocumentId = doc.Id,
                Name = "layer-2",
                Hidden = false,
                ZIndex = 105,
                Shapes = new List<ShapeDTO>(),
            };
            layer.Shapes.Add(new ShapeDTO
            {
                Rectangle = new Rectangle
                {
                    Id = 0,
                    LayerId = 0,
                    FillColorFrom = "#000000",
                    FillColorTo = "",
                    X = 0,
                    Y = 0,
                    Width = rectangleWidth,
                    Height = 1,
                    RotationAngle = 0,
                    RotationCenterOffsetX = 0,
                    RotationCenterOffsetY = 0,
                    SkewX = 0,
                    SkewY = 0,
                }
            });
            doc.Layers.Add(layer);
            return doc;
        }, rectangleWidth, doc =>
        {
            var layers = doc.RootElement.GetProperty("layers");
            for (int i = 0; i < 2; i++)
            {
                var layer = layers[i];
                var rectangle = layer.GetProperty("shapes")[0].GetProperty("rectangle");
                if (rectangle.ValueKind != JsonValueKind.Null)
                {
                    return (float)rectangle.GetProperty("width").GetDecimal();
                }
            }
            return -1f;
        });
    }


    //[Fact]
    //public async Task Delete_Layer_Workflow()
    //{
    //    var initialRotationAngle = 71f;
    //    await postPutWorkflow(initialRotationAngle, doc =>
    //    {
    //        doc.Layers = new List<LayerDTO>();
    //        return doc;
    //    }, 0f, doc =>
    //    {
    //        var layers = doc.RootElement.GetProperty("layers");
    //        if (layers.ValueKind != JsonValueKind.Array) return -1f;
    //        return layers.GetArrayLength();
    //    });
    //}
}
