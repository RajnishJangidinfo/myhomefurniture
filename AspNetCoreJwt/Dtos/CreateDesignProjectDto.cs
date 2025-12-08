using Microsoft.AspNetCore.Http;

namespace AspNetCoreJwt.Dtos;

public class CreateDesignProjectDto
{
    public string Location { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public IFormFileCollection? Images { get; set; }
}
