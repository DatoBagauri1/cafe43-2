import { useEffect, useRef, useState } from "react";

const HOVER_SELECTOR =
  'a, button, [role="button"], input:not([type="hidden"]), textarea, select, label, summary, [data-cursor="hover"]';

function detectTouchDevice() {
  if (typeof window === "undefined") return true;
  return (
    window.matchMedia?.("(hover: none), (pointer: coarse)").matches ||
    "ontouchstart" in window ||
    (navigator.maxTouchPoints || 0) > 0
  );
}

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(!detectTouchDevice());
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add("cursor-custom");

    const s = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      targetX: window.innerWidth / 2,
      targetY: window.innerHeight / 2,
      width: 28,
      height: 28,
      targetWidth: 28,
      targetHeight: 28,
      radius: 999,
      targetRadius: 999,
      visible: false,
      pressed: false,
    };

    let raf = 0;
    let hoverEl: HTMLElement | null = null;

    const animate = () => {
      s.x += (s.targetX - s.x) * 0.22;
      s.y += (s.targetY - s.y) * 0.22;
      s.width += (s.targetWidth - s.width) * 0.18;
      s.height += (s.targetHeight - s.height) * 0.18;
      s.radius += (s.targetRadius - s.radius) * 0.18;

      const scale = s.pressed ? 0.85 : 1;
      ring.style.transform = `translate3d(${s.x - s.width / 2}px, ${s.y - s.height / 2}px, 0) scale(${scale})`;
      ring.style.width = `${s.width}px`;
      ring.style.height = `${s.height}px`;
      ring.style.borderRadius = `${s.radius}px`;
      ring.style.opacity = s.visible ? "1" : "0";

      dot.style.transform = `translate3d(${s.targetX - 3}px, ${s.targetY - 3}px, 0)`;
      dot.style.opacity = s.visible ? "1" : "0";

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const updateFromTarget = (target: EventTarget | null, x: number, y: number) => {
      const el =
        target instanceof Element
          ? (target.closest(HOVER_SELECTOR) as HTMLElement | null)
          : null;
      if (el) {
        if (hoverEl !== el) {
          if (hoverEl) delete hoverEl.dataset.cursorHover;
          hoverEl = el;
          el.dataset.cursorHover = "true";
        }
        const rect = el.getBoundingClientRect();
        const padX = 10;
        const padY = 8;
        s.targetX = rect.left + rect.width / 2;
        s.targetY = rect.top + rect.height / 2;
        s.targetWidth = rect.width + padX * 2;
        s.targetHeight = rect.height + padY * 2;
        const computed = parseFloat(getComputedStyle(el).borderTopLeftRadius || "0");
        s.targetRadius = Math.min(Math.max(computed + 6, 12), 999);
      } else {
        if (hoverEl) {
          delete hoverEl.dataset.cursorHover;
          hoverEl = null;
        }
        s.targetX = x;
        s.targetY = y;
        s.targetWidth = 28;
        s.targetHeight = 28;
        s.targetRadius = 999;
      }
    };

    const onMove = (e: MouseEvent) => {
      s.visible = true;
      updateFromTarget(e.target, e.clientX, e.clientY);
    };
    const onLeave = () => {
      s.visible = false;
    };
    const onEnter = () => {
      s.visible = true;
    };
    const onDown = () => {
      s.pressed = true;
    };
    const onUp = () => {
      s.pressed = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("cursor-custom");
      if (hoverEl) {
        delete hoverEl.dataset.cursorHover;
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] border-2 border-primary mix-blend-difference"
        style={{
          willChange: "transform, width, height, border-radius, opacity",
          transition: "opacity 200ms ease",
          opacity: 0,
          width: 28,
          height: 28,
          borderRadius: 999,
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-primary mix-blend-difference"
        style={{
          willChange: "transform, opacity",
          transition: "opacity 200ms ease",
          opacity: 0,
        }}
      />
    </>
  );
}
