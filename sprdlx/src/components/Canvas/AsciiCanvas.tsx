import React, { useEffect, useRef } from 'react';

interface AsciiCanvasProps {
  active: boolean;
}

export function AsciiCanvas({ active }: AsciiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01#'.split('');
    const fontSize = 14;
    const charWidth = fontSize * 0.6;
    const charHeight = fontSize;

    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px monospace`;
    ctx.fillStyle = '#888888';
    ctx.globalAlpha = 0.5;

    const cols = Math.ceil(canvas.width / charWidth);
    const rows = Math.ceil(canvas.height / charHeight);

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = j * charWidth;
        const y = i * charHeight;
        ctx.fillText(char, x, y);
      }
    }

    ctx.globalAlpha = 1;
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}
