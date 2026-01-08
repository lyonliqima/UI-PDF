import { PdfProcessor } from '../shared/pdfProcessor.js';
import { analyzePDF } from '../shared/typoChecker.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      status: 'error',
      message: 'Method not allowed'
    });
  }

  try {
    // Parse multipart form data
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Parse boundary
    const contentType = req.headers['content-type'];
    const boundary = contentType.match(/boundary=([^;]+)/i)?.[1];

    if (!boundary) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid content type'
      });
    }

    // Extract file from multipart data
    const parts = buffer.toString('binary').split(`--${boundary}`);
    let fileBuffer = null;

    for (const part of parts) {
      if (part.includes('Content-Disposition')) {
        const lines = part.split('\r\n');
        let isFile = false;
        let contentTypeLine = -1;

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('Content-Disposition') && lines[i].includes('filename=')) {
            isFile = true;
          }
          if (lines[i].includes('Content-Type')) {
            contentTypeLine = i;
          }
        }

        if (isFile && contentTypeLine > -1) {
          const data = lines.slice(contentTypeLine + 2).join('\r\n');
          fileBuffer = Buffer.from(data.substring(0, data.length - 2), 'binary');
          break;
        }
      }
    }

    if (!fileBuffer) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded'
      });
    }

    console.log('📄 Processing PDF file...');

    // Extract text with coordinates
    const pdfProcessor = new PdfProcessor();
    const pages = await pdfProcessor.extractTextWithCoordinates(fileBuffer);

    // Analyze PDF
    const result = await analyzePDF(pages);

    // Send response
    res.status(200).json(result);

    console.log(`✅ Analysis complete: ${result.typos.length} typos found`);
  } catch (error) {
    console.error('❌ Error analyzing document:', error);
    res.status(500).json({
      status: 'error',
      totalPages: 0,
      typos: [],
      message: 'Error analyzing document: ' + error.message
    });
  }
}
