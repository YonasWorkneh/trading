import { useEffect, useRef } from "react";

const SCRIPT_ID = "tubes1-cursor-script";
const TUBES_URL =
  "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

type AnyTubes = any;

declare global {
  interface Window {
    Tubes?: AnyTubes;
  }
}

const TubesBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<AnyTubes>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = containerRef.current;
    if (!container) return;

    let mounted = true;

    const loadScript = () =>
      new Promise<void>((resolve, reject) => {
        // If already loaded, resolve immediately
        if (window.Tubes) return resolve();

        const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Failed to load tubes script")), {
            once: true,
          });
          return;
        }

        const s = document.createElement("script");
        s.id = SCRIPT_ID;
        s.src = TUBES_URL;
        s.async = true;
        // Helps avoid opaque "Script error." on some browsers/CDNs
        s.crossOrigin = "anonymous";
        s.onload = () => resolve();
        s.onerror = () => reject(new Error("Failed to load tubes script"));
        document.head.appendChild(s);
      });

    const init = async () => {
      try {
        // Requirement said "dynamically import"; this CDN build is not always ESM.
        // We still dynamically load it at runtime via a script tag (client-only).
        await loadScript();
        if (!mounted) return;

        const TubesCtor: any = window.Tubes;
        if (!TubesCtor) {
          console.error("TubesBackground: window.Tubes not found after script load.");
          return;
        }

        // Clear any previous canvases
        container.innerHTML = "";

        instanceRef.current = new TubesCtor(container, {
          // Main app base colors (light blue-ish)
          colors: [0xe8f0fe, 0xd0e0fc, 0xb8d0fa, 0xa0c0f8],
          lightIntensity: 200,
          lightColor1: 0x2463eb, // blue
          lightColor2: 0x1e4fd4, // dark blue
          lightColor3: 0x6b7280, // gray
        });
      } catch (err) {
        console.error("TubesBackground: failed to load/init", err);
      }
    };

    void init();

    return () => {
      mounted = false;
      const inst: any = instanceRef.current;
      if (inst && typeof inst.dispose === "function") inst.dispose();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
};

export default TubesBackground;

