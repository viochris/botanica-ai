import React from 'react';

interface PlantIllustrationProps {
  badge: string;
  className?: string;
}

export const PlantIllustration: React.FC<PlantIllustrationProps> = ({ badge, className = 'w-full h-full' }) => {
  switch (badge) {
    case 'monstera':
      return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Monstera leaf illustration">
          <defs>
            <linearGradient id="monstera-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f0fdf4" />
              <stop stopColor="#dcfce7" />
            </linearGradient>
            <linearGradient id="monstera-leaf" x1="60" y1="30" x2="160" y2="170" gradientUnits="userSpaceOnUse">
              <stop stopColor="#15803d" />
              <stop stopColor="#166534" />
            </linearGradient>
            <linearGradient id="pot-grad" x1="70" y1="140" x2="130" y2="190" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ea580c" />
              <stop stopColor="#c2410c" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="16" fill="url(#monstera-bg)" />
          {/* Stem & Petiole */}
          <path d="M100 150 C98 120 102 80 110 40" stroke="#14532d" strokeWidth="5" strokeLinecap="round" />
          <path d="M100 130 C80 110 65 90 60 70" stroke="#166534" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M104 110 C125 95 140 85 145 65" stroke="#166534" strokeWidth="3.5" strokeLinecap="round" />
          {/* Main Monstera Leaf */}
          <path
            d="M110 38 C140 45 165 75 160 110 C155 135 125 145 102 142 C85 140 70 125 72 95 C75 65 90 42 110 38 Z"
            fill="url(#monstera-leaf)"
          />
          {/* Fenestration holes */}
          <ellipse cx="125" cy="75" rx="8" ry="18" transform="rotate(30 125 75)" fill="#dcfce7" />
          <ellipse cx="140" cy="98" rx="6" ry="14" transform="rotate(45 140 98)" fill="#dcfce7" />
          <ellipse cx="98" cy="80" rx="6" ry="15" transform="rotate(-30 98 80)" fill="#dcfce7" />
          <ellipse cx="88" cy="108" rx="5" ry="12" transform="rotate(-40 88 108)" fill="#dcfce7" />
          {/* Clay Pot */}
          <polygon points="75,150 125,150 120,185 80,185" fill="url(#pot-grad)" />
          <rect x="70" y="146" width="60" height="6" rx="2" fill="#9a3412" />
        </svg>
      );

    case 'ficus':
      return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Fiddle Leaf Fig illustration">
          <defs>
            <linearGradient id="ficus-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f7fee7" />
              <stop stopColor="#ecfccb" />
            </linearGradient>
            <linearGradient id="ficus-leaf-1" x1="40" y1="30" x2="160" y2="150" gradientUnits="userSpaceOnUse">
              <stop stopColor="#15803d" />
              <stop stopColor="#14532d" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="16" fill="url(#ficus-bg)" />
          {/* Woody stem */}
          <path d="M100 160 L100 50" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
          {/* Fiddle Leaf Top */}
          <path
            d="M100 30 C125 25 140 45 130 65 C122 78 135 95 125 110 C115 122 100 125 100 125 C100 125 85 122 75 110 C65 95 78 78 70 65 C60 45 75 25 100 30 Z"
            fill="url(#ficus-leaf-1)"
          />
          {/* Pale veins */}
          <path d="M100 35 L100 120" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M100 55 Q115 50 122 45" stroke="#86efac" strokeWidth="1.5" />
          <path d="M100 55 Q85 50 78 45" stroke="#86efac" strokeWidth="1.5" />
          <path d="M100 78 Q118 72 125 70" stroke="#86efac" strokeWidth="1.5" />
          <path d="M100 78 Q82 72 75 70" stroke="#86efac" strokeWidth="1.5" />
          <path d="M100 98 Q115 92 120 95" stroke="#86efac" strokeWidth="1.5" />
          <path d="M100 98 Q85 92 80 95" stroke="#86efac" strokeWidth="1.5" />
          {/* Pot */}
          <polygon points="76,155 124,155 118,188 82,188" fill="#57534e" />
          <rect x="72" y="152" width="56" height="5" rx="2" fill="#44403c" />
        </svg>
      );

    case 'snake':
      return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Snake plant illustration">
          <defs>
            <linearGradient id="snake-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f0fdf4" />
              <stop stopColor="#d1fae5" />
            </linearGradient>
            <linearGradient id="leaf-grad-center" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#047857" />
              <stop stopColor="#064e3b" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="16" fill="url(#snake-bg)" />
          {/* Center tall sword */}
          <path d="M100 25 C108 55 110 110 106 160 L94 160 C90 110 92 55 100 25 Z" fill="#eab308" />
          <path d="M100 28 C105 55 107 110 104 160 L96 160 C93 110 95 55 100 28 Z" fill="url(#leaf-grad-center)" />
          {/* Left blade */}
          <path d="M78 50 C90 80 90 120 86 160 L76 160 C70 120 70 80 78 50 Z" fill="#eab308" />
          <path d="M78 53 C87 80 87 120 84 160 L78 160 C73 120 73 80 78 53 Z" fill="#047857" />
          {/* Right blade */}
          <path d="M122 55 C112 85 112 120 116 160 L126 160 C130 120 130 85 122 55 Z" fill="#eab308" />
          <path d="M122 58 C115 85 115 120 118 160 L124 160 C127 120 127 85 122 58 Z" fill="#047857" />
          {/* Horizontal bands */}
          <path d="M96 70 Q100 72 104 70 M96 100 Q100 102 104 100 M96 130 Q100 132 104 130" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
          {/* Modern Planter */}
          <polygon points="72,158 128,158 122,190 78,190" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
        </svg>
      );

    case 'peacelily':
      return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Peace lily illustration">
          <defs>
            <linearGradient id="lily-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f0fdfa" />
              <stop stopColor="#ccfbf1" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="16" fill="url(#lily-bg)" />
          {/* Deep green ribbed foliage */}
          <path d="M60 160 Q70 110 50 85 Q75 105 75 160 Z" fill="#065f46" />
          <path d="M140 160 Q130 110 150 85 Q125 105 125 160 Z" fill="#065f46" />
          <path d="M85 160 Q90 100 80 65 Q105 90 98 160 Z" fill="#047857" />
          <path d="M115 160 Q110 100 120 65 Q95 90 102 160 Z" fill="#047857" />
          {/* White flower stem */}
          <path d="M100 160 Q102 80 105 35" stroke="#047857" strokeWidth="3" strokeLinecap="round" />
          {/* Elegant white spathe petal */}
          <path d="M105 30 C125 35 125 65 105 78 C95 65 92 35 105 30 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
          {/* Spadix central spike */}
          <ellipse cx="106" cy="55" rx="3.5" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          {/* Planter */}
          <polygon points="76,155 124,155 120,188 80,188" fill="#1e293b" />
        </svg>
      );

    case 'lavender':
      return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="English lavender illustration">
          <defs>
            <linearGradient id="lavender-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#faf5ff" />
              <stop stopColor="#f3e8ff" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="16" fill="url(#lavender-bg)" />
          {/* Multiple stems */}
          <path d="M100 160 L100 45" stroke="#4d7c0f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M96 160 L80 65" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" />
          <path d="M104 160 L120 65" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" />
          {/* Purple flower clusters on center stem */}
          <circle cx="100" cy="42" r="5" fill="#7e22ce" />
          <circle cx="97" cy="50" r="4.5" fill="#9333ea" />
          <circle cx="103" cy="50" r="4.5" fill="#a855f7" />
          <circle cx="97" cy="58" r="4" fill="#7e22ce" />
          <circle cx="103" cy="58" r="4" fill="#9333ea" />
          <circle cx="100" cy="66" r="4" fill="#a855f7" />
          {/* Left stem flowers */}
          <circle cx="80" cy="62" r="4" fill="#7e22ce" />
          <circle cx="78" cy="70" r="3.5" fill="#9333ea" />
          <circle cx="83" cy="70" r="3.5" fill="#a855f7" />
          {/* Right stem flowers */}
          <circle cx="120" cy="62" r="4" fill="#7e22ce" />
          <circle cx="117" cy="70" r="3.5" fill="#9333ea" />
          <circle cx="123" cy="70" r="3.5" fill="#a855f7" />
          {/* Terracotta Pot */}
          <polygon points="76,155 124,155 118,188 82,188" fill="#c2410c" />
          <rect x="72" y="152" width="56" height="5" rx="2" fill="#9a3412" />
        </svg>
      );

    case 'tomato':
      return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Cherry tomato illustration">
          <defs>
            <linearGradient id="tomato-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff1f2" />
              <stop stopColor="#ffe4e6" />
            </linearGradient>
            <linearGradient id="tomato-fruit" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#ef4444" />
              <stop stopColor="#b91c1c" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" rx="16" fill="url(#tomato-bg)" />
          {/* Vine stem */}
          <path d="M100 160 Q95 100 115 50" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
          <path d="M100 100 Q80 85 70 80" stroke="#15803d" strokeWidth="2.5" />
          <path d="M108 80 Q130 75 140 70" stroke="#15803d" strokeWidth="2.5" />
          {/* Vine leaves */}
          <path d="M70 78 Q60 65 50 72 Q60 85 70 80 Z" fill="#166534" />
          <path d="M140 68 Q150 55 160 62 Q150 75 140 70 Z" fill="#166534" />
          {/* Ripe red cherry tomatoes */}
          <circle cx="90" cy="115" r="14" fill="url(#tomato-fruit)" />
          <circle cx="86" cy="110" r="3" fill="#fca5a5" opacity="0.8" />
          {/* Sepal star */}
          <path d="M90 101 L88 105 L84 103 L87 107 L83 109 L88 110 L89 114 L91 110 L95 111 L92 107 L95 104 L91 105 Z" fill="#15803d" />
          <circle cx="118" cy="125" r="12" fill="url(#tomato-fruit)" />
          <circle cx="115" cy="121" r="2.5" fill="#fca5a5" opacity="0.8" />
          {/* Container */}
          <polygon points="74,155 126,155 120,188 80,188" fill="#334155" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Plant illustration">
          <rect width="200" height="200" rx="16" fill="#f0fdf4" />
          <path d="M100 160 C95 110 105 70 100 40" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
          <ellipse cx="85" cy="70" rx="18" ry="10" transform="rotate(-30 85 70)" fill="#15803d" />
          <ellipse cx="115" cy="95" rx="18" ry="10" transform="rotate(25 115 95)" fill="#16a34a" />
          <polygon points="75,155 125,155 120,188 80,188" fill="#ea580c" />
        </svg>
      );
  }
};
