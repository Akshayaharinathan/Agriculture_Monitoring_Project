using System.Text.Json.Serialization;

namespace _52362867_MiniProj.Models
{
    public class Crop
    {

        public int Id { get; set; }
        public string Name { get; set; } = default!; // e.g., "Rice", "Wheat"
        public string? Variety { get; set; }         // optional metadata

        // Navigations
        [JsonIgnore]
        public List<Cultivation> Cultivations { get; set; } = new();

    }
}
