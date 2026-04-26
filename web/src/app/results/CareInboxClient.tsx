"use client";

import { useEffect, useMemo, useState } from "react";

type MessageRole = "USER" | "CLINICIAN" | "SYSTEM";

type ThreadMessage = {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: string;
  meta?: any;
};

type Thread = {
  id: string;
  title: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: MessageRole;
    text: string;
    createdAt: string;
    meta?: any;
  }>;
};

export function CareInboxClient() {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");

  const messages = useMemo<ThreadMessage[]>(() => {
    if (!thread?.messages) return [];
    return thread.messages.map((m) => ({
      id: m.id,
      role: m.role,
      text: m.text,
      createdAt: m.createdAt,
      meta: m.meta,
    }));
  }, [thread]);

  async function refresh() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/messages/thread", { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to load messages.");
      setThread(json?.thread ?? null);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function send(kind?: string, presetText?: string) {
    const payload = (presetText ?? text).trim();
    if (!payload) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages/thread", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: payload, kind }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed to send.");
      const newMsgs = Array.isArray(json?.messages) ? json.messages : [];
      setThread((prev) => {
        if (!prev) return prev;
        return { ...prev, messages: [...prev.messages, ...newMsgs] };
      });
      setText("");
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-[2.5rem] bg-surface-container-lowest p-7 sm:p-9 border border-outline-variant/10 shadow-[0_18px_60px_-40px_rgba(47,51,48,0.14)]">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface/45">
            Care inbox
          </p>
          <p className="mt-2 font-headline tracking-tight text-lg">
            {thread?.title ?? "Dr. Riris"}
          </p>
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
            Daily guidance + follow-ups live here. Send an update anytime.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refresh()}
          className="rounded-full border border-outline-variant/25 bg-surface px-5 py-2.5 text-sm font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-outline-variant/15 bg-surface px-5 py-4 text-sm text-on-surface-variant">
          {error}
        </div>
      ) : null}

      <div className="mt-7 space-y-3 max-h-[420px] overflow-auto pr-1">
        {loading ? (
          <div className="text-sm text-on-surface-variant">Loading messages…</div>
        ) : messages.length ? (
          messages.map((m) => {
            const isUser = m.role === "USER";
            return (
              <div
                key={m.id}
                className={[
                  "flex",
                  isUser ? "justify-end" : "justify-start",
                ].join(" ")}
              >
                <div
                  className={[
                    "max-w-[85%] rounded-3xl px-5 py-4 border text-sm leading-relaxed",
                    isUser
                      ? "bg-primary/10 border-primary/20 text-on-surface"
                      : "bg-surface-container-low border-outline-variant/12 text-on-surface-variant",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-on-surface/40">
                    {isUser ? "You" : "Dr. Riris"}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-on-surface-variant">
            No messages yet.
          </div>
        )}
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        {[
          { id: "irritated", label: "Irritated" },
          { id: "breakout", label: "Breakout" },
          { id: "dry", label: "Dry today" },
          { id: "period", label: "Period" },
          { id: "travel", label: "Traveling" },
        ].map((q) => (
          <button
            key={q.id}
            type="button"
            onClick={() => send("quick", q.label)}
            disabled={sending || loading}
            className="rounded-full border border-outline-variant/25 bg-surface px-4 py-2 text-xs font-medium tracking-wide text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Ask about anything… (what changed, what stung, what you’re worried about)"
          className="flex-1 rounded-3xl bg-surface border border-outline-variant/15 px-5 py-4 text-sm text-on-surface placeholder:text-on-surface/35 outline-none focus:ring-2 focus:ring-primary/25"
        />
        <button
          type="button"
          onClick={() => send(undefined)}
          disabled={sending || loading || !text.trim()}
          className="btn-gradient text-on-primary px-7 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}

