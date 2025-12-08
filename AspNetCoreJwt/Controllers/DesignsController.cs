using AspNetCoreJwt.Data;
using AspNetCoreJwt.Dtos;
using AspNetCoreJwt.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCoreJwt.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DesignsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public DesignsController(ApplicationDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DesignProject>>> GetDesigns()
    {
        return await _context.DesignProjects
            .Include(d => d.Images)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<DesignProject>> CreateDesign([FromForm] CreateDesignProjectDto dto)
    {
        var project = new DesignProject
        {
            Location = dto.Location,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        if (dto.Images != null && dto.Images.Count > 0)
        {
            var webRootPath = _environment.WebRootPath ?? Path.Combine(_environment.ContentRootPath, "wwwroot");
            var uploadsFolder = Path.Combine(webRootPath, "uploads");
            
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            foreach (var file in dto.Images)
            {
                if (file.Length > 0)
                {
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + file.FileName;
                    var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    project.Images.Add(new DesignImage
                    {
                        FilePath = "/uploads/" + uniqueFileName
                    });
                }
            }
        }

        _context.DesignProjects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDesigns), new { id = project.Id }, project);
    }
}
