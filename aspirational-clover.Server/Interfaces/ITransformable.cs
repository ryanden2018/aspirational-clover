namespace aspirational_clover.Server.Interfaces;

/// <summary>
/// Defines properties for objects that can be transformed, including rotation and skewing.
/// </summary>
public interface ITransformable
{
    /// <summary>
    /// Gets or sets the rotation angle in degrees for the object.
    /// </summary>
    public float RotationAngle { get; set; }

    /// <summary>
    /// Gets or sets the X offset for the rotation center of the object, originating from the standard center point.
    /// </summary>
    public float RotationCenterOffsetX { get; set; }

    /// <summary>
    /// Gets or sets the Y offset for the rotation center of the object, originating from the standard center point.
    /// </summary>
    public float RotationCenterOffsetY { get; set; }

    /// <summary>
    /// Gets or sets the skew in degrees along the X-axis for the object.
    /// </summary>
    public float SkewX { get; set; }

    /// <summary>
    /// Gets or sets the skew in degrees along the Y-axis for the object.
    /// </summary>
    public float SkewY { get; set; }
}
