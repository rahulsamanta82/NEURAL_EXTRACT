import { GoogleGenAI } from '@google/genai';

const API_BASE = `${window.location.origin}/api`.replace(/\/$/, '');

export class ApiService {
  private static token: string | null = localStorage.getItem('token');

  static setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  static getToken() {
    return this.token;
  }

  private static async request(endpoint: string, options: RequestInit = {}) {
    // Ensure endpoint starts with a slash for joining, but we'll handle it robustly
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${cleanEndpoint}`;
    
    const headers = new Headers(options.headers || {});
    if (this.token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    console.log(`[API Fetch] ${options.method || 'GET'} ${url}`);
    const response = await fetch(url, { ...options, headers });
    
    // Handle unauthorized access (e.g., database reset or expired token)
    if (response.status === 401) {
      console.warn('[API] Unauthorized access - clearing token');
      this.setToken(null);
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Unauthorized - Please log in again');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) {
        const message = data.error || `Request failed with status ${response.status}`;
        const details = data.details ? ` (${data.details})` : '';
        throw new Error(`${message}${details}`);
      }
      return data;
    } else {
      const text = await response.text();
      const preview = text.substring(0, 100).replace(/[\n\r]/g, ' ');
      console.error(`[API Error] Non-JSON response from ${url}:`, preview);
      throw new Error(`Server error (${response.status}): Unexpected response format. (Preview: ${preview}...)`);
    }
  }

  static async login(credentials: any) {
    return this.request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  }

  static async register(credentials: any) {
    return this.request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  }

  static async extract(file: File, extractedData: any, type: 'cheque' | 'bill' = 'cheque') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', JSON.stringify(extractedData));
    formData.append('type', type);

    return this.request('/extract', {
      method: 'POST',
      body: formData,
    });
  }

  static async getHistory(type: 'cheque' | 'bill' = 'cheque') {
    return this.request(`/history?type=${type}`);
  }

  static async deleteHistory(id: number) {
    return this.request(`/extractions/${id}`, {
      method: 'DELETE',
    });
  }
}

// Proprietary Extraction Service
export class ExtractionService {
  private static getAI() {
    // process.env.API_KEY is the user-selected key from the dialog
    // process.env.GEMINI_API_KEY is the default platform key
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('API Key not found. Please select an API key.');
    }
    return new GoogleGenAI({ apiKey });
  }

  private static async callGeminiWithRetry(params: any, maxRetries = 3): Promise<any> {
    const ai = this.getAI();
    let lastError: any;
    // Try Flash models first as they are fastest. Pro is a last resort.
    const models = [
      'gemini-3-flash-preview', 
      'gemini-3.1-flash-lite-preview'
    ];

    for (const modelName of models) {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await ai.models.generateContent({
            ...params,
            model: modelName,
          });
          return response;
        } catch (error: any) {
          lastError = error;
          const status = error?.status || error?.code || error?.response?.status;
          const message = error?.message || '';
          
          const isRetryable = 
            status === 503 || 
            status === 'UNAVAILABLE' || 
            status === 429 || 
            message.includes('high demand');

          if (isRetryable) {
            const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
            console.warn(`Gemini busy. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          break;
        }
      }
    }
    
    throw lastError;
  }

  static async extractChequeData(file: File): Promise<any> {
    try {
      const compressedBase64 = await this.compressImage(file);
      const response = await this.callGeminiWithRetry({
        contents: [
          {
            parts: [
              { text: 'JSON extract: bank_name, cheque_number, account_number, ifsc_code, date, payee_name, amount_numbers, amount_words, micr_code.' },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: compressedBase64,
                },
              },
            ],
          },
        ],
        config: { responseMimeType: 'application/json' },
      });

      return JSON.parse(response.text || '{}');
    } catch (error: any) {
      console.error('Extraction Error:', error);
      throw error;
    }
  }

  static async extractBillData(file: File): Promise<any> {
    try {
      const compressedBase64 = await this.compressImage(file);
      const response = await this.callGeminiWithRetry({
        contents: [
          {
            parts: [
              { text: 'JSON extract: store_name, store_address, store_phone, invoice_number, date, time, gstin, items(desc, qty, rate, amt), subtotal, cgst, sgst, service_charge, discount, tax_amount, total_amount, payment_mode, raw_text.' },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: compressedBase64,
                },
              },
            ],
          },
        ],
        config: { responseMimeType: 'application/json' },
      });

      return JSON.parse(response.text || '{}');
    } catch (error: any) {
      console.error('Extraction Error:', error);
      throw error;
    }
  }

  private static async compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension 1600px for faster processing while keeping detail
          const MAX_DIM = 1600;
          if (width > height) {
            if (width > MAX_DIM) {
              height *= MAX_DIM / width;
              width = MAX_DIM;
            }
          } else {
            if (height > MAX_DIM) {
              width *= MAX_DIM / height;
              height = MAX_DIM;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with 0.8 quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          resolve(dataUrl.split(',')[1]);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }

  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }
}
