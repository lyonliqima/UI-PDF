@echo off
echo Starting PDF Typo Detector Backend...
echo =======================================

REM Check if Maven is installed
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Maven is not installed. Please install Maven first.
    echo Visit: https://maven.apache.org/install.html
    pause
    exit /b 1
)

REM Check if Java is installed
where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Java is not installed. Please install Java 17 or higher.
    echo Visit: https://www.oracle.com/java/technologies/downloads/
    pause
    exit /b 1
)

REM Navigate to the backend directory
cd /d "%~dp0"

REM Start the backend using Maven
echo Starting Spring Boot application on port 8080...
mvn spring-boot:run
