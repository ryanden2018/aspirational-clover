namespace aspirational_clover.Server.DTOs;

/// <summary>
/// Represents a container for a collection of DocumentDTO objects,
/// allowing for the organization and management of multiple documents within a single structure.
/// </summary>
public class DocumentContainerDTO
{
    /// <summary>
    /// Gets or sets the list of documents contained within this container.
    /// </summary>
    public List<DocumentDTO>? DocumentDTOs { get; set; }
}
