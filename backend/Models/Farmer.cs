using System.Text.Json.Serialization;

namespace _52362867_MiniProj.Models
{
    public class Farmer
    {

        public int Id { get; set; }
        public string Name { get; set; } = default!;
        [JsonIgnore]
        public List<Cultivation> Cultivations { get; set; } = new();

    }
}
