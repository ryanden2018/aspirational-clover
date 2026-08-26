using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Extensions;

/// <summary>
/// Extension methods for DocumentContainerDTO
/// </summary>
public static class DocumentContainerDTOExtensions
{
    /// <summary>
    /// Populate the layers using a provided list of layers and shapes. This method creates a 
    /// new DocumentContainerDTO instance with the same documents as the original,
    /// but with the Layers property populated per-document based on the provided layers and shapes.
    /// Neither the source container nor its documents are modified; a new instance is returned.
    /// </summary>
    public static DocumentContainerDTO PopulateLayers(this DocumentContainerDTO documentDTO, List<LayerDTO> layerDTOs, List<ShapeDTO> shapeDTOs)
    {        
        var shapesDictionary = shapeDTOs?.GroupBy(shape => shape.LayerId)
            .ToDictionary(group => group.Key, group => group.ToList());

        var layerDictionary = layerDTOs?.GroupBy(layer => layer.DocumentId).ToDictionary(group => group.Key, group =>
            group?.ToList()?.Select(layer => layer.PopulateShapes(shapesDictionary?.ElementAt(layer.Id).Value)));


        return new DocumentContainerDTO
        {
            DocumentDTOs = documentDTO.DocumentDTOs?.Select(doc =>
                new DocumentDTO(
                    new Document
                    {
                        Id = doc.Id,
                        DocumentSlug = doc.DocumentSlug,
                        CreatedAt = doc.CreatedAt,
                        LastUpdatedAt = doc.LastUpdatedAt,
                    })
                {
                    Layers = layerDictionary?.ElementAt(doc.Id).Value?.ToList() ?? new List<LayerDTO>()
                }).ToList()
        };
    }
}