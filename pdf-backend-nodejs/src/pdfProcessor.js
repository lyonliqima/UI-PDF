
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export class PdfProcessor {
    async extractTextWithCoordinates(buffer) {
        const uint8Array = new Uint8Array(buffer);
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdfDocument = await loadingTask.promise;
        const numPages = pdfDocument.numPages;
        const pages = [];

        for (let i = 1; i <= numPages; i++) {
            const page = await pdfDocument.getPage(i);
            const textContent = await page.getTextContent();
            const viewport = page.getViewport({ scale: 1.0 }); // Scale 1.0 gives PDF point coordinates

            const items = textContent.items.map(item => {
                const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);

                const fontScaleX = Math.hypot(tx[0], tx[1]);
                const fontScaleY = Math.hypot(tx[2], tx[3]); // For height

                const w = item.width * fontScaleX; // Scale width
                const h = item.height > 0 ? item.height * fontScaleY : fontScaleY; // Approximate height if 0 (using scaleY ~ fontSize)

                return {
                    str: item.str,
                    x: tx[4],
                    y: tx[5] - h, // Top-Left Y
                    w: w,
                    h: h,
                    baselineY: tx[5]
                };
            });

            items.sort((a, b) => {
                const yDiff = Math.abs(a.y - b.y);
                if (yDiff < (a.h || 10) * 0.5) { // Same line tolerance
                    return a.x - b.x;
                }
                return a.y - b.y; // Top (small Y) first
            });

            const words = this.groupTextItemsIntoWords(items);

            pages.push({
                pageNumber: i,
                words: words,
                width: viewport.width, // Store page width for scaling if needed
                height: viewport.height
            });
        }

        return pages;
    }

    groupTextItemsIntoWords(items) {
        const words = [];
        if (items.length === 0) return words;

        let currentWord = {
            text: "",
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.str || item.str.trim() === '') {
                if (currentWord.text.length > 0) {
                    words.push({ ...currentWord });
                    currentWord = { text: "", x: 0, y: 0, width: 0, height: 0 };
                }
                continue;
            }

            if (currentWord.text.length === 0) {
                currentWord = {
                    text: item.str,
                    x: item.x,
                    y: item.y,
                    width: item.w,
                    height: item.h
                };
            } else {
                // Check merge
                const x_diff = item.x - (currentWord.x + currentWord.width);
                const y_diff = Math.abs(item.y - currentWord.y);

                // If on same line (small y_diff) and close (small x_diff), merge
                if (y_diff < item.h * 0.5 && x_diff < item.h * 0.5 && x_diff > -item.h * 0.5) {
                    currentWord.text += item.str;
                    currentWord.width = (item.x + item.w) - currentWord.x;
                    currentWord.height = Math.max(currentWord.height, item.h);
                } else {
                    words.push({ ...currentWord });
                    currentWord = {
                        text: item.str,
                        x: item.x,
                        y: item.y,
                        width: item.w,
                        height: item.h
                    };
                }
            }
        }

        if (currentWord.text.length > 0) {
            words.push(currentWord);
        }

        return words;
    }
}
