using AspNetCoreJwt.Dtos;
using AspNetCoreJwt.Models;
using AspNetCoreJwt.Services;
using AspNetCoreJwt.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AspNetCoreJwt.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly EmailService _emailService;

    public AuthController(ApplicationDbContext context, IConfiguration config, EmailService emailService)
    {
        _context = context;
        _configuration = config;
        _emailService = emailService;
    }

    // POST /auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            // Check if username already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == dto.Username);

            if (existingUser != null)
                return Conflict(new { message = "Username already exists" });

            // Create new user
            var user = new User
            {
                Id = Guid.NewGuid().ToString(),
                Username = dto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            
            return Ok(new { message = "User registered successfully" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error during registration: {ex}");
            return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
        }
    }

    // POST /auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == dto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials" });

        var token = GenerateToken(user);
        return Ok(new { token });
    }

    // GET /auth/profile
    [HttpGet("profile")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _context.Users.FindAsync(userId);
        if (user == null) return NotFound();

        return Ok(new
        {
            user.Username,
            user.FirstName,
            user.LastName,
            user.Email,
            user.DateOfBirth,
            user.Address
        });
    }

    // PUT /auth/profile
    [HttpPut("profile")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        try
        {
            var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound();

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.DateOfBirth = dto.DateOfBirth;
            user.Address = dto.Address;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated successfully" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating profile: {ex}");
            return StatusCode(500, new { message = "Internal Server Error", error = ex.Message });
        }
    }

    // GET /api/auth/users
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _context.Users.ToListAsync();
        return Ok(users.Select(u => new
        {
            u.Id,
            u.Username,
            u.FirstName,
            u.LastName,
            u.Email,
            u.DateOfBirth,
            u.Address,
            u.CreatedAt
        }));
    }

    // PUT /api/auth/users/{id}
    [HttpPut("users/{id}")]
    public async Task<IActionResult> UpdateUserById(string id, [FromBody] UpdateProfileDto dto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.FirstName = dto.FirstName;
        user.LastName = dto.LastName;
        user.Email = dto.Email;
        user.DateOfBirth = dto.DateOfBirth;
        user.Address = dto.Address;

        await _context.SaveChangesAsync();
        return Ok(new { message = "User updated successfully" });
    }

    // DELETE /api/auth/users/{id}
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(new { message = "User deleted successfully" });
    }

    // POST: /api/auth/forgot-password
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ResetPasswordRequestDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null)
        {
            // Don't reveal that the user doesn't exist
            return Ok(new { message = "If the email exists, a reset link has been sent to your email address." });
        }

        // Generate a reset token (GUID)
        user.ResetToken = Guid.NewGuid().ToString();
        user.ResetTokenExpiry = DateTime.UtcNow.AddHours(1); // Token valid for 1 hour

        await _context.SaveChangesAsync();

        // Send email with reset link
        try
        {
            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
            var resetUrl = $"{frontendUrl}/reset-password?token={user.ResetToken}";
            
            await _emailService.SendPasswordResetEmailAsync(user.Email, user.ResetToken, resetUrl);
            
            return Ok(new { 
                message = "Password reset link has been sent to your email address.",
                // For development: also return token
                token = user.ResetToken,
                resetUrl = resetUrl
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send email: {ex.Message}");
            
            // Even if email fails, return success message for security
            // But for development, include the token
            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";
            var resetUrl = $"{frontendUrl}/reset-password?token={user.ResetToken}";
            
            return Ok(new { 
                message = "Reset token generated. Email sending is not configured - use the token below.",
                token = user.ResetToken,
                resetUrl = resetUrl,
                note = "Configure SMTP settings in appsettings.json to enable email sending"
            });
        }
    }

    // POST: /api/auth/reset-password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => 
            u.ResetToken == dto.Token && 
            u.ResetTokenExpiry > DateTime.UtcNow);

        if (user == null)
        {
            return BadRequest(new { message = "Invalid or expired reset token" });
        }

        // Hash the new password
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);

        // Clear the reset token
        user.ResetToken = null;
        user.ResetTokenExpiry = null;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Password has been reset successfully" });
    }

    private string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.NameIdentifier, user.Id!),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id!),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? "default_secret_key_at_least_32_characters_long"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: "MyHomeFurniture",
            audience: "MyHomeFurnitureClients",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
