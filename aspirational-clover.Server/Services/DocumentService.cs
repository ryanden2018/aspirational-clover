using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Extensions;
using aspirational_clover.Server.Interfaces;
using aspirational_clover.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

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

    private void CreateCircle(int layerId, Circle? circle)
    {
        if (circle == null) return;
        circle.LayerId = layerId;
        if (circle.Id == 0)
        {
            _db.Circles.Add(circle);
        }
    }

    private void CreateRectangle(int layerId, Rectangle? rectangle)
    {
        if (rectangle == null) return;
        rectangle.LayerId = layerId;
        if (rectangle.Id == 0) {
            _db.Rectangles.Add(rectangle);
        }
    }

    private void CreateTextBox(int layerId, TextBox? textBox)
    {
        if (textBox == null) return;
        textBox.LayerId = layerId;
        if (textBox.Id == 0)
        {
            _db.TextBoxes.Add(textBox);
        }
    }

    private void CreateShape(int layerId, ShapeDTO shapeDTO)
    {
        shapeDTO.LayerId = layerId;
        CreateCircle(layerId, shapeDTO.Circle);
        CreateRectangle(layerId, shapeDTO.Rectangle);
        CreateTextBox(layerId, shapeDTO.TextBox);
    }

    private void CreateLayerAndShapes(int documentId, LayerDTO layerDTO)
    {
        var layer = layerDTO.ProjectToModel();
        layer.Id = 0;
        layer.DocumentId = documentId;
        _db.Layers.Add(layer);
        var layerId = layer.Id;
        layerDTO.Id = layerId;
        var shapes = layerDTO.Shapes ?? new List<ShapeDTO>();

        foreach (var shapeDTO in shapes)
        {
            CreateShape(layerId, shapeDTO);
        }
    }

    /// <summary>
    /// Creates a new document along with its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="documentDTO"></param>
    /// <returns></returns>
    public async Task<DocumentDTO?> CreateDocument(DocumentDTO documentDTO)
    {
        if (documentDTO.DocumentSlug == null || documentDTO.DocumentSlug == "" || documentDTO.Id != 0)
        {
            return null;
        }

        var maybeExisting = await GetDocumentBySlugWithLayersAndShapes(documentDTO.DocumentSlug);
        if (maybeExisting != null)
        {
            // this slug already exists -- reject
            return null;
        }

        var document = documentDTO.ProjectToModel();
        var now = DateTime.UtcNow;
        document.CreatedAt = now;
        document.LastUpdatedAt = now;
        _db.Documents.Add(document);
        var documentId = document.Id;
        documentDTO.Id = documentId;
        documentDTO.CreatedAt = document.CreatedAt;
        documentDTO.LastUpdatedAt = document.LastUpdatedAt;
        var layers = documentDTO.Layers ?? new List<LayerDTO>();

        foreach (var layerDTO in layers)
        {
            CreateLayerAndShapes(documentId, layerDTO);
        }

        return documentDTO;
    }

    private async Task DeleteShapes(List<ShapeDTO> shapes)
    {
        _db.Circles.RemoveRange(shapes.Where(s => s?.Circle != null).Select(s => new Circle { Id = s.Circle?.Id ?? 0 }));
        _db.Rectangles.RemoveRange(shapes.Where(s => s?.Rectangle != null).Select(s => new Rectangle { Id = s.Rectangle?.Id ?? 0 }));
        _db.TextBoxes.RemoveRange(shapes.Where(s => s?.TextBox != null).Select(s => new TextBox { Id = s.TextBox?.Id ?? 0 }));
    }

    /// <summary>
    /// Updates an existing document along with its associated hydrated layers and shapes.
    /// </summary>
    /// <param name="documentDTO"></param>
    /// <returns></returns>
    public async Task<DocumentDTO?> UpdateDocument(DocumentDTO documentDTO)
    {
        // note carefully: mutating the DTO DOES NOT alter the DB
        // The purpose of this is to obtain the fully hydrated data structure, which involves a
        // complex sequence of queries. We have to fetch the relevant entities AGAIN below
        // in order to obtain objects whose mutations are tracked by Entity Framework.
        var existingDTO = await GetDocumentByIdWithLayersAndShapes(documentDTO.Id);

        if (existingDTO == null || existingDTO.Id != documentDTO.Id)
        {
            return null;
        }

        var documentId = existingDTO.Id;

        var existing = await _db.Documents.FindAsync(documentId);
        if (existing == null)
        {
            return null;
        }

        // we only update the LastUpdatedAt value here (altering the slug is not supported here)
        // NOTE: if we DID alter the slug, we'd have to re-check for conflicting slugs
        // but right now slugs are just constructed via UUIDs in the client so it seems silly
        // to allow modifying them.
        existing.LastUpdatedAt = DateTime.UtcNow;

        var existingLayerIds = new HashSet<int>(existingDTO.Layers?.Select(layer => layer.Id) ?? new List<int>());
        var newLayerIds = new HashSet<int>(documentDTO.Layers?.Select(layer => layer.Id) ?? new List<int>());

        // Step 1: Create layers that are currently missing; this will also create new
        // shapes as needed for those layers.
        documentDTO.Layers?.Where(layer => layer.Id == 0)?.ToList()
            ?.ForEach(l => CreateLayerAndShapes(documentId, l));

        // Step 2: Delete layers. Note carefully we need to refer to EXISTING layers to
        // determine which to delete, but the shapes to delete need to be with reference
        // to the NEW document.
        var layerIdsToDelete = existingLayerIds.Except(newLayerIds) ?? new List<int>();
        _db.Layers.RemoveRange(layerIdsToDelete.Select(l => new Layer {  Id = l }));
        var shapesToDelete = documentDTO.Layers?.Where(l => layerIdsToDelete.Contains(l.Id))
            ?.Select(l => l.Shapes)
            ?.Aggregate((acc, val) => acc?.Concat(val ?? new List<ShapeDTO>()).ToList() ?? new List<ShapeDTO>())
            ?? new List<ShapeDTO>();
        await DeleteShapes(shapesToDelete.ToList());

        // Step 3: For all remaining entities, we need to update Layers, as well
        // as possibly update or create Shapes.

        return documentDTO;
    }


    private async void DeleteLayersAndShapes(List<int> layerIds)
    {
        _db.Layers.RemoveRange(layerIds.Select(l => new Layer { Id = l }));
        var shapes = await getShapes(layerIds);
        await DeleteShapes(shapes.ToList());
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
        DeleteLayersAndShapes(layers.Select(l => l.Id).ToList());
        _db.Documents.Remove(existing);

        return true;
    }
}
