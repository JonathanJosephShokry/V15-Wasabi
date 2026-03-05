import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  version: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, version }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#2C2C2C] font-sans">
      <main>{children}</main>
      <footer className="bg-[#6B5435] text-white py-12 px-5">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
          <div className="text-3xl font-bold text-[#9FD356] tracking-widest">WASABI</div>
          <p className="text-sm text-white/45">&copy; 2026 Wasabi. Wasabi Private Website | Version: {version}</p>
          <a
            href="https://www.instagram.com/wasabi_egypt/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-transparent text-white no-underline font-semibold text-sm rounded-full border border-white/35 transition-all hover:bg-gradient-to-br hover:from-[#e1306c] hover:to-[#f77737] hover:border-transparent hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(225,48,108,0.4)] active:translate-y-0"
          >
            <Instagram size={18} />
            Follow on Instagram
          </a>
        </div>
      </footer>
    </div>
  );
};
