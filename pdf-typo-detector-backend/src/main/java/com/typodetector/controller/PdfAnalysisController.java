package com.typodetector.controller;

import com.typodetector.model.PdfAnalysisResponse;
import com.typodetector.model.TypoDetection;
import com.typodetector.service.PdfProcessingService;
import com.typodetector.service.SpellCheckService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/pdf")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class PdfAnalysisController {

    private final PdfProcessingService pdfProcessingService;
    private final SpellCheckService spellCheckService;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzePdf(@RequestParam("file") MultipartFile file) {
        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("application/pdf")) {
            return ResponseEntity.badRequest().body("Only PDF files are supported");
        }

        try {
            log.info("Analyzing PDF file: {} (size: {} bytes)", file.getOriginalFilename(), file.getSize());

            // Extract text with positions from PDF
            List<TypoDetection> allWords = pdfProcessingService.extractTextWithPositions(file);
            log.info("Extracted {} words from PDF", allWords.size());

            // Detect typos
            List<TypoDetection> typos = spellCheckService.detectTypos(allWords);
            log.info("Found {} typos in PDF", typos.size());

            // Build response
            PdfAnalysisResponse response = new PdfAnalysisResponse();
            response.setStatus("success");
            response.setTotalPages(allWords.isEmpty() ? 0 :
                allWords.stream().mapToInt(TypoDetection::getPageNumber).max().orElse(0));
            response.setTypos(typos);
            response.setMessage(String.format("Analysis complete. Found %d potential typos.", typos.size()));

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Error processing PDF file", e);
            return ResponseEntity.internalServerError().body(
                new PdfAnalysisResponse("error", 0, List.of(), "Error processing PDF: " + e.getMessage())
            );
        } catch (Exception e) {
            log.error("Unexpected error during PDF analysis", e);
            return ResponseEntity.internalServerError().body(
                new PdfAnalysisResponse("error", 0, List.of(), "Unexpected error: " + e.getMessage())
            );
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("PDF Typo Detector API is running");
    }
}
