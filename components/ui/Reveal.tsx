"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger child animations rather than animating the wrapper. */
  stagger?: boolean;
  /** Re-trigger animation every time the element enters the viewport. */
  repeat?: boolean;
  /** IntersectionObserver threshold (0-1). */
  threshold?: number;
};

/**
 * Apple-style scroll reveal. Adds the `is-visible` class once the
 * element intersects the viewport. Pairs with the `.reveal` and
 * `.reveal-stagger` utilities defined in `globals.css`.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  repeat = false,
  threshold = 0.15
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [repeat, threshold]);

  return (
    <div
      ref={ref}
      className={cn(stagger ? "reveal-stagger" : "reveal", visible && "is-visible", className)}
    >
      {children}
    </div>
  );
}
