using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Models;
using aspirational_clover.Server.Extensions;

namespace aspirational_clover.Server.Util;

/// <summary>
/// Create sample data
/// </summary>
public class CreateSamples
{
    private static string[] _colors = new[]
    {
        "#FF0000", "#00FF00", "#0000FF", "#A1A1A1", "#B2B2B2", "#C3C3C3"
    };

    /// <summary>
    /// Make a random circle.
    /// </summary>
    /// <param name="layerId"></param>
    /// <returns></returns>
    public static Circle MakeRandomCircle(int layerId)
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

    /// <summary>
    /// Make a random rectangle.
    /// </summary>
    /// <param name="layerId"></param>
    /// <returns></returns>
    public static Rectangle MakeRandomRectangle(int layerId)
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
    /// Create a sample document with name 'description' and introductory text.
    /// </summary>
    /// <returns></returns>
    public static (Document, Layer, TextBox[]) CreateDescriptionDocument()
    {
        var descDocument = new Document
        {
            DocumentSlug = "description",
            ClientUuid = Guid.NewGuid().ToString(),
            Name = "description",
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow
        };

        var descLayer = new Layer
        {
            DocumentId = 0,
            ClientUuid = Guid.NewGuid().ToString(),
            Name = "Layer 1",
            Hidden = false,
            ZIndex = 0
        };

        var descTextBoxes = new[]
            {
                new TextBox
                {
                    LayerId = 0,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"This is a sample document.\"}",
                    X = 10,
                    Y = 100,
                    FontSize = 24,
                },
                new TextBox
                {
                    LayerId = 0,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"You can edit this document, or create your own.\"}",
                    X = 10,
                    Y = 200,
                    FontSize = 24,
                },
                new TextBox
                {
                    LayerId = 0,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"See above tabs for samples demonstrating the feature set.\"}",
                    X = 10,
                    Y = 300,
                    FontSize = 24,
                },
                new TextBox
                {
                    LayerId = 0,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"This application is best viewed on a laptop or desktop device.\"}",
                    X = 10,
                    Y = 400,
                    FontSize = 24,
                },
            };

        return (descDocument, descLayer, descTextBoxes);
    }

    /// <summary>
    /// Create a description document DTO
    /// </summary>
    /// <returns></returns>
    public static DocumentDTO CreateDescriptionDocumentDTO()
    {
        var (document, layer, textBoxes) = CreateDescriptionDocument();
        var documentDTO = new DocumentDTO(document);
        if (layer == null || textBoxes == null) return documentDTO;
        if (documentDTO.Layers == null)
        {
            documentDTO.Layers = new List<LayerDTO>();
        }
        var layerDTO = new LayerDTO(layer);
        documentDTO.Layers.Add(layerDTO);
        if (layerDTO.Shapes == null)
        {
            layerDTO.Shapes = new List<ShapeDTO>();
        }
        foreach (var textBox in textBoxes)
        {
            layerDTO.Shapes.Add(new ShapeDTO(null, null, textBox, null));
        }
        return documentDTO;
    }

    /// <summary>
    /// Create a random sample document DTO.
    /// </summary>
    /// <param name="slug"></param>
    /// <returns></returns>
    public static DocumentDTO CreateSampleDocumentDTO(string slug)
    {
        var document = new Document
        {
            DocumentSlug = slug,
            ClientUuid = Guid.NewGuid().ToString(),
            Name = slug,
            CreatedAt = DateTime.UtcNow,
            LastUpdatedAt = DateTime.UtcNow
        };

        var documentDTO = new DocumentDTO(document);

        var layers = new[]
        {
            new Layer
            {
                DocumentId = 0,
                ClientUuid = Guid.NewGuid().ToString(),
                Name = "Layer 1",
                Hidden = false,
                ZIndex = 0
            },
            new Layer
            {
                DocumentId = 0,
                ClientUuid = Guid.NewGuid().ToString(),
                Name = "Layer 2",
                Hidden = false,
                ZIndex = 1
            },
            new Layer
            {
                DocumentId = 0,
                ClientUuid = Guid.NewGuid().ToString(),
                Name = "Layer 3",
                Hidden = false,
                ZIndex = 2
            }
        };

        documentDTO.Layers = layers.Select(layer => new LayerDTO(layer)).ToList();

        foreach (var layer in documentDTO.Layers)
        {
            if (layer.Shapes == null)
            {
                layer.Shapes = new List<ShapeDTO>();
            }

            var circles = new[]
            {
                MakeRandomCircle(0),
                MakeRandomCircle(0),
                MakeRandomCircle(0),
                MakeRandomCircle(0),
                MakeRandomCircle(0),
                MakeRandomCircle(0),
            };

            var rectangles = new[]
            {
                MakeRandomRectangle(0),
                MakeRandomRectangle(0),
                MakeRandomRectangle(0),
                MakeRandomRectangle(0),
                MakeRandomRectangle(0),
                MakeRandomRectangle(0),
                MakeRandomRectangle(0),
            };

            var textBoxes = new[]
            {
                new TextBox
                {
                    LayerId = 0,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"text box\"}",
                    X = 200,
                    Y = 200 + ((layer.ZIndex ?? 0) * 100),
                    FontSize = 24,
                },
                new TextBox
                {
                    LayerId = 0,
                    ClientUuid = Guid.NewGuid().ToString(),
                    Content = "{\"text\": \"text box\"}",
                    X = 500,
                    Y = 500 + ((layer.ZIndex ?? 0) * 100),
                    FontSize = 24,
                }
            };

            foreach (var circle in circles)
            {
                layer.Shapes.Add(new ShapeDTO(circle, null, null, null));
            }

            foreach (var rectangle in rectangles) {
                layer.Shapes.Add(new ShapeDTO(null, rectangle, null, null));
            }

            foreach (var textBox in textBoxes)
            {
                layer.Shapes.Add(new ShapeDTO(null, null, textBox, null));
            }
        }

        return documentDTO;
    }
}
