namespace aspirational_clover.Server.Models;

public class Layer
{
    public int Id { get; set; }
    public int DocumentId { get; set; }
    public string? Name { get; set; }
    public bool? Hidden { get; set; }
    public int? ZIndex { get; set; }
}
