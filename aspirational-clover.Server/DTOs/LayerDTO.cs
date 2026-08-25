using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.DTOs;

public class LayerDTO
{
    public int Id { get; set; }
    public int DocumentId { get; set; }
    public string? Name { get; set; }
    public bool? Hidden { get; set; }
    public int? ZIndex { get; set; }
    public List<ShapeDTO>? Shapes { get; set; }

    public LayerDTO(Layer layer)
    {
        Id = layer.Id;
        DocumentId = layer.DocumentId;
        Name = layer.Name;
        Hidden = layer.Hidden;
        ZIndex = layer.ZIndex;
        Shapes = new List<ShapeDTO>(); // Initialize as an empty list (populate using the extension methods)
    }
}
