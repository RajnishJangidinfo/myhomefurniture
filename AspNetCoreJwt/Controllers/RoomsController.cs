using AspNetCoreJwt.Data;
using AspNetCoreJwt.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreJwt.Controllers;

[Route("api/[controller]")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RoomsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Rooms
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
    {
        return await _context.Rooms.Include(r => r.Floor).ToListAsync();
    }

    // GET: api/Rooms/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Room>> GetRoom(int id)
    {
        var room = await _context.Rooms.Include(r => r.Floor).FirstOrDefaultAsync(r => r.Id == id);

        if (room == null)
        {
            return NotFound();
        }

        return room;
    }

    // POST: api/Rooms
    [HttpPost]
    public async Task<ActionResult<Room>> PostRoom(Room room)
    {
        room.Name = room.Name.Trim();
        // Validate uniqueness scoped to Floor
        if (_context.Rooms.Any(r => r.Name == room.Name && r.FloorId == room.FloorId))
        {
            return Conflict(new { message = "A room with this name already exists on this floor." });
        }

        _context.Rooms.Add(room);
        await _context.SaveChangesAsync();

        return CreatedAtAction("GetRoom", new { id = room.Id }, room);
    }

    // PUT: api/Rooms/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutRoom(int id, Room room)
    {
        if (id != room.Id)
        {
            return BadRequest();
        }

        room.Name = room.Name.Trim();
        // Validate uniqueness scoped to Floor
        if (_context.Rooms.Any(r => r.Name == room.Name && r.FloorId == room.FloorId && r.Id != id))
        {
            return Conflict(new { message = "A room with this name already exists on this floor." });
        }

        _context.Entry(room).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!RoomExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }

    // DELETE: api/Rooms/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRoom(int id)
    {
        var room = await _context.Rooms.FindAsync(id);
        if (room == null)
        {
            return NotFound();
        }

        _context.Rooms.Remove(room);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool RoomExists(int id)
    {
        return _context.Rooms.Any(e => e.Id == id);
    }
}
