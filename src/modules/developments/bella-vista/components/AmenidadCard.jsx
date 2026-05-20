import React from 'react';

export default function AmenidadCard({ icon, title, description }) {
  return (
    <div className="bv-glass-card p-8 flex flex-col items-start gap-4 text-left">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[rgba(194,166,131,0.08)] border border-[rgba(194,166,131,0.2)] text-2xl text-[#C2A683]">
        {icon}
      </div>
      <div>
        <h3 className="bv-title-serif text-xl font-bold text-[#F4EFE6] mb-2">{title}</h3>
        <p className="bv-text-sans text-sm text-[rgba(244,239,230,0.7)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
