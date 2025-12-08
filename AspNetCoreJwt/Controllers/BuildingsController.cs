using AspNetCoreJwt.Data;
using AspNetCoreJwt.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreJwt.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BuildingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BuildingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Building>>> GetBuildings()
    {
        return await _context.Buildings.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Building>> GetBuilding(int id)
    {
        var building = await _context.Buildings.FindAsync(id);
        if (building == null) return NotFound();
        return building;
    }

    [HttpPost]
    public async Task<ActionResult<Building>> PostBuilding(Building building)
    {
        building.Name = building.Name.Trim();
        if (_context.Buildings.Any(b => b.Name == building.Name && b.CampusId == building.CampusId))
        {
            return Conflict(new { message = "A building with this name already exists in this campus." });
        }

        _context.Buildings.Add(building);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetBuilding", new { id = building.Id }, building);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutBuilding(int id, Building building)
    {
        if (id != building.Id) return BadRequest();

        building.Name = building.Name.Trim();
        if (_context.Buildings.Any(b => b.Name == building.Name && b.CampusId == building.CampusId && b.Id != id))
        {
            return Conflict(new { message = "A building with this name already exists in this campus." });
        }

        _context.Entry(building).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!BuildingExists(id)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBuilding(int id)
    {
        var building = await _context.Buildings.FindAsync(id);
        if (building == null) return NotFound();
        _context.Buildings.Remove(building);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool BuildingExists(int id) => _context.Buildings.Any(e => e.Id == id);
}
