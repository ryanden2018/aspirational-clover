using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;
using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Extensions;

namespace aspirational_clover.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class DocumentController : ControllerBase
{
    private readonly Data.AppDbContext _db;

    public DocumentController(Data.AppDbContext db)
    {
        _db = db;
    }

    private async Task<IEnumerable<ShapeDTO>> getShapes(List<int>? layerIDs)
    {
        var circles = (await _db.Circles.Where(c => layerIDs == null || layerIDs.Contains(c.LayerId)).ToListAsync())
                .Select(c => new ShapeDTO(c, null, null));
        var rectangles = (await _db.Rectangles.Where(r => layerIDs == null || layerIDs.Contains(r.LayerId)).ToListAsync())
                .Select(r => new ShapeDTO(null, r, null));
        var textBoxes = (await _db.TextBoxes.Where(t => layerIDs == null || layerIDs.Contains(t.LayerId)).ToListAsync())
                .Select(t => new ShapeDTO(null, null, t));
        return circles.Concat(rectangles).Concat(textBoxes);
    }

    [HttpGet(Name = "GetDocuments")]
    public async Task<IEnumerable<DocumentDTO>> Get()
    {
        var documents = (await _db.Documents.ToListAsync()).Select(d => new DocumentDTO(d));
        var layers = (await _db.Layers.ToListAsync()).Select(l => new LayerDTO(l));
        var shapes = await getShapes(null);

       return (new DocumentContainerDTO { DocumentDTOs = documents.ToList() })
            .PopulateLayers(layers.ToList(), shapes.ToList()).DocumentDTOs ?? 
            new List<DocumentDTO>();
    }

    [HttpGet("{id}", Name = "GetDocumentById")]
    public async Task<ActionResult<DocumentDTO>> GetById(int id)
    {
        var item = await _db.Documents.FindAsync(id);
        if (item == null) return NotFound();
        var layers = (await _db.Layers.Where(l => l.DocumentId == id).ToListAsync()).Select(l => new LayerDTO(l));
        var shapes = await getShapes(layers?.Select(l => l.Id).ToList());
        var itemAsList = new List<DocumentDTO> { new DocumentDTO(item) };
        var populatedDocument = (new DocumentContainerDTO { DocumentDTOs = itemAsList })
            .PopulateLayers(layers?.ToList() ?? new List<LayerDTO>(), shapes.ToList()).DocumentDTOs?.FirstOrDefault();
        return populatedDocument ?? new DocumentDTO(item);
    }

    [HttpGet("slug/{slug}", Name = "GetDocumentBySlug")]
    public async Task<ActionResult<DocumentDTO>> GetBySlug(string slug)
    {
        var item = await _db.Documents.FirstOrDefaultAsync(d => d.DocumentSlug == slug);
        if (item == null) return NotFound();
        var layers = (await _db.Layers.Where(l => l.DocumentId == item.Id).ToListAsync()).Select(l => new LayerDTO(l));
        var shapes = await getShapes(layers?.Select(l => l.Id).ToList());
        var itemAsList = new List<DocumentDTO> { new DocumentDTO(item) };
        var populatedDocument = (new DocumentContainerDTO { DocumentDTOs = itemAsList })
            .PopulateLayers(layers?.ToList() ?? new List<LayerDTO>(), shapes.ToList()).DocumentDTOs?.FirstOrDefault();
        return populatedDocument ?? new DocumentDTO(item);
    }

    [HttpPost]
    public async Task<ActionResult<Document>> Post([FromBody] Document model)
    {
        // Ensure id is not set by client
        model.Id = 0;
        _db.Documents.Add(model);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] Document model)
    {
        var existing = await _db.Documents.FindAsync(id);
        if (existing == null) return NotFound();

        //// Update fields
        //existing.Date = model.Date;
        //existing.TemperatureC = model.TemperatureC;
        //existing.Summary = model.Summary;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _db.Documents.FindAsync(id);
        if (existing == null) return NotFound();

        var layers = await _db.Layers.Where(l => l.DocumentId == id).ToListAsync();
        var shapes = await getShapes(layers.Select(l => l.Id).ToList());


        _db.Documents.Remove(existing);
        _db.Layers.RemoveRange(layers.Select(l => new Layer { Id = l.Id }));
        _db.Circles.RemoveRange(shapes.Where(s => s?.Circle != null).Select(s => new Circle { Id = s.Circle?.Id ?? 0 }));
        _db.Rectangles.RemoveRange(shapes.Where(s => s?.Rectangle != null).Select(s => new Rectangle { Id = s.Rectangle?.Id ?? 0 }));
        _db.TextBoxes.RemoveRange(shapes.Where(s => s?.TextBox != null).Select(s => new TextBox { Id = s.TextBox?.Id ?? 0 }));

        await _db.SaveChangesAsync();
        return NoContent();
    }
}
