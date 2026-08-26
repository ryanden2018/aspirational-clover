using System;
using System.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Extensions;

/// <summary>
/// Extension methods for WebApplication
/// </summary>
public static class WebApplicationExtensions
{
    /// <summary>
    /// Seed test data into the AppDbContext when running in Development and when enabled via configuration.
    /// </summary>
    public static void SeedTestData(this WebApplication app)
    {
        var configuration = app.Configuration;
        var env = app.Environment;

        // Only seed when running in Development by default. Allow override via configuration key "SeedTestData".
        var enabled = configuration.GetValue<bool?>("SeedTestData") ?? true;
        if (!env.IsDevelopment() || !enabled)
        {
            return;
        }

        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<Data.AppDbContext>();

        // Idempotent check
        if (db.Documents.Any())
        {
            return;
        }

        //var summaries = new[]
        //{
        //    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        //};

        //var items = Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //{
        //    Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        //    TemperatureC = Random.Shared.Next(-20, 55),
        //    Summary = summaries[Random.Shared.Next(summaries.Length)]
        //}).ToArray();

        //db.WeatherForecasts.AddRange(items);
        //db.SaveChanges();
    }
}
