package com.typodetector.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PdfAnalysisResponse {
    private String status;
    private int totalPages;
    private List<TypoDetection> typos;
    private String message;
}
