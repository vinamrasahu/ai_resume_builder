import React, { useEffect, useRef } from "react";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const mapRange = (value, [inMin, inMax], [outMin, outMax]) => {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
};

// Ease `current` toward `target`. Larger factor = snappier, smaller = floatier.
const lerp = (current, target, factor) => current + (target - current) * factor;

// const DEFAULT_CARDS = [
//   {
//     title: "Matthias Leidinger",
//     description:
//       "Originally hailing from Austria, Berlin-based photographer Matthias Leindinger is a young creative brimming with talent and ideas.",
//     image:
//       "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
//     url: "#",
//     color: "#BBACAF",
//   },
//   {
//     title: "Clément Chapillon",
//     description:
//       "A story on the border between reality and imaginary, about the contradictory feelings that the insularity of a rocky, arid, wild territory provokes.",
//     image:
//       "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
//     url: "#",
//     color: "#977F6D",
//   },
//   {
//     title: "Zissou",
//     description:
//       "Though he views photography as a medium for storytelling, Zissou's images don't insist on a narrative — crisp, ethereal, and encoded with ambiguity.",
//     image:
//       "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&q=80",
//     url: "#",
//     color: "#C2491D",
//   },
//   {
//     title: "Mathias Svold & Ulrik Hasemann",
//     description:
//       "The coastlines of Denmark are documented in tonal colors in a pensive new series investigating how humans interact with and disrupt the coast.",
//     image:
//       "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80",
//     url: "#",
//     color: "#B62429",
//   },
//   {
//     title: "Mark Rammers",
//     description:
//       "A meditative journey into the origins of regret and the uncertainty of stepping into new unknowns, captured during a residency in Lanzarote.",
//     image:
//       "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80",
//     url: "#",
//     color: "#88A28D",
//   },
// ];

const DEFAULT_CARDS = [
  {
    title: "1. Choose a Template",
    description:
      "Select from professionally designed ATS-friendly resume templates tailored for students, freshers, and experienced professionals.",

    image: "images/cardtemplete.png",

    url: "#",

    color: "#CFEAFF",
  },

  {
    title: "2. Add Your Experience",
    description:
      "Quickly fill in your work experience, education, projects, certifications, and skills using our intuitive editor.",

    image: "/images/experience.png",

    url: "#",

    color: "#E7DEFF",
  },

  {
    title: "3. Customize Layout & Design",
    description:
      "Personalize fonts, colors, spacing, and sections to create a resume that perfectly reflects your professional identity.",

    image: "/images/customize.png",

    url: "#",

    color: "#DDFBE6",
  },

  {
    title: "4. Download Unlimited PDFs",
    description:
      "Generate and download high-quality PDF resumes instantly with no watermarks and unlimited downloads.",

    image: "/images/download.png",

    url: "#",

    color: "#F97316",
  },
];

function StackCard({ index, card, outerRef, innerRef, imageWrapRef }) {
  return (
    <div ref={outerRef} className="sticky top-0 flex h-screen items-center justify-center">
      <div
        ref={innerRef}
        style={{
          backgroundColor: card.color,
          top: `calc(-5vh + ${index * 25}px)`,
          willChange: "transform",
        }}
        className="relative flex h-[500px] w-[92vw] max-w-4xl origin-top flex-col rounded-[25px] p-6 shadow-xl md:p-10"
      >
        <h2 className="m-0 text-center font-serif text-xl font-semibold tracking-tight text-black/90 md:text-3xl">
          {card.title}
        </h2>

        <div className="mt-6 flex h-full flex-col gap-6 overflow-hidden md:mt-10 md:flex-row md:gap-10">
          <div className="relative top-0 w-full shrink-0 md:top-[10%] md:w-2/5">
            <p className="text-sm leading-relaxed text-black/80 first-letter:mr-0.5 first-letter:text-2xl first-letter:font-bold md:text-base">
              {card.description}
            </p>
            <span className="mt-3 flex items-center gap-1.5">
              <a
                href={card.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-black underline underline-offset-2"
              >
                See more
              </a>
              <svg width="18" height="10" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                  fill="black"
                />
              </svg>
            </span>
          </div>

          <div className="relative w-full flex-1 overflow-hidden rounded-2xl">
            <div ref={imageWrapRef} className="h-full w-full" style={{ willChange: "transform" }}>
              <img src={card.image} alt={card.title} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParallaxStackCards({
  cards = DEFAULT_CARDS,
  ease = 0.1, // how fast card/image scale catches up to scroll (lower = smoother/floatier)
  smoothScroll = true, // virtualize wheel scrolling for a Lenis-like glide
  scrollEase = 0.07, // how fast the virtual scroll catches up (lower = floatier)
  idle = true, // subtle "alive" motion even when not scrolling
  idleIntensity = 0.012, // scale amplitude — keep this small, it's meant to be barely-there
}) {
  const mainRef = useRef(null);

  // One ref bundle per card: outer sticky wrapper, the colored card, the image wrapper.
  const refsRef = useRef(cards.map(() => ({ outer: null, inner: null, imageWrap: null })));
  // Smoothed ("current") values we lerp toward the real scroll-derived targets.
  const valuesRef = useRef(cards.map(() => ({ scale: 1, imageScale: 2 })));

  // --- Lightweight smooth-scroll (wheel-only, no library) ---
  useEffect(() => {
    if (!smoothScroll || typeof window === "undefined") return;
    // Skip on touch devices — native momentum scrolling is already smooth there,
    // and fighting it with scrollTo() causes jittery rubber-banding.
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let programmatic = false;
    let rafId;

    const getMax = () => document.documentElement.scrollHeight - window.innerHeight;

    const onWheel = (e) => {
  // Sirf tab handle karo jab mouse stack section ke upar ho
  if (!mainRef.current) return;

  const rect = mainRef.current.getBoundingClientRect();

  const isInside =
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom;

  if (!isInside) return;

  e.preventDefault();
  target = clamp(target + e.deltaY, 0, getMax());
};

    // Keep in sync with scrollbar drag / keyboard / touch — anything not from us.
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

    document.addEventListener("wheel", onWheel, {
  passive: false,
});
    window.addEventListener("scroll", onScroll, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [smoothScroll, scrollEase]);

  // --- Card / image scale animation, synced to whatever the current scroll is ---
  useEffect(() => {
    let rafId;
    const startTime = performance.now();

    const tick = () => {
      const windowHeight = window.innerHeight;
      const elapsed = (performance.now() - startTime) / 1000; // seconds

      // Overall progress across the whole stack, 0 -> 1.
      let overallProgress = 0;
      if (mainRef.current) {
        const mainRect = mainRef.current.getBoundingClientRect();
        const scrollable = mainRect.height - windowHeight;
        overallProgress = scrollable > 0 ? clamp(-mainRect.top / scrollable, 0, 1) : 0;
      }

      const total = cards.length;

      refsRef.current.forEach((refs, i) => {
        const { outer, inner, imageWrap } = refs;
        if (!outer || !inner || !imageWrap) return;

        const targetScale = 1 - (total - i) * 0.05;
        const range = [i * 0.25, 1];
        const scaleTarget = mapRange(overallProgress, range, [1, targetScale]);

        const rect = outer.getBoundingClientRect();
        const localProgress = clamp((windowHeight - rect.top) / windowHeight, 0, 1);
        const imageScaleTarget = mapRange(localProgress, [0, 1], [2, 1]);

        const values = valuesRef.current[i];
        values.scale = lerp(values.scale, scaleTarget, ease);
        values.imageScale = lerp(values.imageScale, imageScaleTarget, ease);

        // Subtle idle "breathing" — a slow sine wave, phase-offset per card so
        // they don't all pulse in unison. Only visible when a card is roughly
        // in view (localProgress > 0), and the amplitude is intentionally tiny.
        let idleScale = 0;
        let idleY = 0;
        if (idle && localProgress > 0.05) {
          const wave = Math.sin(elapsed * 0.6 + i * 1.3);
          idleScale = wave * idleIntensity * localProgress;
          idleY = wave * 3 * localProgress; // px
        }

        inner.style.transform = `translateY(${idleY}px) scale(${values.scale + idleScale})`;
        imageWrap.style.transform = `scale(${values.imageScale})`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [cards, ease, idle, idleIntensity]);

  return (
    <main ref={mainRef} className="relative">
      {cards.map((card, i) => (
        <StackCard
          key={card.title + i}
          index={i}
          card={card}
          outerRef={(el) => (refsRef.current[i].outer = el)}
          innerRef={(el) => (refsRef.current[i].inner = el)}
          imageWrapRef={(el) => (refsRef.current[i].imageWrap = el)}
        />
      ))}
    </main>
  );
}
