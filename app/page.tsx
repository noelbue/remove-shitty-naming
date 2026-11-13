"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/slugify";

type Theme = "light" | "dark";

export default function Home() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [origin, setOrigin] = useState("https://remove-shitty-naming.netlify.app");
  const [cliCopied, setCliCopied] = useState(false);
  const output = slugify(input);
  const installCmd = `curl -fsSL ${origin}/install.sh | sh`;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function copyInstall() {
    try {
      await navigator.clipboard.writeText(installCmd);
      setCliCopied(true);
      setTimeout(() => setCliCopied(false), 1400);
    } catch {}
  }

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {}
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        copy();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="logo" aria-hidden>
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path d="M6 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 17h6" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
          remove-shitty-naming
        </div>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle light / dark mode">
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>
      </header>

      <main className="main">
        <section className="hero">
          <h1>
            Messy title in.
            <br />
            <span className="muted">Clean name out.</span>
          </h1>
          <p className="lead">
            Paste anything — it&apos;s turned into a lowercase, underscore-separated name, live.
            Nothing is stored or sent anywhere.
          </p>
        </section>

        <section className="card">
          <div className="field">
            <div className="field-head">
              <label htmlFor="input">Input</label>
              {input && (
                <button className="text-btn" onClick={() => setInput("")}>
                  Clear
                </button>
              )}
            </div>
            <textarea
              id="input"
              autoFocus
              rows={3}
              spellCheck={false}
              placeholder="Paste your title here…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="divider" aria-hidden>
            <span>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </span>
          </div>

          <div className="field">
            <div className="field-head">
              <label htmlFor="output">Output</label>
              {output && <span className="count">{output.length} chars</span>}
            </div>
            <div className={`output ${output ? "" : "empty"}`}>
              <output id="output" aria-live="polite">
                {output || "—"}
              </output>
              <button className={`copy-btn ${copied ? "done" : ""}`} onClick={copy} disabled={!output}>
                {copied ? (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5 9-10" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="11" height="11" rx="2" />
                      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <ul className="rules">
          <li><code>Aa</code> → <code>aa</code></li>
          <li><code>ä ö ü ß</code> → <code>ae oe ue ss</code></li>
          <li><code>é</code> → <code>e</code></li>
          <li>spaces &amp; symbols → <code>_</code></li>
          <li>hyphens in words stay</li>
          <li><kbd>⌘</kbd> <kbd>Enter</kbd> to copy</li>
        </ul>

        <section className="cli">
          <div className="cli-head">
            <h2>Whole folders? Use the CLI.</h2>
            <p>
              <code>rsn</code> renames every file and folder in a directory with the same rules —
              macOS, no dependencies, preview before anything changes.
            </p>
          </div>
          <div className="terminal">
            <div className="terminal-row">
              <code className="cmd">
                <span className="prompt">$</span> {installCmd}
              </code>
              <button className={`copy-btn small ${cliCopied ? "done" : ""}`} onClick={copyInstall}>
                {cliCopied ? "Copied" : "Copy"}
              </button>
            </div>
            <code className="cmd dim">
              <span className="prompt">$</span> rsn ~/Documents/messy-folder
            </code>
          </div>
        </section>
      </main>
    </div>
  );
}
