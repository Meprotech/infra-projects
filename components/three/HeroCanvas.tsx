"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// Lazy-load the WebGL scene so it never blocks first paint. ssr:false because
// three.js touches the DOM/canvas APIs that don't exist on the server.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

function SceneFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-48 w-48">
        <div className="absolute inset-0 rounded-full border border-steel/20" />
        <div className="absolute inset-4 rounded-full border border-steel/15" />
        <div className="absolute inset-8 rounded-full border border-accent/20 animate-pulse" />
        <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-glow" />
      </div>
    </div>
  );
}

export function HeroCanvas() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => setMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause the render loop while the hero is scrolled out of view.
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Reduced motion: render a calm static fallback instead of the animated scene.
  if (mounted && reduce) {
    return (
      <div ref={ref} className="absolute inset-0">
        <SceneFallback />
      </div>
    );
  }

  return (
    <div ref={ref} className="absolute inset-0">
      {mounted ? <HeroScene mobile={mobile} paused={!visible} /> : <SceneFallback />}
    </div>
  );
}
