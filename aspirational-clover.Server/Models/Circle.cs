namespace aspirational_clover.Server.Models;

using aspirational_clover.Server.Interfaces;

public class Circle : IFillable, ILayerable, ITransformable
{
    public int Id { get; set; }
    public string? DocSlug { get; set; }
    public int LayerId { get; set; }
    public string? FillColorFrom { get; set; }
    public string? FillColorTo { get; set; }
    public int FillAngle { get; set; }
    public int CenterX { get; set; }
    public int CenterY { get; set; }
    public int Radius { get; set; }
    public int RotationAngle { get; set; }
    public int RotationCenterX { get; set; }
    public int RotationCenterY { get; set; }
    public int SkewX { get; set; }
    public int SkewY { get; set; }
}
