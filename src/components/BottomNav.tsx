import React from 'react';
import { Camera, Sprout, MessageSquare, BookOpen } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'scan' | 'garden' | 'chat' | 'guides';
  setActiveTab: (tab: 'scan' | 'garden' | 'chat' | 'guides') => void;
  gardenCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  gardenCount,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {/* Tab 1: Scanner */}
        <button
          type="button"
          onClick={() => setActiveTab('scan')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
            activeTab === 'scan' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'scan' ? 'bg-emerald-100/80 text-emerald-900 font-bold' : ''
            }`}
          >
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium tracking-tight">Scanner</span>
        </button>

        {/* Tab 2: My Garden */}
        <button
          type="button"
          onClick={() => setActiveTab('garden')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-90 relative ${
            activeTab === 'garden' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center transition-colors relative ${
              activeTab === 'garden' ? 'bg-emerald-100/80 text-emerald-900 font-bold' : ''
            }`}
          >
            <Sprout className="w-5 h-5" />
            {gardenCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono-nums">
                {gardenCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium tracking-tight">My Garden</span>
        </button>

        {/* Tab 3: Botanist Chat */}
        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
            activeTab === 'chat' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'chat' ? 'bg-emerald-100/80 text-emerald-900 font-bold' : ''
            }`}
          >
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium tracking-tight">Dr. Flora</span>
        </button>

        {/* Tab 4: Care Guides */}
        <button
          type="button"
          onClick={() => setActiveTab('guides')}
          className={`min-h-[48px] flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
            activeTab === 'guides' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div
            className={`w-9 h-7 rounded-xl flex items-center justify-center transition-colors ${
              activeTab === 'guides' ? 'bg-emerald-100/80 text-emerald-900 font-bold' : ''
            }`}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium tracking-tight">Care Guides</span>
        </button>
      </div>
    </nav>
  );
};
