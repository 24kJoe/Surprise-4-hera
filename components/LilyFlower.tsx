"use client";

import { memo, useId } from "react";
import styles from "./LilyFlower.module.css";

function LilyFlower() {
  const id = useId();

  return (
    <svg viewBox="0 0 260 340" fill="none" aria-hidden="true" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id={`${id}-petal`} x1="130" y1="65" x2="145" y2="192" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffefa" />
          <stop offset="0.55" stopColor="#ffe5ed" />
          <stop offset="1" stopColor="#d97198" />
        </linearGradient>
        <linearGradient id={`${id}-leaf`} x1="80" y1="210" x2="151" y2="320" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a4b79a" />
          <stop offset="1" stopColor="#54745b" />
        </linearGradient>
      </defs>
      <g className={styles.stem}>
        <path d="M130 171 C119 218 146 263 122 329" stroke="#6e8c70" strokeWidth="4" strokeLinecap="round" />
        <path d="M132 276 C83 273 65 243 64 215 C102 222 130 243 132 276Z" fill={`url(#${id}-leaf)`} />
        <path d="M134 251 C173 245 192 213 190 189 C157 205 138 226 134 251Z" fill={`url(#${id}-leaf)`} />
        <path d="M75 230 Q108 248 130 274 M180 207 Q150 229 135 249" stroke="#d1ddbd" strokeOpacity="0.5" />
      </g>
      {[-120, -60, 0, 60, 120, 180].map((angle, index) => (
        <g key={angle} transform={`rotate(${angle} 130 151)`}>
          <g
            className={styles.petal}
            style={{ animationDelay: `${index * 0.075}s` }}
          >
            <path d="M130 155 C93 130 91 83 130 27 C169 83 167 130 130 155Z" fill={`url(#${id}-petal)`} stroke="#eab7c9" strokeWidth="0.7" />
            <path d="M130 145 Q121 91 130 44" stroke="#d993ad" strokeWidth="0.9" strokeOpacity="0.45" />
            {[0, 1, 2].map((dot) => <circle key={dot} cx={123 + dot * 6} cy={127 - dot * 9} r="1.2" fill="#bc6686" opacity="0.5" />)}
          </g>
        </g>
      ))}
      <circle cx="130" cy="151" r="10" fill="#e9ce8e" />
      {[-24, -12, 0, 12, 24].map((offset) => (
        <g key={offset}>
          <path d={`M130 153 Q${130 + offset} 132 ${130 + offset} ${113 + Math.abs(offset) / 3}`} stroke="#a6a36d" strokeWidth="1.6" />
          <ellipse cx={130 + offset} cy={112 + Math.abs(offset) / 3} rx="3" ry="5" fill="#b88a48" transform={`rotate(${offset} ${130 + offset} 115)`} />
        </g>
      ))}
    </svg>
  );
}

export default memo(LilyFlower);
