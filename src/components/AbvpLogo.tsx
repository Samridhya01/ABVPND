import React, { useId } from 'react';

interface AbvpLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
  subtext?: string;
}

export const AbvpLogo: React.FC<AbvpLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  subtext,
}) => {
  const uid = useId().replace(/:/g, '_');

  const sizeMap = {
    xs: { box: 'w-7 h-7', text: 'text-xs' },
    sm: { box: 'w-9 h-9', text: 'text-xs' },
    md: { box: 'w-11 h-11 sm:w-12 sm:h-12', text: 'text-sm' },
    lg: { box: 'w-16 h-16', text: 'text-base' },
    xl: { box: 'w-24 h-24', text: 'text-lg' },
    '2xl': { box: 'w-36 h-36 sm:w-44 sm:h-44', text: 'text-xl' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official ABVP West Bengal Emblem (Vector SVG matching user upload) */}
      <div
        className={`${current.box} rounded-full shrink-0 relative transition-transform duration-200 hover:scale-105 select-none drop-shadow-md`}
        title="Akhil Bharatiya Vidyarthi Parishad (ABVP) – Official West Bengal Emblem"
      >
        <svg
          viewBox="0 0 300 300"
          className="w-full h-full rounded-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Top Text Arc Path: Left to Right across upper half */}
            <path
              id={`${uid}-arc-top`}
              d="M 32,150 A 118,118 0 0,1 268,150"
              fill="none"
            />
            {/* Bottom Text Arc Path: Right to Left across lower half (so text stands upright) */}
            <path
              id={`${uid}-arc-bottom`}
              d="M 268,150 A 118,118 0 0,1 32,150"
              fill="none"
            />
            {/* Diagonal White Stripes Pattern for India Map */}
            <pattern
              id={`${uid}-hatch`}
              width="8"
              height="8"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="#ffffff" strokeWidth="2.8" />
            </pattern>
            {/* Circular Clip for Central Saffron Disc */}
            <clipPath id={`${uid}-centerClip`}>
              <circle cx="150" cy="150" r="95" />
            </clipPath>
          </defs>

          {/* 1. Outermost Orange Border Rim */}
          <circle
            cx="150"
            cy="150"
            r="148"
            fill="#ff5500"
            stroke="#002bb8"
            strokeWidth="2.5"
          />

          {/* 2. Concentric White Spacer Ring */}
          <circle cx="150" cy="150" r="144" fill="#ffffff" />

          {/* 3. Official Deep Royal Blue Circular Band */}
          <circle cx="150" cy="150" r="140" fill="#053bd7" />

          {/* 4. Inner Concentric White Separator */}
          <circle cx="150" cy="150" r="97" fill="#ffffff" />

          {/* 5. Central Saffron Disc */}
          <circle cx="150" cy="150" r="95" fill="#ff5500" />

          {/* 6. Central Graphic (India Map with diagonal stripes & Flaming Torch) */}
          <g clipPath={`url(#${uid}-centerClip)`}>
            {/* Akhand Bharat / India Outline Map filled with White Diagonal Hatch Lines */}
            <path
              d="M138 74 C144 68 152 68 157 74 C163 80 174 85 184 89 C196 94 212 99 217 108 C222 118 221 127 209 132 C196 137 195 145 195 153 C194 167 178 193 162 211 C154 220 149 229 147 232 C145 229 141 214 137 203 C130 188 118 182 110 173 C102 164 92 156 90 146 C88 135 99 127 103 119 C107 111 115 105 121 97 C127 89 131 81 138 74 Z"
              fill={`url(#${uid}-hatch)`}
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Raised Forearm & Clenched Fist */}
            <path
              d="M144 225 L146 178 C143 175 140 171 140 165 C140 159 145 154 150 154 C156 154 161 159 161 165 C161 170 158 175 155 178 L157 225 Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2.4"
            />
            {/* Finger Knuckles / Clenched Grip Lines */}
            <line x1="144" y1="162" x2="153" y2="162" stroke="#000000" strokeWidth="1.6" />
            <line x1="144" y1="167" x2="154" y2="167" stroke="#000000" strokeWidth="1.6" />
            <line x1="145" y1="172" x2="155" y2="172" stroke="#000000" strokeWidth="1.6" />

            {/* Torch Handle & Fluted Cup / Bowl */}
            <path
              d="M146 154 L146 138 L155 138 L155 154 Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2.2"
            />
            <path
              d="M139 138 L162 138 L166 125 L135 125 Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <line x1="138" y1="131" x2="163" y2="131" stroke="#000000" strokeWidth="1.6" />

            {/* Flaming Torch (Mashal) Fire & Billowing Smoke */}
            <path
              d="M136 124 C134 113 138 103 147 98 C153 94 163 92 172 85 C178 79 186 73 191 79 C196 85 192 95 187 100 C197 100 203 107 201 115 C198 123 187 125 183 125 C177 125 172 119 167 121 C162 123 160 125 150 125 Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {/* Interior flame swirl lines */}
            <path
              d="M147 117 C152 111 161 107 169 103 C175 99 181 94 185 88"
              fill="none"
              stroke="#000000"
              strokeWidth="1.6"
            />
            <path
              d="M155 121 C160 115 168 113 175 113"
              fill="none"
              stroke="#000000"
              strokeWidth="1.6"
            />
            <path
              d="M141 121 C144 114 148 111 154 110"
              fill="none"
              stroke="#000000"
              strokeWidth="1.4"
            />
          </g>

          {/* 7. Bengali Text: Top Arc (অখিল ভারতীয় বিদ্যार्थी পরিষদ) */}
          <text
            fill="#ffffff"
            fontFamily="'Noto Sans Bengali', system-ui, sans-serif"
            fontWeight="900"
            fontSize="20.5"
            letterSpacing="1.2"
          >
            <textPath
              href={`#${uid}-arc-top`}
              startOffset="50%"
              textAnchor="middle"
            >
              অখিল ভারতীয় বিদ্যार्थी পরিষদ
            </textPath>
          </text>

          {/* 8. Bengali Text: Bottom Arc (জ্ঞান • চরিত্র • একতা) */}
          <text
            fill="#ffffff"
            fontFamily="'Noto Sans Bengali', system-ui, sans-serif"
            fontWeight="900"
            fontSize="19"
            letterSpacing="2.2"
          >
            <textPath
              href={`#${uid}-arc-bottom`}
              startOffset="50%"
              textAnchor="middle"
            >
              জ্ঞান • চরিত্র • একতা
            </textPath>
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-slate-950 font-display text-base sm:text-lg leading-tight">
              ABVP
            </span>
            <span className="px-1.5 py-0.2 text-[10px] font-extrabold uppercase bg-orange-100 text-orange-800 rounded border border-orange-200">
              NDC Unit
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium leading-none mt-0.5 truncate max-w-[190px] sm:max-w-none">
            {subtext || 'Narasimha Datta College • Howrah'}
          </span>
        </div>
      )}
    </div>
  );
};
