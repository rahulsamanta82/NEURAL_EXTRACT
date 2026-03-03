import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Search, Filter, Download, Trash2, ExternalLink, 
  ChevronRight, Calendar, Banknote, FileText, Hash, ArrowRight
} from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { Button } from './Button';

interface HistoryViewProps {
  history: any[];
  isLoading: boolean;
  fetchHistory: () => void;
}

export const HistoryView = ({ history, isLoading, fetchHistory }: HistoryViewProps) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredHistory = history.filter(item => 
    (item.bank_name || item.store_name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.payee_name || item.invoice_number)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.cheque_number || item.gstin)?.includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
        <div className="space-y-4">
          <h2 className="text-5xl font-display font-bold text-slate-900 tracking-tight">Extraction History</h2>
          <p className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed">Manage and export your processed financial documents with enterprise-grade precision.</p>
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 lg:flex-none">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by bank, store, invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] w-full lg:w-[450px] focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 focus:bg-white transition-all text-sm font-medium shadow-sm"
            />
          </div>
          <button className="p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <Filter className="w-6 h-6" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <div className="relative mb-10">
            <div className="w-20 h-20 border-4 border-slate-100 rounded-full" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-brand-600 rounded-full border-t-transparent animate-spin" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Loading Secure History...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-slate-50/50 rounded-[3rem] border border-slate-100 border-dashed p-24 text-center">
          <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-sm border border-slate-100">
            <History className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-3xl font-display font-bold text-slate-900 mb-4">No extractions found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-12 text-lg font-medium leading-relaxed">
            {searchTerm ? `No results matching "${searchTerm}"` : "You haven't processed any documents yet. Start your first extraction to see it here."}
          </p>
          {!searchTerm && (
            <Button className="rounded-2xl px-12 h-16 text-lg font-bold shadow-2xl shadow-slate-900/10">
              Start Processing
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredHistory.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 hover:border-brand-200 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  <div className="lg:col-span-4 flex items-center gap-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-brand-50 transition-colors duration-500 border border-slate-100 group-hover:border-brand-100">
                      <FileText className="w-10 h-10 text-slate-300 group-hover:text-brand-600 transition-colors duration-500" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                        {item.bank_name || item.store_name || 'Unknown Entity'}
                      </h4>
                      <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-brand-600">{item.type === 'cheque' ? 'Cheque' : 'Bill'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                      {item.type === 'cheque' ? 'Payee' : 'Invoice No.'}
                    </p>
                    <p className="text-lg font-bold text-slate-700 truncate">{item.payee_name || item.invoice_number || '---'}</p>
                  </div>

                  <div className="lg:col-span-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Amount</p>
                    <p className="text-3xl font-display font-bold text-slate-900 tracking-tight">₹{item.amount_numbers || item.total_amount || '0'}</p>
                  </div>

                  <div className="lg:col-span-3 flex items-center justify-end gap-4">
                    <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-2xl transition-all border border-transparent hover:border-slate-100" title="View Details">
                      <ExternalLink className="w-6 h-6" />
                    </button>
                    <button className="p-4 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 rounded-2xl transition-all border border-transparent hover:border-slate-100" title="Download PDF">
                      <Download className="w-6 h-6" />
                    </button>
                    <button className="p-4 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100" title="Delete Record">
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
