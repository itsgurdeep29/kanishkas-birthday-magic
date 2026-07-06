import { useEffect, useRef, useState } from "react";

// Floating hearts / sparkles / particles background
export function FloatingBackground({ variant = "day" }: { variant?: "day" | "night" }) {
  const items = Array.from({ length: 28 });
  const emojis = ["💗", "✨", "🌸", "🎀", "💫", "🩷", "⭐"];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "night"
              ? "var(--gradient-night)"
              : "var(--gradient-dreamy)",
        }}
      />
      {items.map((_, i) => {
        const left = Math.random() * 100;
        const size = 12 + Math.random() * 24;
        const duration = 8 + Math.random() * 14;
        const delay = Math.random() * 10;
        const emoji = emojis[i % emojis.length];
        return (
          <span
            key={i}
            className="absolute animate-float-up select-none"
            style={{
              left: `${left}%`,
              fontSize: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `-${delay}s`,
              filter: "drop-shadow(0 0 8px rgba(255,182,193,0.6))",
            }}
          >
            {emoji}
          </span>
        );
      })}
    </div>
  );
}

// Sparkle overlay
export function Sparkles({ count = 20 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="absolute animate-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
            fontSize: `${8 + Math.random() * 14}px`,
          }}
        >
          ✨
        </span>
      ))}
    </div>
  );
}

// Cursor-following particles (desktop only)
export function CursorParticles() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const container = ref.current;
    if (!container) return;
    const onMove = (e: MouseEvent) => {
      const el = document.createElement("span");
      el.textContent = ["💗", "✨", "🌸"][Math.floor(Math.random() * 3)];
      el.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;font-size:${
        10 + Math.random() * 10
      }px;transition:all 1s ease-out;opacity:1;z-index:9999;transform:translate(-50%,-50%)`;
      container.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transform = `translate(-50%,-50%) translate(${(Math.random() - 0.5) * 60}px, ${
          -30 - Math.random() * 40
        }px) scale(0.2)`;
        el.style.opacity = "0";
      });
      setTimeout(() => el.remove(), 1000);
    };
    let last = 0;
    const throttled = (e: MouseEvent) => {
      const now = Date.now();
      if (now - last > 80) {
        last = now;
        onMove(e);
      }
    };
    window.addEventListener("mousemove", throttled);
    return () => window.removeEventListener("mousemove", throttled);
  }, []);
  return <div ref={ref} />;
}

// Music toggle
export function MusicToggle({ started }: { started: boolean }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      const a = new Audio(
        "https://cdn.pixabay.com/download/audio/2022/10/25/audio_946bc7a1c4.mp3?filename=birthday-119241.mp3"
      );
      a.loop = true;
      a.volume = 0.35;
      audioRef.current = a;
    }
  }, []);

  useEffect(() => {
    if (started && audioRef.current && !playing) {
      audioRef.current
        .play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }, [started, playing]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle music"
      className="fixed bottom-4 right-4 z-50 glass rounded-full h-12 w-12 grid place-items-center text-xl hover:scale-110 transition-transform"
    >
      {playing ? "🎵" : "🔇"}
    </button>
  );
}
