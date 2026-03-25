import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  version: string;
  wasabiRulesLink?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, version, wasabiRulesLink }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] font-sans">
      <main>{children}</main>
      <footer className="bg-[#6B5435] text-white py-12 px-5">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="text-3xl font-bold text-[#9FD356] tracking-widest">WASABI</div>
          <p className="text-sm text-white/45">&copy; 2026 Wasabi. Wasabi Private Website | Version: {version}</p>
          <a
            href={wasabiRulesLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent text-white no-underline font-semibold text-sm rounded-full border border-white/35 transition-all hover:bg-[#9FD356] hover:text-[#6B5435] hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(159,211,86,0.4)] active:translate-y-0"
          >
            Wasabi Rules
          </a>
        </div>
      </footer>
    </div>
  );
};
