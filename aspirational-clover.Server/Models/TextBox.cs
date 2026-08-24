namespace aspirational_clover.Server.Models;

using aspirational_clover.Server.Interfaces;

public class TextBox : ILayerable
{
    public string? Text { get; set; }
    public string? DocSlug { get; set; }
    public int LayerId { get; set; }
}

