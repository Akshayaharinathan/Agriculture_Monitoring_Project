using _52362867_MiniProj.Data;
using _52362867_MiniProj.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _52362867_MiniProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CultivationsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CultivationsController(AppDbContext context) => _context = context;

        // Display all
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cultivation>>> GetAll()
        {
            var list = await _context.Cultivations
                .Include(c => c.Farmer)
                .Include(c => c.Crop)
                .Include(c => c.Sensors)
                .ToListAsync();
            return Ok(list);
        }

        // Get a specific cultivation by composite id
        [HttpGet("{farmerId:int}/{cropId:int}")]
        public async Task<ActionResult<Cultivation>> GetById(int farmerId, int cropId)
        {
            var cultivation = await _context.Cultivations
                .Include(c => c.Farmer)
                .Include(c => c.Crop)
                .Include(c => c.Sensors)
                .FirstOrDefaultAsync(c => c.FarmerId == farmerId && c.CropId == cropId);

            return cultivation is null ? NotFound() : Ok(cultivation);
        }

        // Map farmer to crop (Add Cultivation)
        public class CultivationCreateDto
        {
            public int FarmerId { get; set; }
            public int CropId { get; set; }
            public DateTime? StartDate { get; set; }
            public double? AreaInAcres { get; set; }
            public bool? IsHarvested { get; set; }
            public DateTime? HarvestedOn { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CultivationCreateDto dto)
        {
            // Validate existence
            var farmerExists = await _context.Farmers.AnyAsync(f => f.Id == dto.FarmerId);
            var cropExists = await _context.Crops.AnyAsync(c => c.Id == dto.CropId);
            if (!farmerExists || !cropExists) return BadRequest("Farmer or Crop not found.");

            // Prevent duplicates
            var exists = await _context.Cultivations
                .AnyAsync(c => c.FarmerId == dto.FarmerId && c.CropId == dto.CropId);
            if (exists) return Conflict("Cultivation already exists for this farmer & crop.");


            var cultivation = new Cultivation
            {
                FarmerId = dto.FarmerId,
                CropId = dto.CropId,
                StartDate = dto.StartDate ?? DateTime.UtcNow,
                AreaInAcres = dto.AreaInAcres,
                IsHarvested = dto.IsHarvested.Value,
                HarvestedOn = dto.IsHarvested.Value ? dto.HarvestedOn : null
            

        };

            _context.Cultivations.Add(cultivation);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { farmerId = dto.FarmerId, cropId = dto.CropId }, cultivation);
        }

        // Update by composite id
        public class CultivationUpdateDto
        {
            public DateTime? StartDate { get; set; }
            public double? AreaInAcres { get; set; }
            public bool? IsHarvested { get; set; }
            public DateTime? HarvestedOn { get; set; }
        }

        [HttpPut("{farmerId:int}/{cropId:int}")]
        public async Task<IActionResult> Update(int farmerId, int cropId, [FromBody] CultivationUpdateDto dto)
        {
            var c = await _context.Cultivations.FindAsync(farmerId, cropId);
            if (c is null) return NotFound();

            if (dto.StartDate.HasValue) c.StartDate = dto.StartDate.Value;
            if (dto.AreaInAcres.HasValue) c.AreaInAcres = dto.AreaInAcres.Value;
            if (dto.IsHarvested.HasValue)
            {
                c.IsHarvested = dto.IsHarvested.Value;
                c.HarvestedOn = dto.IsHarvested.Value
                    ? dto.HarvestedOn 
                    : null;
            }

            await _context.SaveChangesAsync();
            return Ok(c);
        }

        // Delete by composite id
        [HttpDelete("{farmerId:int}/{cropId:int}")]
        public async Task<IActionResult> Delete(int farmerId, int cropId)
        {
            var c = await _context.Cultivations.FindAsync(farmerId, cropId);
            if (c is null) return NotFound();
            _context.Cultivations.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // Query: which farmers cultivated a particular crop
        [HttpGet("farmers-by-crop/{cropId:int}")]
        public async Task<ActionResult<IEnumerable<Farmer>>> GetFarmersForCrop(int cropId)
        {
            var farmers = await _context.Cultivations
                .Where(c => c.CropId == cropId)
                .Select(c => c.Farmer)
                .Distinct()
                .ToListAsync();
            return Ok(farmers);
        }

        // Query: crops cultivated by a particular farmer
        [HttpGet("crops-by-farmer/{farmerId:int}")]
        public async Task<ActionResult<IEnumerable<Crop>>> GetCropsForFarmer(int farmerId)
        {
            var crops = await _context.Cultivations
                .Where(c => c.FarmerId == farmerId)
                .Select(c => c.Crop)
                .Distinct()
                .ToListAsync();
            return Ok(crops);
        }

        // Mark harvested (convenience endpoint)
        [HttpPost("{farmerId:int}/{cropId:int}/harvest")]
        public async Task<IActionResult> MarkHarvested(int farmerId, int cropId, [FromBody] DateTime? harvestedOn)
        {
            var c = await _context.Cultivations.FindAsync(farmerId, cropId);
            if (c is null) return NotFound();
            c.IsHarvested = true;
            c.HarvestedOn = harvestedOn ?? DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return Ok(c);
        }

        // Search harvested crops by particular farmer
        [HttpGet("harvested/by-farmer/{farmerId:int}")]
        public async Task<ActionResult<IEnumerable<Cultivation>>> GetHarvestedByFarmer(int farmerId)
        {
            var list = await _context.Cultivations
                .Where(c => c.FarmerId == farmerId && c.IsHarvested)
                .Include(c => c.Crop)
                .ToListAsync();
            return Ok(list);
        }
    }
}
