namespace AspNetCoreJwt.Services;

using MailKit.Net.Smtp;
using MimeKit;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string resetToken, string resetUrl)
    {
        var message = new MimeMessage();
        
        // From address
        var fromEmail = _configuration["Email:FromAddress"] ?? "noreply@myhomefurniture.in";
        var fromName = _configuration["Email:FromName"] ?? "My Home Furniture";
        message.From.Add(new MailboxAddress(fromName, fromEmail));
        
        // To address
        message.To.Add(new MailboxAddress("", toEmail));
        
        // Subject
        message.Subject = "Reset Your Password - My Home Furniture";
        
        // Email body with HTML
        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #c7b299; color: white; padding: 20px; text-align: center; }}
                        .content {{ background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }}
                        .button {{ display: inline-block; padding: 12px 30px; background-color: #c7b299; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                        .token {{ background-color: #fff; padding: 15px; border: 1px solid #ddd; font-family: monospace; word-break: break-all; margin: 15px 0; }}
                        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                    </style>
                </head>
                <body>
                    <div class=""container"">
                        <div class=""header"">
                            <h1>Reset Your Password</h1>
                        </div>
                        <div class=""content"">
                            <p>Hello,</p>
                            <p>We received a request to reset your password for your My Home Furniture account.</p>
                            <p>Click the button below to reset your password:</p>
                            <p style=""text-align: center;"">
                                <a href=""{resetUrl}"" class=""button"">Reset Password</a>
                            </p>
                            <p>Or copy and paste this link into your browser:</p>
                            <div class=""token"">{resetUrl}</div>
                            <p><strong>Your reset token:</strong></p>
                            <div class=""token"">{resetToken}</div>
                            <p><strong>This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                            <p>Best regards,<br>My Home Furniture Team</p>
                        </div>
                        <div class=""footer"">
                            <p>&copy; 2024 My Home Furniture. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            ",
            TextBody = $@"
Reset Your Password

Hello,

We received a request to reset your password for your My Home Furniture account.

Click this link to reset your password:
{resetUrl}

Your reset token: {resetToken}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.

Best regards,
My Home Furniture Team
            "
        };
        
        message.Body = bodyBuilder.ToMessageBody();

        // Send email
        using var client = new SmtpClient();
        try
        {
            var smtpServer = _configuration["Email:SmtpServer"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["Email:Username"];
            var smtpPassword = _configuration["Email:Password"];
            
            await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUsername, smtpPassword);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Email sending failed: {ex.Message}");
            throw new Exception("Failed to send password reset email. Please try again later.");
        }
    }
}
