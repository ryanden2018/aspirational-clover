namespace aspirational_clover.Server.Models;

/// <summary>
/// Represents a layer within a document, allowing for the organization and management of different elements in a 
/// layered structure. Each layer can have properties such as visibility, name, and z-index for rendering order.
/// </summary>
public class Layer
{
    /// <summary>
    /// The unique ID of this layer.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The ID of the document to which this layer belongs.
    /// </summary>
    public int DocumentId { get; set; }

    /// <summary>
    /// The human-readable name of this layer.
    /// </summary>
    public string? Name { get; set; }

    /// <summary>
    /// Whether the layer is hidden; if false or null, the layer is visible.
    /// </summary>
    public bool? Hidden { get; set; }

    /// <summary>
    /// The z-index of this layer. Higher z-index takes priority over lower z-index.
    /// </summary>
    public int? ZIndex { get; set; }
}
