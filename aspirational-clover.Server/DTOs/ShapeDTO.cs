using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.DTOs;

/// <summary>
/// Represents a data transfer object (DTO) for shapes, encapsulating the properties of different shape types (Circle, Rectangle, TextBox, ...) 
/// and their associated layer information. This DTO is used to transfer shape data between different layers of the application (e.g.
/// backend and frontend), ensuring that only one shape type is represented at a time. Apart from the LayerID convenience field, exactly
/// one of the shape properties (Circle, Rectangle, TextBox, ...) should be non-null, depending on the shape type. If more than one
/// is non-null, behavior is undefined and should be avoided. If multiple shapes are needed, they should be recorded as a 
/// List&lt;ShapeDTO&gt; in the parent object.
/// </summary>
public class ShapeDTO
{
    /// <summary>
    /// Gets or sets the Circle shape data. If this property is non-null, it indicates that the shape represented by this DTO is a Circle.
    /// </summary>
    public Circle? Circle { get; set; }

    /// <summary>
    /// Gets or sets the Rectangle shape data. If this property is non-null, it indicates that the shape represented by this DTO is a Rectangle.
    /// </summary>
    public Rectangle? Rectangle { get; set; }

    /// <summary>
    /// Gets or sets the TextBox shape data. If this property is non-null, it indicates that the shape represented by this DTO is a TextBox.
    /// </summary>
    public TextBox? TextBox { get; set; }

    /// <summary>
    /// Gets or sets the ID of the layer to which the shape belongs. This property is a convenience field that allows for easy 
    /// access to the layer information without needing to access the individual shape properties. It is set based on the non-null 
    /// shape property (Circle, Rectangle, TextBox, ...) and should match the LayerId of that shape.
    /// </summary>

    public int LayerID { get; set; }

    /// <summary>
    /// Initializes a new instance of the ShapeDTO class with the specified shape data. The constructor accepts optional parameters
    /// for Circle, Rectangle, and TextBox shapes (but only one shape should be non-null). It sets the corresponding shape property 
    /// and determines the LayerID based on the non-null shape's LayerId.
    /// </summary>
    /// <param name="circle"></param>
    /// <param name="rectangle"></param>
    /// <param name="textBox"></param>
    public ShapeDTO(Circle? circle = null, Rectangle? rectangle = null, TextBox? textBox = null)
    {
        Circle = circle;
        Rectangle = rectangle;
        TextBox = textBox;
        LayerID = circle?.LayerId ?? rectangle?.LayerId ?? textBox?.LayerId ?? 0;
    }
}
