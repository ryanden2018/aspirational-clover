using aspirational_clover.Server.Models;
using aspirational_clover.Server.DTOs;

namespace aspirational_clover.Server.Extensions;

/// <summary>
/// Extension methods for DocumentDTO
/// </summary>
public static class DocumentDTOExtensions
{
    /// <summary>
    /// Project a DocumentDTO to a Document model. This method creates a new Document instance with the same properties as the DocumentDTO,
    /// but without the Layers property (which is hydrated at runtime).
    /// </summary>
    /// <param name="documentDTO"></param>
    /// <returns></returns>
    public static Document ProjectToModel(this DocumentDTO documentDTO)
    {
        return new Document
        {
            Id = documentDTO.Id,
            DocumentSlug = documentDTO.DocumentSlug,
            CreatedAt = documentDTO.CreatedAt,
            LastUpdatedAt = documentDTO.LastUpdatedAt
        };
    }
}

