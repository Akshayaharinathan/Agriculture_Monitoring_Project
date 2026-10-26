using _52362867_MiniProj.Models;
using Microsoft.EntityFrameworkCore;

namespace _52362867_MiniProj.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options) { }
        public DbSet<Farmer> Farmers { get; set; }
        public DbSet<Crop> Crops { get; set; }
        public DbSet<Cultivation> Cultivations { get; set; }
        public DbSet<Sensor> Sensors { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Farmer
            modelBuilder.Entity<Farmer>()
                .Property(f => f.Name)
                .IsRequired();

            // Crop
            modelBuilder.Entity<Crop>()
                .Property(c => c.Name)
                .IsRequired();

            // Cultivation: composite key (FarmerId, CropId)
            modelBuilder.Entity<Cultivation>()
                .HasKey(c => new { c.FarmerId, c.CropId });

            modelBuilder.Entity<Cultivation>()
                .HasOne(c => c.Farmer)
                .WithMany(f => f.Cultivations)
                .HasForeignKey(c => c.FarmerId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Cultivation>()
                .HasOne(c => c.Crop)
                .WithMany(crop => crop.Cultivations)
                .HasForeignKey(c => c.CropId)
                .OnDelete(DeleteBehavior.Cascade);

            // Sensor belongs to a specific Cultivation (FK is composite: FarmerId + CropId)
            modelBuilder.Entity<Sensor>()
                .HasOne(s => s.Cultivation)
                .WithMany(c => c.Sensors)
                .HasForeignKey(s => new { s.FarmerId, s.CropId })
                .OnDelete(DeleteBehavior.Cascade); // deleting cultivation removes its sensors

            // Optional: enforce unique serial numbers
            modelBuilder.Entity<Sensor>()
                .HasIndex(s => s.SerialNumber)
                .IsUnique();
        }

    }
}
