import React from 'react';
import { motion } from 'motion/react';
import { FileText, LogOut } from 'lucide-react';
import { cn } from '@/src/utils/cn';
import { Button } from './Button';

const MovingLogo = ({ className }: { className?: string }) => (
  <motion.div 
    className={cn("relative flex items-center justify-center", className)}
  >
    <div className="relative w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
      <FileText className="text-white w-5 h-5" />
    </div>
  </motion.div>
);

interface NavbarProps {
  view: 'landing' | 'auth' | 'upload' | 'history';
  setView: (view: 'landing' | 'auth' | 'upload' | 'history') => void;
  handleLogout: () => void;
  token: string | null;
}

export const Navbar = ({ view, setView, handleLogout, token }: NavbarProps) => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-8">
      <div className="flex justify-between h-20 items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView(token ? 'upload' : 'landing')}
        >
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20 group-hover:scale-110 transition-transform">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            NEURAL<span className="text-brand-500">EXTRACT</span>
          </span>
        </div>
        
        <div className="flex items-center gap-8">
          {token ? (
            <>
              <div className="hidden md:flex items-center gap-8">
                <button 
                  onClick={() => setView('upload')}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest transition-all",
                    view === 'upload' ? "text-brand-600" : "text-slate-400 hover:text-slate-900"
                  )}
                >
                  Processor
                </button>
                <button 
                  onClick={() => setView('history')}
                  className={cn(
                    "text-xs font-bold uppercase tracking-widest transition-all",
                    view === 'history' ? "text-brand-600" : "text-slate-400 hover:text-slate-900"
                  )}
                >
                  History
                </button>
              </div>
              <div className="h-4 w-px bg-slate-200 hidden md:block" />
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setView('auth')}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
              >
                Sign In
              </button>
              <Button 
                onClick={() => setView('auth')} 
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  </nav>
);
