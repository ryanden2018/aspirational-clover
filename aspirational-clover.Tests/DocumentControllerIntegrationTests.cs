using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Xunit;

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
    public async Task Post_Put_Workflow()
    {
        var initialRotationAngle = (float)125;
        var updateRotationAngle = (float)87;
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

    //[Fact]
    //public async Task Add_Shape_Workflow()
    //{
    //    var client = _factory.CreateClient();

    //    var documentSlug = Guid.NewGuid().ToString();

    //    var rectangleWidth = (float) 5.2;

    //    var postPayload = new DocumentDTO
    //    {
    //        Id = 0,
    //        DocumentSlug = documentSlug,
    //        CreatedAt = DateTime.UtcNow,
    //        LastUpdatedAt = DateTime.UtcNow,
    //        Layers = new List<LayerDTO>
    //        {
    //            new LayerDTO
    //            {
    //                Id = 0,
    //                DocumentId = 0,
    //                Name = "layer-1",
    //                Hidden = false,
    //                ZIndex = 0,
    //                Shapes = new List<ShapeDTO>
    //                {
    //                    new ShapeDTO
    //                    {
    //                        Circle = new Circle
    //                        {
    //                            Id = 0,
    //                            LayerId = 0,
    //                            FillColorFrom = "#000000",
    //                            FillColorTo = "",
    //                            FillAngle = 0,
    //                            CenterX = 0,
    //                            CenterY = 0,
    //                            Radius = 1,
    //                            RotationAngle = 0,
    //                            RotationCenterOffsetX = 0,
    //                            RotationCenterOffsetY = 0,
    //                            SkewX = 0,
    //                            SkewY = 0
    //                        },
    //                    }
    //                }
    //            }
    //        }
    //    };

    //    var getPutPayload = (int documentId, int layerId, int circleId) => new DocumentDTO
    //    {
    //        Id = documentId,
    //        DocumentSlug = documentSlug,
    //        CreatedAt = DateTime.UtcNow,
    //        LastUpdatedAt = DateTime.UtcNow,
    //        Layers = new List<LayerDTO>
    //        {
    //            new LayerDTO
    //            {
    //                Id = layerId,
    //                DocumentId = documentId,
    //                Name = "layer-1",
    //                Hidden = false,
    //                ZIndex = 0,
    //                Shapes = new List<ShapeDTO>
    //                {
    //                    new ShapeDTO
    //                    {
    //                        Circle = new Circle
    //                        {
    //                            Id = circleId,
    //                            LayerId = layerId,
    //                            FillColorFrom = "#000000",
    //                            FillColorTo = "",
    //                            FillAngle = 0,
    //                            CenterX = 0,
    //                            CenterY = 0,
    //                            Radius = 1,
    //                            RotationAngle = 0,
    //                            RotationCenterOffsetX = 0,
    //                            RotationCenterOffsetY = 0,
    //                            SkewX = 0,
    //                            SkewY = 0
    //                        },
    //                    },
    //                    new ShapeDTO
    //                    {
    //                        Rectangle = new Rectangle
    //                        {
    //                            Id = 0,
    //                            LayerId = layerId,
    //                            FillColorFrom = "#000000",
    //                            FillColorTo = "",
    //                            X = 0,
    //                            Y = 0,
    //                            Width = rectangleWidth,
    //                            Height = 1,
    //                            RotationAngle = 0,
    //                            RotationCenterOffsetX = 0,
    //                            RotationCenterOffsetY = 0,
    //                            SkewX = 0,
    //                            SkewY = 0,
    //                        }
    //                    }
    //                }
    //            }
    //        }
    //    };

    //    var json = JsonSerializer.Serialize(postPayload);

    //    var postHttpContent = new StringContent(json, Encoding.UTF8, "application/json");
    //    postHttpContent.Headers.Add("X-CSRF-Token", await getCsrfToken(client));
    //    var postRes = await client.PostAsync("/api/document", postHttpContent);
    //    Assert.Equal(HttpStatusCode.Created, postRes.StatusCode);

    //    var createdBody = await postRes.Content.ReadAsStringAsync();
    //    using var createdDoc = JsonDocument.Parse(createdBody);
    //    var id = createdDoc.RootElement.GetProperty("id").GetInt32();
    //    var layerId = createdDoc.RootElement.GetProperty("layers")[0].GetProperty("id").GetInt32();
    //    var circleId = createdDoc.RootElement.GetProperty("layers")[0].GetProperty("shapes")[0].GetProperty("circle").GetProperty("id").GetInt32();

    //    var updated = getPutPayload(id, layerId, circleId);

    //    var putJson = JsonSerializer.Serialize(updated);
    //    var putHttpContent = new StringContent(putJson, Encoding.UTF8, "application/json");
    //    putHttpContent.Headers.Add("X-CSRF-Token", await getCsrfToken(client));
    //    var putRes = await client.PutAsync($"/api/document/{id}", putHttpContent);
    //    Assert.Equal(HttpStatusCode.NoContent, putRes.StatusCode);

    //    var getRes2 = await client.GetAsync($"/api/document/{id}");
    //    Assert.Equal(HttpStatusCode.OK, getRes2.StatusCode);
    //    var getBody2 = await getRes2.Content.ReadAsStringAsync();
    //    using var getDoc2 = JsonDocument.Parse(getBody2);

    //    Assert.Equal(rectangleWidth, getDoc2.RootElement.GetProperty("layers")[0].GetProperty("shapes")[1].GetProperty("rectangle").GetProperty("width").GetInt32());
    //}
}
