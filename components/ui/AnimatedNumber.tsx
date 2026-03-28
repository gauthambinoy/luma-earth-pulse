"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function AnimatedNumber({
  value,
  format = (n) => n.toLocaleString(),
  duration = 1200,
  className,
  style,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const current = from + (to - from) * eased;
      setDisplay(Math.floor(current));
      if (p < 1) requestAnimationFrame(tick);
      else prevRef.current = to;
    };

    requestAnimationFrame(tick);
  }, [value, duration]);

  return (
    <span className={className} style={style}>
      {format(display)}
    </span>
  );
}
