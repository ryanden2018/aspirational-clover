using aspirational_clover.Server.DTOs;

namespace aspirational_clover.Server.Extensions;

/// <summary>
/// Extension methods for ShapeDTO
/// </summary>
public static class ShapeDTOExtensions
{
    /// <summary>
    /// Destructively set all ID properties of the ShapeDTO and its contained shapes to 0. This is useful for creating a 
    /// new shape based on an existing one without retaining any database IDs.
    /// </summary>
    /// <param name="shapeDTO"></param>
    public static void DestructivelyRemoveShapeIds(this ShapeDTO shapeDTO)
    {
        shapeDTO.LayerId = 0;

        shapeDTO.GetType().GetProperties()
            .Where(p => p.PropertyType != typeof(string) && p.PropertyType != typeof(int))
            .ToList()
            .ForEach(p =>
            {
                var shape = p.GetValue(shapeDTO);
                if (shape != null)
                {
                    var idProperty = shape.GetType().GetProperty("Id");
                    if (idProperty != null)
                    {
                        idProperty.SetValue(shape, 0);
                    }
                }
            });
    }
}
