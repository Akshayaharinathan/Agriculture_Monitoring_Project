
using _52362867_MiniProj.Data;
using _52362867_MiniProj.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _52362867_MiniProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CropsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CropsController(AppDbContext context) => _context = context;

        // Display all
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Crop>>> GetAll()
        {
            var crops = await _context.Crops
                .Include(c => c.Cultivations)
                    .ThenInclude(cv => cv.Farmer)
                .ToListAsync();
            return Ok(crops);
        }

        // Get by id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Crop>> GetById(int id)
        {
            var crop = await _context.Crops
                .Include(c => c.Cultivations).ThenInclude(cv => cv.Farmer)
                .FirstOrDefaultAsync(c => c.Id == id);

            return crop is null ? NotFound() : Ok(crop);
        }

        // Search by name
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Crop>>> Search([FromQuery] string q)
        {
            var crops = await _context.Crops
                .Where(c => !string.IsNullOrEmpty(q) && EF.Functions.Like(c.Name, $"%{q}%"))
                .ToListAsync();
            return Ok(crops);
        }

        // Add
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Crop crop)
        {
            if (string.IsNullOrWhiteSpace(crop.Name)) return BadRequest("Name is required.");
            _context.Crops.Add(crop);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = crop.Id }, crop);
        }

        // Update by id
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Crop input)
        {
            var c = await _context.Crops.FindAsync(id);
            if (c is null) return NotFound();
            c.Name = input.Name ?? c.Name;
            c.Variety = input.Variety ?? c.Variety;
            await _context.SaveChangesAsync();
            return Ok(c);
        }

        // Delete by id
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var c = await _context.Crops.FindAsync(id);
            if (c is null) return NotFound();
            _context.Crops.Remove(c);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

