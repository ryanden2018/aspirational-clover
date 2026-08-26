using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.DTOs;

/// <summary>
/// Represents a Data Transfer Object (DTO) for the Document model, encapsulating the essential properties of a document, 
/// including its ID, slug, creation and last update timestamps, and associated layers. This DTO is used for transferring 
/// fully hydrated document data between the server and client while ensuring immutability of certain fields (eg CreatedAt).
/// </summary>
public class DocumentDTO
{
    /// <summary>
    /// Gets or sets the unique identifier for the document.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the slug for the document, which is a URL-friendly string that uniquely identifies the document.
    /// </summary>
    public string? DocumentSlug { get; set; }

    /// <summary>
    /// Gets or sets the timestamp indicating when the document was created. This property is immutable by the client and
    /// is set by the server during the initial creation of the document.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the timestamp indicating when the document was last updated. This property is also immutable by the client
    /// but will be automatically updated by the server whenever the document is modified.
    /// </summary>
    public DateTime LastUpdatedAt { get; set; }

    /// <summary>
    /// Gets or sets the list of layers associated with the document. Each layer is represented by a LayerDTO object, which contains
    /// the essential properties of a layer, as well as its hydrated shapes.
    /// </summary>
    public List<LayerDTO>? Layers { get; set; }

    /// <summary>
    /// Initializes a new instance of the DocumentDTO class based on the provided Document model. This constructor maps the properties
    /// from the Document model to the DocumentDTO, but does not hydrate Layers (see the DocumentDTOExtensions for that). The Layers 
    /// property is initialized as an empty list, and should be populated using the extension methods provided in DocumentDTOExtensions.
    /// This avoid placing the responsibility of hydrating nested objects in the constructor, which can lead to performance issues
    /// and circular dependencies.
    /// </summary>
    /// <param name="document"></param>
    public DocumentDTO(Document document)
    {
        Id = document.Id;
        DocumentSlug = document.DocumentSlug;
        CreatedAt = document.CreatedAt;
        LastUpdatedAt = document.LastUpdatedAt;
        Layers = new List<LayerDTO>(); // Initialize as an empty list (populate using the extension methods)
    }
}
