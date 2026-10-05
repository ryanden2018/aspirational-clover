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
            ClientUuid = Guid.NewGuid().ToString(),
            FillColorFrom = _colors[Random.Shared.Next(_colors.Length)],
            FillColorTo = _colors[Random.Shared.Next(_colors.Length)],
            FillAngle = Random.Shared.Next(0, 360),
            CenterX = Random.Shared.Next(0, 850),
            CenterY = Random.Shared.Next(0, 1100),
            Radius = Random.Shared.Next(50, 200),
            RotationAngle = Random.Shared.Next(0, 360),
            RotationCenterOffsetX = Random.Shared.Next(0, 4),
            RotationCenterOffsetY = Random.Shared.Next(0, 4),
            SkewX = Random.Shared.Next(-50, 50),
            SkewY = Random.Shared.Next(-50, 50)
        };
    }

    private static Rectangle MakeRandomRectangle(int layerId)
    {
        return new Rectangle
        {
            LayerId = layerId,
            ClientUuid = Guid.NewGuid().ToString(),
            FillColorFrom = _colors[Random.Shared.Next(_colors.Length)],
            FillColorTo = _colors[Random.Shared.Next(_colors.Length)],
            FillAngle = Random.Shared.Next(0, 360),
            X = Random.Shared.Next(0, 850),
            Y = Random.Shared.Next(0, 1100),
            Width = Random.Shared.Next(50, 200),
            Height = Random.Shared.Next(50, 200),
            RotationAngle = Random.Shared.Next(0, 360),
            RotationCenterOffsetX = Random.Shared.Next(0, 4),
            RotationCenterOffsetY = Random.Shared.Next(0, 4),
            SkewX = Random.Shared.Next(-50, 50),
            SkewY = Random.Shared.Next(-50, 50)
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

        var descDocument = new Document
        {
            DocumentSlug = "description",
            ClientUuid = Guid.NewGuid().ToString(),
            Name = "description",
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow
        };

        db.Documents.Add(descDocument);

        var descLayer = new Layer
        {
            DocumentId = descDocument.Id,
            ClientUuid = Guid.NewGuid().ToString(),
            Name = "Layer 1",
            Hidden = false,
            ZIndex = 0
        };

        db.Layers.Add(descLayer);

        db.TextBoxes.AddRange(
            new[]
            {
                new TextBox
                {
                    LayerId = descLayer.Id,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"This is a sample document.\"}",
                    X = 10,
                    Y = 100,
                    FontSize = 24,
                },
                new TextBox
                {
                    LayerId = descLayer.Id,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"You can edit this document, or create your own.\"}",
                    X = 10,
                    Y = 200,
                    FontSize = 24,
                },
                new TextBox
                {
                    LayerId = descLayer.Id,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"See above tabs for samples demonstrating the feature set.\"}",
                    X = 10,
                    Y = 300,
                    FontSize = 24,
                },
                new TextBox
                {
                    LayerId = descLayer.Id,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"This application is best viewed on a laptop or desktop device.\"}",
                    X = 10,
                    Y = 400,
                    FontSize = 24,
                },
            }
        );

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
            MakeRandomCircle(layer.Id),
            MakeRandomCircle(layer.Id),
            MakeRandomCircle(layer.Id),
            MakeRandomCircle(layer.Id),
            MakeRandomCircle(layer.Id),
            MakeRandomCircle(layer.Id),
        }).Aggregate(new List<Circle>(), (acc, val) => acc.Concat(val).ToList());

        db.Circles.AddRange(circles);

        var rectangles = layers.Select(layer => new[]
        {
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id),
            MakeRandomRectangle(layer.Id),
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
