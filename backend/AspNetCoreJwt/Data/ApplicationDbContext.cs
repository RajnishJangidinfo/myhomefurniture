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
    // public DbSet<Order> Orders { get; set; } // Order requires complex configuration for lists, skipping for now
}
