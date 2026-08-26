
using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Data;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using Microsoft.AspNetCore.ResponseCompression;

using aspirational_clover.Server.Extensions;
using aspirational_clover.Server.Services;
using aspirational_clover.Server.Interfaces;
using Scalar.AspNetCore;

namespace aspirational_clover.Server;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add Aspire service defaults (OpenTelemetry, health checks, etc.)
        builder.AddServiceDefaults();

        // Register EF Core DbContext. Use an in-memory provider for local development so the app
        // can run without a live database. In non-development environments, attempt to use the
        // configured PostgreSQL provider (Npgsql) if a connection string is present.
        builder.Services.AddControllers();

        // Configure AppDbContext
        // Use InMemory when running in Development (localhost) for test implementation
        // Otherwise use Npgsql if a connection string is provided, fallback to InMemory.
        builder.Services.AddOptions();
        var configuration = builder.Configuration;
        var env = builder.Environment;

        if (env.IsDevelopment())
        {
            // Test implementation for local development
            builder.Services.AddDbContext<AppDbContext>(opts =>
                opts.UseInMemoryDatabase("Aspire.Test.Db"));
        }
        else
        {
            var conn = configuration.GetConnectionString("DefaultConnection");
            if (!string.IsNullOrWhiteSpace(conn))
            {
                builder.Services.AddDbContext<AppDbContext>(opts =>
                    opts.UseNpgsql(conn));
            }
            else
            {
                // No connection string configured; fall back to InMemory to keep the app runnable.
                builder.Services.AddDbContext<AppDbContext>(opts =>
                    opts.UseInMemoryDatabase("Aspire.Fallback.Db"));
            }
        }

        builder.Services.AddTransient<IDocumentService>(
            provider => new DocumentService(provider.GetRequiredService<AppDbContext>())
        );

        // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
        builder.Services.AddOpenApi();

        var app = builder.Build();

        // Seed test data into the in-memory database when running in Development (localhost).
        // Use extension method to keep Program.cs clean.
        app.SeedTestData();

        app.MapDefaultEndpoints();

        app.UseDefaultFiles();
        app.MapStaticAssets();

        if (env.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.MapFallbackToFile("/index.html");

        app.Run();
    }
}
