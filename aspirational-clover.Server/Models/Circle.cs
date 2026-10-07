namespace aspirational_clover.Server.Models;

using aspirational_clover.Server.Interfaces;

/// <summary>
/// Represents a circle shape with properties for fill, layer, and transformation.
/// </summary>
public class Circle : IFillable, ILayerable, ITransformable
{
    /// <summary>
    /// Gets or sets the unique identifier for the circle.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the client UUID of this entity (managed by the frontend).
    /// </summary>
    public string? ClientUuid { get; set; }

    /// <summary>
    /// Gets or sets the ID of the layer to which the circle belongs.
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
    public float FillAngle { get; set; }

    /// <summary>
    /// Gets or sets the X coordinate of the center of the circle.
    /// </summary>
    public float CenterX { get; set; }

    /// <summary>
    /// Gets or sets the Y coordinate of the center of the circle.
    /// </summary>
    public float CenterY { get; set; }

    /// <summary>
    /// Gets or sets the radius of the circle.
    /// </summary>
    public float Radius { get; set; }

    /// <summary>
    /// Gets or sets the rotation angle in degrees for the circle.
    /// </summary>
    public float RotationAngle { get; set; }

    /// <summary>
    /// Gets or sets the X offset for the rotation center of the circle, originating from the standard center point.
    /// </summary>
    public float RotationCenterOffsetX { get; set; }

    /// <summary>
    /// Gets or sets the Y offset for the rotation center of the circle, originating from the standard center point.
    /// </summary>
    public float RotationCenterOffsetY { get; set; }

    /// <summary>
    /// Gets or sets the skew in degrees along the X-axis for the circle.
    /// </summary>
    public float SkewX { get; set; }

    /// <summary>
    /// Gets or sets the skew in degrees along the Y-axis for the circle.
    /// </summary>
    public float SkewY { get; set; }
}
