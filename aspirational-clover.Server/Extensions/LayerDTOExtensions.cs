using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Extensions;

/// <summary>
/// Extension methods for LayerDTO
/// </summary>
public static class LayerDTOExtensions
{
    /// <summary>
    /// Populate the shapes using a provided list of shapes. This method creates a new LayerDTO
    /// instance with the same properties as the original, but with Shapes property populated
    /// based on the provided shapes.
    /// </summary>
    public static LayerDTO PopulateShapes(this LayerDTO layerDTO, List<ShapeDTO>? shapeDTOs)
    {
        return new LayerDTO(
            new Layer
            {
                Id = layerDTO.Id,
                DocumentId = layerDTO.DocumentId,
                Name = layerDTO.Name,
                Hidden = layerDTO.Hidden ?? false, // Default to false if null
                ZIndex = layerDTO.ZIndex ?? 0 // Default to 0 if null
            })
        {
            Shapes = shapeDTOs?.Where(shapeDTO => shapeDTO.LayerId == layerDTO.Id).ToList() ?? new List<ShapeDTO>()
        };
    }

    /// <summary>
    /// Project a LayerDTO to a Layer model. This method creates a new Layer instance with the same properties as the LayerDTO,
    /// but without the Shapes property (which is hydrated at runtime).
    /// </summary>
    /// <param name="layerDTO"></param>
    /// <returns></returns>
    public static Layer ProjectToModel(this LayerDTO layerDTO)
    {
        return new Layer
        {
            Id = layerDTO.Id,
            DocumentId = layerDTO.DocumentId,
            Name = layerDTO.Name,
            Hidden = layerDTO.Hidden ?? false, // Default to false if null
            ZIndex = layerDTO.ZIndex ?? 0 // Default to 0 if null
        };
    }
}

