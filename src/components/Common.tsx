import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/utils/cn';

export const Card = ({ children, className, ...props }: any) => (
  <div className={cn("bg-white rounded-3xl border border-slate-100 shadow-sm", className)} {...props}>
    {children}
  </div>
);

export const Input = ({ className, ...props }: any) => (
  <input 
    className={cn(
      "w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-slate-900 placeholder:text-slate-400 font-medium",
      className
    )} 
    {...props} 
  />
);

export const FeatureCard = ({ icon: Icon, title, desc, className, iconBg = "bg-slate-50", iconColor = "text-brand-600", dark = false }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      "p-8 rounded-3xl border transition-all duration-500 group",
      dark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 hover:border-brand-100 hover:shadow-2xl hover:shadow-brand-500/5",
      className
    )}
  >
    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500", iconBg, iconColor)}>
      <Icon className="w-7 h-7" />
    </div>
    <h3 className={cn("text-xl font-bold mb-3", dark ? "text-white" : "text-slate-900")}>{title}</h3>
    <p className={cn("text-sm leading-relaxed", dark ? "text-slate-400" : "text-slate-500")}>{desc}</p>
  </motion.div>
);

export const BankMarquee = () => (
  <div className="py-12 bg-slate-50/50 border-y border-slate-100 overflow-hidden">
    <div className="flex whitespace-nowrap animate-marquee">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center gap-16 px-8">
          {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'].map((bank) => (
            <span key={bank} className="text-sm font-bold text-slate-300 uppercase tracking-[0.3em] hover:text-slate-900 transition-colors cursor-default">
              {bank}
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);
