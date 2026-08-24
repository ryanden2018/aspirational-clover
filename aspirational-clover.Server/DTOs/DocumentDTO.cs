namespace aspirational_clover.Server.DTOs;

public class DocumentDTO
{
    public int Id { get; set; }
    public string? DocSlug { get; set; }

    // Immutable by the client. This is written during the initial POST and never changed after that. Any value supplied by the client will be ignored.
    public DateTime CreatedAt { get; set; }

    // Any value supplied by the client will be ignored and overwritten with the current timestamp on the server.
    public DateTime LastUpdatedAt { get; set; }

    public List<LayerDTO>? Layers { get; set; }
}
