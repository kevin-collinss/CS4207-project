@echo off
:: Navigate to your project directory
cd /d %~dp0

:: Start Ganache in a new terminal
start cmd /k "ganache --server.port 7545 --account='0xbe7d028aeb35c441f84d829387cad6328754dd91e4848236efe62404d9550c7c,1000000000000000000000'"

:: Wait for Ganache to start
timeout /t 5 /nobreak > nul

:: Deploy contracts with Truffle
cd /d "blockchain"
start cmd /c "truffle migrate --reset"

:: Wait for contract to start
:wait_for_file
IF NOT EXIST "build\contracts\AcademicResources.json" (
    timeout /t 1 /nobreak > nul
    goto wait_for_file
)

:: Setup .env file
cd /d "../"
timeout /t 5 /nobreak > nul
python setupEnv.py

:: Start the backend server
cd /d "backend"
node server.js

:: Keep the script terminal open
pause
