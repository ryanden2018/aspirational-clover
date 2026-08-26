namespace aspirational_clover.Server.Models;

/// <summary>
/// Represents a document entity with properties for identification, slug, and timestamps for creation and last update.
/// </summary>
public class Document
{
    /// <summary>
    /// Gets or sets the unique identifier for the document.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the slug for the document, which is a URL-friendly string used to identify the document in a human-readable format.
    /// </summary>
    public string? DocumentSlug { get; set; }

    /// <summary>
    /// Gets or sets the timestamp indicating when the document was created. This property is set by the server during the initial 
    /// creation of the document and is immutable by the client.
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Gets or sets the timestamp indicating when the document was last updated. This property is set by the server during the
    /// initial creation of the document and updates, but should not be modified by the client (any value pushed by the client
    /// will be ignored).
    /// </summary>
    public DateTime LastUpdatedAt { get; set; }
}
