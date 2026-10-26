using System.Text.Json.Serialization;

namespace _52362867_MiniProj.Models
{
    public class Cultivation
    {

        public int FarmerId { get; set; }
        public Farmer Farmer { get; set; } = default!;

        public int CropId { get; set; }
        public Crop Crop { get; set; } = default!;

        // Extra per-farmer-per-crop details
        public DateTime? StartDate { get; set; }
        public double? AreaInAcres { get; set; }


        public bool IsHarvested { get; set; }       // default false
        public DateTime? HarvestedOn { get; set; }  // when harvested


        // Sensors tied to this farmer-crop instance
        [JsonIgnore]
        public List<Sensor> Sensors { get; set; } = new();

    }
}
