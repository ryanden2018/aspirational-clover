using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Models;
using aspirational_clover.Server.Extensions;
using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Interfaces;

namespace aspirational_clover.Server.Services;

/// <summary>
/// Implementation of the service to manage documents, including create, read, update, and delete, accounting
/// for the hydrated layers and shapes in all methods.
/// </summary>
public class DocumentService : IDocumentService
{
    private readonly Data.AppDbContext _db;

    /// <summary>
    /// Constructor for DocumentService
    /// </summary>
    /// <param name="db"></param>
    public DocumentService(Data.AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Get shapes, either by a list of layers or globally.
    /// </summary>
    /// <param name="layerIDs"></param>
    /// <returns></returns>
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

    /// <summary>
    /// Retrieves all documents along with their associated hydrated layers and shapes.
    /// </summary>
    /// <returns></returns>
    public async Task<IEnumerable<DocumentDTO>> GetDocumentsWithLayersAndShapes()
    {
        var documents = (await _db.Documents.ToListAsync()).Select(d => new DocumentDTO(d));
        var layers = (await _db.Layers.ToListAsync()).Select(l => new LayerDTO(l));
        var shapes = await getShapes(null);

        return (new DocumentContainerDTO { DocumentDTOs = documents.ToList() })
             .PopulateLayers(layers.ToList(), shapes.ToList()).DocumentDTOs ??
             new List<DocumentDTO>();
    }

    /// <summary>
    /// Retrieves a specific document by its ID, including its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<DocumentDTO?> GetDocumentByIdWithLayersAndShapes(int id)
    {
        var item = await _db.Documents.FindAsync(id);
        if (item == null) return null;
        var layers = (await _db.Layers.Where(l => l.DocumentId == id).ToListAsync()).Select(l => new LayerDTO(l));
        var shapes = await getShapes(layers?.Select(l => l.Id).ToList());
        var itemAsList = new List<DocumentDTO> { new DocumentDTO(item) };
        var populatedDocument = (new DocumentContainerDTO { DocumentDTOs = itemAsList })
            .PopulateLayers(layers?.ToList() ?? new List<LayerDTO>(), shapes.ToList()).DocumentDTOs?.FirstOrDefault();
        return populatedDocument ?? new DocumentDTO(item);
    }

    /// <summary>
    /// Retrieves a specific document by its slug, including its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="slug"></param>
    /// <returns></returns>
    public async Task<DocumentDTO?> GetDocumentBySlugWithLayersAndShapes(string slug)
    {
        var item = await _db.Documents.FirstOrDefaultAsync(d => d.DocumentSlug == slug);
        if (item == null) return null;
        var layers = (await _db.Layers.Where(l => l.DocumentId == item.Id).ToListAsync()).Select(l => new LayerDTO(l));
        var shapes = await getShapes(layers?.Select(l => l.Id).ToList());
        var itemAsList = new List<DocumentDTO> { new DocumentDTO(item) };
        var populatedDocument = (new DocumentContainerDTO { DocumentDTOs = itemAsList })
            .PopulateLayers(layers?.ToList() ?? new List<LayerDTO>(), shapes.ToList()).DocumentDTOs?.FirstOrDefault();
        return populatedDocument ?? new DocumentDTO(item);
    }

    /// <summary>
    /// Creates a new document along with its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="documentDTO"></param>
    /// <returns></returns>
    public Task<DocumentDTO?> CreateDocument(DocumentDTO documentDTO)
    {
        // _db.Documents.Add(model);
        throw new NotImplementedException();
    }


    /// <summary>
    /// Updates an existing document along with its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="documentDTO"></param>
    /// <returns></returns>
    public Task<DocumentDTO?> UpdateDocument(DocumentDTO documentDTO)
    {
        //var existing = await _db.Documents.FindAsync(id);
        //if (existing == null) return NotFound();


        //// Update fields
        //existing.Date = model.Date;
        //existing.TemperatureC = model.TemperatureC;
        //existing.Summary = model.Summary;
        throw new NotImplementedException();
    }

    /// <summary>
    /// Deletes a document by its ID, along with its associated layers and shapes.
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    public async Task<Boolean> DeleteDocument(int id)
    {
        var document = GetDocumentByIdWithLayersAndShapes(id);

        var existing = await _db.Documents.FindAsync(id);
        if (existing == null) return false;

        var layers = await _db.Layers.Where(l => l.DocumentId == id).ToListAsync();
        var shapes = await getShapes(layers.Select(l => l.Id).ToList());

        _db.Documents.Remove(existing);
        _db.Layers.RemoveRange(layers.Select(l => new Layer { Id = l.Id }));
        _db.Circles.RemoveRange(shapes.Where(s => s?.Circle != null).Select(s => new Circle { Id = s.Circle?.Id ?? 0 }));
        _db.Rectangles.RemoveRange(shapes.Where(s => s?.Rectangle != null).Select(s => new Rectangle { Id = s.Rectangle?.Id ?? 0 }));
        _db.TextBoxes.RemoveRange(shapes.Where(s => s?.TextBox != null).Select(s => new TextBox { Id = s.TextBox?.Id ?? 0 }));

        return true;
    }
}
