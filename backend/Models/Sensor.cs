namespace _52362867_MiniProj.Models
{
    public class Sensor
    {
        public int Id { get; set; }
        public string SerialNumber { get; set; } = default!;
        public string Type { get; set; } = default!; // e.g., "SoilMoisture", "pH"

        // FK to the specific Cultivation (farmer-crop)
        public int FarmerId { get; set; }
        public int CropId { get; set; }
        public Cultivation Cultivation { get; set; } = default!;

        // Optional live state/metadata
        public DateTime? InstalledOn { get; set; }
        public bool IsActive { get; set; } = true;

    }
}
