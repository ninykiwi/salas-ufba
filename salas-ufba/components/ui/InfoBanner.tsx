import React from 'react';

interface InfoBannerProps {
  title: string;
  description: string;
  buttonText: string;
}

export function InfoBanner({ title, description, buttonText }: InfoBannerProps) {
  return (
    <div className="mt-12 p-6 bg-primary rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-white">info</span>
        </div>
        <div>
          <p className="text-white font-headline-sm text-headline-sm font-bold">{title}</p>
          <p className="text-white/80 font-body-sm text-body-sm">{description}</p>
        </div>
      </div>
      <button className="bg-white text-primary px-6 py-2 rounded-lg font-label-bold text-label-bold hover:bg-primary-fixed transition-colors">
        {buttonText}
      </button>
    </div>
  );
}