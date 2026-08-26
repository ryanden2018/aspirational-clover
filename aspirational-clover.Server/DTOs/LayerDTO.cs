using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.DTOs;

/// <summary>
/// Represents a data transfer object (DTO) for a Layer, encapsulating its 
/// properties and associated shapes for use in API responses or other data transfer scenarios.
/// </summary>
public class LayerDTO
{
    /// <summary>
    /// Gets or sets the unique identifier for the layer.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the unique identifier of the document to which this layer belongs.
    /// </summary>
    public int DocumentId { get; set; }

    /// <summary>
    /// Gets or sets the name of the layer, which can be used for display purposes or identification within the document.
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether the layer is hidden. A value of true indicates that the layer is 
    /// hidden, while false indicates that it is visible. If null, the visibility state is unspecified but can be
    /// rendered as visible in the client.
    /// </summary>
    public bool? Hidden { get; set; }

    /// <summary>
    /// Gets or sets the Z-index of the layer, which determines its stacking order relative to other layers.
    /// A higher Z-index value indicates that the layer is rendered above layers with lower Z-index values.
    /// If null, the Z-index is unspecified and may be treated as 0 in rendering.
    /// </summary>
    public int? ZIndex { get; set; }

    /// <summary>
    /// Gets or sets the list of shapes associated with the layer. Each shape is represented by a ShapeDTO object,
    /// which should by hydrated with only one of the possible shapes non-null.
    /// </summary>
    public List<ShapeDTO>? Shapes { get; set; }

    /// <summary>
    /// Initializes a new instance of the LayerDTO class based on the provided Layer model. This constructor maps the properties
    /// from the Layer model to the corresponding properties in the LayerDTO. The Shapes property is initialized as an empty list,
    /// and should be populated using the extension methods provided in LayerDTOExtensions. This avoid placing the responsibility
    /// of hydrating nested objects in the constructor, which can lead to performance issues and circular dependencies.
    /// </summary>
    /// <param name="layer"></param>
    public LayerDTO(Layer layer)
    {
        Id = layer.Id;
        DocumentId = layer.DocumentId;
        Name = layer.Name;
        Hidden = layer.Hidden;
        ZIndex = layer.ZIndex;
        Shapes = new List<ShapeDTO>(); // Initialize as an empty list (populate using the extension methods)
    }
}
