using System.Text.Json.Serialization;

namespace AspNetCoreJwt.Models;

public class Building
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    
    public int CampusId { get; set; }
    [JsonIgnore]
    public Campus? Campus { get; set; }
}
