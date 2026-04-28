// tweaks.js — adds a "Tweaks" panel that swaps theme/typography on every page.
// Vanilla JS; no React. Loads on every page that includes it.

(function () {
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "theme": "cream",
    "accent": "terracotta",
    "headingFont": "instrument",
    "bodyFont": "pretendard",
    "density": "regular"
  }/*EDITMODE-END*/;

  // ── Theme palettes ─────────────────────────────────────
  const THEMES = {
    cream:  { bg:"#f5f3ee", bgSoft:"#ebe8e0", paper:"#fbfaf6", ink:"#1a1a1a", inkSoft:"#4a4a48", inkMute:"#8a8780", line:"#d8d4c8", lineSoft:"#e3dfd4" },
    paper:  { bg:"#fafaf7", bgSoft:"#f0efe9", paper:"#ffffff", ink:"#141414", inkSoft:"#444",    inkMute:"#8a8a86", line:"#e2e0d6", lineSoft:"#eeece4" },
    night:  { bg:"#15151a", bgSoft:"#1d1d24", paper:"#1a1a20", ink:"#ece9e0", inkSoft:"#b6b3a8", inkMute:"#7c7a72", line:"#2c2c34", lineSoft:"#222229" },
    mono:   { bg:"#f1f1ee", bgSoft:"#e6e6e2", paper:"#fcfcfa", ink:"#0d0d0d", inkSoft:"#3a3a3a", inkMute:"#7d7d7a", line:"#cfcfc8", lineSoft:"#dcdcd6" }
  };
  const ACCENTS = {
    terracotta: "oklch(0.62 0.10 45)",
    cobalt:     "oklch(0.55 0.14 250)",
    forest:     "oklch(0.50 0.08 150)",
    lime:       "oklch(0.78 0.16 110)",
    plum:       "oklch(0.45 0.12 330)"
  };
  const HEADING_FONTS = {
    instrument: '"Instrument Serif", "Cormorant Garamond", "Times New Roman", serif',
    fraunces:   '"Fraunces", "Instrument Serif", serif',
    pretendard: '"Pretendard","Pretendard Variable",sans-serif',
    mono:       '"JetBrains Mono","IBM Plex Mono",monospace'
  };
  const BODY_FONTS = {
    pretendard: '"Pretendard","Pretendard Variable",-apple-system,sans-serif',
    inter:      '"Inter", "Pretendard", sans-serif',
    mono:       '"JetBrains Mono","IBM Plex Mono",monospace'
  };
  const DENSITY = {
    compact: { padScale: 0.78, fontScale: 0.94 },
    regular: { padScale: 1,    fontScale: 1 },
    comfy:   { padScale: 1.18, fontScale: 1.06 }
  };

  let state = { ...TWEAK_DEFAULTS };
  // Try to load from sessionStorage so changes persist across navigation
  try {
    const stored = sessionStorage.getItem("tweaks");
    if (stored) state = { ...state, ...JSON.parse(stored) };
  } catch (e) {}

  function applyTheme() {
    const t = THEMES[state.theme] || THEMES.cream;
    const r = document.documentElement.style;
    r.setProperty("--bg", t.bg);
    r.setProperty("--bg-soft", t.bgSoft);
    r.setProperty("--paper", t.paper);
    r.setProperty("--ink", t.ink);
    r.setProperty("--ink-soft", t.inkSoft);
    r.setProperty("--ink-mute", t.inkMute);
    r.setProperty("--line", t.line);
    r.setProperty("--line-soft", t.lineSoft);
    r.setProperty("--accent", ACCENTS[state.accent] || ACCENTS.terracotta);
    r.setProperty("--serif", HEADING_FONTS[state.headingFont] || HEADING_FONTS.instrument);
    r.setProperty("--sans", BODY_FONTS[state.bodyFont] || BODY_FONTS.pretendard);
    const d = DENSITY[state.density] || DENSITY.regular;
    r.setProperty("--pad", `clamp(${20*d.padScale}px, ${4*d.padScale}vw, ${56*d.padScale}px)`);
    document.body.style.fontSize = (16 * d.fontScale) + "px";
  }

  function persist() {
    try { sessionStorage.setItem("tweaks", JSON.stringify(state)); } catch (e) {}
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: state }, "*");
    } catch (e) {}
  }

  function set(k, v) {
    state[k] = v;
    applyTheme();
    persist();
  }

  // ── Panel UI ───────────────────────────────────────────
  let panel = null;
  function buildPanel() {
    if (panel) return panel;
    panel = document.createElement("div");
    panel.className = "tweaks-panel";
    panel.innerHTML = `
      <div class="tw-hd">
        <b>Tweaks</b>
        <button class="tw-x" aria-label="Close">×</button>
      </div>
      <div class="tw-body">
        ${section("Theme")}
        ${radio("theme", ["cream","paper","night","mono"])}
        ${section("Accent")}
        ${swatches("accent", ACCENTS)}
        ${section("Heading font")}
        ${radio("headingFont", ["instrument","fraunces","pretendard","mono"])}
        ${section("Body font")}
        ${radio("bodyFont", ["pretendard","inter","mono"])}
        ${section("Density")}
        ${radio("density", ["compact","regular","comfy"])}
      </div>
    `;
    document.body.appendChild(panel);

    panel.querySelector(".tw-x").addEventListener("click", () => deactivate());
    panel.querySelectorAll("[data-tw-radio]").forEach(group => {
      const key = group.getAttribute("data-tw-radio");
      group.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          const v = btn.getAttribute("data-v");
          set(key, v);
          group.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
        });
      });
    });
    panel.querySelectorAll("[data-tw-swatch]").forEach(group => {
      const key = group.getAttribute("data-tw-swatch");
      group.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
          const v = btn.getAttribute("data-v");
          set(key, v);
          group.querySelectorAll("button").forEach(b => b.classList.toggle("active", b === btn));
        });
      });
    });
    syncPanelActive();
    return panel;
  }
  function syncPanelActive() {
    if (!panel) return;
    panel.querySelectorAll("[data-tw-radio]").forEach(group => {
      const key = group.getAttribute("data-tw-radio");
      group.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.getAttribute("data-v") === state[key]));
    });
    panel.querySelectorAll("[data-tw-swatch]").forEach(group => {
      const key = group.getAttribute("data-tw-swatch");
      group.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.getAttribute("data-v") === state[key]));
    });
  }

  function section(label) {
    return `<div class="tw-section">${label}</div>`;
  }
  function radio(key, options) {
    return `<div class="tw-radio" data-tw-radio="${key}">
      ${options.map(o => `<button data-v="${o}">${o}</button>`).join("")}
    </div>`;
  }
  function swatches(key, map) {
    return `<div class="tw-swatch" data-tw-swatch="${key}">
      ${Object.keys(map).map(k => `<button data-v="${k}" title="${k}" style="--c:${map[k]}"></button>`).join("")}
    </div>`;
  }

  // ── Activate / deactivate ──────────────────────────────
  function activate() {
    buildPanel();
    panel.classList.add("on");
  }
  function deactivate() {
    if (!panel) return;
    panel.classList.remove("on");
    try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
  }

  // Listen first
  window.addEventListener("message", (e) => {
    const t = e.data && e.data.type;
    if (t === "__activate_edit_mode") activate();
    else if (t === "__deactivate_edit_mode") deactivate();
  });
  // Then announce
  try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}

  // Apply theme on load
  applyTheme();

  // ── Inject panel styles ────────────────────────────────
  const css = `
    .tweaks-panel {
      position: fixed; right: 16px; bottom: 16px; z-index: 2147483646;
      width: 240px; max-height: calc(100vh - 32px);
      display: none; flex-direction: column;
      background: rgba(250,249,247,.92);
      color: #1a1a1a;
      backdrop-filter: blur(20px) saturate(140%);
      -webkit-backdrop-filter: blur(20px) saturate(140%);
      border: 1px solid rgba(0,0,0,.08);
      border-radius: 14px;
      box-shadow: 0 18px 48px rgba(0,0,0,.18), 0 0 0 1px rgba(255,255,255,.4) inset;
      font: 11px/1.4 "JetBrains Mono", ui-monospace, monospace;
      overflow: hidden;
    }
    .tweaks-panel.on { display: flex; }
    .tweaks-panel .tw-hd {
      display: flex; justify-content: space-between; align-items: center;
      padding: 10px 10px 10px 14px; border-bottom: 1px solid rgba(0,0,0,.06);
    }
    .tweaks-panel .tw-hd b {
      font-family: "Instrument Serif", serif; font-weight: 400;
      font-size: 16px; font-style: italic; letter-spacing: -0.01em;
    }
    .tweaks-panel .tw-x {
      appearance: none; border: 0; background: transparent;
      width: 22px; height: 22px; border-radius: 6px;
      cursor: pointer; font-size: 16px; color: #666;
    }
    .tweaks-panel .tw-x:hover { background: rgba(0,0,0,.06); color: #000; }
    .tweaks-panel .tw-body {
      padding: 12px 14px 16px; display: flex; flex-direction: column; gap: 8px;
      overflow-y: auto;
    }
    .tweaks-panel .tw-section {
      text-transform: uppercase; letter-spacing: 0.1em; color: #888;
      font-size: 10px; margin: 8px 0 2px;
    }
    .tweaks-panel .tw-radio {
      display: flex; flex-wrap: wrap; gap: 4px;
    }
    .tweaks-panel .tw-radio button {
      flex: 1; min-width: 0;
      appearance: none; border: 1px solid rgba(0,0,0,.12);
      background: transparent; color: #555;
      padding: 6px 8px; border-radius: 6px;
      font: inherit; cursor: pointer;
      text-transform: capitalize;
      transition: all .15s;
    }
    .tweaks-panel .tw-radio button:hover { border-color: #000; color: #000; }
    .tweaks-panel .tw-radio button.active {
      background: #1a1a1a; color: #fff; border-color: #1a1a1a;
    }
    .tweaks-panel .tw-swatch {
      display: flex; gap: 8px;
    }
    .tweaks-panel .tw-swatch button {
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--c); border: 2px solid transparent;
      cursor: pointer; padding: 0;
      box-shadow: 0 0 0 1px rgba(0,0,0,.1);
      transition: transform .15s;
    }
    .tweaks-panel .tw-swatch button:hover { transform: scale(1.1); }
    .tweaks-panel .tw-swatch button.active {
      border-color: #fff; box-shadow: 0 0 0 2px #1a1a1a;
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();
