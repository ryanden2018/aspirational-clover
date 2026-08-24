namespace aspirational_clover.Server.Interfaces;

public interface ITransformable
{
    public int RotationAngle { get; set; }
    public int RotationCenterX { get; set; }
    public int RotationCenterY { get; set; }
    public int SkewX { get; set; }
    public int SkewY { get; set; }
}
