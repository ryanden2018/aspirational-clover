using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Extensions;

/// <summary>
/// Extension methods for WebApplication
/// </summary>
public static class WebApplicationExtensions
{
    private static string[] _colors = new[]
    {
        "#FF0000", "#00FF00", "#0000FF", "#A1A1A1", "#B2B2B2", "#C3C3C3"
    };

    private static Circle MakeRandomCircle(int layerId)
    {
        return new Circle
        {
            LayerId = layerId,
            FillColorFrom = _colors[Random.Shared.Next(_colors.Length)],
            FillColorTo = _colors[Random.Shared.Next(_colors.Length)],
            FillAngle = Random.Shared.Next(0, 360),
            CenterX = Random.Shared.Next(0, 100),
            CenterY = Random.Shared.Next(0, 100),
            Radius = Random.Shared.Next(1, 10),
            RotationAngle = Random.Shared.Next(0, 360),
            RotationCenterOffsetX = Random.Shared.Next(0, 4),
            RotationCenterOffsetY = Random.Shared.Next(0, 4),
            SkewX = Random.Shared.Next(-90, 90),
            SkewY = Random.Shared.Next(-90, 90)
        };
    }

    private static Rectangle MakeRandomRectangle(int layerId)
    {
        return new Rectangle
        {
            LayerId = layerId,
            FillColorFrom = _colors[Random.Shared.Next(_colors.Length)],
            FillColorTo = _colors[Random.Shared.Next(_colors.Length)],
            FillAngle = Random.Shared.Next(0, 360),
            X = Random.Shared.Next(0, 100),
            Y = Random.Shared.Next(0, 100),
            Width = Random.Shared.Next(1, 10),
            Height = Random.Shared.Next(1, 10),
            RotationAngle = Random.Shared.Next(0, 360),
            RotationCenterOffsetX = Random.Shared.Next(0, 4),
            RotationCenterOffsetY = Random.Shared.Next(0, 4),
            SkewX = Random.Shared.Next(-90, 90),
            SkewY = Random.Shared.Next(-90, 90)
        };
    }

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

        var slugs = new[]
        {
            "scores-doc", "remarks-doc", "books-doc", "markup-doc", "computer-doc"
        };

        var documents = Enumerable.Range(0, slugs.Length).Select(index => new Document
        {
            DocumentSlug = slugs[index],
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow
        });

        db.Documents.AddRange(documents);

        var layers = documents.Select(document => new[]
        {
            new Layer
            {
                DocumentId = document.Id,
                Name = "layer-1",
                Hidden = false,
                ZIndex = 0
            },
            new Layer
            {
                DocumentId = document.Id,
                Name = "layer-2",
                Hidden = false,
                ZIndex = 2
            },
            new Layer
            {
                DocumentId = document.Id,
                Name = "layer-3",
                Hidden = true,
                ZIndex = 1
            }
        }).Aggregate(new List<Layer>(), (acc, val) => acc.Concat(val).ToList());

        db.Layers.AddRange(layers);

        var circles = layers.Select(layer => new[]
        {
            MakeRandomCircle(layer.Id),
            MakeRandomCircle(layer.Id),
            MakeRandomCircle(layer.Id)
        }).Aggregate(new List<Circle>(), (acc, val) => acc.Concat(val).ToList());

        db.Circles.AddRange(circles);

        var rectangles = layers.Select(layer => new[]
        {
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id)
        }).Aggregate(new List<Rectangle>(), (acc, val) => acc.Concat(val).ToList());

        db.Rectangles.AddRange(rectangles);

        var textBoxes = layers.Select(layer => new[]
        {
            new TextBox
            {
                LayerId = layer.Id,
                Content = "{text: \"content-1\"}",
            },
            new TextBox
            {
                LayerId = layer.Id,
                Content = "{text: \"content-2\"}",
            }
        }).Aggregate(new List<TextBox>(), (acc, val) => acc.Concat(val).ToList());

        db.TextBoxes.AddRange(textBoxes);

        db.SaveChanges();
    }
}
