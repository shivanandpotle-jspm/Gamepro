@echo off
rem ----------------------------------------------------------------------------
rem Maven Wrapper for Windows (Memory Flip - Master)
rem ----------------------------------------------------------------------------
setlocal

set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set "DIRNAME=."

rem Verify or auto-detect JAVA_HOME
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
    echo [ERROR] JAVA_HOME is not set and no JDK was found in C:\Program Files\Java.
    echo Please install Java JDK 17+ or set JAVA_HOME.
    exit /b 1
)

set "PATH=%JAVA_HOME%\bin;%PATH%"

rem Use pre-bundled Maven if available, or wrapper jar
if exist "%DIRNAME%.maven\apache-maven-3.9.9\bin\mvn.cmd" (
    call "%DIRNAME%.maven\apache-maven-3.9.9\bin\mvn.cmd" %*
    exit /b %ERRORLEVEL%
)

set "WRAPPER_JAR=%DIRNAME%.mvn\wrapper\maven-wrapper.jar"
if not exist "%WRAPPER_JAR%" (
    echo [ERROR] Maven Wrapper jar not found at %WRAPPER_JAR%
    exit /b 1
)

"%JAVA_HOME%\bin\java.exe" -Dmaven.multiModuleProjectDirectory="%DIRNAME%" -jar "%WRAPPER_JAR%" %*
exit /b %ERRORLEVEL%
