using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;

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

    [HttpGet(Name = "GetDocuments")]
    public async Task<IEnumerable<Document>> Get()
    {
        // Return current documents from the database. Seeding happens during app startup in Development.
        return await _db.Documents.ToListAsync();
    }

    [HttpGet("{id}", Name = "GetDocumentById")]
    public async Task<ActionResult<Document>> GetById(int id)
    {
        var item = await _db.Documents.FindAsync(id);
        if (item == null) return NotFound();
        return item;
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

        _db.Documents.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
