using Microsoft.EntityFrameworkCore;
using AspNetCoreJwt.Models;

namespace AspNetCoreJwt.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<DesignProject> DesignProjects { get; set; }
    public DbSet<DesignImage> DesignImages { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Campus> Campuses { get; set; }
    public DbSet<Building> Buildings { get; set; }
    public DbSet<Floor> Floors { get; set; }
    // public DbSet<Order> Orders { get; set; } // Order requires complex configuration for lists, skipping for now
}
