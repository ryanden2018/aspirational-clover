using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;
using aspirational_clover.Server.Util;

namespace aspirational_clover.Server.Extensions;

/// <summary>
/// Extension methods for WebApplication
/// </summary>
public static class WebApplicationExtensions
{
    /// <summary>
    /// Seed test data into the AppDbContext when running in Development and when enabled via configuration.
    /// </summary>
    public static void SeedTestData(this WebApplication app)
    {
        var configuration = app.Configuration;
        var env = app.Environment;

        // Only seed when running in Development by default. Allow override via configuration key "SeedTestData".
        var enabled = configuration.GetValue<bool?>("SeedTestData") ?? true;
        if (!env.IsDevelopment() || !enabled)
        {
           return;
        }

        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<Data.AppDbContext>();

        // Idempotent check
        if (db.Documents.Any())
        {
            return;
        }

        var (descDocument, descLayer, descTextBoxes) = CreateSamples.CreateDescriptionDocument();

        db.Documents.Add(descDocument);

        descLayer.DocumentId = descDocument.Id;

        db.Layers.Add(descLayer);

        foreach (var item in descTextBoxes)
        {
            item.LayerId = descLayer.Id;
        }

        db.TextBoxes.AddRange(descTextBoxes);

        var slugs = new[]
        {
            "sample-one", "sample-two"
        };

        var documents = Enumerable.Range(0, slugs.Length).Select(index => new Document
        {
            DocumentSlug = slugs[index],
            ClientUuid = Guid.NewGuid().ToString(),
            Name = slugs[index],
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow
        }).ToList();

        db.Documents.AddRange(documents);

        var layers = documents.Select(document => new[]
        {
            new Layer
            {
                DocumentId = document.Id,
                ClientUuid = Guid.NewGuid().ToString(),
                Name = "Layer 1",
                Hidden = false,
                ZIndex = 0
            },
            new Layer
            {
                DocumentId = document.Id,
                ClientUuid = Guid.NewGuid().ToString(),
                Name = "Layer 2",
                Hidden = false,
                ZIndex = 1
            },
            new Layer
            {
                DocumentId = document.Id,
                ClientUuid = Guid.NewGuid().ToString(),
                Name = "Layer 3",
                Hidden = false,
                ZIndex = 2
            }
        }).Aggregate(new List<Layer>(), (acc, val) => acc.Concat(val).ToList());

        db.Layers.AddRange(layers);

        var circles = layers.Select(layer => new[]
        {
            CreateSamples.MakeRandomCircle(layer.Id),
            CreateSamples.MakeRandomCircle(layer.Id),
            CreateSamples.MakeRandomCircle(layer.Id),
            CreateSamples.MakeRandomCircle(layer.Id),
            CreateSamples.MakeRandomCircle(layer.Id),
            CreateSamples.MakeRandomCircle(layer.Id),
        }).Aggregate(new List<Circle>(), (acc, val) => acc.Concat(val).ToList());

        db.Circles.AddRange(circles);

        var rectangles = layers.Select(layer => new[]
        {
            CreateSamples.MakeRandomRectangle(layer.Id),
            CreateSamples.MakeRandomRectangle(layer.Id),
            CreateSamples.MakeRandomRectangle(layer.Id),
            CreateSamples.MakeRandomRectangle(layer.Id),
            CreateSamples.MakeRandomRectangle(layer.Id),
            CreateSamples.MakeRandomRectangle(layer.Id),
            CreateSamples.MakeRandomRectangle(layer.Id),
        }).Aggregate(new List<Rectangle>(), (acc, val) => acc.Concat(val).ToList());

        db.Rectangles.AddRange(rectangles);

        var textBoxes = layers.Select(layer => new[]
        {
            new TextBox
            {
                LayerId = layer.Id,
                ClientUuid = Guid.NewGuid().ToString(),
                Content = "{\"text\": \"text box\"}",
                X = 200,
                Y = 200 + ((layer.ZIndex ?? 0) * 100),
                FontSize = 24,
            },
            new TextBox
            {
                LayerId = layer.Id,
                ClientUuid = Guid.NewGuid().ToString(),
                Content = "{\"text\": \"text box\"}",
                X = 500,
                Y = 500 + ((layer.ZIndex ?? 0) * 100),
                FontSize = 24,
            }
        }).Aggregate(new List<TextBox>(), (acc, val) => acc.Concat(val).ToList());

        db.TextBoxes.AddRange(textBoxes);

        db.SaveChanges();
    }
}
