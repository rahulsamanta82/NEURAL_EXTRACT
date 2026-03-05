import React from 'react';
import { motion } from 'motion/react';
import { 
  Upload, FileText, X, Loader2, CheckCircle2, AlertCircle, 
  ChevronRight, Download, Share2, Eye, EyeOff, 
  Banknote, Calendar, Hash, User, CreditCard, MapPin, Info,
  Cpu, Database, ShieldCheck
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { Button } from './Button';

interface UploadViewProps {
  processorType: 'cheque' | 'bill';
  setProcessorType: (type: 'cheque' | 'bill') => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  extractedData: any;
  revealedFields: Set<string>;
  toggleField: (field: string) => void;
  handleExtraction: () => void;
  onSelectKey: () => void;
  hasApiKey: boolean;
  exportData: (format: 'json' | 'csv' | 'excel') => void;
}

export const UploadView = ({
  processorType,
  setProcessorType,
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
  isLoading,
  error,
  success,
  extractedData,
  revealedFields,
  toggleField,
  handleExtraction,
  onSelectKey,
  hasApiKey,
  exportData
}: UploadViewProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Upload & Preview */}
        <div className="lg:col-span-7 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
            <div className="flex-1">
              <h2 className="text-4xl font-display font-bold text-slate-900 tracking-tight">DocuMint Processor</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">Upload a {processorType === 'cheque' ? 'bank cheque' : 'paper bill'} for high-precision neural extraction.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <button 
                  onClick={() => setProcessorType('cheque')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                    processorType === 'cheque' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Cheque
                </button>
                <button 
                  onClick={() => setProcessorType('bill')}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.15em] transition-all",
                    processorType === 'bill' ? "bg-white text-brand-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Bill to Excel
                </button>
              </div>

              {selectedFile && (
                <button 
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {!selectedFile ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-slate-900 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
              <label className="relative flex flex-col items-center justify-center w-full h-[500px] border-2 border-dashed border-slate-200 bg-white rounded-[2.5rem] cursor-pointer hover:bg-slate-50/50 hover:border-brand-500/50 transition-all duration-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-10 text-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm border border-slate-100">
                    <Upload className="w-10 h-10 text-brand-600" />
                  </div>
                  <p className="text-2xl font-display font-bold text-slate-900 mb-4">Drop document here</p>
                  <p className="text-slate-500 text-sm max-w-xs leading-relaxed font-medium">
                    Support for PNG, JPG and PDF. <br />Max file size 10MB.
                  </p>
                  <div className="mt-12 flex items-center gap-6">
                    <div className="h-px w-12 bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">or</span>
                    <div className="h-px w-12 bg-slate-200" />
                  </div>
                  <div className="mt-12 px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                    Select from Computer
                  </div>
                </div>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
              </label>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[2rem] overflow-hidden bg-slate-900 shadow-2xl border border-slate-800 p-2"
            >
              <div className="relative rounded-[1.5rem] overflow-hidden aspect-[16/9] bg-slate-800 flex items-center justify-center">
                {selectedFile.type === 'application/pdf' ? (
                  <div className="flex flex-col items-center gap-4 text-slate-400">
                    <FileText className="w-20 h-20 opacity-20" />
                    <p className="font-bold uppercase tracking-widest text-xs">PDF Document Loaded</p>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                  </div>
                ) : (
                  <img 
                    src={previewUrl!} 
                    className="w-full h-full object-contain" 
                    alt="Cheque Preview" 
                    referrerPolicy="no-referrer"
                  />
                )}
                
                <div className="absolute top-6 right-6 flex gap-2">
                  <button className="p-2.5 bg-slate-900/80 backdrop-blur-md text-white rounded-xl hover:bg-slate-800 transition-all border border-white/10">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {isLoading && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-10 text-center">
                    <div className="relative mb-8">
                      <div className="w-20 h-20 border-4 border-brand-500/20 rounded-full" />
                      <div className="absolute inset-0 w-20 h-20 border-4 border-brand-500 rounded-full border-t-transparent animate-spin" />
                      <Cpu className="absolute inset-0 m-auto w-8 h-8 text-brand-500 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">DocuMint Neural Analysis</h3>
                    <p className="text-slate-400 text-sm max-w-xs leading-relaxed font-medium">
                      Our in-house AI engine is extracting high-precision financial data from your {processorType === 'cheque' ? 'Indian bank cheque' : 'paper bill'}.
                    </p>
                    <div className="mt-10 w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="h-full bg-brand-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {selectedFile && !extractedData && !isLoading && (
            <Button 
              onClick={handleExtraction}
              className="w-full h-20 text-xl font-display font-bold rounded-2xl bg-brand-600 hover:bg-brand-700 shadow-2xl shadow-brand-600/30 group"
            >
              Start Neural Extraction
              <ChevronRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-red-600"
            >
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Extraction Error</p>
                <p className="text-sm font-medium leading-relaxed opacity-80">{error}</p>
                {(error.toLowerCase().includes('quota') || error.includes('API key')) && (
                  <button 
                    onClick={onSelectKey}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
                  >
                    {hasApiKey ? 'Change API Key' : 'Switch to Paid API Key'}
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-4 text-emerald-600"
            >
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Success</p>
                <p className="text-sm font-medium leading-relaxed opacity-80">{success}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-5 space-y-8">
          <div className="sticky top-32 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Extraction Results</h3>
              {extractedData && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => exportData('excel')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border border-emerald-100 shadow-sm"
                    title="Export to Excel"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Excel
                  </button>
                  <button 
                    onClick={() => exportData('json')}
                    className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200"
                    title="Export JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleField('raw_json')}
                    className={cn(
                      "p-2.5 rounded-xl transition-all border",
                      revealedFields.has('raw_json') ? "bg-brand-50 text-brand-600 border-brand-100" : "text-slate-400 hover:text-slate-900 hover:bg-slate-100 border-transparent hover:border-slate-200"
                    )}
                    title="View Raw Data"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className={cn(
              "rounded-[2.5rem] border transition-all duration-500 overflow-hidden",
              extractedData ? "bg-white border-slate-100 shadow-2xl shadow-slate-200/50" : "bg-slate-50 border-slate-100 border-dashed min-h-[600px] flex flex-col items-center justify-center p-12 text-center"
            )}>
              {extractedData ? (
                <div className="divide-y divide-slate-50 relative">
                  {revealedFields.has('raw_json') ? (
                    <div className="p-8 bg-slate-900 text-brand-400 font-mono text-[10px] overflow-auto max-h-[600px] custom-scrollbar">
                      <div className="flex justify-between items-center mb-4 text-slate-400 font-sans">
                        <span className="uppercase tracking-widest font-bold">Raw Neural Output</span>
                        <button onClick={() => toggleField('raw_json')} className="hover:text-white transition-colors">Close</button>
                      </div>
                      <pre>{JSON.stringify(extractedData, null, 2)}</pre>
                    </div>
                  ) : (
                    <>
                      <div className="p-8 bg-slate-900 text-white">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        {processorType === 'cheque' ? <Banknote className="w-6 h-6 text-brand-400" /> : <CreditCard className="w-6 h-6 text-brand-400" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                          {processorType === 'cheque' ? 'Detected Institution' : 'Store / Vendor'}
                        </p>
                        <h4 className="text-xl font-bold">{extractedData.bank_name || extractedData.store_name || 'Unknown'}</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 mt-8">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          {processorType === 'cheque' ? 'Cheque No.' : 'Invoice No.'}
                        </p>
                        <p className="text-lg font-mono font-bold tracking-wider">{extractedData.cheque_number || extractedData.invoice_number || '---'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-lg font-bold">{extractedData.date || '---'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 space-y-8">
                    {processorType === 'cheque' ? (
                      <>
                        <DataField 
                          icon={User} 
                          label="Payee Name" 
                          value={extractedData.payee_name} 
                          isRevealed={revealedFields.has('payee_name')}
                          onToggle={() => toggleField('payee_name')}
                        />
                        <DataField 
                          icon={CreditCard} 
                          label="Account Number" 
                          value={extractedData.account_number} 
                          isRevealed={revealedFields.has('account_number')}
                          onToggle={() => toggleField('account_number')}
                          isMono
                        />
                        <DataField 
                          icon={MapPin} 
                          label="IFSC Code" 
                          value={extractedData.ifsc_code} 
                          isRevealed={revealedFields.has('ifsc_code')}
                          onToggle={() => toggleField('ifsc_code')}
                          isMono
                        />
                        <div className="pt-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">Amount in Words</p>
                          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                            "{extractedData.amount_words || 'Not detected'}"
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <DataField 
                          icon={Hash} 
                          label="GSTIN" 
                          value={extractedData.gstin} 
                          isRevealed={revealedFields.has('gstin')}
                          onToggle={() => toggleField('gstin')}
                          isMono
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <DataField 
                            icon={MapPin} 
                            label="Address" 
                            value={extractedData.store_address} 
                            isRevealed={revealedFields.has('store_address')}
                            onToggle={() => toggleField('store_address')}
                          />
                          <DataField 
                            icon={User} 
                            label="Phone" 
                            value={extractedData.store_phone} 
                            isRevealed={revealedFields.has('store_phone')}
                            onToggle={() => toggleField('store_phone')}
                          />
                        </div>
                        
                        {extractedData.items && extractedData.items.length > 0 && (
                          <div className="space-y-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Itemized Breakdown</p>
                            <div className="rounded-2xl border border-slate-100 overflow-hidden">
                              <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  <tr>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3 text-right">Qty</th>
                                    <th className="px-4 py-3 text-right">Rate</th>
                                    <th className="px-4 py-3 text-right">Amount</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                  {extractedData.items.map((item: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                      <td className="px-4 py-3 font-medium text-slate-700">{item.description}</td>
                                      <td className="px-4 py-3 text-right text-slate-500">{item.quantity}</td>
                                      <td className="px-4 py-3 text-right text-slate-500">₹{item.rate}</td>
                                      <td className="px-4 py-3 text-right font-bold text-slate-900">₹{item.amount}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
                            <p className="font-bold text-slate-900">₹{extractedData.subtotal || '0.00'}</p>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tax Amount</p>
                            <p className="font-bold text-slate-900">₹{extractedData.tax_amount || '0.00'}</p>
                          </div>
                        </div>

                        {(extractedData.cgst || extractedData.sgst || extractedData.service_charge || extractedData.discount) && (
                          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Additional Details</p>
                            <div className="grid grid-cols-2 gap-y-2 text-xs">
                              {extractedData.cgst && <div className="flex justify-between pr-4"><span>CGST:</span> <span className="font-bold">₹{extractedData.cgst}</span></div>}
                              {extractedData.sgst && <div className="flex justify-between pr-4"><span>SGST:</span> <span className="font-bold">₹{extractedData.sgst}</span></div>}
                              {extractedData.service_charge && <div className="flex justify-between pr-4"><span>Service Charge:</span> <span className="font-bold">₹{extractedData.service_charge}</span></div>}
                              {extractedData.discount && <div className="flex justify-between pr-4 text-emerald-600"><span>Discount:</span> <span className="font-bold">-₹{extractedData.discount}</span></div>}
                            </div>
                          </div>
                        )}

                        {extractedData.raw_text && (
                          <div className="pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Text Transcription</p>
                              <button 
                                onClick={() => toggleField('raw_text')}
                                className="text-[10px] font-bold text-brand-600 hover:text-brand-700 uppercase tracking-widest"
                              >
                                {revealedFields.has('raw_text') ? 'Hide Transcription' : 'Show Transcription'}
                              </button>
                            </div>
                            {revealedFields.has('raw_text') && (
                              <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 text-slate-300 text-[11px] leading-relaxed font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                                {extractedData.raw_text}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="p-8 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {processorType === 'cheque' ? 'Total Amount' : 'Grand Total'}
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        {extractedData.amount_numbers || extractedData.total_amount ? `₹${extractedData.amount_numbers || extractedData.total_amount}` : '---'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[98%]" />
                        </div>
                        <span className="text-xs font-bold text-emerald-600">98.4%</span>
                      </div>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm">
                    <Database className="w-10 h-10 text-slate-200" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">No Data Extracted</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Upload and process a document to see the extracted neural data points here.
                  </p>
                </>
              )}
            </div>

            {extractedData && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-medium">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <p>All data is processed within our secure DocuMint data centers and encrypted.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DataField = ({ icon: Icon, label, value, isRevealed, onToggle, isMono = false }: any) => (
  <div className="group">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className="p-1.5 text-slate-300 hover:text-slate-600 transition-all opacity-0 group-hover:opacity-100"
      >
        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
    <div className={cn(
      "p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between",
      isRevealed ? "bg-white border-slate-100 shadow-sm" : "bg-slate-50 border-transparent"
    )}>
      <p className={cn(
        "font-bold transition-all duration-300",
        isRevealed ? "text-slate-900" : "text-slate-300 blur-[4px] select-none",
        isMono ? "font-mono tracking-wider text-sm" : "text-base"
      )}>
        {value || '---'}
      </p>
      {isRevealed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
    </div>
  </div>
);
