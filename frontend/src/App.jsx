import { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Shield, ShieldAlert, ShieldX, AlertTriangle, Lock, Globe, FileWarning, Link2 } from "lucide-react";

/* ─── Matrix Rain Background ─── */
const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1).map(() => Math.random() * -100);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff9f";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.globalAlpha = Math.random() * 0.5 + 0.1;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        ctx.globalAlpha = 1;
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);
    return () => { clearInterval(interval); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, opacity: 0.3 }} />;
};

/* ─── Floating Code Snippets ─── */
const codeSnippets = ["GET /api/phish", "SSL: INVALID", "DNS: SPOOFED", "if (url.sus)", "alert('pwned')", "chmod 777", "nmap -sS", "SELECT * FROM", "DROP TABLE", "0xDEADBEEF", "sudo rm -rf", "ping flood"];

const FloatingCode = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
  <motion.span
    className="absolute text-xs whitespace-nowrap"
    style={{ left: `${x}%`, top: `${y}%`, fontFamily: "'Share Tech Mono', monospace", color: "rgba(0,255,159,0.25)" }}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: [0, 0.6, 0], y: [10, -20, -40] }}
    transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: 2 }}
  >
    {codeSnippets[Math.floor(Math.random() * codeSnippets.length)]}
  </motion.span>
);

/* ─── Hacker Scene ─── */
const HackerScene = () => {
  const [screenText, setScreenText] = useState("");
  const terminalLines = ["> scanning network...", "> analyzing packets...", "> checking SSL certs...", "> running AI model...", "> threat detected!", "> quarantining...", "> system secure.", "> _"];

  useEffect(() => {
    let lineIdx = 0, charIdx = 0, current = "";
    const interval = setInterval(() => {
      if (lineIdx >= terminalLines.length) { lineIdx = 0; current = ""; }
      const line = terminalLines[lineIdx];
      if (charIdx <= line.length) { setScreenText(current + line.slice(0, charIdx) + "█"); charIdx++; }
      else { current += line + "\n"; lineIdx++; charIdx = 0; }
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const floats = Array.from({ length: 8 }, (_, i) => ({ delay: i * 1.2, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }));

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 400 }}>
      {floats.map((p, i) => <FloatingCode key={i} {...p} />)}
      <motion.div className="relative" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
        <svg viewBox="0 0 300 350" style={{ width: "clamp(16rem, 20vw, 20rem)", height: "auto", animation: "float 3s ease-in-out infinite" }}>
          <ellipse cx="150" cy="320" rx="80" ry="30" fill="#111" />
          <path d="M90 200 Q90 320 150 320 Q210 320 210 200 Z" fill="#111" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.3" />
          <path d="M85 200 Q85 120 150 100 Q215 120 215 200 Z" fill="#0d0d0d" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.3" />
          <ellipse cx="150" cy="170" rx="35" ry="40" fill="#0a0a0a" />
          <motion.ellipse cx="138" cy="162" rx="5" ry="3" fill="#00ff9f" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
          <motion.ellipse cx="162" cy="162" rx="5" ry="3" fill="#00ff9f" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
          <rect x="100" y="260" width="100" height="6" rx="2" fill="#1a1a1a" stroke="#00ff9f" strokeWidth="0.5" strokeOpacity="0.4" />
          <motion.g animate={{ opacity: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity }}>
            <rect x="110" y="220" width="80" height="42" rx="3" fill="#0a1a0f" stroke="#00ff9f" strokeWidth="1" strokeOpacity="0.6" />
            <rect x="110" y="220" width="80" height="42" rx="3" fill="url(#screenGlow)" />
          </motion.g>
          <foreignObject x="114" y="224" width="72" height="34">
            <div style={{ fontSize: 4, fontFamily: "monospace", color: "#00ff9f", lineHeight: "6px", overflow: "hidden", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{screenText}</div>
          </foreignObject>
          <motion.g animate={{ y: [0, -1, 0] }} transition={{ duration: 0.3, repeat: Infinity }}>
            <ellipse cx="125" cy="258" rx="10" ry="5" fill="#0d0d0d" />
            <ellipse cx="175" cy="258" rx="10" ry="5" fill="#0d0d0d" />
          </motion.g>
          <defs>
            <radialGradient id="screenGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#00ff9f" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#00ff9f" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 192, height: 32, background: "rgba(0,255,159,0.1)", borderRadius: "50%", filter: "blur(16px)" }} />
      </motion.div>
    </div>
  );
};

/* ─── Terminal Logs ─── */
const logMessages = ["[SYS] Initializing AI scanner...", "[NET] Resolving DNS records...", "[SSL] Checking certificate validity...", "[AI ] Running phishing detection model v3.7...", "[DB ] Cross-referencing threat database...", "[NET] Analyzing redirect chain...", "[AI ] Extracting URL features...", "[AI ] Computing risk vector...", "[SYS] Generating threat report..."];

const TerminalLogs = ({ onComplete }: { onComplete: () => void }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (lineIndex >= logMessages.length) { onComplete(); return; }
    const msg = logMessages[lineIndex];
    let charIdx = 0;
    const interval = setInterval(() => {
      if (charIdx <= msg.length) { setCurrentLine(msg.slice(0, charIdx)); charIdx++; }
      else { setLines(p => [...p, msg]); setCurrentLine(""); setLineIndex(p => p + 1); clearInterval(interval); }
    }, 25);
    return () => clearInterval(interval);
  }, [lineIndex, onComplete]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ border: "1px solid #1a3a2a", borderRadius: 8, padding: 16, background: "rgba(18,18,18,0.5)", fontFamily: "'Share Tech Mono', monospace", fontSize: 12, maxHeight: 240, overflowY: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: "rgba(0,255,159,0.5)" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff9f", animation: "pulse 2s infinite" }} />
        <span>AI SCANNER TERMINAL</span>
      </div>
      {lines.map((l, i) => <div key={i} style={{ color: "rgba(0,255,159,0.4)", lineHeight: "24px" }}>{l}</div>)}
      {currentLine && (
        <div style={{ color: "#00ff9f", lineHeight: "24px" }}>
          {currentLine}<span style={{ display: "inline-block", width: 8, height: 16, background: "#00ff9f", marginLeft: 2, animation: "blink 1s step-end infinite" }} />
        </div>
      )}
    </motion.div>
  );
};

/* ─── Scan Results ─── */
interface ScanResult { riskScore: number; verdict: "safe" | "suspicious" | "dangerous"; flags: string[]; }

const verdictConfig = {
  safe: { icon: Shield, label: "SAFE", color: "#00ff9f", glow: "rgba(0,255,159,0.2)" },
  suspicious: { icon: ShieldAlert, label: "SUSPICIOUS", color: "#ffcc00", glow: "rgba(255,204,0,0.2)" },
  dangerous: { icon: ShieldX, label: "DANGEROUS", color: "#ff4444", glow: "rgba(255,68,68,0.2)" },
};

const flagIcons: Record<string, React.ElementType> = { "Suspicious TLD": Globe, "No SSL certificate": Lock, "URL shortener detected": Link2, "Phishing keywords": FileWarning, "Domain age < 30 days": AlertTriangle, "Homograph attack": AlertTriangle, "Redirects detected": Link2, "Blacklisted domain": ShieldX };

const ScanResults = ({ result }: { result: ScanResult }) => {
  const cfg = verdictConfig[result.verdict];
  const Icon = cfg.icon;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      style={{ border: `1px solid ${cfg.color}33`, borderRadius: 8, padding: 24, background: `${cfg.color}0a`, boxShadow: `0 0 15px ${cfg.glow}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <Icon style={{ width: 32, height: 32, color: cfg.color }} />
        <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 24, fontWeight: 700, letterSpacing: "0.1em", color: cfg.color }}>{cfg.label}</span>
      </div>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 14 }}>
          <span style={{ color: "rgba(0,255,159,0.4)" }}>Risk Score</span>
          <span style={{ color: cfg.color }}>{result.riskScore}/100</span>
        </div>
        <div style={{ width: "100%", height: 12, background: "#1a1a1a", borderRadius: 999, overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${result.riskScore}%` }} transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ height: "100%", borderRadius: 999, background: cfg.color, boxShadow: `0 0 10px ${cfg.glow}` }} />
        </div>
      </div>
      {result.flags.length > 0 && (
        <div>
          <p style={{ fontSize: 14, color: "rgba(0,255,159,0.4)", marginBottom: 8, fontFamily: "'Share Tech Mono', monospace" }}>Flags Detected:</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {result.flags.map((flag, i) => {
              const FlagIcon = flagIcons[flag] || AlertTriangle;
              return (
                <motion.li key={flag} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.15 }}
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontFamily: "'Share Tech Mono', monospace", color: "rgba(0,255,159,0.5)", marginBottom: 8 }}>
                  <FlagIcon style={{ width: 16, height: 16, color: cfg.color }} />
                  {flag}
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

/* ─── URL Analyzer Logic ─── */
const suspiciousKeywords = ["login", "verify", "account", "secure", "update", "bank", "paypal", "password"];
const suspiciousTLDs = [".xyz", ".tk", ".ml", ".ga", ".cf", ".top", ".buzz", ".club"];

function analyzeUrl(url: string): ScanResult {
  let score = 0;
  const flags: string[] = [];
  const lower = url.toLowerCase();
  if (!lower.startsWith("https://")) { score += 25; flags.push("No SSL certificate"); }
  for (const tld of suspiciousTLDs) { if (lower.includes(tld)) { score += 20; flags.push("Suspicious TLD"); break; } }
  for (const kw of suspiciousKeywords) { if (lower.includes(kw)) { score += 15; flags.push("Phishing keywords"); break; } }
  if (lower.includes("bit.ly") || lower.includes("tinyurl") || lower.includes("t.co")) { score += 15; flags.push("URL shortener detected"); }
  if ((url.match(/-/g) || []).length > 3) { score += 10; flags.push("Homograph attack"); }
  if ((url.match(/\./g) || []).length > 4) { score += 10; flags.push("Redirects detected"); }
  if (url.length > 75) { score += 10; flags.push("Domain age < 30 days"); }
  score = Math.min(score, 100);
  const verdict: ScanResult["verdict"] = score <= 25 ? "safe" : score <= 60 ? "suspicious" : "dangerous";
  return { riskScore: score, verdict, flags };
}

/* ─── Main App ─── */
const App = () => {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);

  const handleScan = useCallback(() => {
    if (!url.trim()) return;
    setResult(null);
    setScanning(true);
  }, [url]);

  const handleScanComplete = useCallback(() => {
    setScanning(false);
    setResult(analyzeUrl(url));
  }, [url]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;900&family=Share+Tech+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; color: #00ff9f; font-family: 'Share Tech Mono', monospace; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes pulseNeon {
          0%, 100% { box-shadow: 0 0 10px rgba(0,255,159,0.5), 0 0 40px rgba(0,255,159,0.2); }
          50% { box-shadow: 0 0 20px rgba(0,255,159,0.8), 0 0 60px rgba(0,255,159,0.4); }
        }
        .scanline-overlay {
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,159,0.03) 2px, rgba(0,255,159,0.03) 4px);
        }
        input::placeholder { color: rgba(0,255,159,0.3); }
        input:focus { outline: none; border-color: #00ff9f; box-shadow: 0 0 10px rgba(0,255,159,0.5), 0 0 40px rgba(0,255,159,0.2), inset 0 0 20px rgba(0,255,159,0.05); }
      `}</style>

      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
        <MatrixRain />
        <div className="scanline-overlay" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 10, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: 32 }}>
          {/* Mobile hacker */}
          <div style={{ display: "block", width: "100%", maxWidth: 320 }} className="mobile-hacker">
            <HackerScene />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 64, width: "100%", maxWidth: 1200 }}>
            {/* Left: Detector */}
            <div style={{ flex: 1, maxWidth: 560, width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <Shield style={{ width: 32, height: 32, color: "#00ff9f", filter: "drop-shadow(0 0 8px rgba(0,255,159,0.6))" }} />
                    <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: "#00ff9f", letterSpacing: "0.1em", textShadow: "0 0 7px rgba(0,255,159,0.8), 0 0 20px rgba(0,255,159,0.4)" }}>
                      AI Phishing Detector
                    </h1>
                  </div>
                  <p style={{ color: "rgba(0,255,159,0.4)", fontSize: 14 }}>Analyze URLs for threats in real-time</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <div style={{ position: "relative", marginBottom: 12 }}>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleScan()}
                      placeholder="Enter suspicious URL..."
                      style={{ width: "100%", padding: "16px 48px 16px 20px", background: "#121212", border: "2px solid #1a3a2a", borderRadius: 8, fontFamily: "'Share Tech Mono', monospace", fontSize: 16, color: "#00ff9f", transition: "all 0.3s" }} />
                    <Search style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, color: "rgba(0,255,159,0.3)" }} />
                  </div>
                  <motion.button onClick={handleScan} disabled={scanning || !url.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{
                      width: "100%", padding: 16, borderRadius: 8, border: "none", fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: scanning || !url.trim() ? "not-allowed" : "pointer", transition: "all 0.3s",
                      background: scanning || !url.trim() ? "#1a1a1a" : "#00ff9f",
                      color: scanning || !url.trim() ? "rgba(0,255,159,0.3)" : "#0a0a0a",
                      animation: scanning || !url.trim() ? "none" : "pulseNeon 2s ease-in-out infinite",
                    }}>
                    {scanning ? "⟳ Scanning..." : "⚡ Scan Now"}
                  </motion.button>
                </motion.div>

                {scanning && <TerminalLogs onComplete={handleScanComplete} />}
                {result && !scanning && <ScanResults result={result} />}
              </div>
            </div>

            {/* Right: Hacker (desktop) */}
            <div className="desktop-hacker" style={{ flex: 1, maxWidth: 480, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HackerScene />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .desktop-hacker { display: none !important; }
        }
        @media (min-width: 1024px) {
          .mobile-hacker { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default App;

