using System.Text.Json.Serialization;

namespace AspNetCoreJwt.Models;

public class DesignImage
{
    public int Id { get; set; }
    public string FilePath { get; set; } = string.Empty;
    
    public int DesignProjectId { get; set; }
    [JsonIgnore]
    public DesignProject? DesignProject { get; set; }
}
