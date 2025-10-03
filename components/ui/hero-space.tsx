"use client";


import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STYLE_ID = "space-hero-animations";

const getRootTheme = () => {
  if (typeof document === "undefined") {
    if (typeof window !== "undefined" && window.matchMedia) {
      // Check localStorage first for saved theme
      if (typeof window.localStorage !== "undefined") {
        const savedTheme = window.localStorage.getItem("hero-theme");
        if (savedTheme) return savedTheme;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark"; // Default to dark
  }

  // Check localStorage first for saved theme
  if (typeof window !== "undefined" && window.localStorage) {
    const savedTheme = window.localStorage.getItem("hero-theme");
    if (savedTheme) return savedTheme;
  }

  const root = document.documentElement;
  if (root.classList.contains("dark")) return "dark";
  if (root.getAttribute("data-theme") === "dark" || root.dataset?.theme === "dark") return "dark";
  if (root.classList.contains("light")) return "light";

  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  return "dark"; // Default to dark
};

export const useThemeSync = () => {
  const [theme, setTheme] = useState<string>(() => getRootTheme());

  useEffect(() => {
    if (typeof document === "undefined") return;

    const sync = () => {
      const next = getRootTheme();
      setTheme((prev) => (prev === next ? prev : next));
    };

    // Initial sync after component mounts to ensure we get the most up-to-date theme
    const timer = setTimeout(sync, 0);

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    const media =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
        : null;

    const onMedia = () => sync();
    media?.addEventListener("change", onMedia);

    const onStorage = (event: StorageEvent) => {
      if (event.key === "hero-theme" || event.key === "bento-theme") sync();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      media?.removeEventListener("change", onMedia);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", onStorage);
      }
    };
  }, []);

  return [theme, setTheme] as const;
};

const SpaceGlyph = ({ theme = "dark" }) => {
  const stroke = theme === "dark" ? "#f5f5f5" : "#111111";
  const fill = theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(17,17,17,0.08)";

  return (
    <svg viewBox="0 0 120 120" className="h-16 w-16" aria-hidden>
      <circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke={stroke}
        strokeWidth="1.4"
        className="motion-safe:animate-[hero3-orbit_8.5s_linear_infinite] motion-reduce:animate-none"
        style={{ strokeDasharray: "18 14" }}
      />
      <rect
        x="34"
        y="34"
        width="52"
        height="52"
        rx="14"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.2"
        className="motion-safe:animate-[hero3-grid_5.4s_ease-in-out_infinite] motion-reduce:animate-none"
      />
      <circle cx="60" cy="60" r="7" fill={stroke} />
      <path
        d="M60 30v10M60 80v10M30 60h10M80 60h10"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        className="motion-safe:animate-[hero3-pulse_6s_ease-in-out_infinite] motion-reduce:animate-none"
      />
    </svg>
  );
};

function HeroSpaceLanding() {
  const [theme, setTheme] = useThemeSync();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<'stargazing' | 'exploration'>("stargazing");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Get initial theme preference for SSR consistency
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const savedTheme = localStorage.getItem('hero-theme');
      const initialTheme = savedTheme || preferredTheme;
      // Ensure theme is set properly on client side
      if (document.documentElement.classList.contains('dark') !== (initialTheme === 'dark')) {
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        document.documentElement.setAttribute('data-theme', initialTheme);
      }
    }
  }, []);

  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.innerHTML = `
      @keyframes hero3-intro {
        0% { opacity: 0; transform: translate3d(0, 64px, 0) scale(0.98); filter: blur(12px); }
        60% { filter: blur(0); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); filter: blur(0); }
      }
      @keyframes hero3-card {
        0% { opacity: 0; transform: translate3d(0, 32px, 0) scale(0.95); }
        100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
      }
      @keyframes hero3-orbit {
        0% { stroke-dashoffset: 0; transform: rotate(0deg); }
        100% { stroke-dashoffset: -64; transform: rotate(360deg); }
      }
      @keyframes hero3-grid {
        0%, 100% { transform: rotate(-2deg); opacity: 0.7; }
        50% { transform: rotate(2deg); opacity: 1; }
      }
      @keyframes hero3-pulse {
        0%, 100% { stroke-dasharray: 0 200; opacity: 0.2; }
        45%, 60% { stroke-dasharray: 200 0; opacity: 1; }
      }
      @keyframes hero3-glow {
        0%, 100% { opacity: 0.45; transform: translate3d(0,0,0); }
        50% { opacity: 0.9; transform: translate3d(0,-8px,0); }
      }
      @keyframes hero3-drift {
        0%, 100% { transform: translate3d(0,0,0) rotate(-3deg); }
        50% { transform: translate3d(0,-12px,0) rotate(3deg); }
      }
      @keyframes star-pulse {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current || typeof window === "undefined") {
      setVisible(true);
      return;
    }

    const node = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const current = getRootTheme();
    const next = current === "dark" ? "light" : "dark";
    root.classList.toggle("dark", next === "dark");
    root.classList.toggle("light", next === "light");
    root.setAttribute("data-theme", next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage?.setItem("hero-theme", next);
      } catch (_err) {
        /* ignore */
      }
    }
    setTheme(next);
  };

  const palette = useMemo(
    () =>
      theme === "dark"
        ? {
            surface: "bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white",
            subtle: "text-white/60",
            border: "border-white/12",
            card: "bg-white/6",
            accent: "bg-white/12",
            glow: "rgba(255,255,255,0.14)",
            background: {
              color: "#040404",
              layers: [
                "radial-gradient(ellipse 80% 60% at 10% -10%, rgba(200,200,200,0.10), transparent 60%)",
                "radial-gradient(ellipse 90% 70% at 90% -20%, rgba(180,180,180,0.08), transparent 70%)",
                "linear-gradient(to bottom, rgba(200,200,200,0.05), transparent 30%)",
              ],
              dots:
                "radial-gradient(circle at 25% 25%, rgba(250,250,250,0.08) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(250,250,250,0.08) 0.7px, transparent 1px)",
            },
          }
        : {
            surface: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-neutral-950",
            subtle: "text-neutral-600",
            border: "border-neutral-200/80",
            card: "bg-neutral-100/80",
            accent: "bg-neutral-100",
            glow: "rgba(17,17,17,0.08)",
            background: {
              color: "#f5f5f4",
              layers: [
                "radial-gradient(ellipse 80% 60% at 10% -10%, rgba(100,100,100,0.12), transparent 60%)",
                "radial-gradient(ellipse 90% 70% at 90% -20%, rgba(80,80,80,0.08), transparent 70%)",
                "linear-gradient(to bottom, rgba(100,100,100,0.05), transparent 30%)",
              ],
              dots:
                "radial-gradient(circle at 25% 25%, rgba(17,17,17,0.12) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(17,17,17,0.08) 0.7px, transparent 1px)",
            },
          },
    [theme]
  );

  const metrics = [
    { label: "Galaxies mapped", value: "42" },
    { label: "Nebulas explored", value: "128" },
    { label: "Stars catalogued", value: "1.2K" },
  ];

  type ModeType = 'stargazing' | 'exploration';

  const modes = useMemo(
    () => ({
      stargazing: {
        title: "Stargazing mode",
        description:
          "Explore the cosmos with detailed astronomical data, real-time celestial events, and personalized star maps tailored to your location and interests.",
        items: [
          "Real-time star positions",
          "Constellation overlays",
          "Astronomical event notifications",
        ],
      },
      exploration: {
        title: "Deep space exploration",
        description:
          "Dive deep into space imagery from Hubble, Webb, and other space telescopes. Discover new worlds and cosmic phenomena at the edge of the universe.",
        items: [
          "High-resolution space imagery",
          "Planet and moon exploration",
          "Cosmic phenomenon insights",
        ],
      },
    }),
    []
  );

  const activeMode = modes[mode as ModeType];

  const spacePhenomena = [
    {
      name: "Orion Nebula",
      detail: "Stellar nursery 1,344 light-years away, birthplace of new stars.",
      status: "Visible",
    },
    {
      name: "Andromeda Galaxy",
      detail: "Closest major galaxy to the Milky Way, approaching at 110 km/s.",
      status: "Distant",
    },
    {
      name: "Voyager 1",
      detail: "Farthest human-made object, entering interstellar space.",
      status: "Active",
    },
  ];

  const setSpotlight = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    target.style.setProperty("--hero3-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--hero3-y", `${event.clientY - rect.top}px`);
  };

  const clearSpotlight = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.currentTarget;
    target.style.removeProperty("--hero3-x");
    target.style.removeProperty("--hero3-y");
  };

  if (!isClient) {
    // Render a simplified version during SSR to prevent hydration mismatch
    return (
      <div className="relative isolate min-h-screen w-full transition-colors duration-700 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        {/* Simplified background for SSR */}
        <div className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      </div>
    );
  }

  return (
    <div className={`relative isolate min-h-screen w-full transition-colors duration-700 ${palette.surface} z-10`}>
      {/* Background with space elements */}
      <div
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          backgroundColor: palette.background.color,
          backgroundImage: palette.background.layers.join(", "),
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-80"
        style={{
          backgroundImage: palette.background.dots,
          backgroundSize: "12px 12px",
          backgroundRepeat: "repeat",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.18), transparent 70%)"
              : "radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.12), transparent 70%)",
          filter: "blur(22px)",
        }}
      />
      
      {/* Floating stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.7 + 0.3,
            animation: `star-pulse ${Math.random() * 5 + 3}s infinite ${Math.random() * 2}s`
          }}
        />
      ))}

      <section
        ref={sectionRef}
        className={`relative flex min-h-screen w-full flex-col gap-16 px-6 py-24 transition-opacity duration-700 md:gap-20 md:px-10 lg:px-16 xl:px-24 ${
          visible ? "motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]" : "opacity-0 translate-y-4"
        }`}
      >
        <header className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)] lg:items-end">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4">
              <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] ${palette.border} ${palette.accent}`}>
                Space Explorer
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className={`rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] transition duration-500 ${palette.border}`}
              >
                {theme === "dark" ? "Light" : "Dark"} mode
              </button>
            </div>
            <div className="space-y-6">
              <h1 className="text-3xl font-semibold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block">Explore the Cosmos</span> 
                <span className="block">with AI Insight</span> 
                <span className="block mt-3 text-lg font-normal sm:mt-4 sm:text-xl md:mt-4 md:text-2xl">
                  by{' '}
                  <span 
                    className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} animate-float-by-irohayashi motion-safe:animate-[float-by-irohayashi_3s_ease-in-out_infinite]`}
                    style={{ 
                      animation: 'float-by-irohayashi 3s ease-in-out infinite, glow-by-irohayashi 2s ease-in-out infinite alternate'
                    }}
                  >
                    irohayashi
                  </span>
                </span>
              </h1>
              <p className={`max-w-2xl text-base md:text-lg ${palette.subtle}`}>
                Discover the wonders of space through real NASA data enhanced with artificial intelligence. 
                Explore galaxies, nebulae, and celestial phenomena like never before.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className={`inline-flex flex-wrap gap-2 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.3em] transition sm:gap-3 sm:px-5 sm:py-3 ${palette.border} ${palette.accent}`}>
                <span className="flex items-center gap-1 sm:gap-2">
                  <span className="h-1 w-1 rounded-full bg-current animate-pulse sm:h-1.5 sm:w-1.5" />
                  Live Data
                </span>
                <span className="opacity-60">∙</span>
                <span>Enhanced</span>
              </div>
              <div className={`flex divide-x divide-white/10 overflow-hidden rounded-full border text-[10px] uppercase tracking-[0.3em] sm:text-xs ${palette.border}`}>
                {metrics.map((metric) => (
                  <div key={metric.label} className="flex flex-col px-3 py-2 sm:px-5 sm:py-3">
                    <span className={`text-[11px] ${palette.subtle}`}>{metric.label}</span>
                    <span className="text-lg font-semibold tracking-tight sm:text-xl">{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* CTA Button to Explore Page */}
            <div className="pt-4">
              <Link href="/explore">
                <Button 
                  size="lg" 
                  className={`rounded-full px-8 py-6 text-base font-semibold uppercase tracking-wider hover:scale-105 transition-transform ${
                    theme === 'dark' 
                      ? 'bg-white text-black hover:bg-white/90' 
                      : 'bg-black text-white hover:bg-black/90'
                  }`}
                >
                  Begin Space Exploration
                </Button>
              </Link>
            </div>
          </div>

          <div className={`relative flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em]">Mode</p>
                <h2 className="text-xl font-semibold tracking-tight">{activeMode.title}</h2>
              </div>
              <SpaceGlyph theme={theme} />
            </div>
            <p className={`text-sm leading-relaxed ${palette.subtle}`}>{activeMode.description}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("stargazing")}
                className={`flex-1 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] transition sm:px-4 sm:py-2 ${
                  mode === "stargazing" ? "bg-white text-black dark:bg-white/90 dark:text-black" : `${palette.border} ${palette.accent}`
                }`}
              >
                Stargazing
              </button>
              <button
                type="button"
                onClick={() => setMode("exploration")}
                className={`flex-1 rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] transition sm:px-4 sm:py-2 ${
                  mode === "exploration" ? "bg-white text-black dark:bg-white/90 dark:text-black" : `${palette.border} ${palette.accent}`
                }`}
              >
                Exploration
              </button>
            </div>
            <ul className="space-y-2 text-sm">
              {activeMode.items.map((item: string) => (
                <li key={item} className={`flex items-start gap-3 ${palette.subtle}`}>
                  <span className="mt-1 h-2 w-2 rounded-full bg-current" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)_minmax(0,0.9fr)] xl:items-stretch">
          <div className={`order-2 flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card} xl:order-1`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.35em]">Cosmic Insights</h3>
              <span className="text-xs uppercase tracking-[0.35em] opacity-60">AI Enhanced</span>
            </div>
            <p className={`text-sm leading-relaxed ${palette.subtle}`}>
              Using cutting-edge technology to analyze and enhance real NASA space imagery and data, 
              providing deeper insights into cosmic phenomena and celestial objects.
            </p>
            <div className="grid gap-3">
              {["Real NASA data integration", "Enhanced insights", "Interactive cosmic exploration"].map((item) => (
                <div key={item} className="relative overflow-hidden rounded-2xl border px-4 py-3 text-xs uppercase tracking-[0.3em] transition duration-500 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_14px_40px_rgba(0,0,0,0.45)]">
                  <span>{item}</span>
                  <span className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 hover:opacity-100" style={{ background: `radial-gradient(180px circle at 50% 20%, ${palette.glow}, transparent 70%)` }} />
                </div>
              ))}
            </div>
          </div>

          <figure className="order-1 overflow-hidden rounded-[32px] border transition xl:order-2 relative w-full" style={{ position: "relative" }}>
            {/* Space imagery placeholder */}
            <div className="relative w-full pb-[100%] sm:pb-[90%] md:pb-[80%] lg:pb-[72%] bg-gradient-to-br from-indigo-900/30 via-cyan-900/20 to-blue-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Central space object */}
                  <div className={`rounded-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-400 to-gray-600' : 'bg-gradient-to-r from-gray-300 to-gray-500'} rounded-full shadow-2xl animate-pulse`} />
                  
                  {/* Orbiting bodies */}
                  <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-40 h-40 md:w-48 md:h-48 -mt-16 sm:-mt-20 md:-mt-24 -ml-16 sm:-ml-20 md:-ml-24 rounded-full border border-white/20 flex items-center justify-center">
                    <div className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${theme === 'dark' ? 'bg-gray-300' : 'bg-gray-500'} animate-spin`} style={{ animationDuration: '12s' }}></div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 -mt-12 sm:-mt-14 md:-mt-16 -ml-12 sm:-ml-14 md:-ml-16 rounded-full border border-white/20 flex items-center justify-center">
                    <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${theme === 'dark' ? 'bg-gray-400' : 'bg-gray-400'} animate-spin`} style={{ animationDuration: '8s' }}></div>
                  </div>
                </div>
              </div>
              
              {/* Gradient overlay */}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 mix-blend-soft-light dark:from-white/10" />
              <div className="pointer-events-none absolute inset-0 border border-white/10 mix-blend-overlay dark:border-white/20" />
              <span className="pointer-events-none absolute -left-16 top-16 h-40 w-40 rounded-full border border-white/15 opacity-70 motion-safe:animate-[hero3-glow_9s_ease-in-out_infinite]" />
              <span className="pointer-events-none absolute -right-12 bottom-16 h-48 w-48 rounded-full border border-white/10 opacity-40 motion-safe:animate-[hero3-drift_12s_ease-in-out_infinite]" />
            </div>
            <figcaption className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 sm:px-6 sm:py-5 text-[10px] sm:text-xs uppercase tracking-[0.35em] ${palette.subtle}`}>
              <span className="mb-1 sm:mb-0">Cosmic Visualization</span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-6 sm:w-8 bg-current" />
                AI Enhanced
              </span>
            </figcaption>
          </figure>

          <aside className={`order-3 flex flex-col gap-6 rounded-3xl border p-8 transition ${palette.border} ${palette.card} xl:order-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-[0.35em]">Celestial Events</h3>
              <span className="text-xs uppercase tracking-[0.35em] opacity-60">Live Feed</span>
            </div>
            <ul className="space-y-4">
              {spacePhenomena.map((phenomenon, index) => (
                <li
                  key={phenomenon.name}
                  onMouseMove={setSpotlight}
                  onMouseLeave={clearSpotlight}
                  className="group relative overflow-hidden rounded-2xl border px-5 py-4 transition duration-500 hover:-translate-y-0.5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        theme === "dark"
                          ? "radial-gradient(190px circle at var(--hero3-x, 50%) var(--hero3-y, 50%), rgba(255,255,255,0.18), transparent 72%)"
                          : "radial-gradient(190px circle at var(--hero3-x, 50%) var(--hero3-y, 50%), rgba(17,17,17,0.12), transparent 72%)",
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.25em]">{phenomenon.name}</h4>
                    <span className="text-[10px] uppercase tracking-[0.35em] opacity-70">{phenomenon.status}</span>
                  </div>
                  <p className={`mt-3 text-sm leading-relaxed ${palette.subtle}`}>{phenomenon.detail}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default HeroSpaceLanding;
export { HeroSpaceLanding };