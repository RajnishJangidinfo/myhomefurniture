using AspNetCoreJwt.Data;
using AspNetCoreJwt.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreJwt.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CampusesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CampusesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Campus>>> GetCampuses()
    {
        return await _context.Campuses.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Campus>> GetCampus(int id)
    {
        var campus = await _context.Campuses.FindAsync(id);
        if (campus == null) return NotFound();
        return campus;
    }

    [HttpPost]
    public async Task<ActionResult<Campus>> PostCampus(Campus campus)
    {
        campus.Name = campus.Name.Trim();
        if (_context.Campuses.Any(c => c.Name == campus.Name))
        {
            return Conflict(new { message = "A campus with this name already exists." });
        }

        _context.Campuses.Add(campus);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetCampus", new { id = campus.Id }, campus);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutCampus(int id, Campus campus)
    {
        if (id != campus.Id) return BadRequest();

        campus.Name = campus.Name.Trim();
        if (_context.Campuses.Any(c => c.Name == campus.Name && c.Id != id))
        {
            return Conflict(new { message = "A campus with this name already exists." });
        }

        _context.Entry(campus).State = EntityState.Modified;
        try { await _context.SaveChangesAsync(); }
        catch (DbUpdateConcurrencyException) { if (!CampusExists(id)) return NotFound(); else throw; }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCampus(int id)
    {
        var campus = await _context.Campuses.FindAsync(id);
        if (campus == null) return NotFound();
        _context.Campuses.Remove(campus);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    private bool CampusExists(int id) => _context.Campuses.Any(e => e.Id == id);
}
