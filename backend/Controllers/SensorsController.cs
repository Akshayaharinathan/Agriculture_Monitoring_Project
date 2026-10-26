
using _52362867_MiniProj.Data;
using _52362867_MiniProj.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _52362867_MiniProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SensorsController(AppDbContext context) => _context = context;

        // Display all
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sensor>>> GetAll()
        {
            var sensors = await _context.Sensors
                .Include(s => s.Cultivation)
                    .ThenInclude(c => c.Farmer)
                .Include(s => s.Cultivation)
                    .ThenInclude(c => c.Crop)
                .ToListAsync();
            return Ok(sensors);
        }

        // Get by id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Sensor>> GetById(int id)
        {
            var sensor = await _context.Sensors
                .Include(s => s.Cultivation).ThenInclude(c => c.Farmer)
                .Include(s => s.Cultivation).ThenInclude(c => c.Crop)
                .FirstOrDefaultAsync(s => s.Id == id);

            return sensor is null ? NotFound() : Ok(sensor);
        }

        // Search by type or serial
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Sensor>>> Search([FromQuery] string? type, [FromQuery] string? serial)
        {
            var q = _context.Sensors.AsQueryable();
            if (!string.IsNullOrWhiteSpace(type))
                q = q.Where(s => EF.Functions.Like(s.Type, $"%{type}%"));
            if (!string.IsNullOrWhiteSpace(serial))
                q = q.Where(s => EF.Functions.Like(s.SerialNumber, $"%{serial}%"));

            return Ok(await q.ToListAsync());
        }

        // Add sensor (requires existing cultivation pair)
        public class SensorCreateDto
        {
            public string SerialNumber { get; set; } = default!;
            public string Type { get; set; } = default!;
            public int FarmerId { get; set; }
            public int CropId { get; set; }
            public DateTime? InstalledOn { get; set; }
            public bool? IsActive { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SensorCreateDto dto)
        {
            var cultivationExists = await _context.Cultivations
                .AnyAsync(c => c.FarmerId == dto.FarmerId && c.CropId == dto.CropId);
            if (!cultivationExists) return BadRequest("Cultivation (FarmerId, CropId) not found.");

            var sensor = new Sensor
            {
                SerialNumber = dto.SerialNumber,
                Type = dto.Type,
                FarmerId = dto.FarmerId,
                CropId = dto.CropId,
                InstalledOn = dto.InstalledOn,
                IsActive = dto.IsActive ?? true
            };
            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = sensor.Id }, sensor);
        }

        // Update by id
        public class SensorUpdateDto
        {
            public string? SerialNumber { get; set; }
            public string? Type { get; set; }
            public DateTime? InstalledOn { get; set; }
            public bool? IsActive { get; set; }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] SensorUpdateDto dto)
        {
            var s = await _context.Sensors.FindAsync(id);
            if (s is null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.SerialNumber)) s.SerialNumber = dto.SerialNumber;
            if (!string.IsNullOrWhiteSpace(dto.Type)) s.Type = dto.Type;
            if (dto.InstalledOn.HasValue) s.InstalledOn = dto.InstalledOn.Value;
            if (dto.IsActive.HasValue) s.IsActive = dto.IsActive.Value;

            await _context.SaveChangesAsync();
            return Ok(s);
        }

        // Delete by id
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var s = await _context.Sensors.FindAsync(id);
            if (s is null) return NotFound();
            _context.Sensors.Remove(s);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Get sensors for a particular farmer+crop
        [HttpGet("by-farmer-crop")]
        public async Task<ActionResult<IEnumerable<Sensor>>> GetByFarmerCrop([FromQuery] int farmerId, [FromQuery] int cropId)
        {
            var sensors = await _context.Sensors
                .Where(s => s.FarmerId == farmerId && s.CropId == cropId)
                .ToListAsync();
            return Ok(sensors);
        }
    }
}
