import React from 'react';
import { BentoItemProps } from '../types';

export const BentoItem: React.FC<BentoItemProps> = ({ children, className = '', title, icon, allowOverflow = false }) => {
  return (
    <div className={`relative ${allowOverflow ? 'overflow-visible' : 'overflow-hidden'} bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-5 flex flex-col transition-all duration-500 hover:bg-black/50 ${className}`}>
      {(title || icon) && (
        <div className="flex items-center gap-2 mb-3 text-white/60 uppercase tracking-widest text-[10px] lg:text-xs font-semibold">
          {icon && <span className="text-white/80">{icon}</span>}
          {title && <span>{title}</span>}
        </div>
      )}
      <div className="flex-1 flex flex-col relative z-10 min-h-0">
        {children}
      </div>

      {/* Subtle shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  );
};