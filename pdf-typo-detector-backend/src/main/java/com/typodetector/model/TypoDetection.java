package com.typodetector.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypoDetection {
    private int pageNumber;
    private String text;
    private String suggestion;
    private BoundingBox boundingBox;
    private String errorType;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BoundingBox {
        private float x;
        private float y;
        private float width;
        private float height;
    }
}
