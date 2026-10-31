"use client";

import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const HeroCanvas = dynamic(() => import("@/components/three/hero-canvas"), {
  ssr: false,
  loading: () => null,
});

type Tier = "static" | "low" | "high";

/** Rough device budget: weak devices keep the static backdrop, small or modest ones get fewer nodes. */
function getTier(): Tier {
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  if (cores <= 2 || memory <= 2) return "static";
  if (window.innerWidth < 768 || cores <= 4 || memory <= 4) return "low";
  return "high";
}

const noopSubscribe = () => () => {};

export function HeroScene() {
  const reduceMotion = useReducedMotion();
  // null on the server and during hydration, so server and client markup match.
  const tier = useSyncExternalStore(noopSubscribe, getTier, () => null);
  const { resolvedTheme } = useTheme();
  const container = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  const [idle, setIdle] = useState(false);

  // Fetch and start three.js only once the page has loaded and the main thread is idle,
  // so it never competes with the first paint or hydration on slower phones.
  useEffect(() => {
    let idleId: number | undefined;
    const schedule = () => {
      idleId = window.requestIdleCallback
        ? window.requestIdleCallback(() => setIdle(true), { timeout: 3000 })
        : window.setTimeout(() => setIdle(true), 1500);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idleId === undefined) return;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);

  // Stop rendering frames once the hero scrolls out of view.
  useEffect(() => {
    const el = container.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const show3D = idle && tier !== null && tier !== "static" && !reduceMotion;

  return (
    <div
      ref={container}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-25 md:relative md:inset-auto md:mx-auto md:aspect-square md:w-full md:max-w-md md:opacity-100"
    >
      {/* Static fallback: always painted first, and all that shows without WebGL. */}
      <div className="hero-orb absolute inset-[18%] opacity-50" />
      {show3D && (
        <HeroCanvas
          active={onScreen}
          density={tier}
          theme={resolvedTheme === "light" ? "light" : "dark"}
        />
      )}
    </div>
  );
}
