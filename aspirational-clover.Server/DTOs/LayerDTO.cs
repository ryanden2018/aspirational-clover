namespace aspirational_clover.Server.DTOs;

public class LayerDTO
{
    public int Id { get; set; }
    public int DocumentId { get; set; }
    public string? Name { get; set; }
    public bool? Hidden { get; set; }
    public int? ZIndex { get; set; }
    public List<ShapeDTO>? Shapes { get; set; }
}
