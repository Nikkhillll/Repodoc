"use client";

import { useState, useEffect, useRef } from "react";

// ─── Spike Mark SVG (brand glyph) ───────────────────────────────────────────
function SpikeMark({ size = 24, color = "currentColor" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
        fill={color}
      />
    </svg>
  );
}

// ─── Processing Steps ────────────────────────────────────────────────────────
const PROCESSING_STEPS = [
  { label: "Connecting to GitHub", icon: "🔗" },
  { label: "Reading repository structure", icon: "📂" },
  { label: "Analyzing README & config files", icon: "📄" },
  { label: "Consulting the AI model", icon: "✨" },
  { label: "Assembling your explanation", icon: "🧩" },
];

function ProcessingState({ currentStep }) {
  return (
    <div className="slide-up" style={{ width: "100%", maxWidth: 560 }}>
      <div className="card" style={{ padding: "var(--space-xl)" }}>
        <p
          className="caption-uppercase"
          style={{
            color: "var(--muted)",
            marginBottom: "var(--space-lg)",
          }}
        >
          Analyzing Repository
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          {PROCESSING_STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isComplete = i < currentStep;
            const isPending = i > currentStep;

            return (
              <div
                key={i}
                className={isActive ? "fade-in" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-sm)",
                  opacity: isPending ? 0.3 : 1,
                  transition: "opacity 0.3s ease",
                }}
              >
                <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>
                  {isComplete ? "✓" : step.icon}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 15,
                    fontWeight: isActive ? 500 : 400,
                    color: isComplete
                      ? "var(--success)"
                      : isActive
                      ? "var(--ink)"
                      : "var(--muted)",
                  }}
                >
                  {step.label}
                </span>
                {isActive && (
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginLeft: "auto",
                    }}
                  >
                    <span className="processing-dot" />
                    <span className="processing-dot" />
                    <span className="processing-dot" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Result Display ──────────────────────────────────────────────────────────
function ResultView({ analysis }) {
  const techStack = safeParseJSON(analysis.techStack);
  const gettingStarted = safeParseJSON(analysis.gettingStarted);
  const readmeSuggestions = safeParseJSON(analysis.readmeSuggestions);

  return (
    <div className="slide-up" style={{ width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-sm)",
          marginBottom: "var(--space-lg)",
        }}
      >
        <SpikeMark size={20} color="var(--primary)" />
        <a
          href={analysis.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--primary)",
            textDecoration: "none",
          }}
        >
          {analysis.owner}/{analysis.repoName}
        </a>
        <span className="body-sm" style={{ color: "var(--muted-soft)" }}>
          · analyzed {formatTimeAgo(analysis.createdAt)}
        </span>
      </div>

      {/* Summary */}
      <section style={{ marginBottom: "var(--space-xxl)" }}>
        <h2
          className="display-md"
          style={{ marginBottom: "var(--space-md)" }}
        >
          Overview
        </h2>
        <p
          className="body-md"
          style={{
            color: "var(--body)",
            maxWidth: 720,
            lineHeight: 1.7,
          }}
        >
          {analysis.summary}
        </p>
      </section>

      {/* Tech Stack */}
      <section style={{ marginBottom: "var(--space-xxl)" }}>
        <h3
          className="title-md"
          style={{
            color: "var(--ink)",
            marginBottom: "var(--space-md)",
          }}
        >
          Tech Stack
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--space-xs)",
          }}
        >
          {techStack.map((tech, i) => (
            <span key={i} className="badge">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section style={{ marginBottom: "var(--space-xxl)" }}>
        <h3
          className="title-md"
          style={{
            color: "var(--ink)",
            marginBottom: "var(--space-md)",
          }}
        >
          Architecture
        </h3>
        <div className="code-window">
          <div className="code-window-header">
            <span className="code-window-dot" style={{ background: "#ff5f56" }} />
            <span className="code-window-dot" style={{ background: "#ffbd2e" }} />
            <span className="code-window-dot" style={{ background: "#27c93f" }} />
            <span
              style={{
                marginLeft: 8,
                fontSize: 12,
                color: "var(--on-dark-soft)",
                fontFamily: "var(--font-body)",
              }}
            >
              architecture.md
            </span>
          </div>
          <div className="code-window-body">
            {analysis.architecture}
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section style={{ marginBottom: "var(--space-xxl)" }}>
        <h3
          className="title-md"
          style={{
            color: "var(--ink)",
            marginBottom: "var(--space-md)",
          }}
        >
          Getting Started
        </h3>
        <ol
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          {gettingStarted.map((step, i) => (
            <li
              key={i}
              className="card"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-md)",
                padding: "var(--space-md) var(--space-lg)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  minWidth: 28,
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "var(--on-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {i + 1}
              </span>
              <span
                className="body-md"
                style={{ color: "var(--body)", paddingTop: 3 }}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* README Suggestions */}
      <section style={{ marginBottom: "var(--space-xl)" }}>
        <h3
          className="title-md"
          style={{
            color: "var(--ink)",
            marginBottom: "var(--space-md)",
          }}
        >
          README Improvement Ideas
        </h3>
        <div className="card-dark" style={{ padding: "var(--space-lg)" }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            {readmeSuggestions.map((suggestion, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "var(--space-sm)",
                }}
              >
                <span
                  style={{
                    color: "var(--accent-amber)",
                    fontSize: 16,
                    lineHeight: 1.55,
                  }}
                >
                  →
                </span>
                <span
                  className="body-sm"
                  style={{ color: "var(--on-dark-soft)", lineHeight: 1.6 }}
                >
                  {suggestion}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

// ─── Recent Analyses List ────────────────────────────────────────────────────
function RecentList({ analyses, onSelect, activeId }) {
  if (!analyses.length) return null;

  return (
    <section style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-xs)",
          marginBottom: "var(--space-md)",
        }}
      >
        <h3
          className="title-sm"
          style={{ color: "var(--ink)", margin: 0 }}
        >
          Recently Analyzed
        </h3>
        <span className="badge-coral" style={{ fontSize: 11 }}>
          {analyses.length}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xs)",
        }}
      >
        {analyses.map((a) => (
          <button
            key={a.id}
            onClick={() => onSelect(a)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "var(--space-sm) var(--space-md)",
              background:
                activeId === a.id
                  ? "var(--surface-cream-strong)"
                  : "var(--canvas)",
              border: `1px solid ${
                activeId === a.id ? "var(--primary)" : "var(--hairline)"
              }`,
              borderRadius: "var(--rounded-md)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-xs)",
                overflow: "hidden",
              }}
            >
              <SpikeMark
                size={14}
                color={
                  activeId === a.id ? "var(--primary)" : "var(--muted-soft)"
                }
              />
              <span
                className="title-sm"
                style={{
                  color: "var(--ink)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {a.owner}/{a.repoName}
              </span>
            </div>
            <span
              className="body-sm"
              style={{
                color: "var(--muted-soft)",
                whiteSpace: "nowrap",
                marginLeft: "var(--space-md)",
                flexShrink: 0,
              }}
            >
              {formatTimeAgo(a.createdAt)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Error Display ───────────────────────────────────────────────────────────
function ErrorCard({ message, onDismiss }) {
  return (
    <div
      className="fade-in"
      style={{
        width: "100%",
        maxWidth: 560,
        background: "rgba(198, 69, 69, 0.06)",
        border: "1px solid rgba(198, 69, 69, 0.2)",
        borderRadius: "var(--rounded-lg)",
        padding: "var(--space-lg)",
        display: "flex",
        alignItems: "flex-start",
        gap: "var(--space-sm)",
      }}
    >
      <span style={{ fontSize: 20, lineHeight: 1 }}>⚠</span>
      <div style={{ flex: 1 }}>
        <p
          className="title-sm"
          style={{ color: "var(--error)", marginBottom: 4 }}
        >
          Something went wrong
        </p>
        <p className="body-sm" style={{ color: "var(--body)", margin: 0 }}>
          {message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted)",
          fontSize: 18,
          padding: 4,
          lineHeight: 1,
        }}
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function safeParseJSON(val) {
  if (Array.isArray(val)) return val;
  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
}

function formatTimeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  // Fetch recent analyses on mount
  useEffect(() => {
    fetchRecent();
  }, []);

  async function fetchRecent() {
    try {
      const res = await fetch("/api/analyze");
      if (res.ok) {
        const data = await res.json();
        setRecentAnalyses(data);
      }
    } catch {
      // silent fail for recent list
    }
  }

  // Advance processing step during loading
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev < PROCESSING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!repoUrl.trim() || loading) return;

    setLoading(true);
    setProcessingStep(0);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "An unexpected error occurred.");
        return;
      }

      setResult(data);
      setRepoUrl("");
      fetchRecent();

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectRecent(analysis) {
    setResult(analysis);
    setError(null);
    setLoading(false);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <>
      {/* ── Top Navigation ─────────────────────────────────────────── */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: 64,
          background: "var(--canvas)",
          borderBottom: "1px solid var(--hairline)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 var(--space-xl)",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(250, 249, 245, 0.9)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-xs)",
          }}
        >
          <SpikeMark size={22} color="var(--ink)" />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 500,
              color: "var(--ink)",
              letterSpacing: "-0.5px",
            }}
          >
            RepoDoc
          </span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
          style={{
            fontSize: 13,
            height: 36,
            padding: "8px 16px",
            textDecoration: "none",
          }}
        >
          GitHub ↗
        </a>
      </nav>

      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--canvas)",
          padding: "var(--space-section) var(--space-xl) var(--space-xxl)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            className="badge-coral"
            style={{ marginBottom: "var(--space-lg)" }}
          >
            AI-Powered
          </div>

          <h1
            className="display-xl"
            style={{
              marginBottom: "var(--space-lg)",
              maxWidth: 640,
            }}
          >
            Understand any repository in seconds
          </h1>

          <p
            className="body-md"
            style={{
              color: "var(--body)",
              maxWidth: 520,
              marginBottom: "var(--space-xxl)",
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Paste a public GitHub URL. Get a structured breakdown — what it does,
            how it's built, and how to get started. No more deciphering
            unfamiliar codebases alone.
          </p>

          {/* ── Input Form ───────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: 560,
              display: "flex",
              gap: "var(--space-xs)",
            }}
          >
            <input
              ref={inputRef}
              type="url"
              className="input"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={loading}
              style={{
                flex: 1,
                height: 48,
                fontSize: 15,
                padding: "12px 16px",
              }}
              id="repo-url-input"
              aria-label="GitHub repository URL"
            />
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !repoUrl.trim()}
              style={{
                height: 48,
                padding: "12px 24px",
                fontSize: 15,
                whiteSpace: "nowrap",
              }}
              id="analyze-button"
            >
              {loading ? "Analyzing…" : "Analyze Repo"}
            </button>
          </form>
        </div>
      </section>

      {/* ── Processing / Error / Result ────────────────────────────── */}
      <section
        ref={resultRef}
        style={{
          background: "var(--canvas)",
          padding: "0 var(--space-xl) var(--space-section)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {loading && <ProcessingState currentStep={processingStep} />}

        {error && !loading && (
          <ErrorCard message={error} onDismiss={() => setError(null)} />
        )}

        {result && !loading && (
          <div style={{ width: "100%", maxWidth: 800 }}>
            <ResultView analysis={result} />
          </div>
        )}
      </section>

      {/* ── Recently Analyzed ──────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-soft)",
          padding: "var(--space-xxl) var(--space-xl)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 700 }}>
          <RecentList
            analyses={recentAnalyses}
            onSelect={handleSelectRecent}
            activeId={result?.id}
          />
          {recentAnalyses.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "var(--space-xxl) 0",
              }}
            >
              <SpikeMark size={32} color="var(--hairline)" />
              <p
                className="body-md"
                style={{
                  color: "var(--muted)",
                  marginTop: "var(--space-md)",
                }}
              >
                No repos analyzed yet. Paste a URL above to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Band ───────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--primary)",
          padding: "var(--space-section) var(--space-xl)",
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600 }}>
          <h2
            className="display-sm"
            style={{
              color: "var(--on-primary)",
              marginBottom: "var(--space-md)",
            }}
          >
            Ready to explore a new codebase?
          </h2>
          <p
            className="body-md"
            style={{
              color: "rgba(255,255,255,0.85)",
              marginBottom: "var(--space-lg)",
            }}
          >
            Just paste any public GitHub repository URL and let RepoDoc do the
            heavy lifting.
          </p>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => inputRef.current?.focus(), 500);
            }}
            className="btn-secondary"
            style={{
              background: "var(--on-primary)",
              color: "var(--primary)",
              border: "none",
              fontWeight: 500,
            }}
          >
            Try it now ↑
          </button>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "var(--surface-dark)",
          padding: "var(--space-xxl) var(--space-xl)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-md)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-xs)",
          }}
        >
          <SpikeMark size={16} color="var(--on-dark-soft)" />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              color: "var(--on-dark)",
              letterSpacing: "-0.3px",
            }}
          >
            RepoDoc
          </span>
        </div>
        <p
          className="body-sm"
          style={{
            color: "var(--on-dark-soft)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Built as a portfolio project · Powered by GitHub Models
        </p>
      </footer>
    </>
  );
}
