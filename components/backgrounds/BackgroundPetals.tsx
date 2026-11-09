import type { CSSProperties } from "react";
import styles from "./BackgroundPetals.module.css";

const petals = [
  { left: 8, size: 12, duration: 19, delay: -4, drift: 55 },
  { left: 26, size: 9, duration: 24, delay: -14, drift: -40 },
  { left: 48, size: 14, duration: 22, delay: -8, drift: 70 },
  { left: 67, size: 10, duration: 26, delay: -21, drift: -55 },
  { left: 86, size: 12, duration: 21, delay: -12, drift: 35 },
  { left: 16, size: 10, duration: 23, delay: -18, drift: -30 },
  { left: 35, size: 12, duration: 20, delay: -6, drift: 45 },
  { left: 57, size: 9, duration: 25, delay: -16, drift: -40 },
  { left: 76, size: 13, duration: 22, delay: -3, drift: 30 },
  { left: 94, size: 10, duration: 24, delay: -20, drift: -60 },
  { left: 3, size: 11, duration: 21, delay: -10, drift: 40 },
  { left: 42, size: 10, duration: 26, delay: -23, drift: -35 },
  { left: 22, size: 11, duration: 22, delay: -11, drift: 35 },
  { left: 63, size: 10, duration: 25, delay: -7, drift: -30 },
  { left: 82, size: 12, duration: 23, delay: -19, drift: 40 },
  { left: 11, size: 10, duration: 24, delay: -9, drift: 30 },
  { left: 31, size: 12, duration: 21, delay: -17, drift: -35 },
  { left: 52, size: 11, duration: 26, delay: -5, drift: 45 },
  { left: 72, size: 10, duration: 23, delay: -13, drift: -40 },
  { left: 90, size: 12, duration: 25, delay: -22, drift: -30 },
];

export default function BackgroundPetals() {
  return (
    <div className={styles.field} aria-hidden="true">
      {petals.map((petal, index) => (
        <span key={index} className={styles.fall} style={{
          left: `${petal.left}%`,
          width: petal.size + 4,
          height: petal.size + 4,
          animationDuration: `${petal.duration}s`,
          animationDelay: `${petal.delay}s`,
          "--drift": `${petal.drift}px`,
        } as CSSProperties}>
          <svg className={styles.petal} style={{ animationDelay: `${petal.delay}s` }} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21 3.1 12.3C-2.2 7.1 5.5-.8 12 6c6.5-6.8 14.2 1.1 8.9 6.3Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
