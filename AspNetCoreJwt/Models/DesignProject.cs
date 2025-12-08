namespace AspNetCoreJwt.Models;

public class DesignProject
{
    public int Id { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<DesignImage> Images { get; set; } = new();
}
