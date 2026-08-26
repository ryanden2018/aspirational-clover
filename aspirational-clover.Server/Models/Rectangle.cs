namespace aspirational_clover.Server.Models;

using aspirational_clover.Server.Interfaces;

/// <summary>
/// Represents a rectangle shape with properties for fill, layer, and transformation.
/// </summary>
public class Rectangle : IFillable, ILayerable, ITransformable
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
    /// Gets or sets the X coordinate of the logical top-left point of the rectangle.
    /// </summary>
    public int X { get; set; }

    /// <summary>
    /// Gets or sets the Y coordinate of the logical top-left point of the rectangle.
    /// </summary>
    public int Y { get; set; }

    /// <summary>
    /// Gets or sets the width of the rectangle
    /// </summary>

    public int Width { get; set; }

    /// <summary>
    /// Gets or sets the height of the rectangle.
    /// </summary>
    public int Height { get; set; }

    /// <summary>
    /// Gets or sets the rotation angle in degrees for the rectangle.
    /// </summary>
    public int RotationAngle { get; set; }

    /// <summary>
    /// Gets or sets the X offset for the rotation center of the rectangle, originating from the standard center point.
    /// </summary>
    public int RotationCenterOffsetX { get; set; }

    /// <summary>
    /// Gets or sets the Y offset for the rotation center of the rectangle, originating from the standard center point.
    /// </summary>
    public int RotationCenterOffsetY { get; set; }

    /// <summary>
    /// Gets or sets the skew in degrees along the X-axis for the rectangle.
    /// </summary>
    public int SkewX { get; set; }

    /// <summary>
    /// Gets or sets the skew in degrees along the Y-axis for the rectangle.
    /// </summary>
    public int SkewY { get; set; }
}
