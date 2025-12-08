using System.Text.Json.Serialization;

namespace AspNetCoreJwt.Models;

public class Floor
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public int BuildingId { get; set; }
    [JsonIgnore]
    public Building? Building { get; set; }
}
