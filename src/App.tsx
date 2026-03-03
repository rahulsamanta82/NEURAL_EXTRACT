import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './components/LandingView';
import { AuthView } from './components/AuthView';
import { UploadView } from './components/UploadView';
import { HistoryView } from './components/HistoryView';
import { ApiService, ExtractionService } from './services/api';

export default function App() {
  // Auth State
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // UI State
  const [view, setView] = useState<'landing' | 'auth' | 'upload' | 'history'>('landing');
  const [processorType, setProcessorType] = useState<'cheque' | 'bill'>('cheque');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [revealedFields, setRevealedFields] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<any[]>([]);

  // Reset state when a new file is selected, cleared, or processor type changes
  useEffect(() => {
    setExtractedData(null);
    setError(null);
    setSuccess(null);
    setRevealedFields(new Set());
  }, [selectedFile, processorType]);

  // Initialize
  useEffect(() => {
    if (token) {
      ApiService.setToken(token);
      setView('upload');
      fetchHistory();
    }
  }, [token]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await ApiService.getHistory(processorType);
      setHistory(data);
    } catch (err: any) {
      console.error('History fetch failed:', err);
      if (err.message.includes('401') || err.message.includes('403')) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [processorType]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = authMode === 'login' 
        ? await ApiService.login({ email, password })
        : await ApiService.register({ email, password });
      
      setToken(data.token);
      setUser(data.user);
      ApiService.setToken(data.token);
      setView('upload');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    ApiService.setToken(null);
    setView('landing');
    setHistory([]);
    setExtractedData(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleExtraction = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setExtractedData(null);
    setRevealedFields(new Set());

    try {
      // 1. Extract using Proprietary AI
      const data = processorType === 'cheque' 
        ? await ExtractionService.extractChequeData(selectedFile)
        : await ExtractionService.extractBillData(selectedFile);
      
      setExtractedData(data);
      
      // Simulate field-by-field revelation for effect
      const fields = Object.keys(data);
      for (const field of fields) {
        await new Promise(r => setTimeout(r, 200));
        setRevealedFields(prev => new Set([...prev, field]));
      }

      // 2. Save to backend
      await ApiService.extract(selectedFile, data, processorType);
      setSuccess(`${processorType === 'cheque' ? 'Cheque' : 'Bill'} extraction saved to history successfully.`);
      fetchHistory();
    } catch (err: any) {
      console.error('Extraction failed:', err);
      let errorMessage = err.message || 'Failed to process document. Please try again.';
      
      // Handle Quota Error
      if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('quota')) {
        errorMessage = 'You have exceeded the free tier quota for neural extraction. Please switch to a paid API key to continue processing high volumes.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // After selecting, we should ideally refresh or just let the next call use the new key
      setSuccess('API Key updated. You can now retry the extraction.');
      setError(null);
    }
  };

  const toggleField = (field: string) => {
    setRevealedFields(prev => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  const exportData = (format: 'json' | 'csv' | 'excel') => {
    if (!extractedData) return;
    
    let fileName = `${processorType}_extraction_${Date.now()}`;

    if (format === 'excel') {
      import('xlsx').then(XLSX => {
        const dataToExport = Array.isArray(extractedData.items) && extractedData.items.length > 0
          ? extractedData.items.map((item: any) => ({
              Store: extractedData.store_name,
              Address: extractedData.store_address,
              Phone: extractedData.store_phone,
              Invoice: extractedData.invoice_number,
              Date: extractedData.date,
              Time: extractedData.time,
              GSTIN: extractedData.gstin,
              Description: item.description,
              Quantity: item.quantity,
              Rate: item.rate,
              Amount: item.amount,
              Subtotal: extractedData.subtotal,
              CGST: extractedData.cgst,
              SGST: extractedData.sgst,
              ServiceCharge: extractedData.service_charge,
              Discount: extractedData.discount,
              TaxTotal: extractedData.tax_amount,
              GrandTotal: extractedData.total_amount,
              PaymentMode: extractedData.payment_mode
            }))
          : [{
              ...extractedData,
              items: JSON.stringify(extractedData.items)
            }];

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        
        // Add raw text as a separate sheet if it exists
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Itemized Data");
        
        if (extractedData.raw_text) {
          const rawWs = XLSX.utils.aoa_to_sheet([["Full Transcription"], [extractedData.raw_text]]);
          XLSX.utils.book_append_sheet(wb, rawWs, "Full Transcription");
        }

        XLSX.writeFile(wb, `${fileName}.xlsx`);
      });
      return;
    }

    let content = '';
    let mimeType = '';

    if (format === 'json') {
      content = JSON.stringify(extractedData, null, 2);
      fileName += '.json';
      mimeType = 'application/json';
    } else {
      const headers = Object.keys(extractedData).join(',');
      const values = Object.values(extractedData).map(v => `"${v}"`).join(',');
      content = `${headers}\n${values}`;
      fileName += '.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-brand-100 selection:text-brand-900">
      {view !== 'landing' && (
        <Navbar 
          view={view} 
          setView={setView} 
          handleLogout={handleLogout} 
          token={token} 
        />
      )}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <LandingView key="landing" onStart={() => setView(token ? 'upload' : 'auth')} />
          )}

          {view === 'auth' && (
            <AuthView 
              key="auth"
              authMode={authMode}
              setAuthMode={setAuthMode}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleAuth={handleAuth}
              isLoading={isLoading}
              error={error}
            />
          )}

          {view === 'upload' && (
            <UploadView 
              key="upload"
              processorType={processorType}
              setProcessorType={setProcessorType}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              isLoading={isLoading}
              error={error}
              success={success}
              extractedData={extractedData}
              revealedFields={revealedFields}
              toggleField={toggleField}
              handleExtraction={handleExtraction}
              onSelectKey={handleSelectKey}
              exportData={exportData}
            />
          )}

          {view === 'history' && (
            <HistoryView 
              key="history"
              history={history}
              isLoading={isLoading}
              fetchHistory={fetchHistory}
            />
          )}
        </AnimatePresence>
      </main>

      {view !== 'landing' && <Footer />}
    </div>
  );
}
