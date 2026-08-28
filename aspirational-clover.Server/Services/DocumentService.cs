using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Extensions;
using aspirational_clover.Server.Interfaces;
using aspirational_clover.Server.Models;
using Microsoft.EntityFrameworkCore;

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
    
    // METHODS THAT NEED TO BE UPDATED WHEN ADDING A SHAPE TYPE

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

    private void CreateShapeFromDTO(int layerId, ShapeDTO shapeDTO)
    {
        shapeDTO.LayerId = layerId;
        CreateShape(layerId, shapeDTO.Circle, c => _db.Circles.Add(c));
        CreateShape(layerId, shapeDTO.Rectangle, r => _db.Rectangles.Add(r));
        CreateShape(layerId, shapeDTO.TextBox, t => _db.TextBoxes.Add(t));
    }

    private void DeleteShapes(List<ShapeDTO> shapes)
    {
        _db.Circles.RemoveRange(shapes.Where(s => s?.Circle != null).Select(s => new Circle { Id = s.Circle?.Id ?? 0 }));
        _db.Rectangles.RemoveRange(shapes.Where(s => s?.Rectangle != null).Select(s => new Rectangle { Id = s.Rectangle?.Id ?? 0 }));
        _db.TextBoxes.RemoveRange(shapes.Where(s => s?.TextBox != null).Select(s => new TextBox { Id = s.TextBox?.Id ?? 0 }));
    }

    private void UpdateLayerIds(int layerId, List<ShapeDTO>? shapes)
    {
        if (shapes == null || layerId == 0) return;
        foreach (ShapeDTO shapeDTO in shapes)
        {
            shapeDTO.LayerId = layerId;
            if (shapeDTO.Circle != null)
            {
                shapeDTO.Circle.LayerId = layerId;
            }
            if (shapeDTO.Rectangle != null)
            {
                shapeDTO.Rectangle.LayerId = layerId;
            }
            if (shapeDTO.TextBox != null)
            {
                shapeDTO.TextBox.LayerId = layerId;
            }
        }
    }

    private List<ShapeDTO> ShapeSetDifference(List<ShapeDTO>? originalShapes, List<ShapeDTO>? shapesToRemove)
    {
        if (originalShapes == null || shapesToRemove == null) return new List<ShapeDTO>();

        var circleDifferenceIds = originalShapes
            .Select(s => s.Circle?.Id ?? 0)
            .Except(shapesToRemove.Select(s => s.Circle?.Id ?? 0))
            .Where(id => id != 0).ToList();

        var rectangleDifferenceIds = originalShapes
            .Select(s => s.Rectangle?.Id ?? 0)
            .Except(shapesToRemove.Select(s => s.Rectangle?.Id ?? 0))
            .Where(id => id != 0).ToList();

        var textBoxDifferenceIds = originalShapes
            .Select(s => s.TextBox?.Id ?? 0)
            .Except(shapesToRemove.Select(s => s.TextBox?.Id ?? 0))
            .Where(id => id != 0).ToList();

        return originalShapes.Where(s =>
        {
            if (s.Circle != null && s.Circle.Id != 0)
            {
                return circleDifferenceIds.Contains(s.Circle.Id);
            }

            if (s.Rectangle != null && s.Rectangle.Id != 0)
            {
                return rectangleDifferenceIds.Contains(s.Rectangle.Id);
            }

            if (s.TextBox != null && s.TextBox.Id != 0)
            {
                return textBoxDifferenceIds.Contains(s.TextBox.Id);
            }

            return false;
        }).ToList();
    }

    private List<ShapeDTO> ShapeSetIntersection(List<ShapeDTO>? shapes, List<ShapeDTO>? other)
    {
        if (shapes == null || other == null) return new List<ShapeDTO>();

        var circleDifferenceIds = shapes
            .Select(s => s.Circle?.Id ?? 0)
            .Intersect(other.Select(s => s.Circle?.Id ?? 0))
            .Where(id => id != 0).ToList();

        var rectangleDifferenceIds = shapes
            .Select(s => s.Rectangle?.Id ?? 0)
            .Intersect(other.Select(s => s.Rectangle?.Id ?? 0))
            .Where(id => id != 0).ToList();

        var textBoxDifferenceIds = shapes
            .Select(s => s.TextBox?.Id ?? 0)
            .Intersect(other.Select(s => s.TextBox?.Id ?? 0))
            .Where(id => id != 0).ToList();

        return shapes.Where(s =>
        {
            if (s.Circle != null && s.Circle.Id != 0)
            {
                return circleDifferenceIds.Contains(s.Circle.Id);
            }

            if (s.Rectangle != null && s.Rectangle.Id != 0)
            {
                return rectangleDifferenceIds.Contains(s.Rectangle.Id);
            }

            if (s.TextBox != null && s.TextBox.Id != 0)
            {
                return textBoxDifferenceIds.Contains(s.TextBox.Id);
            }

            return false;
        }).ToList();
    }

    // DO NOT UPDATE LAYER IDS HERE -- THAT IS DONE IN LAYER PROCESSING
    private void UpdateShapes(List<ShapeDTO>? shapesToUpdate, List<ShapeDTO>? updateSource)
    {
        if (shapesToUpdate == null || updateSource == null) return;

        var circlesUpdateMap = updateSource.Where(s => s?.Circle != null && s.Circle.Id != 0).ToDictionary(
            s => s?.Circle?.Id ?? 0, s => s.Circle);

        var rectangleUpdateMap = updateSource.Where(s => s?.Rectangle != null && s.Rectangle.Id != 0).ToDictionary(
            s => s?.Rectangle?.Id ?? 0, s => s.Rectangle);

        var textBoxUpdateMap = updateSource.Where(s => s?.TextBox != null && s.TextBox.Id != 0).ToDictionary(
            s => s?.TextBox?.Id ?? 0, s => s.TextBox);

        foreach (var shape in shapesToUpdate)
        {
            if (shape == null) continue;

            if (shape?.Circle != null && shape.Circle.Id != 0)
            {
                var update = circlesUpdateMap.GetValueOrDefault(shape.Circle.Id);
                if (update != null)
                {
                    shape.Circle.FillColorFrom = update.FillColorFrom;
                    shape.Circle.FillColorTo = update.FillColorTo;
                    shape.Circle.FillAngle = update.FillAngle;
                    shape.Circle.CenterX = update.CenterX;
                    shape.Circle.CenterY = update.CenterY;
                    shape.Circle.Radius = update.Radius;
                    shape.Circle.RotationAngle = update.RotationAngle;
                    shape.Circle.RotationCenterOffsetX = update.RotationCenterOffsetX;
                    shape.Circle.RotationCenterOffsetY = update.RotationCenterOffsetY;
                    shape.Circle.SkewX = update.SkewX;
                    shape.Circle.SkewY = update.SkewY;
                }
            } else if (shape?.Rectangle != null && shape.Rectangle.Id != 0)
            {
                var update = rectangleUpdateMap.GetValueOrDefault(shape.Rectangle.Id);
                if (update != null)
                {
                    shape.Rectangle.FillColorFrom = update.FillColorFrom;
                    shape.Rectangle.FillColorTo = update.FillColorTo;
                    shape.Rectangle.FillAngle = update.FillAngle;
                    shape.Rectangle.X = update.X;
                    shape.Rectangle.Y = update.Y;
                    shape.Rectangle.Width = update.Width;
                    shape.Rectangle.Height = update.Height;
                    shape.Rectangle.RotationAngle = update.RotationAngle;
                    shape.Rectangle.RotationCenterOffsetX = update.RotationCenterOffsetX;
                    shape.Rectangle.RotationCenterOffsetY = update.RotationCenterOffsetY;
                    shape.Rectangle.SkewX = update.SkewX;
                    shape.Rectangle.SkewY = update.SkewY;
                }
            } else if (shape?.TextBox != null && shape.TextBox.Id != 0)
            {
                var update = textBoxUpdateMap.GetValueOrDefault(shape.TextBox.Id);
                if (update != null)
                {
                    shape.TextBox.Content = update.Content;
                }
            }
        }
    }

    // METHODS THAT SHOULD NOT BE CHANGED WHEN ADDING A SHAPE TYPE

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

    private void CreateShape<T>(int layerId, T? shape, Action<T> addShape) where T : ILayerable {
        if (shape == null) return;
        shape.LayerId = layerId;
        shape.Id = 0;
        addShape(shape);
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
            CreateShapeFromDTO(layerId, shapeDTO);
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

        var existingLayersMap = (existingDTO.Layers ?? new List<LayerDTO>())
            .ToDictionary(l => l.Id, l => l);

        var documentLayersMap = (documentDTO.Layers ?? new List<LayerDTO>())
            .ToDictionary(l => l.Id, l => l);

        // Step 1: Create and delete layers
        var existingLayerIds = existingLayersMap.Keys;
        var documentLayerIds = documentLayersMap.Keys;
        var layerIdsToDelete = existingLayerIds.Except(documentLayerIds);
        _db.Layers.RemoveRange(layerIdsToDelete.Select(l => new Layer { Id = l }));
        (existingDTO.Layers ?? new List<LayerDTO>()).Where(l => l.Id == 0)
            .ToList()
            .ForEach(l =>
            {
                Layer lModel = l.ProjectToModel();
                _db.Layers.Add(lModel);
                var layerId = lModel.Id;
                l.Id = layerId;
                UpdateLayerIds(layerId, l.Shapes);
            });

        // Step 2: Update existing layers
        var layerIdsToUpdate = existingLayerIds.Intersect(documentLayerIds);
        await Task.WhenAll(layerIdsToUpdate.Select(async layerId =>
        {
            var docLayer = documentLayersMap.ElementAtOrDefault(layerId).Value;
            var layer = await _db.Layers.Where(l => l.Id == layerId).FirstOrDefaultAsync();
            if (docLayer == null || layer == null) return;
            layer.Name = docLayer.Name;
            layer.Hidden = docLayer.Hidden;
            layer.ZIndex = docLayer.ZIndex;
            UpdateLayerIds(layer.Id, docLayer.Shapes); // update the layer IDs of the associated shapes
        }));

        // Step 3: Delete shapes that are no longer used
        var documentShapes = documentDTO.Layers?.Aggregate(new List<ShapeDTO>(),
            (acc, val) => acc.Concat(val?.Shapes ?? new List<ShapeDTO>()).ToList());
        var existingShapes = existingDTO.Layers?.Aggregate(new List<ShapeDTO>(),
            (acc, val) => acc.Concat(val?.Shapes ?? new List<ShapeDTO>()).ToList());
        DeleteShapes(ShapeSetDifference(existingShapes, documentShapes));

        // Step 4: Update shapes
        // Note: for the intersection, the order is important because only existingShapes will be tracked by Entity Framework
        var shapesToUpdate = ShapeSetIntersection(existingShapes, documentShapes);
        UpdateShapes(shapesToUpdate, documentShapes);

        return documentDTO;
    }


    private async void DeleteLayersAndShapes(List<int> layerIds)
    {
        _db.Layers.RemoveRange(layerIds.Select(l => new Layer { Id = l }));
        var shapes = await getShapes(layerIds);
        DeleteShapes(shapes.ToList());
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
