const API_BASE_URL = 'http://localhost:8080/api';

export interface TypoDetection {
  pageNumber: number;
  text: string;
  suggestion: string;
  errorType: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PdfAnalysisResponse {
  status: string;
  totalPages: number;
  typos: TypoDetection[];
  message: string;
}

export async function analyzePdf(file: File): Promise<PdfAnalysisResponse> {
  const formData = new FormData();
  formData.append('file', file);

  console.log('📤 Sending request to:', `${API_BASE_URL}/pdf/analyze`);

  const response = await fetch(`${API_BASE_URL}/pdf/analyze`, {
    method: 'POST',
    body: formData,
  });

  console.log('📥 Response status:', response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Error response:', errorText);
    throw new Error(errorText || 'Failed to analyze PDF');
  }

  const data = await response.json();
  console.log('📊 Parsed response data:', data);
  return data;
}

export async function checkHealth(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/pdf/health`);
  if (!response.ok) {
    throw new Error('Backend health check failed');
  }
  return response.text();
}
