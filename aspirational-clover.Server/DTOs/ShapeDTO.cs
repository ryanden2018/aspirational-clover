using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.DTOs;

public class ShapeDTO
{
    // Exactly one of these properties should be non-null, depending on the shape type.
    // ***If more than one is non-null, behavior is UNDEFINED and should be avoided.***
    // If you need multiple shapes, record them as List<ShapeDTO> in the parent.
    public Circle? Circle { get; set; }
    public Rectangle? Rectangle { get; set; }
    public TextBox? TextBox { get; set; }
}
