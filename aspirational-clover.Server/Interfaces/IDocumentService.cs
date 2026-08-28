using aspirational_clover.Server.DTOs;

namespace aspirational_clover.Server.Interfaces;

/// <summary>
/// Defines a contract for a service that manages documents, including operations to retrieve, create, update,
/// and delete documents along with their associated hydrated layers and shapes.
/// </summary>
public interface IDocumentService
{
    /// <summary>
    /// Retrieves all documents along with their associated hydrated layers and shapes.
    /// </summary>
    /// <returns></returns>
    Task<IEnumerable<DocumentDTO>> GetDocumentsWithLayersAndShapes();

    /// <summary>
    /// Retrieves a specific document by its ID, including its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<DocumentDTO?> GetDocumentByIdWithLayersAndShapes(int id);

    /// <summary>
    /// Retrieves a specific document by its slug, including its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="slug"></param>
    /// <returns></returns>
    Task<DocumentDTO?> GetDocumentBySlugWithLayersAndShapes(string slug);

    /// <summary>
    /// Creates a new document along with its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="documentDTO"></param>
    /// <returns></returns>
    Task<DocumentDTO?> CreateDocument(DocumentDTO documentDTO);

    /// <summary>
    /// Updates an existing document along with its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="documentDTO"></param>
    /// <returns></returns>
    Task<DocumentDTO?> UpdateDocument(DocumentDTO documentDTO);

    /// <summary>
    /// Deletes a document by its ID, along with its associated layers and shapes.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<bool> DeleteDocument(int id);
}
