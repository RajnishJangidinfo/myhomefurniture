using AspNetCoreJwt.Data;
using AspNetCoreJwt.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreJwt.Controllers;

[Route("api/[controller]")]
[ApiController]
public class FloorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public FloorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Floor>>> GetFloors()
    {
        return await _context.Floors.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Floor>> GetFloor(int id)
    {
        var floor = await _context.Floors.FindAsync(id);
        if (floor == null) return NotFound();
        return floor;
    }

    [HttpPost]
    public async Task<ActionResult<Floor>> PostFloor(Floor floor)
    {
        floor.Name = floor.Name.Trim();
        if (_context.Floors.Any(f => f.Name == floor.Name && f.BuildingId == floor.BuildingId))
        {
            return Conflict(new { message = "A floor with this name already exists in this building." });
        }

        _context.Floors.Add(floor);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetFloor", new { id = floor.Id }, floor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutFloor(int id, Floor floor)
    {
        if (id != floor.Id) return BadRequest();

        floor.Name = floor.Name.Trim();
        if (_context.Floors.Any(f => f.Name == floor.Name && f.BuildingId == floor.BuildingId && f.Id != id))
        {
            return Conflict(new { message = "A floor with this name already exists in this building." });
        }

        _context.Entry(floor).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!FloorExists(id)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteFloor(int id)
    {
        var floor = await _context.Floors.FindAsync(id);
        if (floor == null) return NotFound();
        _context.Floors.Remove(floor);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool FloorExists(int id) => _context.Floors.Any(e => e.Id == id);
}
