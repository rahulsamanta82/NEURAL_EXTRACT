import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, Cpu, ShieldCheck, Zap, 
  FileText, Banknote, Database, ArrowRight,
  Sparkles, Layers, Globe
} from 'lucide-react';
import { Button } from './Button';

interface LandingViewProps {
  onStart: () => void;
}

export const LandingView = ({ onStart }: LandingViewProps) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-brand-500/30">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 blur-[120px] rounded-full animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-600/10 blur-[100px] rounded-full animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">NEURAL<span className="text-brand-500">EXTRACT</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <a href="#" className="hover:text-white transition-colors">Enterprise</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <Button 
          onClick={onStart}
          className="bg-white text-black hover:bg-slate-200 rounded-full px-6 py-2 text-sm font-bold"
        >
          Launch App
        </Button>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-20 pb-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-400">Next-Gen Document Intelligence</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter"
            >
              FINANCIAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-600 to-purple-500">EXTRACTION</span> <br />
              REDEFINED.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-slate-400 max-w-lg leading-relaxed font-medium"
            >
              High-precision neural processing for Indian bank cheques and paper bills. 
              Transform raw documents into structured data with 99.4% accuracy.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                onClick={onStart}
                className="h-16 px-10 rounded-2xl bg-brand-600 hover:bg-brand-700 text-lg font-bold shadow-2xl shadow-brand-600/40 group"
              >
                Start Extracting
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-lg font-bold backdrop-blur-md">
                View Demo
              </button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex items-center gap-8 pt-8"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-slate-500">
                Trusted by <span className="text-white font-bold">500+</span> Indian enterprises
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-4 bg-brand-500/20 blur-[100px] rounded-full animate-pulse-glow" />
            
            {/* Floating UI Elements */}
            <div className="relative glass-dark rounded-[2.5rem] p-8 border border-white/10 shadow-2xl overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50" />
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Engine</p>
                    <p className="text-sm font-bold">Active Processing</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                  Live
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { icon: Banknote, label: 'Cheque Extraction', status: '99.4%', color: 'text-brand-400' },
                  { icon: FileText, label: 'Bill to Excel', status: '98.9%', color: 'text-purple-400' },
                  { icon: Database, label: 'History Sync', status: 'Real-time', color: 'text-emerald-400' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default group/item">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-300">{item.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500 group-hover/item:text-white transition-colors">{item.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-brand-600/10 rounded-2xl border border-brand-500/20">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Processed</p>
                    <p className="text-2xl font-display font-bold">12,482</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">+12%</p>
                    <div className="h-1 w-16 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-3/4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 p-6 glass-dark rounded-3xl border border-white/10 shadow-2xl z-20"
            >
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 p-6 glass-dark rounded-3xl border border-white/10 shadow-2xl z-20"
            >
              <Globe className="w-8 h-8 text-brand-400" />
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Trusted By Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 py-16 px-8 max-w-7xl mx-auto"
      >
        <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mb-12">
          Empowering Digital Transformation at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-12 opacity-40 hover:opacity-100 transition-opacity duration-700 grayscale hover:grayscale-0">
          {/* HDFC Bank */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-[#004c8f] rounded-lg flex items-center justify-center text-white font-black text-xs">H</div>
            <span className="font-display font-bold text-xl tracking-tight text-white">HDFC <span className="text-slate-500">BANK</span></span>
          </div>
          {/* ICICI Bank */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-[#9c2424] rounded-lg flex items-center justify-center text-white font-black text-xs">I</div>
            <span className="font-display font-bold text-xl tracking-tight text-white">ICICI <span className="text-slate-500">BANK</span></span>
          </div>
          {/* SBI */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-[#29abe2] rounded-full flex items-center justify-center text-white font-black text-xs relative overflow-hidden">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
              S
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">SBI</span>
          </div>
          {/* Axis Bank */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-[#971237] rounded-lg flex items-center justify-center text-white font-black text-xs">A</div>
            <span className="font-display font-bold text-xl tracking-tight text-white">AXIS <span className="text-slate-500">BANK</span></span>
          </div>
          {/* Kotak */}
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-[#ed1c24] rounded-lg flex items-center justify-center text-white font-black text-xs">K</div>
            <span className="font-display font-bold text-xl tracking-tight text-white">KOTAK</span>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <section className="relative z-10 py-32 px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: Zap,
              title: "Instant Extraction",
              desc: "Proprietary neural models extract data from complex Indian financial documents in seconds."
            },
            {
              icon: ShieldCheck,
              title: "Enterprise Security",
              desc: "Bank-grade encryption and local data processing ensure your sensitive documents stay private."
            },
            {
              icon: Layers,
              title: "Multi-Format Export",
              desc: "Seamlessly export your extracted data to Excel, JSON, or CSV for your accounting workflows."
            }
          ].map((feature, i) => (
            <div key={i} className="space-y-6 group">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-brand-600 transition-all duration-500">
                <feature.icon className="w-7 h-7 text-brand-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-display font-bold">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 max-w-7xl mx-auto border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3 opacity-50">
          <Cpu className="w-5 h-5 text-brand-400" />
          <span className="font-display text-sm font-bold tracking-tight uppercase">Neural Extract</span>
        </div>
        <p className="text-slate-500 text-xs font-medium">© 2024 NeuralExtract AI. All rights reserved. Built for Indian Enterprises.</p>
        <div className="flex gap-6 text-slate-500 text-xs font-medium">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};
