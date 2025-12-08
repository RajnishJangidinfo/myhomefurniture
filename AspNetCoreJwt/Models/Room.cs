namespace AspNetCoreJwt.Models;

public class Room
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public int FloorId { get; set; }
    public Floor? Floor { get; set; }
}
