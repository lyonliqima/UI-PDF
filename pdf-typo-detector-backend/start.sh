#!/bin/bash

echo "Starting PDF Typo Detector Backend..."
echo "======================================="

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "Error: Maven is not installed. Please install Maven first."
    echo "Visit: https://maven.apache.org/install.html"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java is not installed. Please install Java 17 or higher."
    echo "Visit: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

# Navigate to the backend directory
cd "$(dirname "$0")"

# Start the backend using Maven
echo "Starting Spring Boot application on port 8080..."
mvn spring-boot:run
