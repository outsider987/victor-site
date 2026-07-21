"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { createSlashCommand, type SlashState } from "./slash-command";

export type ComposerCopy = {
  to: string;
  subject: string;
  placeholder: string;
  latencyLabel: string;
  latencyHint: string;
  send: string;
  sent: string;
};

/** rolling keystroke→paint latency, honest about what it measures */
function useTypingLatency() {
  const [last, setLast] = useState(0);
  const [avg, setAvg] = useState(0);
  const samples = useRef<number[]>([]);
  const pending = useRef<number | null>(null);

  const onKeyDown = () => {
    pending.current = performance.now();
  };
  const onUpdated = () => {
    if (pending.current === null) return;
    const t0 = pending.current;
    pending.current = null;
    requestAnimationFrame(() => {
      const dt = performance.now() - t0;
      samples.current.push(dt);
      if (samples.current.length > 60) samples.current.shift();
      setLast(dt);
      setAvg(samples.current.reduce((a, b) => a + b, 0) / samples.current.length);
    });
  };
  return { last, avg, onKeyDown, onUpdated };
}

export function Composer({ copy }: { copy: ComposerCopy }) {
  const [slash, setSlash] = useState<SlashState>({
    open: false,
    items: [],
    selected: 0,
    rect: null,
    execute: null,
  });
  const [sent, setSent] = useState(false);
  const latency = useTypingLatency();
  const shellRef = useRef<HTMLDivElement>(null);

  const slashExtension = useMemo(() => createSlashCommand(setSlash), []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: copy.placeholder }),
      slashExtension,
    ],
    autofocus: "end",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "composer-prose",
        "aria-label": "Email body",
      },
    },
    onUpdate: () => latency.onUpdated(),
  });

  useEffect(() => () => editor?.destroy(), [editor]);

  // menu position relative to the shell
  const menuStyle = useMemo(() => {
    if (!slash.rect || !shellRef.current) return undefined;
    const host = shellRef.current.getBoundingClientRect();
    return {
      left: Math.min(slash.rect.left - host.left, host.width - 240),
      top: slash.rect.bottom - host.top + 6,
    };
  }, [slash.rect]);

  return (
    <div>
      {/* latency strip */}
      <div className="tnum mb-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 font-mono text-xs text-ink-3">
        <span>
          {copy.latencyLabel}{" "}
          <span className="text-ink">
            {latency.last ? `${latency.last.toFixed(1)}ms` : "—"}
          </span>{" "}
          · avg{" "}
          <span className="text-ink">
            {latency.avg ? `${latency.avg.toFixed(1)}ms` : "—"}
          </span>
        </span>
        <span>{copy.latencyHint}</span>
      </div>

      <div
        ref={shellRef}
        className="relative border border-ink bg-paper card-shadow"
        onKeyDownCapture={latency.onKeyDown}
      >
        {/* fake envelope fields */}
        <div className="flex items-baseline gap-3 border-b border-rule px-4 py-2.5 font-mono text-[13px]">
          <span className="text-ink-3">{copy.to}</span>
          <span className="text-ink">you@yourcompany.com</span>
        </div>
        <div className="flex items-baseline gap-3 border-b border-rule px-4 py-2.5 font-mono text-[13px]">
          <span className="text-ink-3">{copy.subject}</span>
          <span className="text-ink">A keyboard-first composer — Victor Chang</span>
        </div>

        {/* editor */}
        <EditorContent editor={editor} />

        {/* slash menu */}
        {slash.open && slash.items.length > 0 && menuStyle && (
          <div
            className="absolute z-10 w-56 border border-ink bg-paper py-1 card-shadow"
            style={menuStyle}
            role="listbox"
          >
            {slash.items.map((item, i) => (
              <button
                key={item.title}
                role="option"
                aria-selected={i === slash.selected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  slash.execute?.(item);
                }}
                className={`flex w-full items-baseline justify-between px-3 py-1.5 text-left ${
                  i === slash.selected ? "bg-ink text-paper" : "text-ink hover:bg-wash"
                }`}
              >
                <span className="text-[14px] font-medium">{item.title}</span>
                <span
                  className={`font-mono text-[10px] ${
                    i === slash.selected ? "text-paper/70" : "text-ink-3"
                  }`}
                >
                  {item.hint}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* send bar */}
        <div className="flex items-center justify-between border-t border-rule px-4 py-2.5">
          <span className="font-mono text-[11px] text-ink-3">
            ⌘B bold · ⌘I italic · type / for commands
          </span>
          <button
            onClick={() => setSent(true)}
            className="border border-ink bg-paper px-3 py-1 font-mono text-xs text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            {sent ? copy.sent : copy.send}
          </button>
        </div>
      </div>
    </div>
  );
}
