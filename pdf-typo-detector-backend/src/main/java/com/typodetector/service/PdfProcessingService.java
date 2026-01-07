package com.typodetector.service;

import com.typodetector.model.TypoDetection;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PdfProcessingService {

    public List<TypoDetection> extractTextWithPositions(MultipartFile file) throws IOException {
        List<TypoDetection> detections = new ArrayList<>();

        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            int totalPages = document.getNumberOfPages();

            for (int pageNum = 0; pageNum < totalPages; pageNum++) {
                PDPage page = document.getPage(pageNum);

                // Extract text with positions
                TextPositionExtractor extractor = new TextPositionExtractor(document);
                List<TextPosition> textPositions = extractor.extractTextPositions(pageNum);

                // Group text positions into words
                List<WordInfo> words = groupTextPositionsIntoWords(textPositions);

                // Convert to typo detections (will be analyzed by spell checker)
                for (WordInfo word : words) {
                    TypoDetection detection = new TypoDetection();
                    detection.setPageNumber(pageNum + 1);
                    detection.setText(word.getText());

                    TypoDetection.BoundingBox bbox = new TypoDetection.BoundingBox();
                    bbox.setX(word.getX());
                    bbox.setY(word.getY());
                    bbox.setWidth(word.getWidth());
                    bbox.setHeight(word.getHeight());
                    detection.setBoundingBox(bbox);

                    detections.add(detection);
                }
            }
        }

        return detections;
    }

    private List<WordInfo> groupTextPositionsIntoWords(List<TextPosition> textPositions) {
        List<WordInfo> words = new ArrayList<>();
        if (textPositions.isEmpty()) {
            return words;
        }

        StringBuilder currentWord = new StringBuilder();
        float wordStartX = textPositions.get(0).getX();
        float wordStartY = textPositions.get(0).getY();
        float wordEndX = textPositions.get(0).getX() + textPositions.get(0).getWidth();
        float maxHeight = textPositions.get(0).getHeight();

        for (int i = 0; i < textPositions.size(); i++) {
            TextPosition pos = textPositions.get(i);
            String character = pos.getUnicode();

            if (Character.isWhitespace(character.charAt(0))) {
                // End of word
                if (currentWord.length() > 0) {
                    words.add(new WordInfo(
                        currentWord.toString(),
                        wordStartX,
                        wordStartY,
                        wordEndX - wordStartX,
                        maxHeight
                    ));
                    currentWord = new StringBuilder();
                }
                wordStartX = pos.getX() + pos.getWidth();
                wordStartY = pos.getY();
                maxHeight = 0;
            } else {
                if (currentWord.length() == 0) {
                    wordStartX = pos.getX();
                    wordStartY = pos.getY();
                    wordEndX = pos.getX() + pos.getWidth();
                    maxHeight = pos.getHeight();
                } else {
                    wordEndX = pos.getX() + pos.getWidth();
                    maxHeight = Math.max(maxHeight, pos.getHeight());
                }
                currentWord.append(character);
            }
        }

        // Add last word
        if (currentWord.length() > 0) {
            words.add(new WordInfo(
                currentWord.toString(),
                wordStartX,
                wordStartY,
                wordEndX - wordStartX,
                maxHeight
            ));
        }

        return words;
    }

    private static class WordInfo {
        private final String text;
        private final float x;
        private final float y;
        private final float width;
        private final float height;

        public WordInfo(String text, float x, float y, float width, float height) {
            this.text = text;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public String getText() { return text; }
        public float getX() { return x; }
        public float getY() { return y; }
        public float getWidth() { return width; }
        public float getHeight() { return height; }
    }

    private static class TextPositionExtractor extends PDFTextStripper {
        private final List<TextPosition> textPositions = new ArrayList<>();
        private int targetPage = -1;

        public TextPositionExtractor(PDDocument document) throws IOException {
            super();
            setSortByPosition(true);
        }

        public List<TextPosition> extractTextPositions(int pageNum) throws IOException {
            this.targetPage = pageNum;
            this.textPositions.clear();
            // Extract text for the specific page
            super.getDocument().getPage(pageNum);
            return textPositions;
        }

        @Override
        protected void processTextPosition(TextPosition text) {
            textPositions.add(text);
        }
    }
}
