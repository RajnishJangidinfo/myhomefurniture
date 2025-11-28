# GitHub API Upload Script
$owner = 'RajnishJangidinfo'
$repo = 'myhomefurniture'
$token = $env:GITHUB_PAT
$baseUrl = "https://api.github.com/repos/$owner/$repo/contents"

$headers = @{
    'Authorization' = "token $token"
    'Accept' = 'application/vnd.github.v3+json'
}

function Upload-File {
    param($filePath, $repoPath)
    
    if (-not (Test-Path $filePath)) {
        Write-Host "Skipping missing file: $filePath" -ForegroundColor Yellow
        return
    }
    
    $content = [Convert]::ToBase64String([IO.File]::ReadAllBytes($filePath))
    $body = @{
        message = "Add $repoPath"
        content = $content
    } | ConvertTo-Json
    
    $url = "$baseUrl/$repoPath"
    
    try {
        Write-Host "Uploading: $repoPath" -ForegroundColor Cyan
        Invoke-RestMethod -Uri $url -Method PUT -Headers $headers -Body $body -ContentType 'application/json'
        Write-Host "Uploaded: $repoPath" -ForegroundColor Green
    } catch {
        Write-Host "Failed: $repoPath - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

Write-Host 'Starting upload to GitHub...' -ForegroundColor Yellow
Write-Host ''

# Upload .gitignore
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/.gitignore' '.gitignore'

# Upload API files
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/api/server.js' 'api/server.js'
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/api/test_api.js' 'api/test_api.js'
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/api/package.json' 'api/package.json'

# Upload Backend files
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/backend/AspNetCoreJwt/Program.cs' 'backend/AspNetCoreJwt/Program.cs'
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/backend/AspNetCoreJwt/appsettings.json' 'backend/AspNetCoreJwt/appsettings.json'
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/backend/AspNetCoreJwt/AspNetCoreJwt.csproj' 'backend/AspNetCoreJwt/AspNetCoreJwt.csproj'
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/backend/AspNetCoreJwt/Controllers/AuthController.cs' 'backend/AspNetCoreJwt/Controllers/AuthController.cs'
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/backend/AspNetCoreJwt/Models/User.cs' 'backend/AspNetCoreJwt/Models/User.cs'
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/backend/AspNetCoreJwt/Dtos/UserDto.cs' 'backend/AspNetCoreJwt/Dtos/UserDto.cs'

# Upload Frontend placeholder
Upload-File 'c:/Users/rajni/.gemini/antigravity/playground/interstellar-rocket/myhomefurniture_repo/frontend/README.md' 'frontend/README.md'

Write-Host ''
Write-Host 'Upload complete! Check your repository at:' -ForegroundColor Green
$repoUrl = "https://github.com/$owner/$repo"
Write-Host $repoUrl -ForegroundColor Cyan
