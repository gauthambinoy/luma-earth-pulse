"use client";

import { useEffect, useRef, useCallback, RefObject } from "react";

/** Parallax tilt effect — cards subtly tilt following cursor */
export function useParallaxTilt(ref: RefObject<HTMLElement | null>, intensity = 8) {
  const handleMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.02)`;
  }, [ref, intensity]);

  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, handleMove, handleLeave]);
}

/** Magnetic snap — element subtly moves toward cursor when nearby */
export function useMagneticSnap(ref: RefObject<HTMLElement | null>, strength = 0.3, range = 100) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < range) {
        const pull = (1 - dist / range) * strength;
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      } else {
        el.style.transform = "translate(0px, 0px)";
      }
    };

    const handleLeave = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.style.transition = "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
    window.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, strength, range]);
}

/** Global parallax layers — shifts background elements on mouse move */
export function useGlobalParallax() {
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      document.documentElement.style.setProperty("--parallax-x", `${x}`);
      document.documentElement.style.setProperty("--parallax-y", `${y}`);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
}

/** Smooth scroll with momentum physics + overscroll bounce */
export function useSmoothScroll(ref: RefObject<HTMLElement | null>) {
  const velocity = useRef(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let lastY = 0;
    let raf: number;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      velocity.current += e.deltaY * 0.3;

      if (!isScrolling.current) {
        isScrolling.current = true;
        const animate = () => {
          velocity.current *= 0.92; // friction
          el.scrollTop += velocity.current;

          // Overscroll bounce
          if (el.scrollTop <= 0) {
            el.style.transform = `translateY(${Math.min(-velocity.current * 0.5, 20)}px)`;
            setTimeout(() => { el.style.transform = "translateY(0)"; }, 200);
          } else if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
            el.style.transform = `translateY(${Math.max(-velocity.current * 0.5, -20)}px)`;
            setTimeout(() => { el.style.transform = "translateY(0)"; }, 200);
          }

          if (Math.abs(velocity.current) > 0.5) {
            raf = requestAnimationFrame(animate);
          } else {
            velocity.current = 0;
            isScrolling.current = false;
          }
        };
        raf = requestAnimationFrame(animate);
      }
    };

    el.style.transition = "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
}
