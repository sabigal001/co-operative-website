import React, { useEffect, useState, useRef } from 'react';

interface StatCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  end,
  prefix = '',
  suffix = '',
  duration = 1800,
  decimals = 0,
  className = ''
}) => {
  const [value, setValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          let startTime: number | null = null;

          const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth cubic ease-out curve
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const currentCount = easeOut * end;

            setValue(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setValue(end);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  const formatted = decimals > 0 
    ? value.toFixed(decimals) 
    : Math.floor(value).toLocaleString();

  return (
    <span ref={elementRef} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
