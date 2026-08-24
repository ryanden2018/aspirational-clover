using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Layer> Layers => Set<Layer>();
    public DbSet<Circle> Circles => Set<Circle>();
    public DbSet<Rectangle> Rectangles => Set<Rectangle>();
    public DbSet<TextBox> TextBoxes => Set<TextBox>();
}

