namespace aspirational_clover.Server.Interfaces;

public interface IFillable
{
    public string? FillColorFrom { get; set; }
    public string? FillColorTo { get; set; }
    public int FillAngle { get; set; }
}

