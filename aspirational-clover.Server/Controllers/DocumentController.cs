using Microsoft.AspNetCore.Mvc;
using aspirational_clover.Server.Models;
using aspirational_clover.Server.DTOs;
using aspirational_clover.Server.Interfaces;

namespace aspirational_clover.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class DocumentController : ControllerBase
{
    private readonly Data.AppDbContext _db;
    private readonly IDocumentService _documentService;

    public DocumentController(Data.AppDbContext db, IDocumentService documentService)
    {
        _db = db;
        _documentService = documentService;
    }

    [HttpGet(Name = "GetDocuments")]
    public async Task<IEnumerable<DocumentDTO>> Get()
    {
        return await _documentService.GetDocumentsWithLayersAndShapes();
    }

    [HttpGet("{id}", Name = "GetDocumentById")]
    public async Task<ActionResult<DocumentDTO>> GetById(int id)
    {
        var document = await _documentService.GetDocumentByIdWithLayersAndShapes(id);
        if (document == null) return NotFound();
        return document;
    }

    [HttpGet("slug/{slug}", Name = "GetDocumentBySlug")]
    public async Task<ActionResult<DocumentDTO>> GetBySlug(string slug)
    {
        var document = await _documentService.GetDocumentBySlugWithLayersAndShapes(slug);
        if (document == null) return NotFound();
        return document;
    }

    [HttpPost]
    public async Task<ActionResult<DocumentDTO>> Post([FromBody] DocumentDTO model)
    {
        // Ensure id is not set by client
        model.Id = 0;

        var created = await _documentService.CreateDocument(model);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = model.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] DocumentDTO model)
    {
        if (id != model.Id) return BadRequest("ID mismatch");
        var updated = await _documentService.UpdateDocument(model);
        await _db.SaveChangesAsync();
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _documentService.DeleteDocument(id);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
