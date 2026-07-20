"use client";

import { useMemo, useState } from "react";

export type PickerCopy = {
  hint: string;
  timelineLabel: string;
  timelines: string[];
  button: string;
  emailSubject: string;
  bodyIntro: string;
  bodyNeed: string;
  bodyTimeline: string;
  bodyDesc: string;
  bodyDescPlaceholder: string;
  bodyBudget: string;
  bodyName: string;
};

export function ProjectPicker({
  email,
  types,
  copy,
}: {
  email: string;
  types: string[];
  copy: PickerCopy;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [timeline, setTimeline] = useState<string | null>(null);

  const href = useMemo(() => {
    const chosen = types.filter((t) => selected.has(t));
    const subject = `${copy.emailSubject}${chosen.length ? `: ${chosen.join(" + ")}` : ""}`;
    const body = [
      copy.bodyIntro,
      "",
      `${copy.bodyNeed}${chosen.length ? chosen.join("、") : "—"}`,
      `${copy.bodyTimeline}${timeline ?? "—"}`,
      "",
      copy.bodyDesc,
      copy.bodyDescPlaceholder,
      "",
      copy.bodyBudget,
      "",
      copy.bodyName,
    ].join("\n");
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [selected, timeline, types, copy, email]);

  const toggle = (t: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  return (
    <div className="border border-ink bg-paper p-5 shadow-[4px_4px_0_0_#100f0f]">
      <div className="flex flex-wrap gap-2">
        {types.map((t) => {
          const on = selected.has(t);
          return (
            <button
              key={t}
              onClick={() => toggle(t)}
              aria-pressed={on}
              className={`border border-ink px-3 py-1.5 font-mono text-[13px] transition-colors ${
                on ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-wash"
              }`}
            >
              {on ? "✓ " : ""}
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[13px]">
        <span className="text-ink-3">{copy.timelineLabel}</span>
        {copy.timelines.map((t) => {
          const on = timeline === t;
          return (
            <button
              key={t}
              onClick={() => setTimeline(on ? null : t)}
              aria-pressed={on}
              className={`border border-ink px-3 py-1 transition-colors ${
                on ? "bg-ink text-paper" : "bg-paper text-ink hover:bg-wash"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-4">
        <a
          href={href}
          className={`border px-4 py-2 font-mono text-sm transition-colors ${
            selected.size
              ? "border-red-ink text-red-ink hover:bg-red-ink hover:text-paper"
              : "border-rule-mid text-ink-3"
          }`}
        >
          {copy.button}
          {selected.size > 0 && ` (${selected.size})`}
        </a>
        <p className="font-mono text-xs text-ink-3">{copy.hint}</p>
      </div>
    </div>
  );
}
