(function () {
  "use strict";

  const LS_XI = "chelsea-tactics.xi.v1";
  const LS_NOTES = "chelsea-tactics.notes.v1";
  const LS_WATCH = "chelsea-tactics.watch.v1";
  const LS_CHECKS = "chelsea-tactics.checks.v1";

  /* ---------- EXAMPLE data only ---------- */
  const SHAPES = {
    "4231": [
      { role: "GK", x: 340, y: 900, name: "Keeper A" },
      { role: "RB", x: 540, y: 760, name: "Right Back" },
      { role: "RCB", x: 420, y: 780, name: "Centre Back R" },
      { role: "LCB", x: 260, y: 780, name: "Centre Back L" },
      { role: "LB", x: 140, y: 760, name: "Left Back" },
      { role: "RDM", x: 420, y: 620, name: "Pivot R" },
      { role: "LDM", x: 260, y: 620, name: "Pivot L" },
      { role: "RW", x: 540, y: 440, name: "Right 10" },
      { role: "CAM", x: 340, y: 460, name: "No.10" },
      { role: "LW", x: 140, y: 440, name: "Left 10" },
      { role: "ST", x: 340, y: 260, name: "Striker" }
    ],
    "433": [
      { role: "GK", x: 340, y: 900, name: "Keeper A" },
      { role: "RB", x: 540, y: 760, name: "Right Back" },
      { role: "RCB", x: 420, y: 780, name: "Centre Back R" },
      { role: "LCB", x: 260, y: 780, name: "Centre Back L" },
      { role: "LB", x: 140, y: 760, name: "Left Back" },
      { role: "RCM", x: 460, y: 580, name: "Mid R" },
      { role: "CDM", x: 340, y: 620, name: "Anchor" },
      { role: "LCM", x: 220, y: 580, name: "Mid L" },
      { role: "RW", x: 540, y: 340, name: "Right Wing" },
      { role: "ST", x: 340, y: 260, name: "Striker" },
      { role: "LW", x: 140, y: 340, name: "Left Wing" }
    ],
    "343": [
      { role: "GK", x: 340, y: 900, name: "Keeper A" },
      { role: "RCB", x: 480, y: 780, name: "CB R" },
      { role: "CB", x: 340, y: 800, name: "CB" },
      { role: "LCB", x: 200, y: 780, name: "CB L" },
      { role: "RWB", x: 580, y: 560, name: "Wing-back R" },
      { role: "RCM", x: 420, y: 600, name: "Mid R" },
      { role: "LCM", x: 260, y: 600, name: "Mid L" },
      { role: "LWB", x: 100, y: 560, name: "Wing-back L" },
      { role: "RW", x: 500, y: 320, name: "Front R" },
      { role: "ST", x: 340, y: 240, name: "Striker" },
      { role: "LW", x: 180, y: 320, name: "Front L" }
    ]
  };

  const FIXTURES = [
    { week: "EXAMPLE W1", label: "Demo Matchweek A", venue: "Stamford Bridge", opp: "Example United", result: "—", home: true },
    { week: "EXAMPLE W2", label: "Demo Matchweek B", venue: "Away Ground", opp: "Sample Town", result: "—", home: false },
    { week: "EXAMPLE W3", label: "Demo Matchweek C", venue: "Stamford Bridge", opp: "Placeholder City", result: "—", home: true },
    { week: "EXAMPLE W4", label: "Demo Matchweek D", venue: "Away Ground", opp: "Fictional Athletic", result: "—", home: false },
    { week: "EXAMPLE W5", label: "Demo Matchweek E", venue: "Stamford Bridge", opp: "Demo Rovers", result: "—", home: true },
    { week: "EXAMPLE W6", label: "Demo Matchweek F", venue: "Away Ground", opp: "Mock Wanderers", result: "—", home: false },
    { week: "EXAMPLE W7", label: "Demo Matchweek G", venue: "Stamford Bridge", opp: "Test Albion", result: "—", home: true },
    { week: "EXAMPLE W8", label: "Demo Matchweek H", venue: "Away Ground", opp: "Sample FC", result: "—", home: false }
  ];

  const HOME_CHECKS = [
    "TV / stream ready before kickoff",
    "Formation board set to preferred EXAMPLE shape",
    "Set-piece play picked for half-time chat",
    "Fan notes open for live scribbles",
    "Wall mode on if casting to the big screen"
  ];

  const DEFAULT_WATCH = [
    { text: "First 15' pressing shape", done: false },
    { text: "Build-up vs high press", done: false },
    { text: "Corner & free-kick routines", done: false },
    { text: "Second-half substitutions", done: false },
    { text: "Late-game game management", done: false }
  ];

  const PLAYS = [
    {
      id: "corner-near",
      title: "EXAMPLE · Near-post flick",
      blurb: "Corner from the right · near-post runner · flick to back post.",
      draw: drawCornerNear
    },
    {
      id: "corner-edge",
      title: "EXAMPLE · Edge-of-box shot",
      blurb: "Short corner · recycle to edge · first-time strike lane.",
      draw: drawCornerEdge
    },
    {
      id: "fk-wall",
      title: "EXAMPLE · Free-kick over wall",
      blurb: "Direct free-kick · whip over wall · far-post dip.",
      draw: drawFreeKick
    },
    {
      id: "fk-cutback",
      title: "EXAMPLE · Wide free-kick cutback",
      blurb: "Wide free-kick · delivery to penalty spot · cutback lane.",
      draw: drawWideFk
    }
  ];

  /* ---------- helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function nextDemoKickoff() {
    const now = new Date();
    const d = new Date(now);
    const day = d.getDay(); // 0 Sun
    let add = (6 - day + 7) % 7;
    if (add === 0) {
      // if already past Saturday 3pm, jump next week
      const today3 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 15, 0, 0);
      if (now >= today3) add = 7;
    }
    d.setDate(d.getDate() + add);
    d.setHours(15, 0, 0, 0);
    return d;
  }

  function pad(n) { return String(n).padStart(2, "0"); }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) { return fallback; }
  }

  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (_) {}
  }

  /* ---------- tabs ---------- */
  function showTab(id) {
    $$(".tab").forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle("on", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $$(".panel").forEach((p) => {
      const on = p.id === "panel-" + id;
      p.classList.toggle("on", on);
      if (on) p.removeAttribute("hidden");
      else p.setAttribute("hidden", "");
    });
    if (id === "setpieces") replayPlay();
    location.hash = id;
  }

  $$(".tab").forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));
  $$("[data-goto]").forEach((b) => b.addEventListener("click", () => showTab(b.dataset.goto)));

  const hash = (location.hash || "").replace("#", "");
  if (["home", "formation", "setpieces", "season", "notes"].includes(hash)) showTab(hash);

  /* ---------- wall / help ---------- */
  $("#btnWall").addEventListener("click", () => {
    document.body.classList.toggle("wall");
  });
  $("#btnHelp").addEventListener("click", () => $("#helpDlg").showModal());

  /* ---------- particles bg ---------- */
  (function particles() {
    const c = $("#bg");
    if (!c) return;
    const ctx = c.getContext("2d");
    let w, h, dots, raf;
    function resize() {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
      dots = Array.from({ length: Math.min(70, Math.floor((w * h) / 22000)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -0.15 - Math.random() * 0.4,
        a: 0.15 + Math.random() * 0.45
      }));
    }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createRadialGradient(w * 0.3, h * 0.15, 0, w * 0.3, h * 0.15, w * 0.55);
      g.addColorStop(0, "rgba(10,91,184,0.22)");
      g.addColorStop(1, "rgba(2,20,40,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.85
          ? `rgba(245,215,110,${d.a})`
          : `rgba(180,210,255,${d.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", resize);
    frame();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    });
  })();

  /* ---------- countdown ---------- */
  const demoKick = nextDemoKickoff();
  const labelEl = $("#demoKickLabel");
  if (labelEl) {
    labelEl.textContent = "DEMO · " + demoKick.toLocaleString("en-US", {
      weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short"
    });
  }
  function tickCountdown() {
    const now = Date.now();
    let ms = Math.max(0, demoKick.getTime() - now);
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    $("#cdD").textContent = pad(d);
    $("#cdH").textContent = pad(h);
    $("#cdM").textContent = pad(m);
    $("#cdS").textContent = pad(sec);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- home checks ---------- */
  (function homeChecks() {
    const ul = $("#homeChecks");
    if (!ul) return;
    const saved = loadJSON(LS_CHECKS, HOME_CHECKS.map(() => false));
    HOME_CHECKS.forEach((text, i) => {
      const li = document.createElement("li");
      const id = "hc-" + i;
      const inp = document.createElement("input");
      inp.type = "checkbox"; inp.id = id; inp.checked = !!saved[i];
      const lab = document.createElement("label");
      lab.htmlFor = id; lab.textContent = text;
      if (inp.checked) lab.classList.add("done");
      inp.addEventListener("change", () => {
        lab.classList.toggle("done", inp.checked);
        const st = HOME_CHECKS.map((_, j) => $("#hc-" + j).checked);
        saveJSON(LS_CHECKS, st);
      });
      li.append(inp, lab);
      ul.appendChild(li);
    });
  })();

  /* ---------- formation board ---------- */
  let xi = loadJSON(LS_XI, null);
  let shapeKey = (xi && xi.shape) || "4231";
  let players = (xi && xi.players) ? xi.players.map((p) => ({ ...p })) : SHAPES[shapeKey].map((p) => ({ ...p }));
  const pitch = $("#pitch");
  const playersG = $("#players");
  const shapeSelect = $("#shapeSelect");
  const xiList = $("#xiList");
  const xiStatus = $("#xiStatus");
  let drag = null;

  if (shapeSelect) shapeSelect.value = shapeKey;

  function renderXIList() {
    if (!xiList) return;
    xiList.innerHTML = "";
    players.forEach((p, i) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${pad(i + 1)}</strong> <span>${p.role}</span> — ${escapeHtml(p.name)}`;
      xiList.appendChild(li);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderPlayers() {
    if (!playersG) return;
    playersG.innerHTML = "";
    players.forEach((p, i) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.classList.add("player-dot");
      g.dataset.idx = String(i);
      g.setAttribute("transform", `translate(${p.x},${p.y})`);

      const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      c.setAttribute("r", "22");
      c.setAttribute("fill", "#034694");
      c.setAttribute("stroke", "#f5d76e");
      c.setAttribute("stroke-width", "2.5");

      const num = document.createElementNS("http://www.w3.org/2000/svg", "text");
      num.setAttribute("text-anchor", "middle");
      num.setAttribute("y", "5");
      num.setAttribute("class", "player-label");
      num.textContent = String(i + 1);

      const role = document.createElementNS("http://www.w3.org/2000/svg", "text");
      role.setAttribute("text-anchor", "middle");
      role.setAttribute("y", "38");
      role.setAttribute("class", "player-role");
      role.textContent = p.role;

      g.append(c, num, role);
      playersG.appendChild(g);
    });
    renderXIList();
  }

  function svgPoint(evt) {
    const pt = pitch.createSVGPoint();
    pt.x = evt.clientX; pt.y = evt.clientY;
    const ctm = pitch.getScreenCTM().inverse();
    return pt.matrixTransform(ctm);
  }

  function onPointerDown(evt) {
    const g = evt.target.closest(".player-dot");
    if (!g) return;
    evt.preventDefault();
    drag = { idx: +g.dataset.idx, id: evt.pointerId };
    g.setPointerCapture(evt.pointerId);
  }
  function onPointerMove(evt) {
    if (!drag || drag.id !== evt.pointerId) return;
    const pt = svgPoint(evt);
    const p = players[drag.idx];
    p.x = Math.max(60, Math.min(620, pt.x));
    p.y = Math.max(70, Math.min(920, pt.y));
    const g = playersG.querySelector(`[data-idx="${drag.idx}"]`);
    if (g) g.setAttribute("transform", `translate(${p.x},${p.y})`);
  }
  function onPointerUp(evt) {
    if (!drag || drag.id !== evt.pointerId) return;
    drag = null;
    renderXIList();
  }
  function onDblClick(evt) {
    const g = evt.target.closest(".player-dot");
    if (!g) return;
    const i = +g.dataset.idx;
    const name = prompt("EXAMPLE player label (not a real squad name):", players[i].name);
    if (name != null && name.trim()) {
      players[i].name = name.trim().slice(0, 28);
      renderPlayers();
    }
  }

  if (pitch) {
    pitch.addEventListener("pointerdown", onPointerDown);
    pitch.addEventListener("pointermove", onPointerMove);
    pitch.addEventListener("pointerup", onPointerUp);
    pitch.addEventListener("pointercancel", onPointerUp);
    pitch.addEventListener("dblclick", onDblClick);
  }

  if (shapeSelect) {
    shapeSelect.addEventListener("change", () => {
      shapeKey = shapeSelect.value;
      players = SHAPES[shapeKey].map((p) => ({ ...p }));
      renderPlayers();
      xiStatus.textContent = "Loaded EXAMPLE " + shapeKey.replace(/(\d)/g, "$1-").replace(/-$/, "") + " shape";
    });
  }
  $("#btnResetShape").addEventListener("click", () => {
    players = SHAPES[shapeKey].map((p) => ({ ...p }));
    renderPlayers();
    xiStatus.textContent = "Shape reset to EXAMPLE defaults";
  });
  $("#btnSaveXI").addEventListener("click", () => {
    saveJSON(LS_XI, { shape: shapeKey, players });
    xiStatus.textContent = "EXAMPLE XI saved locally · " + new Date().toLocaleTimeString();
  });
  $("#btnLoadXI").addEventListener("click", () => {
    const saved = loadJSON(LS_XI, null);
    if (!saved) { xiStatus.textContent = "No saved XI yet"; return; }
    shapeKey = saved.shape || "4231";
    players = (saved.players || []).map((p) => ({ ...p }));
    if (shapeSelect) shapeSelect.value = shapeKey;
    renderPlayers();
    xiStatus.textContent = "Loaded saved EXAMPLE XI";
  });
  renderPlayers();

  /* ---------- set pieces ---------- */
  const setCanvas = $("#setCanvas");
  const setCtx = setCanvas ? setCanvas.getContext("2d") : null;
  const playList = $("#playList");
  const setCaption = $("#setCaption");
  let activePlay = PLAYS[0];
  let animT = 0;
  let animRaf = 0;

  function drawPitchBase(ctx, W, H) {
    ctx.fillStyle = "#0f5a28";
    ctx.fillRect(0, 0, W, H);
    // stripes
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.05)";
      ctx.fillRect((W / 8) * i, 0, W / 8, H);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = 2;
    ctx.strokeRect(24, 24, W - 48, H - 48);
    // penalty area (attacking top)
    ctx.strokeRect(W * 0.28, 24, W * 0.44, H * 0.22);
    ctx.strokeRect(W * 0.38, 24, W * 0.24, H * 0.09);
    ctx.beginPath();
    ctx.arc(W / 2, 24 + H * 0.22, 48, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    // halfway
    ctx.beginPath();
    ctx.moveTo(24, H / 2);
    ctx.lineTo(W - 24, H / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 56, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawArrow(ctx, x1, y1, x2, y2, color, width) {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width || 3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const head = 12;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - head * Math.cos(ang - 0.4), y2 - head * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - head * Math.cos(ang + 0.4), y2 - head * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fill();
  }

  function drawDot(ctx, x, y, label, blue) {
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = blue ? "#034694" : "#f0f4fa";
    ctx.fill();
    ctx.strokeStyle = blue ? "#f5d76e" : "#333";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (label) {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 10px system-ui,sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y + 3);
    }
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawCornerNear(ctx, W, H, t) {
    drawPitchBase(ctx, W, H);
    const corner = { x: W - 36, y: 36 };
    const near = { x: W * 0.58, y: H * 0.14 };
    const back = { x: W * 0.38, y: H * 0.12 };
    drawDot(ctx, corner.x, corner.y, "K", true);
    drawDot(ctx, near.x, near.y, "1", true);
    drawDot(ctx, back.x, back.y, "2", true);
    drawDot(ctx, W * 0.5, H * 0.2, "3", true);
    const p1 = Math.min(1, t / 0.45);
    const p2 = Math.max(0, Math.min(1, (t - 0.4) / 0.45));
    if (p1 > 0) drawArrow(ctx, corner.x, corner.y, lerp(corner.x, near.x, p1), lerp(corner.y, near.y, p1), "#f5d76e", 3);
    if (p2 > 0) drawArrow(ctx, near.x, near.y, lerp(near.x, back.x, p2), lerp(near.y, back.y, p2), "#56b4ff", 3);
    // ball
    const bx = p2 > 0 ? lerp(near.x, back.x, p2) : lerp(corner.x, near.x, p1);
    const by = p2 > 0 ? lerp(near.y, back.y, p2) : lerp(corner.y, near.y, p1);
    ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
  }

  function drawCornerEdge(ctx, W, H, t) {
    drawPitchBase(ctx, W, H);
    const corner = { x: 36, y: 36 };
    const shortP = { x: W * 0.18, y: H * 0.12 };
    const edge = { x: W * 0.42, y: H * 0.28 };
    drawDot(ctx, corner.x, corner.y, "K", true);
    drawDot(ctx, shortP.x, shortP.y, "S", true);
    drawDot(ctx, edge.x, edge.y, "E", true);
    drawDot(ctx, W * 0.55, H * 0.16, "T", true);
    const p1 = Math.min(1, t / 0.35);
    const p2 = Math.max(0, Math.min(1, (t - 0.3) / 0.4));
    const p3 = Math.max(0, Math.min(1, (t - 0.65) / 0.3));
    if (p1) drawArrow(ctx, corner.x, corner.y, lerp(corner.x, shortP.x, p1), lerp(corner.y, shortP.y, p1), "#f5d76e", 3);
    if (p2) drawArrow(ctx, shortP.x, shortP.y, lerp(shortP.x, edge.x, p2), lerp(shortP.y, edge.y, p2), "#56b4ff", 3);
    if (p3) drawArrow(ctx, edge.x, edge.y, lerp(edge.x, W * 0.52, p3), lerp(edge.y, H * 0.12, p3), "#3dd68c", 3);
    const bx = p3 ? lerp(edge.x, W * 0.52, p3) : p2 ? lerp(shortP.x, edge.x, p2) : lerp(corner.x, shortP.x, p1);
    const by = p3 ? lerp(edge.y, H * 0.12, p3) : p2 ? lerp(shortP.y, edge.y, p2) : lerp(corner.y, shortP.y, p1);
    ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
  }

  function drawFreeKick(ctx, W, H, t) {
    drawPitchBase(ctx, W, H);
    const spot = { x: W * 0.5, y: H * 0.38 };
    const wallX = W * 0.48;
    for (let i = 0; i < 4; i++) drawDot(ctx, wallX + i * 18 - 20, H * 0.22, "", false);
    drawDot(ctx, spot.x, spot.y, "K", true);
    drawDot(ctx, W * 0.62, H * 0.12, "T", true);
    const p = Math.min(1, t);
    // curved path
    const cpx = W * 0.72, cpy = H * 0.2;
    const bx = (1 - p) * (1 - p) * spot.x + 2 * (1 - p) * p * cpx + p * p * (W * 0.58);
    const by = (1 - p) * (1 - p) * spot.y + 2 * (1 - p) * p * cpy + p * p * (H * 0.1);
    ctx.strokeStyle = "#f5d76e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(spot.x, spot.y);
    ctx.quadraticCurveTo(cpx, cpy, W * 0.58, H * 0.1);
    ctx.stroke();
    ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
  }

  function drawWideFk(ctx, W, H, t) {
    drawPitchBase(ctx, W, H);
    const spot = { x: W * 0.12, y: H * 0.32 };
    const spotTarget = { x: W * 0.5, y: H * 0.16 };
    const cut = { x: W * 0.42, y: H * 0.22 };
    drawDot(ctx, spot.x, spot.y, "K", true);
    drawDot(ctx, spotTarget.x, spotTarget.y, "1", true);
    drawDot(ctx, cut.x, cut.y, "2", true);
    drawDot(ctx, W * 0.58, H * 0.14, "3", true);
    const p1 = Math.min(1, t / 0.55);
    const p2 = Math.max(0, Math.min(1, (t - 0.5) / 0.45));
    if (p1) drawArrow(ctx, spot.x, spot.y, lerp(spot.x, spotTarget.x, p1), lerp(spot.y, spotTarget.y, p1), "#f5d76e", 3);
    if (p2) drawArrow(ctx, spotTarget.x, spotTarget.y, lerp(spotTarget.x, cut.x, p2), lerp(spotTarget.y, cut.y, p2), "#56b4ff", 3);
    const bx = p2 ? lerp(spotTarget.x, cut.x, p2) : lerp(spot.x, spotTarget.x, p1);
    const by = p2 ? lerp(spotTarget.y, cut.y, p2) : lerp(spot.y, spotTarget.y, p1);
    ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fillStyle = "#fff"; ctx.fill();
  }

  function renderPlayList() {
    if (!playList) return;
    playList.innerHTML = "";
    PLAYS.forEach((play) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "play-btn" + (play === activePlay ? " on" : "");
      b.innerHTML = `<strong>${escapeHtml(play.title)}</strong><small>${escapeHtml(play.blurb)}</small>`;
      b.addEventListener("click", () => {
        activePlay = play;
        renderPlayList();
        setCaption.textContent = play.blurb + " · EXAMPLE only";
        replayPlay();
      });
      playList.appendChild(b);
    });
  }

  function framePlay(ts) {
    if (!setCtx || !setCanvas) return;
    const W = setCanvas.width, H = setCanvas.height;
    if (!framePlay.start) framePlay.start = ts;
    const elapsed = (ts - framePlay.start) / 1000;
    animT = Math.min(1, elapsed / 2.4);
    setCtx.clearRect(0, 0, W, H);
    activePlay.draw(setCtx, W, H, animT);
    if (animT < 1) animRaf = requestAnimationFrame(framePlay);
  }

  function replayPlay() {
    cancelAnimationFrame(animRaf);
    framePlay.start = 0;
    animT = 0;
    if (setCaption && activePlay) setCaption.textContent = activePlay.blurb + " · EXAMPLE only";
    animRaf = requestAnimationFrame(framePlay);
  }

  renderPlayList();
  $("#btnReplay").addEventListener("click", replayPlay);

  /* ---------- season desk ---------- */
  (function season() {
    const tb = $("#fixtureTable tbody");
    if (!tb) return;
    FIXTURES.forEach((f) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(f.week)}</td>
        <td>${escapeHtml(f.label)}</td>
        <td>${escapeHtml(f.venue)}</td>
        <td>${escapeHtml(f.opp)} <span class="badge demo">EXAMPLE</span></td>
        <td><span class="badge ${f.home ? "home" : "away"}">${f.home ? "HOME" : "AWAY"}</span> ${escapeHtml(f.result)}</td>`;
      tb.appendChild(tr);
    });
  })();

  /* ---------- fan notes ---------- */
  (function notes() {
    const ta = $("#fanNotes");
    const status = $("#notesStatus");
    if (ta) ta.value = localStorage.getItem(LS_NOTES) || "";
    $("#btnSaveNotes").addEventListener("click", () => {
      localStorage.setItem(LS_NOTES, ta.value);
      status.textContent = "Saved · " + new Date().toLocaleTimeString();
    });
    $("#btnClearNotes").addEventListener("click", () => {
      if (!confirm("Clear notepad?")) return;
      ta.value = "";
      localStorage.removeItem(LS_NOTES);
      status.textContent = "Cleared";
    });

    const ul = $("#watchList");
    let watch = loadJSON(LS_WATCH, DEFAULT_WATCH.map((w) => ({ ...w })));

    function renderWatch() {
      ul.innerHTML = "";
      watch.forEach((item, i) => {
        const li = document.createElement("li");
        const id = "w-" + i;
        const inp = document.createElement("input");
        inp.type = "checkbox"; inp.id = id; inp.checked = !!item.done;
        const lab = document.createElement("label");
        lab.htmlFor = id; lab.textContent = item.text;
        if (item.done) lab.classList.add("done");
        inp.addEventListener("change", () => {
          item.done = inp.checked;
          lab.classList.toggle("done", item.done);
          saveJSON(LS_WATCH, watch);
        });
        li.append(inp, lab);
        ul.appendChild(li);
      });
    }
    renderWatch();
    $("#btnAddWatch").addEventListener("click", () => {
      const text = prompt("Watch checklist item:");
      if (!text || !text.trim()) return;
      watch.push({ text: text.trim().slice(0, 80), done: false });
      saveJSON(LS_WATCH, watch);
      renderWatch();
    });
  })();

  console.info("Chelsea Tactics Board ready · EXAMPLE data only · port 4285");
})();
