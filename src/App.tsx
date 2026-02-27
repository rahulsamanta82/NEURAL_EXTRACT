import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  History, 
  LogOut, 
  Loader2, 
  AlertCircle,
  ChevronRight,
  User,
  CreditCard,
  Building2,
  Calendar,
  Hash,
  IndianRupee,
  FileJson,
  Table as TableIcon,
  ShieldCheck,
  Zap,
  Cpu,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI } from '@google/genai';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const MovingLogo = ({ className }: { className?: string }) => (
  <motion.div 
    className={cn("relative flex items-center justify-center", className)}
    animate={{ 
      rotate: [0, 5, -5, 0],
      scale: [1, 1.05, 0.95, 1]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
  >
    <div className="absolute inset-0 bg-brand-500/20 blur-2xl rounded-full animate-pulse" />
    <div className="relative w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/20">
      <FileText className="text-white w-6 h-6" />
    </div>
  </motion.div>
);

const Navbar = ({ view, setView, handleLogout, token }: any) => (
  <nav className="sticky top-0 z-50 glass border-b border-slate-200/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView(token ? 'upload' : 'landing')}
        >
          <MovingLogo className="w-8 h-8 scale-75" />
          <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
            Cheque<span className="text-brand-600">Extract</span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-6">
          {token ? (
            <>
              <button 
                onClick={() => setView('upload')}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                  view === 'upload' ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                Extract
              </button>
              <button 
                onClick={() => setView('history')}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300",
                  view === 'history' ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                History
              </button>
              <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block" />
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Button onClick={() => setView('auth')} className="rounded-full px-6">
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
        <div className="col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">
              Cheque<span className="text-brand-400">Extract</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            State-of-the-art AI for bank cheque data extraction. Fast, secure, and highly accurate.
          </p>
          <div className="flex gap-3 mt-6">
            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-400 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-400 transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] uppercase tracking-widest font-bold">© 2026 ChequeExtract AI. All rights reserved.</p>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </div>
  </footer>
);

const Landing = ({ onStart }: { onStart: () => void }) => (
  <div className="mesh-gradient min-h-[calc(100vh-64px)] relative">
    {/* Decorative Blobs */}
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-200/20 rounded-full blur-[120px] animate-blob" />
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-[10px] font-bold mb-6 shadow-sm uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-brand-500 text-brand-500" />
            <span>Powered by Gemini 3.0 Pro</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500">
              Cheque OCR.
            </span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg mb-10 font-medium">
            Stop manual data entry. Our AI-driven engine extracts every detail from bank cheques with surgical precision and enterprise-grade speed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={onStart} className="h-14 px-8 text-base rounded-xl group shadow-xl shadow-brand-500/20 bg-brand-600 hover:bg-brand-700">
              Start Processing
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" className="h-14 px-8 text-base rounded-xl border-2 border-slate-200 hover:border-brand-500 transition-all">
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-16 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white shadow-lg overflow-hidden">
                  <img 
                    src={`https://picsum.photos/seed/fin${i}/100/100`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Trusted by <span className="text-slate-900">5,000+</span> companies
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
            <div className="relative glass rounded-[2.5rem] p-4 shadow-2xl border-white/60">
              <div className="relative aspect-[1.4/1] overflow-hidden rounded-[2rem] bg-slate-100">
                <img 
                  src="https://picsum.photos/seed/dashboard/1200/900" 
                  className="w-full h-full object-cover opacity-90"
                  alt="AI Dashboard"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                
                {/* Floating UI Elements */}
                <motion.div 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-6 right-6 glass p-3 rounded-xl shadow-xl border-white/40 backdrop-blur-2xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <ShieldCheck className="text-white w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Verified</span>
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute bottom-6 left-6 glass p-3 rounded-xl shadow-xl border-white/40 backdrop-blur-2xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center">
                      <Cpu className="text-white w-3 h-3" />
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">AI Active</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Stats Section */}
      <div className="mt-32 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Accuracy', value: '99.9%', icon: ShieldCheck, color: 'text-emerald-500' },
          { label: 'Speed', value: '< 2s', icon: Zap, color: 'text-amber-500' },
          { label: 'Banks', value: '150+', icon: Building2, color: 'text-brand-500' },
          { label: 'Security', value: 'AES-256', icon: ShieldCheck, color: 'text-indigo-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col items-center text-center group hover:border-brand-200 transition-all"
          >
            <div className={cn("w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-slate-900 tracking-tight mb-1">{stat.value}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bento Features Section */}
      <div className="mt-32">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Built for Modern Finance</h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
            Everything you need to process financial documents at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8">
            <FeatureCard 
              icon={Zap} 
              title="Neural OCR Engine" 
              desc="Our proprietary AI models are trained on millions of financial documents, ensuring perfect recognition."
              className="h-full bg-slate-900 text-white border-none"
              iconBg="bg-brand-600"
              iconColor="text-white"
              dark
            />
          </div>
          <div className="md:col-span-4">
            <FeatureCard 
              icon={ShieldCheck} 
              title="Bank-Grade Privacy" 
              desc="End-to-end encryption for every document."
              className="h-full"
            />
          </div>
          <div className="md:col-span-4">
            <FeatureCard 
              icon={Cpu} 
              title="Multi-Bank API" 
              desc="Seamlessly integrate with any banking format."
              className="h-full"
            />
          </div>
          <div className="md:col-span-8">
            <FeatureCard 
              icon={FileText} 
              title="Automated Reconciliation" 
              desc="Instantly match extracted cheque data with your internal accounting records."
              className="h-full bg-brand-50 border-brand-100"
              iconBg="bg-brand-600"
              iconColor="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, desc, className, iconBg = "bg-brand-50", iconColor = "text-brand-600", dark = false }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      "p-10 rounded-[3rem] border transition-all duration-500 group relative overflow-hidden",
      dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10",
      className
    )}
  >
    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500", iconBg)}>
      <Icon className={cn("w-8 h-8", iconColor)} />
    </div>
    <h3 className={cn("text-2xl font-black tracking-tight mb-4", dark ? "text-white" : "text-slate-900")}>{title}</h3>
    <p className={cn("text-lg leading-relaxed font-medium", dark ? "text-slate-400" : "text-slate-500")}>{desc}</p>
    
    {/* Decorative Gradient for Dark Card */}
    {dark && (
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-600/20 rounded-full blur-3xl" />
    )}
  </motion.div>
);

// --- Types ---
interface ExtractionData {
  id?: number;
  bank_name: string | null;
  cheque_number: string | null;
  account_number: string | null;
  ifsc_code: string | null;
  date: string | null;
  payee_name: string | null;
  amount_numbers: string | null;
  amount_words: string | null;
  micr_code: string | null;
  file_path?: string;
  created_at?: string;
}

interface User {
  id: number;
  email: string;
}

// --- Components ---

const Button = ({ 
  children, 
  className, 
  variant = 'primary', 
  isLoading, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost', isLoading?: boolean }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    className={cn(
      'flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn('rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}>
    {children}
  </div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [view, setView] = useState<'landing' | 'auth' | 'upload' | 'history'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractionData | null>(null);
  const [history, setHistory] = useState<ExtractionData[]>([]);

  useEffect(() => {
    if (token) {
      setView('upload');
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/history', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          setHistory(data);
        } else {
          const text = await res.text();
          console.error('Non-JSON history response:', text);
        }
      } else {
        const text = await res.text();
        console.error('History fetch failed with status:', res.status, text);
      }
    } catch (err) {
      console.error('History fetch failed:', err);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(`Server error (${res.status}): Invalid response format`);
      }

      if (res.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setUser(data.user);
        setView('upload');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
    setView('landing');
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setExtractedData(null);
      setRevealedFields(new Set());
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !token) return;
    setIsLoading(true);
    setError(null);
    setRevealedFields(new Set());
    setExtractedData(null);

    const MAX_RETRIES = 3;
    const BASE_DELAY = 1000;

    const performExtraction = async (attempt = 0): Promise<any> => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const model = 'gemini-3-flash-preview';

        // Convert file to base64 (only once)
        const base64File = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(selectedFile);
        });

        const prompt = `
          Extract structured data from this bank cheque image. 
          Return ONLY a JSON object with the following fields:
          - bank_name
          - cheque_number
          - account_number
          - ifsc_code
          - date
          - payee_name
          - amount_numbers
          - amount_words
          - micr_code
          
          If a field is not found, use null.
        `;

        const result = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { text: prompt },
              { inlineData: { data: base64File, mimeType: selectedFile.type } }
            ]
          },
          config: {
            responseMimeType: 'application/json'
          }
        });

        return JSON.parse(result.text || '{}');
      } catch (err: any) {
        const isRetryable = err.status === 429 || (err.status >= 500 && err.status < 600) || err.message?.includes('fetch');
        
        if (isRetryable && attempt < MAX_RETRIES) {
          const delay = BASE_DELAY * Math.pow(2, attempt);
          console.warn(`Extraction failed, retrying in ${delay}ms... (Attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return performExtraction(attempt + 1);
        }
        throw err;
      }
    };

    try {
      // 1. Perform OCR and Extraction on the Frontend with Retry Logic
      const data = await performExtraction();

      // Simulate staggered reveal for granular feel
      const fields = [
        'bank_name', 'cheque_number', 'account_number', 'ifsc_code', 
        'date', 'payee_name', 'amount_numbers', 'amount_words', 'micr_code'
      ];
      
      setExtractedData(data);
      
      for (const field of fields) {
        await new Promise(r => setTimeout(r, 150));
        setRevealedFields(prev => new Set([...prev, field]));
      }

      // 2. Send extracted data and file to backend for storage
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('data', JSON.stringify(data));

      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      let saveResult;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        saveResult = await res.json();
      } else {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server error (${res.status}): Received HTML instead of JSON. Please check server logs.`);
      }
      
      if (res.ok) {
        setSuccess('Extraction successful!');
        fetchHistory();
      } else {
        setError(saveResult.error || 'Failed to save extraction');
      }
    } catch (err: any) {
      console.error('Extraction error:', err);
      setError(err.message || 'Extraction failed after multiple attempts');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    if (!extractedData) return;
    const data = format === 'json' 
      ? JSON.stringify(extractedData, null, 2)
      : Object.entries(extractedData).map(([k, v]) => `${k},${v}`).join('\n');
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cheque_extraction.${format}`;
    a.click();
  };

  if (view === 'landing') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar view={view} setView={setView} handleLogout={handleLogout} token={token} />
        <Landing onStart={() => setView(token ? 'upload' : 'auth')} />
        <Footer />
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div className="min-h-screen mesh-gradient flex flex-col">
        <Navbar view={view} setView={setView} handleLogout={handleLogout} token={token} />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="p-10 glass border-white/40 shadow-2xl">
              <div className="flex flex-col items-center mb-10">
                <MovingLogo className="mb-6" />
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {authMode === 'login' ? 'Welcome Back' : 'Join ChequeExtract'}
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                  {authMode === 'login' ? 'Enter your credentials to continue' : 'Start your 14-day free trial today'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <Input 
                    type="email" 
                    placeholder="alex@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 focus:ring-brand-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-slate-200 focus:ring-brand-500"
                    required
                  />
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{error}</span>
                  </motion.div>
                )}
                <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-brand-500/20" isLoading={isLoading && !extractedData}>
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-sm text-brand-600 hover:text-brand-700 font-bold transition-colors"
                >
                  {authMode === 'login' ? "New here? Create an account" : "Already have an account? Sign in"}
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar view={view} setView={setView} handleLogout={handleLogout} token={token} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {view === 'upload' ? (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              {/* Left Column: Upload */}
              <div className="lg:col-span-5 space-y-8">
                <Card className="p-8 border-slate-200/60 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                      <Upload className="text-brand-600 w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
                  </div>
                  
                  <div 
                    className={cn(
                      "group relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all duration-500 cursor-pointer overflow-hidden",
                      previewUrl ? "border-brand-200 bg-brand-50/20" : "border-slate-200 hover:border-brand-400 hover:bg-slate-50"
                    )}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*,application/pdf"
                      onChange={onFileChange}
                    />
                    {previewUrl ? (
                      <div className="w-full aspect-[1.6/1] relative overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-white" />
                        {isLoading && !extractedData && (
                          <div className="absolute inset-0 bg-brand-600/20 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="bg-white/95 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-brand-100">
                              <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                              <span className="text-sm font-black text-brand-600 uppercase tracking-[0.2em]">Analyzing</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                          <Upload className="text-slate-400 w-8 h-8 group-hover:text-brand-500 transition-colors" />
                        </div>
                        <p className="text-lg font-bold text-slate-900">Drop your cheque here</p>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Supports PNG, JPG, and PDF formats</p>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-10 flex gap-4">
                    <Button 
                      className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg shadow-brand-500/20" 
                      onClick={handleUpload} 
                      isLoading={isLoading && !extractedData}
                      disabled={!selectedFile}
                    >
                      Process Now
                    </Button>
                    {selectedFile && (
                      <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl border-slate-200" onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setExtractedData(null);
                        setRevealedFields(new Set());
                      }}>
                        <LogOut className="w-6 h-6 rotate-90" />
                      </Button>
                    )}
                  </div>
                </Card>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle className="text-red-600 w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-900">Processing Error</p>
                      <p className="text-sm text-red-700 mt-1 font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column: Results */}
              <div className="lg:col-span-7 space-y-8">
                {(isLoading || extractedData) ? (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card className="p-8 border-slate-200/60 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
                      <div className={cn(
                        "absolute top-0 left-0 w-full h-1.5 transition-all duration-1000",
                        revealedFields.size === 9 ? "bg-emerald-500" : "bg-brand-500"
                      )} />
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                              {revealedFields.size === 9 ? "Extraction Complete" : "AI Processing"}
                            </h2>
                            {revealedFields.size === 9 && (
                              <div className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                                Verified
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 font-medium">
                            {revealedFields.size === 9 ? "All data points successfully identified" : `Analyzing document structure (${revealedFields.size}/9)`}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs" onClick={() => exportData('json')} disabled={revealedFields.size < 9}>
                            <FileJson className="w-4 h-4 mr-2" /> JSON
                          </Button>
                          <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 font-bold text-xs" onClick={() => exportData('csv')} disabled={revealedFields.size < 9}>
                            <TableIcon className="w-4 h-4 mr-2" /> CSV
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DataField icon={Building2} label="Bank Name" value={extractedData?.bank_name || null} isLoading={!revealedFields.has('bank_name')} />
                        <DataField icon={Hash} label="Cheque Number" value={extractedData?.cheque_number || null} isLoading={!revealedFields.has('cheque_number')} />
                        <DataField icon={CreditCard} label="Account Number" value={extractedData?.account_number || null} isLoading={!revealedFields.has('account_number')} />
                        <DataField icon={Building2} label="IFSC Code" value={extractedData?.ifsc_code || null} isLoading={!revealedFields.has('ifsc_code')} />
                        <DataField icon={Calendar} label="Date" value={extractedData?.date || null} isLoading={!revealedFields.has('date')} />
                        <DataField icon={User} label="Payee Name" value={extractedData?.payee_name || null} isLoading={!revealedFields.has('payee_name')} />
                        <DataField icon={IndianRupee} label="Amount (Numbers)" value={extractedData?.amount_numbers || null} isLoading={!revealedFields.has('amount_numbers')} />
                        <DataField icon={FileText} label="Amount (Words)" value={extractedData?.amount_words || null} isLoading={!revealedFields.has('amount_words')} className="md:col-span-2" />
                        <DataField icon={Hash} label="MICR Code" value={extractedData?.micr_code || null} isLoading={!revealedFields.has('micr_code')} />
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="flex flex-col items-center justify-center py-32 border-slate-100 bg-slate-50/30 border-dashed border-2 rounded-[3rem]">
                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-8 animate-float">
                      <FileText className="text-slate-200 w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">Ready for Analysis</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs text-center font-medium leading-relaxed">
                      Upload a cheque document to begin the AI-powered extraction process.
                    </p>
                  </Card>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Extraction History</h2>
                  <p className="text-slate-500 font-medium mt-1">Manage and export your previously processed documents</p>
                </div>
                <Button variant="outline" onClick={fetchHistory} className="rounded-xl border-slate-200 font-bold">
                  Refresh Database
                </Button>
              </div>

              {history.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-32 border-slate-100 bg-slate-50/30 border-dashed border-2 rounded-[3rem]">
                  <History className="text-slate-200 w-16 h-16 mb-6" />
                  <p className="text-slate-400 font-bold text-xl">No records found</p>
                  <Button onClick={() => setView('upload')} className="mt-8 rounded-xl px-8">
                    Start Your First Extraction
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {history.map((item) => (
                    <Card key={item.id} className="hover:border-brand-300 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 group p-8 rounded-[2rem]">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center group-hover:bg-brand-600 transition-colors duration-500">
                          <Building2 className="text-brand-600 w-6 h-6 group-hover:text-white transition-colors duration-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1.5 rounded-full">
                          {new Date(item.created_at!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 truncate mb-1">{item.bank_name || 'Unknown Bank'}</h3>
                      <p className="text-sm text-slate-500 font-medium mb-6">Payee: {item.payee_name || 'N/A'}</p>
                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</span>
                          <span className="text-2xl font-black text-brand-600">₹{item.amount_numbers || '0'}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setExtractedData(item);
                            setPreviewUrl(item.file_path ? `/${item.file_path}` : null);
                            setRevealedFields(new Set(['bank_name', 'cheque_number', 'account_number', 'ifsc_code', 'date', 'payee_name', 'amount_numbers', 'amount_words', 'micr_code']));
                            setView('upload');
                          }}
                          className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-all duration-500"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

function DataField({ 
  icon: Icon, 
  label, 
  value, 
  className,
  isLoading 
}: { 
  icon: any, 
  label: string, 
  value: string | null, 
  className?: string,
  isLoading?: boolean
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className={cn(
        "rounded-lg px-3 py-2 border transition-all duration-500",
        isLoading ? "bg-slate-50 border-slate-100 animate-pulse" : "bg-white border-slate-200 shadow-sm"
      )}>
        {isLoading ? (
          <div className="h-5 flex items-center">
            <div className="h-2 w-24 bg-slate-200 rounded" />
          </div>
        ) : (
          <p className={cn("text-sm font-medium", value ? "text-slate-900" : "text-slate-400 italic")}>
            {value || 'Not detected'}
          </p>
        )}
      </div>
    </div>
  );
}
