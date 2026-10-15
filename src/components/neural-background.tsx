"use client";

import { useEffect, useRef } from "react";

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const surface = canvas;
    const ctx = context;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let visible = true;
    let frame = 0;
    let previous = 0;
    let painted = 0;
    let points: { x: number; y: number; phase: number; radius: number }[] = [];

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // CSS paints the stationary glow once; the canvas only redraws the nodes.
      const positions = points.map((point) => ({
        x:
          point.x * width +
          Math.sin(elapsedRef.current * 0.00023 + point.phase) * width * 0.018,
        y:
          point.y * height +
          Math.cos(elapsedRef.current * 0.00019 + point.phase) * height * 0.045,
      }));
      const reach = Math.min(360, Math.max(150, width * 0.18));
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const a = positions[i];
          const b = positions[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance > reach) continue;
          const opacity = (1 - distance / reach) * 0.52;
          ctx.strokeStyle = `rgba(229,184,78,${opacity})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if ((i + j) % 9 === 0) {
            const travel = (elapsedRef.current * 0.00012 + i * 0.137) % 1;
            ctx.fillStyle = `rgba(255,218,133,${opacity + 0.25})`;
            ctx.beginPath();
            ctx.arc(
              a.x + (b.x - a.x) * travel,
              a.y + (b.y - a.y) * travel,
              2,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          }
        }
        // A soft outer circle avoids expensive canvas blur on every frame.
        if (i % 7 === 0) {
          ctx.fillStyle = "rgba(229,184,78,0.14)";
          ctx.beginPath();
          ctx.arc(
            positions[i].x,
            positions[i].y,
            points[i].radius * 2.8,
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.fillStyle = i % 7 === 0 ? "#ffe3a0" : "#d8a83f";
        ctx.beginPath();
        ctx.arc(
          positions[i].x,
          positions[i].y,
          points[i].radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      surface.dataset.ready = "true";
    }

    function animate(now: number) {
      if (now - painted >= 1000 / (width < 760 ? 20 : 30)) {
        elapsedRef.current += previous ? Math.min(now - previous, 80) : 0;
        previous = now;
        painted = now;
        draw();
      }
      frame = requestAnimationFrame(animate);
    }

    function sync() {
      cancelAnimationFrame(frame);
      previous = 0;
      const running = !motion.matches && visible && !document.hidden;
      surface.dataset.state = motion.matches
        ? "reduced"
        : running
          ? "running"
          : "paused";
      draw();
      if (running) frame = requestAnimationFrame(animate);
    }

    function resize() {
      const bounds = surface.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;
      const scale = Math.min(window.devicePixelRatio || 1, 1.5, 2400 / width);
      surface.width = Math.round(width * scale);
      surface.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      let seed = 127;
      const random = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      points = Array.from(
        {
          length: Math.min(
            130,
            Math.max(48, Math.round((width * height) / 13000)),
          ),
        },
        () => {
          const side = random();
          return {
            x:
              side < 0.42
                ? random() * 0.32
                : side < 0.84
                  ? 0.68 + random() * 0.32
                  : random(),
            y: random(),
            phase: random() * Math.PI * 2,
            radius: 1.6 + random() * 2.6,
          };
        },
      );
      sync();
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    intersectionObserver.observe(surface);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="neural-background" aria-hidden="true" />
  );
}
