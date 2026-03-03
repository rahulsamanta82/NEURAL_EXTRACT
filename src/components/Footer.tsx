import React from 'react';
import { FileText, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export const Footer = () => (
  <footer className="bg-white border-t border-slate-100 py-24">
    <div className="max-w-7xl mx-auto px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
              <FileText className="text-white w-5 h-5" />
            </div>
            <span className="font-display text-xl font-bold text-slate-900 tracking-tight">
              NEURAL<span className="text-brand-500">EXTRACT</span>
            </span>
          </div>
          <p className="text-lg text-slate-500 leading-relaxed max-w-sm font-medium">
            The industry standard for high-precision financial data extraction. Fast, secure, and highly accurate.
          </p>
          <div className="flex gap-4">
            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all duration-500 border border-slate-100 hover:border-slate-900">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold mb-8 text-[10px] uppercase tracking-[0.3em]">Product</h4>
          <ul className="space-y-5 text-sm font-bold text-slate-400">
            <li><a href="#" className="hover:text-slate-900 transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-slate-900 transition-colors">Security</a></li>
            <li><a href="#" className="hover:text-slate-900 transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-slate-900 transition-colors">Documentation</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-slate-900 font-bold mb-8 text-[10px] uppercase tracking-[0.3em]">Company</h4>
          <ul className="space-y-5 text-sm font-bold text-slate-400">
            <li><a href="#" className="hover:text-slate-900 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-slate-900 transition-colors">Contact</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-8">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          © 2026 NeuralExtract AI. Proudly Made in India 🇮🇳
        </p>
        <div className="flex gap-10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);
