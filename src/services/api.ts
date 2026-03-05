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

  static async extractChequeData(file: File): Promise<any> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: 'Extract all details from this bank cheque. Return ONLY a JSON object with these keys: bank_name, cheque_number, account_number, ifsc_code, date, payee_name, amount_numbers, amount_words, micr_code. If a field is not found, use null.' },
              {
                inlineData: {
                  mimeType: file.type,
                  data: await this.fileToBase64(file),
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      return JSON.parse(response.text || '{}');
    } catch (error: any) {
      console.error('Gemini Cheque Extraction Error:', error);
      throw error;
    }
  }

  static async extractBillData(file: File): Promise<any> {
    const ai = this.getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { text: `Extract all details from this Indian paper bill/invoice (could be a restaurant bill, retail receipt, or utility bill). 
              Return ONLY a JSON object with these keys: 
              - store_name: Name of the establishment
              - store_address: Full address if available
              - store_phone: Contact number if available
              - invoice_number: Bill/Invoice/Order number
              - date: Date of transaction
              - time: Time of transaction if available
              - gstin: GST number of the store
              - items: Array of objects with { description, quantity, rate, amount }
              - subtotal: Amount before taxes
              - cgst: CGST amount if specified
              - sgst: SGST amount if specified
              - service_charge: Service charge if specified
              - discount: Discount amount if specified
              - tax_amount: Total tax amount
              - total_amount: Final payable amount
              - payment_mode: Cash/Card/UPI if specified
              - raw_text: A full transcription of all text found on the bill for reference.
              
              If a field is not found, use null. Ensure all numeric values are returned as strings or numbers without currency symbols.` },
              {
                inlineData: {
                  mimeType: file.type,
                  data: await this.fileToBase64(file),
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      return JSON.parse(response.text || '{}');
    } catch (error: any) {
      console.error('Gemini Bill Extraction Error:', error);
      throw error;
    }
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
