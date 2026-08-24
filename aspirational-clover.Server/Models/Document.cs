namespace aspirational_clover.Server.Models;

public class Document
{
    public int Id { get; set; }
    public string? DocSlug { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime LastUpdatedAt { get; set; }
}
