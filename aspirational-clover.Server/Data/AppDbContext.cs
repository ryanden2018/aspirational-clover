using Microsoft.EntityFrameworkCore;
using aspirational_clover.Server.Models;

namespace aspirational_clover.Server.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<WeatherForecast> WeatherForecasts => Set<WeatherForecast>();
}

