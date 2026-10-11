using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace aspirational_clover.Server.Data;

/// <summary>
/// Design-time factory for AppDbContext so EF tools can create a properly configured
/// DbContext when running commands like `dotnet ef database update`.
/// </summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        // Determine environment (fallback to Development)
        var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

        // Build configuration reading appsettings.json and environment overrides
        var config = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile($"appsettings.{env}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var conn = config.GetConnectionString("DefaultConnection");

        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

        if (!string.IsNullOrWhiteSpace(conn))
        {
            optionsBuilder.UseNpgsql(conn);
        }
        else
        {
            // Fall back to an in-memory provider so tools still work if no connection string
            optionsBuilder.UseInMemoryDatabase("DesignTimeFallback_Db");
        }

        return new AppDbContext(optionsBuilder.Options);
    }
}
