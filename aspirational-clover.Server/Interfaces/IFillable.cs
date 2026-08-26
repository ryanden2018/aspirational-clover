namespace aspirational_clover.Server.Interfaces;

/// <summary>
/// Defines a contract for objects that can have fill properties, including fill colors and fill angle.
/// </summary>
public interface IFillable
{
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
}

