@echo off
set PATH=C:\Users\mikes\AppData\Local\Volta\tools\image\node\22.12.0;C:\Users\mikes\AppData\Local\pnpm;%PATH%
echo Starting build from: %CD%
cd /d "C:\Dev\KimiK2\Claude_workspace\Kimi_Agent_Daley Organics Website\Astro_Daley_Organics_Website"
echo Changed to: %CD%
node --version
node node_modules\astro\dist\cli\index.js build
echo BUILD_EXIT_CODE=%ERRORLEVEL%
