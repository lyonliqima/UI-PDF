package com.typodetector.service;

import com.typodetector.model.TypoDetection;
import lombok.extern.slf4j.Slf4j;
import org.languagetool.JLanguageTool;
import org.languagetool.language.AmericanEnglish;
import org.languagetool.rules.RuleMatch;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@Slf4j
public class SpellCheckService {

    private final JLanguageTool languageTool;

    public SpellCheckService() {
        this.languageTool = new JLanguageTool(new AmericanEnglish());
    }

    public List<TypoDetection> detectTypos(List<TypoDetection> allWords) {
        List<TypoDetection> typos = new ArrayList<>();

        for (TypoDetection wordDetection : allWords) {
            String word = wordDetection.getText();

            // Skip numbers, single characters, and common patterns
            if (shouldSkip(word)) {
                continue;
            }

            // Check for spelling and grammar errors
            try {
                List<RuleMatch> matches = languageTool.check(word);

                if (!matches.isEmpty()) {
                    TypoDetection typo = new TypoDetection();
                    typo.setPageNumber(wordDetection.getPageNumber());
                    typo.setText(wordDetection.getText());
                    typo.setBoundingBox(wordDetection.getBoundingBox());

                    // Get suggestion from first match
                    RuleMatch match = matches.get(0);
                    if (!match.getSuggestedReplacements().isEmpty()) {
                        typo.setSuggestion(match.getSuggestedReplacements().get(0));
                    } else {
                        typo.setSuggestion("No suggestion");
                    }

                    typo.setErrorType(match.getMessage());
                    typos.add(typo);

                    log.debug("Detected typo: '{}' on page {} - {}",
                        word, wordDetection.getPageNumber(), match.getMessage());
                }
            } catch (Exception e) {
                log.error("Error checking word: {}", word, e);
            }
        }

        return typos;
    }

    private boolean shouldSkip(String word) {
        // Skip if empty
        if (word == null || word.trim().isEmpty()) {
            return true;
        }

        // Skip if only numbers
        if (word.matches("^\\d+$")) {
            return true;
        }

        // Skip if single character (unless it's 'a' or 'I')
        if (word.length() == 1 && !word.equalsIgnoreCase("a") && !word.equals("I")) {
            return true;
        }

        // Skip common URL patterns
        if (word.matches("^(http|https|www)\\..*")) {
            return true;
        }

        // Skip email patterns
        if (word.matches(".*@.*\\..*")) {
            return true;
        }

        // Skip file extensions
        if (word.matches("^\\.[a-zA-Z]{2,4}$")) {
            return true;
        }

        // Skip very long words (likely technical terms or codes)
        if (word.length() > 30) {
            return true;
        }

        // Skip words with only numbers and special characters
        if (word.matches("^[^a-zA-Z]+$")) {
            return true;
        }

        return false;
    }
}
