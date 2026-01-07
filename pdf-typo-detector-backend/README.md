# PDF Typo Detector Backend

Spring Boot backend service for detecting typos in PDF documents using AI/NLP.

## Features

- PDF text extraction with position information
- Spell checking using LanguageTool
- RESTful API for PDF analysis
- Returns bounding box coordinates for highlighting typos

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Spring Boot 3.2.0

## Running the Backend

### Option 1: Using Maven
```bash
cd pdf-typo-detector-backend
mvn spring-boot:run
```

### Option 2: Using Java
```bash
cd pdf-typo-detector-backend
mvn clean package
java -jar target/pdf-typo-detector-backend-1.0.0.jar
```

The backend will start on `http://localhost:8080`

## API Endpoints

### Analyze PDF
- **POST** `/api/pdf/analyze`
- **Content-Type**: `multipart/form-data`
- **Parameter**: `file` (PDF file)

Response:
```json
{
  "status": "success",
  "totalPages": 5,
  "typos": [
    {
      "pageNumber": 1,
      "text": "mispeled",
      "suggestion": "misspelled",
      "errorType": "Spelling mistake",
      "boundingBox": {
        "x": 100.5,
        "y": 200.3,
        "width": 50.2,
        "height": 12.0
      }
    }
  ],
  "message": "Analysis complete. Found 1 potential typos."
}
```

### Health Check
- **GET** `/api/pdf/health`

## Integration with Frontend

The frontend should:
1. Upload PDF to `/api/pdf/analyze`
2. Receive list of typos with bounding boxes
3. Render yellow highlight boxes over detected typos

## Configuration

Edit `src/main/resources/application.properties` to customize:
- Server port (default: 8080)
- CORS settings
- File upload limits
- Logging levels
