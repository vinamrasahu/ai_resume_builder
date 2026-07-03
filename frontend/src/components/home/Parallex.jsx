import React, { useEffect, useRef } from "react";

/**
 * TextParallaxMarquee
 * --------------------
 * Ported from a Next.js + framer-motion + Lenis project into plain React +
 * Tailwind (no extra deps). Renders horizontal rows of big repeated text
 * (with a small circular image inline) that drift left/right as you scroll,
 * alternating direction row by row — a classic "marquee parallax" effect.
 *
 * Smoothness:
 * - One shared requestAnimationFrame loop drives every row — no React state
 *   updates during scroll, transforms are written straight to the DOM.
 * - Scroll-driven movement is lerped (eased) toward its target each frame.
 * - A gentle sine-wave "idle drift" is layered on top, so the rows keep
 *   gliding a little even when you're not scrolling — subtle, not a full
 *   auto-scrolling marquee.
 * - Optional built-in wheel smoothing (same approach as ParallaxStackCards).
 *   If you're already using that component's smoothScroll on the same page,
 *   leave smoothScroll={false} here to avoid two competing scroll loops.
 *
 * Usage:
 *   <TextParallaxMarquee />                 // sample rows below
 *   <TextParallaxMarquee rows={myRows} />   // your own rows
 *
 * Each row object: { text, image, direction: 'left' | 'right', left: '-40%' }
 * `left` is the row's starting horizontal offset (like the original), so
 * repeated phrases fill the screen edge-to-edge before scroll shifts them.
 */

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const mapRange = (value, [inMin, inMax], [outMin, outMax]) => {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

const lerp = (current, target, factor) => current + (target - current) * factor;

const DEFAULT_ROWS = [
  {
    text: "Fresher Friendly",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    direction: "left",
    left: "-40%",
  },
  {
    text: "Fresher Friendly",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    direction: "right",
    left: "-25%",
  },
  {
    text: "Fresher Friendly",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
    direction: "left",
    left: "-75%",
  },
];

function Phrase({ text, image }) {
  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-[5.5vw] font-medium leading-none">{text}</p>
      <span className="relative aspect-[4/2] h-[7.5vw] shrink-0 overflow-hidden rounded-full">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </span>
    </div>
  );
}

function Row({ row, rowRef }) {
  return (
    <div
      ref={rowRef}
      style={{ position: "relative", left: row.left, willChange: "transform" }}
      className="flex whitespace-nowrap"
    >
      <Phrase text={row.text} image={row.image} />
      <Phrase text={row.text} image={row.image} />
      <Phrase text={row.text} image={row.image} />
    </div>
  );
}

export default function TextParallaxMarquee({
  rows = DEFAULT_ROWS,
  ease = 0.1, // how fast each row catches up to its scroll-driven target
  smoothScroll = false, // built-in wheel smoothing — see note above about using both components together
  scrollEase = 0.07,
  idle = true, // gentle sine-wave drift on top of the scroll motion
  idleIntensity = 14, // px amplitude of the idle drift — keep modest
}) {
  const containerRef = useRef(null);
  const rowRefs = useRef(rows.map(() => null));
  const currentX = useRef(rows.map(() => 0));

  // --- Optional lightweight smooth-scroll (wheel-only, no library) ---
  useEffect(() => {
    if (!smoothScroll || typeof window === "undefined") return;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let programmatic = false;
    let rafId;

    const getMax = () => document.documentElement.scrollHeight - window.innerHeight;

    const onWheel = (e) => {
      e.preventDefault();
      target = clamp(target + e.deltaY, 0, getMax());
    };
    const onScroll = () => {
      if (programmatic) {
        programmatic = false;
        return;
      }
      target = window.scrollY;
      current = window.scrollY;
    };
    const tick = () => {
      if (Math.abs(target - current) > 0.05) {
        current = lerp(current, target, scrollEase);
        programmatic = true;
        window.scrollTo(0, current);
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [smoothScroll, scrollEase]);

  // --- Row translateX animation, driven by container scroll progress ---
  useEffect(() => {
    let rafId;
    const startTime = performance.now();

    const tick = () => {
      const windowHeight = window.innerHeight;
      const elapsed = (performance.now() - startTime) / 1000;

      let progress = 0;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Matches offset ['start end', 'end start']:
        // 0 when container top hits viewport bottom, 1 when container
        // bottom hits viewport top.
        const span = windowHeight + rect.height;
        progress = span > 0 ? clamp((windowHeight - rect.top) / span, 0, 1) : 0;
      }

      rows.forEach((row, i) => {
        const el = rowRefs.current[i];
        if (!el) return;

        const dir = row.direction === "left" ? -1 : 1;
        const target = mapRange(progress, [0, 1], [150 * dir, -150 * dir]);

        let idleOffset = 0;
        if (idle) {
          idleOffset = Math.sin(elapsed * 0.4 + i * 1.7) * idleIntensity;
        }

        currentX.current[i] = lerp(currentX.current[i], target + idleOffset, ease);
        el.style.transform = `translateX(${currentX.current[i]}px)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [rows, ease, idle, idleIntensity]);

  return (
    <main className="overflow-hidden">
      <div className="h-screen" />
      <div ref={containerRef} className="flex flex-col gap-4">
        {rows.map((row, i) => (
          <Row key={i} row={row} rowRef={(el) => (rowRefs.current[i] = el)} />
        ))}
      </div>
      <div className="h-screen" />
    </main>
  );
}
