using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.DTOs;

/// <summary>
/// Represents a data transfer object (DTO) for a Layer, encapsulating its 
/// properties and associated shapes for use in API responses or other data transfer scenarios.
/// </summary>
public class LayerDTO : Layer
{
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

    /// <summary>
    /// Default constructor
    /// </summary>
    public LayerDTO() { }
}
