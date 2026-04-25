"use client";

import { useEffect, useState } from "react";

export type PresetKey = "buildout" | "pressing" | "corner";
export type Token = { id: string; label: string; top: number; left: number; tone: "sky" | "amber" | "white" };

export const boardPresets: Record<PresetKey, { title: string; description: string; tokens: Token[] }> = {
  buildout: {
    title: "Build-out shape",
    description: "Center backs split and the 6 drops between the lines.",
    tokens: [
      { id: "gk", label: "GK", top: 84, left: 50, tone: "white" },
      { id: "rb", label: "RB", top: 68, left: 78, tone: "sky" },
      { id: "rcb", label: "RCB", top: 72, left: 60, tone: "sky" },
      { id: "lcb", label: "LCB", top: 72, left: 40, tone: "sky" },
      { id: "lb", label: "LB", top: 68, left: 22, tone: "sky" },
      { id: "six", label: "6", top: 58, left: 50, tone: "amber" },
      { id: "eight", label: "8", top: 44, left: 38, tone: "amber" },
      { id: "ten", label: "10", top: 44, left: 62, tone: "amber" },
      { id: "rw", label: "RW", top: 26, left: 78, tone: "sky" },
      { id: "nine", label: "9", top: 18, left: 50, tone: "sky" },
      { id: "lw", label: "LW", top: 26, left: 22, tone: "sky" },
    ],
  },
  pressing: {
    title: "Pressing triggers",
    description: "Wide forwards jump and the 8s squeeze inside lanes.",
    tokens: [
      { id: "rw", label: "RW", top: 30, left: 74, tone: "sky" },
      { id: "nine", label: "9", top: 24, left: 52, tone: "sky" },
      { id: "lw", label: "LW", top: 30, left: 28, tone: "sky" },
      { id: "eight", label: "8", top: 46, left: 40, tone: "amber" },
      { id: "ten", label: "10", top: 44, left: 60, tone: "amber" },
      { id: "six", label: "6", top: 58, left: 50, tone: "amber" },
      { id: "rb", label: "RB", top: 66, left: 78, tone: "sky" },
      { id: "rcb", label: "RCB", top: 74, left: 60, tone: "sky" },
      { id: "lcb", label: "LCB", top: 74, left: 40, tone: "sky" },
      { id: "lb", label: "LB", top: 66, left: 22, tone: "sky" },
      { id: "gk", label: "GK", top: 88, left: 50, tone: "white" },
    ],
  },
  corner: {
    title: "Attacking corner",
    description: "Near-post screen opens the back-post run.",
    tokens: [
      { id: "ball", label: "Ball", top: 8, left: 93, tone: "white" },
      { id: "np", label: "NP", top: 18, left: 72, tone: "amber" },
      { id: "bp", label: "BP", top: 24, left: 42, tone: "sky" },
      { id: "scr", label: "SCR", top: 16, left: 60, tone: "amber" },
      { id: "edge", label: "EDGE", top: 34, left: 58, tone: "sky" },
      { id: "rest1", label: "R1", top: 54, left: 66, tone: "sky" },
      { id: "rest2", label: "R2", top: 60, left: 38, tone: "sky" },
    ],
  },
};

function tokenClass(tone: Token["tone"]) {
  if (tone === "amber") return "bg-amber-300 text-slate-950";
  if (tone === "white") return "bg-white text-slate-950";
  return "bg-sky-300 text-slate-950";
}

export function TacticsBoard({ preset, draggable }: { preset: PresetKey; draggable: boolean }) {
  const [tokens, setTokens] = useState(boardPresets[preset].tokens);

  useEffect(() => {
    setTokens(boardPresets[preset].tokens);
  }, [preset]);

  function moveToken(id: string, event: React.PointerEvent<HTMLButtonElement>) {
    if (!draggable) return;
    const board = event.currentTarget.parentElement?.getBoundingClientRect();
    if (!board) return;
    event.currentTarget.setPointerCapture(event.pointerId);

    const handleMove = (nextEvent: PointerEvent) => {
      const left = ((nextEvent.clientX - board.left) / board.width) * 100;
      const top = ((nextEvent.clientY - board.top) / board.height) * 100;
      setTokens((current) => current.map((token) => token.id === id ? { ...token, left: Math.max(6, Math.min(94, left)), top: Math.max(8, Math.min(92, top)) } : token));
    };

    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  }

  return (
    <div className="relative h-72 overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#14532d,#166534)] p-4">
      <div className="absolute inset-4 rounded-[24px] border border-white/40" />
      <div className="absolute left-1/2 top-4 h-[calc(100%-2rem)] w-px -translate-x-1/2 bg-white/30" />
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      {preset === "corner" ? (
        <>
          <div className="absolute right-4 top-4 h-16 w-16 rounded-bl-[18px] border-b border-l border-white/40" />
          <div className="absolute right-4 top-12 h-28 w-20 rounded-bl-[18px] border-b border-l border-white/30" />
        </>
      ) : null}
      {tokens.map((token) => (
        <button
          key={token.id}
          type="button"
          onPointerDown={(event) => moveToken(token.id, event)}
          className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-bold shadow-lg ${draggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"} ${tokenClass(token.tone)}`}
          style={{ top: `${token.top}%`, left: `${token.left}%` }}
        >
          {token.label}
        </button>
      ))}
    </div>
  );
}
