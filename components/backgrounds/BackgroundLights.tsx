import styles from "./BackgroundLights.module.css";

const lights = [
  [8, 17, 4, 0], [24, 64, 3, -3], [43, 30, 4, -6],
  [62, 81, 3, -2], [79, 22, 4, -5], [92, 58, 3, -7],
  [13, 88, 3, -4], [70, 48, 3, -1],
];

export default function BackgroundLights() {
  return (
    <div className={styles.field} aria-hidden="true">
      {lights.map(([left, top, size, delay], index) => (
        <span key={index} className={styles.light} style={{
          left: `${left}%`, top: `${top}%`, width: size, height: size,
          animationDelay: `${delay}s`, animationDuration: `${7 + index % 3}s`,
        }} />
      ))}
    </div>
  );
}
