import React from 'react';
import { Sprout, Camera, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scan' | 'garden' | 'chat' | 'guides';
  setActiveTab: (tab: 'scan' | 'garden' | 'chat' | 'guides') => void;
  gardenCount: number;
  onQuickScanClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  gardenCount,
  onQuickScanClick,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div 
          onClick={() => setActiveTab('scan')}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 group select-none min-h-[44px]"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-100 shadow-sm transition-transform group-hover:scale-105">
            <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
          </div>
          <span className="font-serif-display text-lg sm:text-xl font-bold tracking-tight text-stone-900">
            Botanica<span className="text-emerald-700">AI</span>
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('scan')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'scan'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            Plant Scanner
          </button>

          <button
            onClick={() => setActiveTab('garden')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'garden'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            My Garden
            {gardenCount > 0 && (
              <span className="text-xs font-mono-nums text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                {gardenCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Botanist Chat
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              activeTab === 'guides'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700'
                : 'hover:text-stone-900'
            }`}
          >
            Care Guides
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onQuickScanClick}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors shadow-sm active:scale-95 whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-300" />
            <span className="hidden sm:inline">Identify Plant</span>
            <span className="sm:hidden">Scan Plant</span>
          </button>
        </div>
      </div>
    </header>
  );
};
