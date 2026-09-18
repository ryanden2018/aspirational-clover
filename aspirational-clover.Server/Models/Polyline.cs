namespace aspirational_clover.Server.Models;

using System.ComponentModel.DataAnnotations;

using aspirational_clover.Server.Interfaces;

/// <summary>
/// Represents a rectangle shape with properties for fill, layer, and transformation.
/// </summary>
public class Polyline : IFillable, ILayerable
{
    /// <summary>
    /// Gets or sets the unique identifier for the rectangle.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the ID of the layer to which this rectangle belongs.
    /// </summary>
    public int LayerId { get; set; }

    /// <summary>
    /// Gets or sets the starting color of the fill, represented as a string (e.g., hex code or color name).
    /// </summary>
    public string? FillColorFrom { get; set; }

    /// <summary>
    /// Gets or sets the ending color of the fill, represented as a string (e.g., hex code or color name).
    /// </summary>
    public string? FillColorTo { get; set; }

    /// <summary>
    /// Gets or sets the angle of the fill, in degrees.
    /// </summary>
    public int FillAngle { get; set; }

    /// <summary>
    /// Gets or sets the coordinates as a JSON string, eg:
    ///    Coords == "{'coords': [{'x':3,'y':4}, {'x':1,'y':2.25}, {'x':19,'y':25}]"
    /// It is closed precisely if the last array element is identical to the first (the client handles snapping).
    /// There is no logical bound to the length of the coordinate array. However, it is stored in the
    /// DB as a simple JSON string as above.
    /// </summary>
    [MaxLength]
    public string? Coords { get; set; }
}
