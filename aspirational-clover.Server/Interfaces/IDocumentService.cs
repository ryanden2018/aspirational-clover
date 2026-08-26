using aspirational_clover.Server.DTOs;

namespace aspirational_clover.Server.Interfaces;

public interface IDocumentService
{
    Task<IEnumerable<DocumentDTO>> GetDocumentsWithLayersAndShapes();
    Task<DocumentDTO?> GetDocumentByIdWithLayersAndShapes(int id);
    Task<DocumentDTO?> GetDocumentBySlugWithLayersAndShapes(string slug);
    Task<DocumentDTO?> CreateDocument(DocumentDTO documentDTO);
    Task<DocumentDTO?> UpdateDocument(DocumentDTO documentDTO);
    Task<bool> DeleteDocument(int id);
}
