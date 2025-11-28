@echo off
echo Checking Git installation...
git --version
if %errorlevel% neq 0 (
    echo.
    echo Git is not available in PATH yet.
    echo Please close this window and open a NEW Command Prompt or PowerShell window.
    echo Then run this script again.
    pause
    exit /b 1
)

echo.
echo Git found! Pushing code to GitHub...
echo.

cd /d "c:\Users\rajni\.gemini\antigravity\playground\interstellar-rocket\myhomefurniture_repo"

git init
git remote add origin https://github.com/RajnishJangidinfo/myhomefurniture.git
git add .
git commit -m "Initial commit: Node.js API + ASP.NET Core backend"
git branch -M main
git push -u origin main

echo.
echo Upload complete!
echo Check your repository at: https://github.com/RajnishJangidinfo/myhomefurniture
echo.
pause
