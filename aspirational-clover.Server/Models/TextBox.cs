namespace aspirational_clover.Server.Models;

using aspirational_clover.Server.Interfaces;

public class TextBox : ILayerable
{    
    public string? DocSlug { get; set; }
    public int LayerId { get; set; }
    public string? Content { get; set; } // JSON string -- interpreted from the front-end as a rich text editor content
}

