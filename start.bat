@echo off
setlocal enabledelayedexpansion
title Memory Flip - Master Launcher

echo ============================================================================
echo                     MEMORY FLIP - MASTER : LAUNCHER
echo ============================================================================
echo [INFO] Initializing Memory Flip - Master game environment...

rem ----------------------------------------------------------------------------
rem 1. Check if application is already running on port 8080
rem ----------------------------------------------------------------------------
set "ALREADY_RUNNING=0"
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr :8080 ^| findstr LISTENING') do (
    set "ALREADY_RUNNING=1"
    set "EXISTING_PID=%%a"
)

if "%ALREADY_RUNNING%"=="1" (
    echo [INFO] Game server is already active on port 8080 (Process ID: %EXISTING_PID%).
    echo [INFO] Opening game in your default browser...
    start http://localhost:8080
    echo ============================================================================
    echo The game is now open in your web browser at:
    echo http://localhost:8080
    echo ============================================================================
    timeout /t 5 >nul
    exit /b 0
)

rem ----------------------------------------------------------------------------
rem 2. Verify or Auto-Detect Java JDK
rem ----------------------------------------------------------------------------
if not exist "%JAVA_HOME%\bin\java.exe" (
    if exist "C:\Program Files\Java\jdk-26.0.2\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-26.0.2"
    ) else if exist "C:\Program Files\Java\latest\bin\java.exe" (
        set "JAVA_HOME=C:\Program Files\Java\latest"
    ) else (
        for /d %%I in ("C:\Program Files\Java\jdk*") do (
            if exist "%%I\bin\java.exe" set "JAVA_HOME=%%I"
        )
    )
)

if not exist "%JAVA_HOME%\bin\java.exe" (
    where java >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Java was not found on your system!
        echo Please ensure Java JDK 17, 21 or higher is installed.
        echo Download: https://www.oracle.com/java/technologies/downloads/
        echo.
        pause
        exit /b 1
    )
    set "JAVA_CMD=java"
) else (
    set "JAVA_CMD=%JAVA_HOME%\bin\java.exe"
    set "PATH=%JAVA_HOME%\bin;%PATH%"
)

echo [OK] Java detected:
"%JAVA_CMD%" -version
echo.

rem ----------------------------------------------------------------------------
rem 3. Check for Executable Application Package
rem ----------------------------------------------------------------------------
set "JAR_PATH=target\memory-flip-master-1.0.0.jar"
if not exist "%JAR_PATH%" (
    echo [INFO] Application package not found. Building project using Maven Wrapper...
    call mvnw.cmd package -DskipTests
    if not exist "%JAR_PATH%" (
        echo.
        echo [ERROR] Project build failed! Check console output above for details.
        echo.
        pause
        exit /b 1
    )
)

rem ----------------------------------------------------------------------------
rem 4. Launch Spring Boot Server in Background
rem ----------------------------------------------------------------------------
echo [INFO] Starting Memory Flip - Master Server...
start "Memory Flip - Master Server" /min "%JAVA_CMD%" -jar "%JAR_PATH%"

rem ----------------------------------------------------------------------------
rem 5. Poll for Server Health & Open Browser
rem ----------------------------------------------------------------------------
echo [INFO] Waiting for server to become ready at http://localhost:8080...
set "ATTEMPTS=0"
set "SERVER_READY=0"

:WAIT_LOOP
timeout /t 1 /nobreak >nul
set /a ATTEMPTS+=1

powershell -Command "$ErrorActionPreference = 'SilentlyContinue'; $res = Invoke-WebRequest -Uri 'http://localhost:8080/api/health' -UseBasicParsing -TimeoutSec 1; if ($res.StatusCode -eq 200) { exit 0 } else { exit 1 }" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    set "SERVER_READY=1"
    goto SERVER_UP
)

if %ATTEMPTS% GEQ 45 (
    echo.
    echo [WARNING] Server took longer than expected to report healthy.
    echo Opening browser anyway. If page doesn't load immediately, please refresh in a moment.
    goto SERVER_UP
)

goto WAIT_LOOP

:SERVER_UP
echo.
echo ============================================================================
echo [SUCCESS] Memory Flip - Master is now running!
echo ============================================================================
echo Game URL: http://localhost:8080
echo Database Console: http://localhost:8080/h2-console
echo.
echo [INFO] Launching game in your default browser...
start http://localhost:8080
echo.
echo Leave this window or close it. To stop the game server anytime, double-click stop.bat
echo ============================================================================
timeout /t 6 >nul
exit /b 0
