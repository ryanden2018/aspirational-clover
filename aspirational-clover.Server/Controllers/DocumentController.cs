using Microsoft.AspNetCore.Mvc;
using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Interfaces;
using aspirational_clover.Server.Extensions;

namespace aspirational_clover.Server.Controllers;

/// <summary>
/// Controller for managing documents and their nested layers/shapes.
/// </summary>
[ApiController]
[Route("[controller]")]
[Produces("application/json")]
public class DocumentController : ControllerBase
{
    private readonly Data.AppDbContext _db;
    private readonly IDocumentService _documentService;

    /// <summary>
    /// Initializes a new instance of the DocumentController class.
    /// </summary>
    /// <param name="db"></param>
    /// <param name="documentService"></param>
    public DocumentController(Data.AppDbContext db, IDocumentService documentService)
    {
        _db = db;
        _documentService = documentService;
    }

    /// <summary>
    /// Returns a list of all documents, including nested layers and shapes.
    /// </summary>
    /// <returns>Array of DocumentDTO</returns>
    [HttpGet(Name = "GetDocuments")]
    [ProducesResponseType(typeof(IEnumerable<DocumentDTO>), StatusCodes.Status200OK)]
    public async Task<IEnumerable<DocumentDTO>> Get()
    {
        return await _documentService.GetDocumentsWithLayersAndShapes();
    }

    /// <summary>
    /// Retrieve a single document by its numeric id.
    /// </summary>
    /// <param name="id">Document id</param>
    /// <returns>DocumentDTO when found</returns>
    [HttpGet("{id}", Name = "GetDocumentById")]
    [ProducesResponseType(typeof(DocumentDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDTO>> GetById(int id)
    {
        var document = await _documentService.GetDocumentByIdWithLayersAndShapes(id);
        if (document == null) return NotFound();
        return document;
    }

    /// <summary>
    /// Retrieve a single document by its slug.
    /// </summary>
    /// <param name="slug">Document slug</param>
    /// <returns>DocumentDTO when found</returns>
    [HttpGet("slug/{slug}", Name = "GetDocumentBySlug")]
    [ProducesResponseType(typeof(DocumentDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DocumentDTO>> GetBySlug(string slug)
    {
        var document = await _documentService.GetDocumentBySlugWithLayersAndShapes(slug);
        if (document == null) return NotFound();
        return document;
    }

    /// <summary>
    /// Create a new document. The server will ignore any Id supplied by the client.
    /// </summary>
    /// <param name="model">Document to create</param>
    /// <returns>Created DocumentDTO</returns>
    [HttpPost]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(DocumentDTO), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<DocumentDTO>> Post([FromBody] DocumentDTO model)
    {
        // Ensure id is not set by client
        model.Id = 0;

        if (model.Layers != null)
        {
            foreach (var layer in model.Layers)
            {
                layer.Id = 0; // Ensure layer ids are not set by client
                if (layer.Shapes != null)
                {
                    foreach (var shape in layer.Shapes)
                    {
                        shape.DestructivelyRemoveShapeIds(); // Ensure shape IDs are not set by client (TODO: add a test for this at the controller level)
                    }
                }
            }
        }

        var created = await _documentService.CreateDocument(model);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = model.Id }, created);
    }

    /// <summary>
    /// Update an existing document. Id in the route must match the payload.
    /// </summary>
    /// <param name="id">Document id</param>
    /// <param name="model">Updated document payload</param>
    /// <returns>Updated DocumentDTO</returns>
    [HttpPut("{id}")]
    [Consumes("application/json")]
    [ProducesResponseType(typeof(DocumentDTO), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Put(int id, [FromBody] DocumentDTO model)
    {
        if (id != model.Id) return BadRequest("ID mismatch");
        var updated = await _documentService.UpdateDocument(model);
        await _db.SaveChangesAsync();
        return Ok(updated);
    }

    /// <summary>
    /// Delete a document by id.
    /// </summary>
    /// <param name="id">Document id</param>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _documentService.DeleteDocument(id);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
