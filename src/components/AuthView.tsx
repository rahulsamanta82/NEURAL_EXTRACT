import React from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface AuthViewProps {
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (pass: string) => void;
  handleAuth: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthView = ({
  authMode,
  setAuthMode,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth,
  isLoading,
  error
}: AuthViewProps) => (
  <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-8 bg-white relative overflow-hidden">
    {/* Background Accents */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-50 rounded-full blur-[120px] opacity-50 pointer-events-none" />
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md relative z-10"
    >
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-brand-600/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            {authMode === 'login' 
              ? 'Access your enterprise neural processor' 
              : 'Start automating your financial workflow today'}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-xs font-bold uppercase tracking-wider"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-8">
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400"
                placeholder="name@company.com"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 focus:bg-white transition-all text-slate-900 font-medium placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-16 text-lg font-display font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-2xl shadow-slate-900/20 group"
            isLoading={isLoading}
          >
            {authMode === 'login' ? 'Sign In' : 'Create Account'}
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="text-xs font-bold text-slate-400 hover:text-brand-600 uppercase tracking-widest transition-all"
          >
            {authMode === 'login' 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);
