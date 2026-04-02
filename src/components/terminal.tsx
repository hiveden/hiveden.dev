"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";

interface Line {
  type: "input" | "output" | "error";
  content: string;
}

const COMMANDS: Record<string, { description: string; handler: () => string[] }> = {
  help: {
    description: "Show available commands",
    handler: () => {
      const lines = ["", "Available commands:", ""];
      for (const [name, cmd] of Object.entries(COMMANDS)) {
        lines.push(`  ${name.padEnd(12)} ${cmd.description}`);
      }
      lines.push("");
      lines.push('Type a command or click one above to get started.');
      lines.push("");
      return lines;
    },
  },
  about: {
    description: "About hiveden",
    handler: () => [
      "",
      "hiveden.dev — A hive for builders.",
      "",
      "We build tools, write code, and share what we learn.",
      "This is our corner of the internet.",
      "",
    ],
  },
  clear: {
    description: "Clear terminal",
    handler: () => [],
  },
  whoami: {
    description: "Who are you?",
    handler: () => ["", "visitor@hiveden.dev", ""],
  },
};

const WELCOME: Line[] = [
  { type: "output", content: "" },
  { type: "output", content: "Welcome to hiveden.dev" },
  { type: "output", content: "Type 'help' for available commands." },
  { type: "output", content: "" },
];

export function Terminal() {
  const [history, setHistory] = useState<Line[]>(WELCOME);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const executeCommand = useCallback((raw: string) => {
    const trimmed = raw.trim().toLowerCase();

    if (!trimmed) return;

    const inputLine: Line = { type: "input", content: raw.trim() };

    if (trimmed === "clear") {
      setHistory([]);
      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      return;
    }

    const cmd = COMMANDS[trimmed];
    if (cmd) {
      const output = cmd.handler();
      setHistory((prev) => [
        ...prev,
        inputLine,
        ...output.map((content) => ({ type: "output" as const, content })),
      ]);
    } else {
      setHistory((prev) => [
        ...prev,
        inputLine,
        { type: "error", content: `command not found: ${trimmed}. Type 'help' for available commands.` },
      ]);
    }

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
  };

  const handleCommandClick = (cmd: string) => {
    executeCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <div
      className="rounded-lg border border-border bg-surface overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-muted text-xs ml-2">hiveden ~ terminal</span>
      </div>

      {/* Quick commands */}
      <div className="flex gap-2 px-4 py-2 border-b border-border bg-background/50">
        {Object.keys(COMMANDS).map((cmd) => (
          <button
            key={cmd}
            onClick={(e) => {
              e.stopPropagation();
              handleCommandClick(cmd);
            }}
            className="px-2.5 py-1 text-xs rounded bg-border/50 text-muted hover:text-accent hover:bg-accent/10 transition-colors cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Output area */}
      <div ref={scrollRef} className="p-4 h-[60vh] overflow-y-auto space-y-0.5">
        {history.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.type === "input" ? (
              <div>
                <span className="text-accent">$ </span>
                <span>{line.content}</span>
              </div>
            ) : line.type === "error" ? (
              <div className="text-red-400">{line.content}</div>
            ) : (
              <div className="text-muted">{line.content || "\u00A0"}</div>
            )}
          </div>
        ))}

        {/* Input line */}
        <div className="flex items-center">
          <span className="text-accent">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-foreground ml-1 caret-accent"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
}
