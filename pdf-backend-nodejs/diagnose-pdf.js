import fs from 'fs';
import pdfParse from 'pdf-parse';

// This script helps diagnose PDF parsing issues
const pdfPath = process.argv[2];

if (!pdfPath) {
  console.log('Usage: node diagnose-pdf.js <path-to-pdf-file>');
  process.exit(1);
}

console.log('📋 PDF Diagnostic Tool');
console.log('=' .repeat(60));

try {
  const buffer = fs.readFileSync(pdfPath);
  pdfParse(buffer).then(data => {
    console.log('✅ Successfully parsed PDF');
    console.log('');
    console.log('📊 PDF Information:');
    console.log('  - Number of pages:', data.numpages);
    console.log('  - Total text length:', data.text.length, 'characters');
    console.log('  - Has text:', data.text.length > 0 ? 'Yes ✓' : 'No ✗');
    console.log('');

    if (data.text.length === 0) {
      console.log('⚠️  WARNING: No text extracted!');
      console.log('');
      console.log('This PDF likely contains:');
      console.log('  - Scanned images (needs OCR)');
      console.log('  - Embedded fonts that cannot be extracted');
      console.log('  - Image-based content');
      console.log('');
      console.log('💡 Solution: Use OCR (Optical Character Recognition)');
      console.log('  Recommended libraries:');
      console.log('    - tesseract.js (JavaScript OCR)');
      console.log('    - google-cloud-vision');
      console.log('    - aws textract');
    } else {
      console.log('📝 Extracted Text Preview (first 500 chars):');
      console.log('─'.repeat(60));
      console.log(data.text.substring(0, 500));
      console.log('─'.repeat(60));
      console.log('');

      // Detect if text is mostly non-Latin characters
      const latinChars = data.text.match(/[a-zA-Z]/g);
      const totalChars = data.text.replace(/\s/g, '').length;
      const latinRatio = latinChars ? latinChars.length / totalChars : 0;

      console.log('🔤 Character Analysis:');
      console.log('  - Total characters (no spaces):', totalChars);
      console.log('  - Latin characters (a-z, A-Z):', latinChars ? latinChars.length : 0);
      console.log('  - Latin ratio:', (latinRatio * 100).toFixed(2) + '%');
      console.log('');

      if (latinRatio < 0.3) {
        console.log('⚠️  WARNING: PDF contains mostly non-Latin text');
        console.log('  (Likely Chinese, Japanese, Korean, Arabic, etc.)');
        console.log('');
        console.log('💡 The current spell checker only supports English text.');
        console.log('  For multilingual support, consider:');
        console.log('    - language-detect (language detection)');
        console.log('    - nodehun (Hunspell spell checker)');
        console.log('    - Support for Chinese spelling check');
      } else {
        console.log('✅ PDF contains Latin-based text (English, European languages)');
      }
    }

    console.log('');
    console.log('=' .repeat(60));
  }).catch(err => {
    console.error('❌ Error parsing PDF:', err.message);
  });
} catch (err) {
  console.error('❌ Error reading file:', err.message);
}
