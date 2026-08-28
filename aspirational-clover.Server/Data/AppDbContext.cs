using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Data;

/// <summary>
/// Represents the application's database context, providing access to the database and managing entity sets for documents, layers, and shapes.
/// </summary>
public class AppDbContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the AppDbContext class with the specified options.
    /// </summary>
    /// <param name="options"></param>
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    /// <summary>
    /// Gets the DbSet for Document entities, allowing CRUD operations on the Documents table in the database.
    /// </summary>
    public DbSet<Document> Documents => Set<Document>();

    /// <summary>
    /// Gets the DbSet for Layer entities, allowing CRUD operations on the Layers table in the database.
    /// </summary>
    public DbSet<Layer> Layers => Set<Layer>();

    /// <summary>
    /// Gets the DbSet for Circle entities, allowing CRUD operations on the Circles table in the database.
    /// </summary>
    public DbSet<Circle> Circles => Set<Circle>();

    /// <summary>
    /// Gets the DbSet for Rectangle entities, allowing CRUD operations on the Rectangles table in the database.
    /// </summary>
    public DbSet<Rectangle> Rectangles => Set<Rectangle>();

    /// <summary>
    /// Gets the DbSet for TextBox entities, allowing CRUD operations on the TextBoxes table in the database.
    /// </summary>
    public DbSet<TextBox> TextBoxes => Set<TextBox>();
}

