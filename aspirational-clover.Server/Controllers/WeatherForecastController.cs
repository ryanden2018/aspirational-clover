using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private readonly Data.AppDbContext _db;

    public WeatherForecastController(Data.AppDbContext db)
    {
        _db = db;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<IEnumerable<WeatherForecast>> Get()
    {
        // Return current weather forecasts from the database. Seeding happens during app startup in Development.
        return await _db.WeatherForecasts.ToListAsync();
    }

    [HttpGet("{id}", Name = "GetWeatherForecastById")]
    public async Task<ActionResult<WeatherForecast>> GetById(int id)
    {
        var item = await _db.WeatherForecasts.FindAsync(id);
        if (item == null) return NotFound();
        return item;
    }

    [HttpPost]
    public async Task<ActionResult<WeatherForecast>> Post([FromBody] WeatherForecast model)
    {
        // Ensure id is not set by client
        model.Id = 0;
        _db.WeatherForecasts.Add(model);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = model.Id }, model);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] WeatherForecast model)
    {
        var existing = await _db.WeatherForecasts.FindAsync(id);
        if (existing == null) return NotFound();

        // Update fields
        existing.Date = model.Date;
        existing.TemperatureC = model.TemperatureC;
        existing.Summary = model.Summary;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existing = await _db.WeatherForecasts.FindAsync(id);
        if (existing == null) return NotFound();

        _db.WeatherForecasts.Remove(existing);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
