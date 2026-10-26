
using _52362867_MiniProj.Data;
using _52362867_MiniProj.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace _52362867_MiniProj.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FarmersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public FarmersController(AppDbContext context) => _context = context;

        // Display all
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Farmer>>> GetAll()
        {
            var farmers = await _context.Farmers
                .Include(f => f.Cultivations)
                    .ThenInclude(c => c.Crop)
                .Include(f => f.Cultivations)
                    .ThenInclude(c => c.Sensors)
                .ToListAsync();
            return Ok(farmers);
        }

        // Get by id
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Farmer>> GetById(int id)
        {
            var farmer = await _context.Farmers
                .Include(f => f.Cultivations).ThenInclude(c => c.Crop)
                .Include(f => f.Cultivations).ThenInclude(c => c.Sensors)
                .FirstOrDefaultAsync(f => f.Id == id);

            return farmer is null ? NotFound() : Ok(farmer);
        }

        // Search by name
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Farmer>>> Search([FromQuery] string q)
        {
            var farmers = await _context.Farmers
                .Where(f => !string.IsNullOrEmpty(q) && EF.Functions.Like(f.Name, $"%{q}%"))
                .ToListAsync();
            return Ok(farmers);
        }

        // Add
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Farmer farmer)
        {
            if (string.IsNullOrWhiteSpace(farmer.Name)) return BadRequest("Name is required.");
            _context.Farmers.Add(farmer);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = farmer.Id }, farmer);
        }

        // Update by id
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] Farmer input)
        {
            var f = await _context.Farmers.FindAsync(id);
            if (f is null) return NotFound();
            f.Name = input.Name ?? f.Name;
            await _context.SaveChangesAsync();
            return Ok(f);
        }

        // Delete by id
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var f = await _context.Farmers.FindAsync(id);
            if (f is null) return NotFound();
            _context.Farmers.Remove(f);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
