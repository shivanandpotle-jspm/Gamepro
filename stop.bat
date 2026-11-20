@echo off
setlocal enabledelayedexpansion
title Stop Memory Flip - Master Server

echo ============================================================================
echo                     STOPPING MEMORY FLIP - MASTER SERVER
echo ============================================================================
echo [INFO] Searching for active server running on port 8080...

set "FOUND_PID="
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :8080 ^| findstr LISTENING') do (
    set "FOUND_PID=%%a"
)

if defined FOUND_PID (
    echo [INFO] Found server running with Process ID: !FOUND_PID!
    echo [INFO] Terminating server process safely...
    taskkill /F /PID !FOUND_PID! >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo.
        echo ============================================================================
        echo [SUCCESS] Memory Flip - Master server has been stopped.
        echo Port 8080 is now free.
        echo ============================================================================
    ) else (
        echo [ERROR] Could not terminate process !FOUND_PID!. Please try running as Administrator.
    )
) else (
    echo [INFO] No active Memory Flip server was found listening on port 8080.
    echo The port is already free.
)

echo.
echo Press any key to close this window...
pause >nul
exit /b 0
