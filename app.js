"use strict";
/* ---------- Deck data ---------- */
var MAJOR = [
  ["คนโง่","The Fool","โง่ คนเขลา นักผจญภัย"],["นักมายากล","The Magician","จอมเวทย์ นักเล่นกล"],["สตรีนักบวช","The High Priestess","นักบวชหญิง หญิงนักบวช"],["จักรพรรดินี","The Empress",""],
  ["จักรพรรดิ","The Emperor",""],["พระสันตะปาปา","The Hierophant","พระสันตปาปา pope ผู้นำศาสนา ปุโรหิต"],["คู่รัก","The Lovers","ผู้รัก"],["รถม้าศึก","The Chariot","รถศึก"],
  ["พลังใจ","Strength","พลัง ความแข็งแกร่ง ความเข้มแข็ง"],["ฤๅษี","The Hermit","ฤษี ผู้สันโดษ"],["กงล้อแห่งโชคชะตา","Wheel of Fortune","วงล้อ กงล้อ โชคชะตา"],["ความยุติธรรม","Justice",""],
  ["คนแขวนกลับหัว","The Hanged Man","ผู้ถูกแขวน ชายถูกแขวน"],["ความตาย","Death","มรณะ"],["ความพอดี","Temperance","ความสมดุล ความพอเหมาะ"],["ปีศาจ","The Devil","ซาตาน"],
  ["หอคอย","The Tower","หอคอยพัง"],["ดวงดาว","The Star","ดาว"],["ดวงจันทร์","The Moon","พระจันทร์ จันทร์"],["ดวงอาทิตย์","The Sun","พระอาทิตย์ อาทิตย์"],
  ["การพิพากษา","Judgement","judgment การตัดสิน"],["โลก","The World","จักรวาล"]
];
var ROMAN = ["0","I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII","XVIII","XIX","XX","XXI"];
var SUITS = [
  { key: "w", th: "ไม้เท้า", en: "Wands", color: "#b4532a", alias: "wand staff ไม้ พลอง กระบอง" },
  { key: "c", th: "ถ้วย", en: "Cups", color: "#2b6f8f", alias: "cup" },
  { key: "s", th: "ดาบ", en: "Swords", color: "#59647a", alias: "sword" },
  { key: "p", th: "เหรียญ", en: "Pentacles", color: "#5d7d36", alias: "pentacle coin coins เพนทาเคิล เพนตาเคิล เหรียญทอง" }
];
var RANKS = [
  ["1","Ace","เอซ เอส หนึ่ง"],["2","Two",""],["3","Three",""],["4","Four",""],["5","Five",""],["6","Six",""],["7","Seven",""],["8","Eight",""],["9","Nine",""],["10","Ten",""],
  ["เด็ก","Page","เพจ เด็กรับใช้ มหาดเล็ก"],["อัศวิน","Knight","ไนท์ ไนต์"],["ราชินี","Queen","ควีน"],["ราชา","King","คิง กษัตริย์"]
];

/* search helpers: ignore spaces and the word "แห่ง", so "3 ถ้วย", "ถ้วย3", "3 of cups" and "3 แห่งถ้วย" all find the same card */
var STOP = { "แห่ง": 1, "of": 1, "the": 1, "ใบ": 1, "ไพ่": 1 };
function norm(t) { return String(t).toLowerCase().replace(/แห่ง/g, "").replace(/[\s.,'’"()\-_\/]+/g, ""); }
function tokenize(q) {
  q = String(q || "").toLowerCase().replace(/(\d)([^\d\s])/g, "$1 $2").replace(/([^\d\s])(\d)/g, "$1 $2");
  return q.split(/\s+/).filter(function (t) { return t && !STOP[t] && norm(t); });
}
function matchCard(c, toks) {
  if (!toks.length) return false;
  for (var i = 0; i < toks.length; i++) {
    var t = toks[i];
    if (/^\d+$/.test(t)) { if (c.nums.indexOf(String(+t)) < 0) return false; }
    else if (c.key.indexOf(norm(t)) < 0) return false;
  }
  return true;
}

var CARDS = [];
var CARD_BY_ID = {};
(function () {
  MAJOR.forEach(function (m, i) {
    CARDS.push({ id: "m" + i, group: "m", n: i, th: m[0], en: m[1], alias: m[2] || "", short: i + " " + m[0], roman: ROMAN[i] });
  });
  SUITS.forEach(function (s) {
    RANKS.forEach(function (r, i) {
      var sp = /^\d+$/.test(r[0]) ? " " : "";
      CARDS.push({ id: s.key + (i + 1), group: s.key, n: i + 1, th: r[0] + sp + s.th, en: r[1] + " of " + s.en,
        alias: [r[0] + sp + "แห่ง" + s.th, r[2], s.alias, s.en, r[1]].join(" "),
        short: r[0], rankTh: r[0], rankEn: r[1], suit: s });
    });
  });
  CARDS.forEach(function (c) {
    CARD_BY_ID[c.id] = c;
    c.key = [c.th, c.en, c.alias].join(" ").split(/\s+/).map(norm).filter(Boolean).join("|");
    c.nums = [String(c.n)];
  });
})();
var GROUPS = [
  { key: "m", th: "เมเจอร์" },
  { key: "w", th: "ไม้เท้า" },
  { key: "c", th: "ถ้วย" },
  { key: "s", th: "ดาบ" },
  { key: "p", th: "เหรียญ" }
];

/* ---------- Background (table cloth) choices ---------- */
var BGS = [
  { key: "blush",    th: "ชมพูพีช",   bg: "#fbdde5", fg: "#4a2d42", accent: "#c2477a", edge: "#e59ab5" },
  { key: "butter",   th: "เหลืองเนย", bg: "#fdf0c8", fg: "#4d3a2a", accent: "#c0663a", edge: "#e6c06a" },
  { key: "sage",     th: "เขียวมินต์", bg: "#dcebd9", fg: "#2f4a3a", accent: "#3f8a62", edge: "#8fbf9f" },
  { key: "lavender", th: "ม่วงลาเวนเดอร์", bg: "#e6dcf5", fg: "#3d2d5c", accent: "#7b4fc0", edge: "#b7a2e0" },
  { key: "plum",     th: "ม่วงเข้ม",  bg: "#2b1a3c", fg: "#f1e7d0", accent: "#d9b261", edge: "#d9b261" },
  { key: "white",    th: "ขาว",        bg: "#ffffff", fg: "#3b2b3a", accent: "#c2477a", edge: "#e59ab5" },
  { key: "none",     th: "โปร่งใส",    bg: null,      fg: "#3b2b3a", accent: "#c2477a", edge: "#e59ab5" }
];

/* ---------- Spreads ---------- */
/* cw = card width; board width 1200 unless set. Slots: [label, x, y, turn] */
function rowSlots(labels, y, gap) {
  var n = labels.length, out = [];
  for (var i = 0; i < n; i++) out.push([labels[i], 600 + (i - (n - 1) / 2) * gap, y, 0]);
  return out;
}
function horseshoe() {
  var labels = ["อดีต", "ปัจจุบัน", "อนาคตอันใกล้", "ตัวคุณ", "คนรอบข้าง", "อุปสรรค", "ผลลัพธ์"], out = [];
  for (var i = 0; i < 7; i++) {
    var t = (i - 3) / 3;
    out.push([labels[i], 130 + i * 156.7, 230 + 230 * (1 - t * t), 0]);
  }
  return out;
}
var SPREADS = [
  { key: "one",   th: "1 ใบ",  w: 1200, h: 480, cw: 170, labels: true,  legend: false, slots: rowSlots(["คำตอบ"], 215, 0) },
  { key: "three", th: "3 ใบ",  w: 1200, h: 450, cw: 150, labels: true,  legend: false, slots: rowSlots(["อดีต", "ปัจจุบัน", "อนาคต"], 190, 300) },
  { key: "four",  th: "4 ใบ",  w: 1200, h: 450, cw: 150, labels: true,  legend: false, slots: rowSlots(["สถานการณ์", "อุปสรรค", "คำแนะนำ", "ผลลัพธ์"], 190, 250) },
  { key: "five",  th: "5 ใบ",  w: 1200, h: 450, cw: 150, labels: true,  legend: false, slots: rowSlots(["อดีต", "ปัจจุบัน", "สิ่งที่ซ่อนอยู่", "คำแนะนำ", "อนาคต"], 190, 225) },
  { key: "horse", th: "เกือกม้า 7 ใบ", w: 1200, h: 700, cw: 130, labels: true, legend: false, slots: horseshoe() },
  { key: "celtic", th: "เซลติกครอส 10 ใบ", w: 1100, h: 1200, cw: 110, labels: false, legend: true, slots: [
      ["ตัวคุณ/ปัจจุบัน", 380, 570, 0],
      ["อุปสรรค", 380, 570, 1],
      ["รากฐาน", 380, 850, 0],
      ["อดีต", 175, 570, 0],
      ["เป้าหมาย", 380, 290, 0],
      ["อนาคตอันใกล้", 585, 570, 0],
      ["ท่าทีของคุณ", 900, 990, 0],
      ["สิ่งแวดล้อม", 900, 710, 0],
      ["ความหวัง/ความกลัว", 900, 430, 0],
      ["ผลลัพธ์", 900, 150, 0]
  ] },
  { key: "free", th: "จัดเองอิสระ", w: 1200, h: 800, cw: 140, labels: true, legend: false, slots: [] }
];
function spreadDef(key) { for (var i = 0; i < SPREADS.length; i++) if (SPREADS[i].key === key) return SPREADS[i]; return SPREADS[0]; }

/* ---------- State ---------- */
var S = { spread: "celtic", slots: [], sel: -1, title: "", bg: "blush", scale: 100, labels: false, nums: true, legend: true };
var IMGS = {};   /* cardId -> HTMLImageElement */
var UNDO = [], meanSlot = -1, LASTRES = [], SAVE_KEY = "tarot-table-v1", saveTimer = 0, hintTimer = 0, rafId = 0;
var FONT_D = '"Mali", "Noto Sans Thai", system-ui, sans-serif';
var FONT_T = '"Sriracha", "Mali", cursive';
var FONT_N = '"Fredoka", "Mali", sans-serif';
var FONT_B = '"Mali", "Noto Sans Thai", system-ui, sans-serif';
var RATIO = 1.75;

function theme() { for (var i = 0; i < BGS.length; i++) if (BGS[i].key === S.bg) return BGS[i]; return BGS[0]; }
function curDef() { return spreadDef(S.spread); }
function cardW() { return curDef().cw * S.scale / 100; }
function titleH() { return S.title.replace(/\s+/g, "") ? 110 : 0; }
function legendH() { return S.legend ? 100 + Math.ceil(S.slots.length / 2) * 40 : 0; }
function dims() { var d = curDef(); return { W: d.w, H: titleH() + d.h + legendH() }; }
function slotExtent(sl) { var cw = cardW(), ch = cw * RATIO; return sl.turn ? { hw: ch / 2, hh: cw / 2 } : { hw: cw / 2, hh: ch / 2 }; }

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

/* ---------- Suit symbols, drawn around (0,0) in a box of size s ---------- */
function drawSymbol(ctx, suit, s, color) {
  ctx.save(); ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineCap = "round"; ctx.lineJoin = "round";
  if (suit === "w") {
    ctx.rotate(Math.PI / 5.5);
    ctx.lineWidth = s * 0.1; ctx.beginPath(); ctx.moveTo(0, -s * 0.5); ctx.lineTo(0, s * 0.5); ctx.stroke();
    [[-1, -0.25], [1, -0.05], [-1, 0.18]].forEach(function (p) {
      ctx.beginPath(); ctx.ellipse(p[0] * s * 0.13, p[1] * s, s * 0.14, s * 0.06, p[0] * 0.7, 0, Math.PI * 2); ctx.fill();
    });
    ctx.beginPath(); ctx.ellipse(0, -s * 0.52, s * 0.06, s * 0.11, 0, 0, Math.PI * 2); ctx.fill();
  } else if (suit === "c") {
    ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.34); ctx.lineTo(s * 0.4, -s * 0.34);
    ctx.quadraticCurveTo(s * 0.42, s * 0.14, 0, s * 0.18); ctx.quadraticCurveTo(-s * 0.42, s * 0.14, -s * 0.4, -s * 0.34);
    ctx.closePath(); ctx.fill();
    ctx.lineWidth = s * 0.08; ctx.beginPath(); ctx.moveTo(0, s * 0.18); ctx.lineTo(0, s * 0.42); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-s * 0.2, s * 0.44); ctx.lineTo(s * 0.2, s * 0.44); ctx.stroke();
  } else if (suit === "s") {
    ctx.beginPath(); ctx.moveTo(0, -s * 0.54); ctx.lineTo(s * 0.07, -s * 0.4); ctx.lineTo(s * 0.07, s * 0.16);
    ctx.lineTo(-s * 0.07, s * 0.16); ctx.lineTo(-s * 0.07, -s * 0.4); ctx.closePath(); ctx.fill();
    ctx.lineWidth = s * 0.07; ctx.beginPath(); ctx.moveTo(-s * 0.26, s * 0.2); ctx.lineTo(s * 0.26, s * 0.2); ctx.stroke();
    ctx.lineWidth = s * 0.07; ctx.beginPath(); ctx.moveTo(0, s * 0.22); ctx.lineTo(0, s * 0.42); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, s * 0.48, s * 0.06, 0, Math.PI * 2); ctx.fill();
  } else {
    ctx.lineWidth = s * 0.05; ctx.beginPath(); ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    for (var i = 0; i < 5; i++) { var a = -Math.PI / 2 + i * 4 * Math.PI / 5; var px = Math.cos(a) * s * 0.4, py = Math.sin(a) * s * 0.4; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
    ctx.closePath(); ctx.stroke();
  }
  ctx.restore();
}
function drawStar(ctx, r, color) {
  ctx.save(); ctx.fillStyle = color; ctx.beginPath();
  for (var i = 0; i < 16; i++) { var a = -Math.PI / 2 + i * Math.PI / 8, rad = i % 2 ? r * 0.42 : r; var px = Math.cos(a) * rad, py = Math.sin(a) * rad; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
  ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2); ctx.fillStyle = "#2a1c4a"; ctx.fill(); ctx.restore();
}
function drawCrown(ctx, w, color) {
  ctx.save(); ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(-w / 2, w * 0.18); ctx.lineTo(-w / 2, -w * 0.12); ctx.lineTo(-w / 4, w * 0.04); ctx.lineTo(0, -w * 0.2);
  ctx.lineTo(w / 4, w * 0.04); ctx.lineTo(w / 2, -w * 0.12); ctx.lineTo(w / 2, w * 0.18); ctx.closePath(); ctx.fill(); ctx.restore();
}

/* ---------- Card faces (centered on 0,0) ---------- */
function drawImageCover(ctx, img, w, h) {
  var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  var ir = iw / ih, cr = w / h, sw, sh, sx, sy;
  if (ir > cr) { sh = ih; sw = sh * cr; sx = (iw - sw) / 2; sy = 0; }
  else { sw = iw; sh = sw / cr; sx = 0; sy = (ih - sh) / 2; }
  ctx.save(); rr(ctx, -w / 2, -h / 2, w, h, w * 0.05); ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, -w / 2, -h / 2, w, h); ctx.restore();
  ctx.save(); ctx.lineWidth = Math.max(1.5, w * 0.012); ctx.strokeStyle = "rgba(0,0,0,.45)"; rr(ctx, -w / 2, -h / 2, w, h, w * 0.05); ctx.stroke(); ctx.restore();
}
function drawFace(ctx, card, w, h) {
  if (IMGS[card.id]) { drawImageCover(ctx, IMGS[card.id], w, h); return; }
  if (typeof wantImage === "function") wantImage(card.id);
  var x = -w / 2, y = -h / 2, major = card.group === "m", col = major ? "#d9b261" : card.suit.color;
  ctx.save();
  rr(ctx, x, y, w, h, w * 0.07);
  if (major) { var g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, "#2a1d52"); g.addColorStop(1, "#18122f"); ctx.fillStyle = g; }
  else ctx.fillStyle = "#f4ecdc";
  ctx.fill();
  ctx.lineWidth = Math.max(1.5, w * 0.025); ctx.strokeStyle = col; rr(ctx, x + w * 0.04, y + w * 0.04, w * 0.92, h - w * 0.08, w * 0.04); ctx.stroke();
  ctx.lineWidth = Math.max(1, w * 0.008); ctx.strokeStyle = "rgba(0,0,0,.35)"; rr(ctx, x, y, w, h, w * 0.07); ctx.stroke();
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  var nameCol = major ? "#f1e7d0" : "#2a2233";
  if (major) {
    ctx.fillStyle = col; ctx.font = "600 " + (w * 0.2) + "px " + FONT_N; ctx.fillText(card.roman, 0, y + h * 0.12, w * 0.8);
    ctx.save(); ctx.translate(0, -h * 0.02); drawStar(ctx, w * 0.36, col); ctx.restore();
  } else {
    ctx.fillStyle = col; ctx.font = "600 " + (w * 0.17) + "px " + FONT_N; ctx.fillText(card.rankTh, 0, y + h * 0.11, w * 0.8);
    var court = card.n >= 11;
    if (court) { ctx.save(); ctx.translate(0, -h * 0.2); drawCrown(ctx, w * 0.3, col); ctx.restore(); }
    ctx.save(); ctx.translate(0, court ? h * 0.02 : -h * 0.02); drawSymbol(ctx, card.group, w * (court ? 0.52 : 0.62), col); ctx.restore();
  }
  ctx.fillStyle = nameCol; ctx.font = "700 " + (w * 0.095) + "px " + FONT_D;
  ctx.fillText(card.th, 0, y + h * 0.84, w * 0.84);
  ctx.globalAlpha = 0.75; ctx.font = "500 " + (w * 0.07) + "px " + FONT_B;
  ctx.fillText(card.en, 0, y + h * 0.92, w * 0.84);
  ctx.restore();
}
function drawBlank(ctx, w, h, th) {
  ctx.save(); ctx.setLineDash([w * 0.06, w * 0.05]); ctx.lineWidth = Math.max(2, w * 0.018); ctx.strokeStyle = th.accent; ctx.globalAlpha = 0.7;
  rr(ctx, -w / 2, -h / 2, w, h, w * 0.07); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = th.accent; ctx.font = "500 " + (w * 0.34) + "px " + FONT_B; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("+", 0, 0);
  ctx.restore();
}

function drawSpark(ctx, x, y, r, color) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(0, 0, r, 0); ctx.quadraticCurveTo(0, 0, 0, r); ctx.quadraticCurveTo(0, 0, -r, 0); ctx.quadraticCurveTo(0, 0, 0, -r);
  ctx.fill(); ctx.restore();
}

/* ---------- Board rendering ---------- */
function drawOrder() {
  var o = [], i;
  for (i = 0; i < S.slots.length; i++) if (i !== S.sel) o.push(i);
  if (S.sel >= 0 && S.sel < S.slots.length) o.push(S.sel);
  return o;
}
function slotName(sl) { return sl.card ? CARD_BY_ID[sl.card] : null; }
function sharesSpot(sl, idx) {
  for (var j = 0; j < S.slots.length; j++) if (j !== idx && Math.abs(S.slots[j].x - sl.x) < 8 && Math.abs(S.slots[j].y - sl.y) < 8) return true;
  return false;
}

function drawBoard(ctx, scale, forExport) {
  var D = dims(), th = theme(), cw = cardW(), ch = cw * RATIO, i, k;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, D.W, D.H);
  if (th.bg) {
    ctx.fillStyle = th.bg; ctx.fillRect(0, 0, D.W, D.H);
    ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = th.edge; rr(ctx, 16, 16, D.W - 32, D.H - 32, 30); ctx.stroke();
    ctx.lineWidth = 2; ctx.setLineDash([10, 9]); ctx.globalAlpha = 0.8; rr(ctx, 30, 30, D.W - 60, D.H - 60, 22); ctx.stroke(); ctx.restore();
    var cs = [[44, 44], [D.W - 44, 44], [44, D.H - 44], [D.W - 44, D.H - 44]];
    for (k = 0; k < 4; k++) drawSpark(ctx, cs[k][0], cs[k][1], 15, th.edge);
  }
  var tH = titleH();
  if (tH) {
    ctx.fillStyle = th.fg; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = "400 50px " + FONT_T; ctx.fillText(S.title.trim(), D.W / 2, 66, D.W - 160);
  }
  ctx.save(); ctx.translate(0, tH);
  var order = drawOrder(), fs = Math.max(15, cw * 0.115);
  for (k = 0; k < order.length; k++) {
    i = order[k]; var sl = S.slots[i], card = slotName(sl);
    ctx.save(); ctx.translate(sl.x, sl.y); if (sl.turn) ctx.rotate(Math.PI / 2);
    if (card) {
      if (sl.rev) ctx.rotate(Math.PI);
      /* shadow comes from a solid plate only, so it is never clipped or smeared onto the card artwork */
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.32)"; ctx.shadowBlur = cw * 0.08 * scale; ctx.shadowOffsetY = cw * 0.03 * scale;
      ctx.fillStyle = "#f4ecdc"; rr(ctx, -cw / 2, -ch / 2, cw, ch, cw * 0.06); ctx.fill();
      ctx.restore();
      drawFace(ctx, card, cw, ch);
    } else drawBlank(ctx, cw, ch, th);
    ctx.restore();
    if (!forExport && i === S.sel) {
      ctx.save(); ctx.translate(sl.x, sl.y); if (sl.turn) ctx.rotate(Math.PI / 2);
      ctx.lineWidth = 4; ctx.strokeStyle = "#ff6fb5"; rr(ctx, -cw / 2 - 6, -ch / 2 - 6, cw + 12, ch + 12, cw * 0.09); ctx.stroke(); ctx.restore();
    }
  }
  for (k = 0; k < order.length; k++) {
    i = order[k]; var s2 = S.slots[i], e = slotExtent(s2), c2 = slotName(s2);
    if (S.nums) {
      var bx = s2.x - e.hw + 2, by = s2.y - e.hh + 2, br = Math.max(13, cw * 0.1);
      ctx.save(); ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fillStyle = th.accent; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = th.bg || "#ffffff"; ctx.stroke();
      ctx.fillStyle = th.bg ? th.bg : "#ffffff"; ctx.font = "600 " + (br * 1.05) + "px " + FONT_N; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), bx, by + 1); ctx.restore();
    }
    if (S.labels && !(s2.turn && sharesSpot(s2, i))) {
      var ty = s2.y + e.hh + 12, mw = cw * 1.4;
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillStyle = th.accent; ctx.font = "600 " + fs + "px " + FONT_B; ctx.fillText(s2.label || "", s2.x, ty, mw);
      if (c2) {
        ctx.fillStyle = th.fg; ctx.font = "700 " + (fs * 1.15) + "px " + FONT_D; ctx.fillText(c2.th, s2.x, ty + fs * 1.45, mw);
        ctx.globalAlpha = 0.78; ctx.font = "500 " + (fs * 0.85) + "px " + FONT_B;
        ctx.fillText(c2.en + (s2.rev ? " (กลับหัว)" : ""), s2.x, ty + fs * 1.45 + fs * 1.5, mw); ctx.globalAlpha = 1;
      }
    }
  }
  if (S.legend) {
    var ly = curDef().h + 8;
    ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = th.edge; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(60, ly); ctx.lineTo(D.W - 60, ly); ctx.stroke(); ctx.restore();
    ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillStyle = th.accent; ctx.font = "400 30px " + FONT_T;
    ctx.fillText("สรุปการเปิดไพ่", 60, ly + 18);
    var colW = (D.W - 120) / 2, rows = Math.ceil(S.slots.length / 2);
    for (i = 0; i < S.slots.length; i++) {
      var s3 = S.slots[i], c3 = slotName(s3), col = Math.floor(i / rows), row = i % rows;
      var lx = 60 + col * colW, lyy = ly + 62 + row * 40;
      ctx.fillStyle = th.accent; ctx.font = "600 22px " + FONT_N; ctx.fillText((i + 1) + ".", lx, lyy);
      ctx.fillStyle = th.fg; ctx.font = "500 21px " + FONT_B;
      var txt = (s3.label || "ช่อง " + (i + 1)) + " : " + (c3 ? c3.th + (s3.rev ? " (กลับหัว)" : "") : "ยังไม่เลือกไพ่");
      ctx.fillText(txt, lx + 34, lyy, colW - 50);
    }
  }
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

var board = document.getElementById("board");
var bctx = board.getContext("2d");
var RS = 2;
function redraw() {
  var D = dims();
  if (board.width !== D.W * RS || board.height !== D.H * RS) { board.width = D.W * RS; board.height = D.H * RS; }
  drawBoard(bctx, RS, false);
  scheduleSave();
}
function requestRedraw() { if (rafId) return; rafId = requestAnimationFrame(function () { rafId = 0; redraw(); }); }

/* ---------- Hit testing and dragging ---------- */
function toBoard(ev) {
  var r = board.getBoundingClientRect(), D = dims();
  return { x: (ev.clientX - r.left) / r.width * D.W, y: (ev.clientY - r.top) / r.height * D.H - titleH() };
}
function hit(p) {
  var cw = cardW(), ch = cw * RATIO, o = drawOrder(), pad = COARSE() ? 14 : 0;
  for (var k = o.length - 1; k >= 0; k--) {
    var sl = S.slots[o[k]], dx = p.x - sl.x, dy = p.y - sl.y;
    if (sl.turn) { var t = dx; dx = dy; dy = -t; }
    if (Math.abs(dx) <= cw / 2 + pad && Math.abs(dy) <= ch / 2 + pad) return o[k];
  }
  return -1;
}
function clampSlot(sl) {
  var e = slotExtent(sl), D = dims(), h = curDef().h, m = 40;
  var bot = m + (S.labels ? Math.max(15, cardW() * 0.115) * 3.4 + 12 : 0);
  var lx = e.hw + m, hx = D.W - e.hw - m, ly = e.hh + m, hy = h - e.hh - bot;
  sl.x = lx > hx ? D.W / 2 : Math.max(lx, Math.min(hx, sl.x));
  sl.y = ly > hy ? h / 2 : Math.max(ly, Math.min(hy, sl.y));
}
function COARSE() { return !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches); }
var drag = null, lastTap = { t: 0, i: -1 };
board.addEventListener("pointerdown", function (ev) {
  var p = toBoard(ev), i = hit(p);
  if (i < 0) { selectSlot(-1); return; }
  var now = Date.now();
  if (lastTap.i === i && now - lastTap.t < 380) { pushUndo(); S.slots[i].rev = !S.slots[i].rev; lastTap = { t: 0, i: -1 }; selectSlot(i); return; }
  lastTap = { t: now, i: i };
  selectSlot(i);
  drag = { i: i, ox: p.x - S.slots[i].x, oy: p.y - S.slots[i].y, moved: false };
  board.classList.add("drag");
  try { board.setPointerCapture(ev.pointerId); } catch (e) {}
  ev.preventDefault();
});
board.addEventListener("pointermove", function (ev) {
  if (!drag) return;
  var p = toBoard(ev), sl = S.slots[drag.i];
  if (!sl) { drag = null; return; }
  if (!drag.moved) {
    if (Math.abs(p.x - drag.ox - sl.x) + Math.abs(p.y - drag.oy - sl.y) < 4) return;
    pushUndo(); drag.moved = true;
  }
  sl.x = p.x - drag.ox; sl.y = p.y - drag.oy; clampSlot(sl);
  requestRedraw();
});
function endDrag() { if (drag) { drag = null; board.classList.remove("drag"); } }
board.addEventListener("pointerup", function () {
  var d = drag; endDrag();
  if (d && !d.moved && NARROW() && S.slots[d.i] && !S.slots[d.i].card) openSheet();
});
board.addEventListener("pointercancel", endDrag);
/* the page can still be scrolled by touching empty table; touching a card blocks scrolling so it can be dragged */
board.addEventListener("touchstart", function (ev) {
  if (ev.touches.length === 1 && hit(toBoard(ev.touches[0])) >= 0) ev.preventDefault();
}, { passive: false });

/* ---------- Card images from the cards/ folder (lazy), user images win ---------- */
var SRC = {};                 /* cardId -> "mine" | "repo" */
var REPO = { map: null, tried: {}, ready: null };
function shrink(im) {
  var w = im.naturalWidth, h = im.naturalHeight, m = 1000, mx = Math.max(w, h);
  if (!w || !h || mx <= m) return im;
  var k = m / mx, c = document.createElement("canvas");
  c.width = Math.round(w * k); c.height = Math.round(h * k);
  var x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(im, 0, 0, c.width, c.height);
  return c;
}
REPO.ready = (function () {
  try {
    return fetch("cards/cards.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) { if (m && typeof m === "object") REPO.map = m; }).catch(function () {});
  } catch (e) { return Promise.resolve(); }
})();
var refreshTimer = 0;
function scheduleRefresh() {
  if (refreshTimer) return;
  refreshTimer = setTimeout(function () { refreshTimer = 0; buildGrid(); redraw(); }, 60);
}
function repoUrls(id) {
  var u = [];
  if (REPO.map && REPO.map[id]) u.push("cards/" + encodeURIComponent(REPO.map[id]).replace(/%2F/g, "/"));
  ["jpg", "png", "webp"].forEach(function (e) { u.push("cards/" + id + "." + e); });
  return u;
}
function tryRepo(id, urls, i) {
  if (i >= urls.length) return;
  var im = new Image();
  im.crossOrigin = "anonymous";
  im.onload = function () { if (SRC[id] === "mine") return; IMGS[id] = shrink(im); SRC[id] = "repo"; scheduleRefresh(); };
  im.onerror = function () { tryRepo(id, urls, i + 1); };
  im.src = urls[i];
}
function wantImage(id) {
  if (IMGS[id] || REPO.tried[id]) return;
  REPO.tried[id] = 1;
  REPO.ready.then(function () { if (!IMGS[id]) tryRepo(id, repoUrls(id), 0); });
}

/* ---------- Meaning box ---------- */
var GROUP_LABEL = { m: "เมเจอร์ · บทใหญ่ของชีวิต", w: "ไม้เท้า · ธาตุไฟ", c: "ถ้วย · ธาตุน้ำ", s: "ดาบ · ธาตุลม", p: "เหรียญ · ธาตุดิน" };
function el(tag, cls, text) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}
function meanSection(label, text, on) {
  var d = el("div", "mean-sec" + (on ? " on" : ""));
  d.appendChild(el("div", "mean-label", label));
  d.appendChild(el("p", "mean-text", text));
  return d;
}
function meanSections(host, id, rev) {
  var m = MEAN[id];
  host.appendChild(meanSection("ภาพที่เห็น", m[0], false));
  host.appendChild(meanSection("ลองถามตัวเอง", m[1], false));
  host.appendChild(meanSection("ความหมายตรง", m[2], rev === false));
  host.appendChild(meanSection("ความหมายกลับหัว", m[3], rev === true));
}
function renderMeaning() {
  var box = $("meanBox"), body = $("meanBody");
  /* keep showing the card that was just placed, even though the selection has moved on to the next empty slot */
  var idx = meanSlot >= 0 && S.slots[meanSlot] && S.slots[meanSlot].card ? meanSlot : S.sel;
  var sl = idx >= 0 ? S.slots[idx] : null, c = sl ? slotName(sl) : null;
  if (!c || typeof MEAN === "undefined" || !MEAN[c.id]) { box.hidden = true; return; }
  box.hidden = false; body.textContent = "";
  var head = el("div", "mean-head");
  head.appendChild(el("div", "mean-name", c.th));
  head.appendChild(el("div", "mean-en", c.en + (sl.rev ? " · กลับหัว" : "")));
  head.appendChild(el("div", "mean-where", "ช่อง " + (idx + 1) + (sl.label ? " · " + sl.label : "")));
  head.appendChild(el("span", "mean-tag", GROUP_LABEL[c.group]));
  body.appendChild(head);
  meanSections(body, c.id, !!sl.rev);
  var b = el("button", "btn", "ดูในคู่มือ");
  b.type = "button";
  b.addEventListener("click", function () { openGuide("cards", c.id); });
  body.appendChild(b);
}
$("slotRev").addEventListener("change", function () { setTimeout(renderMeaning, 0); });

/* ---------- Guide overlay ---------- */
var guideTab = "tool", guideGroup = "all", guideQuery = "";
var GTABS = [["tool", "วิธีใช้เครื่องมือ"], ["read", "วิธีอ่านไพ่"], ["img", "ภาษาของภาพ"], ["cards", "ความหมายไพ่"]];
function buildGuideTabs() {
  var box = $("guideTabs"); box.textContent = "";
  GTABS.forEach(function (t) {
    var b = el("button", "chip", t[1]); b.type = "button";
    b.setAttribute("aria-pressed", t[0] === guideTab ? "true" : "false");
    b.addEventListener("click", function () { guideTab = t[0]; renderGuide(); });
    box.appendChild(b);
  });
}
function stepList(host, arr) {
  arr.forEach(function (s, i) {
    var d = el("div", "g-step");
    var n = el("span", "num", String(i + 1));
    var t = el("div", "g-step-t");
    t.appendChild(el("h3", "g-h", s.h)); t.appendChild(el("p", "g-p", s.p));
    d.appendChild(n); d.appendChild(t); host.appendChild(d);
  });
}
function renderGuide(focusId) {
  buildGuideTabs();
  var body = $("guideBody"); body.textContent = "";
  if (guideTab === "tool") {
    body.appendChild(el("p", "note", "ขั้นตอนใช้งานโต๊ะเรียงไพ่ตั้งแต่ต้นจนบันทึกรูป"));
    stepList(body, GUIDE.tool);
  } else if (guideTab === "read") {
    var intro = el("p", "g-lead", "ลำดับนี้ใช้ได้กับทุกรูปแบบการเรียง เริ่มจากสิ่งที่ตาเห็นและใจรู้สึกก่อน แล้วค่อยเอาคีย์เวิร์ดมาเทียบ จะเล่าไพ่ทั้งกระดานได้ลื่นกว่าท่องความหมายทีละใบ");
    body.appendChild(intro);
    stepList(body, GUIDE.read);
    var ex = el("div", "g-lead"); ex.appendChild(el("b", null, GUIDE.example.h)); ex.appendChild(el("p", "g-p", GUIDE.example.p)); body.appendChild(ex);
    body.appendChild(el("h3", "g-h g-sub", "ตัวเลขและราชสำนักในไพ่ชุดย่อย"));
    var grid = el("div", "g-nums");
    GUIDE.numbers.forEach(function (n) {
      var r = el("div", "g-num-row"); r.appendChild(el("b", null, n[0])); r.appendChild(el("span", null, n[1])); grid.appendChild(r);
    });
    body.appendChild(grid);
  } else if (guideTab === "img") {
    body.appendChild(el("p", "g-lead", "รายละเอียดเล็กๆ ในภาพคือภาษาที่ช่วยให้อ่านลึกขึ้น ความหมายด้านล่างเป็นแนวทางสังเกต ไม่ใช่กฎตายตัว ให้ดูบริบทของไพ่ใบนั้นและความรู้สึกของคุณประกอบเสมอ"));
    GUIDE.imagery.forEach(function (g) {
      var sec = el("section", "g-group"); sec.appendChild(el("h3", "g-h g-sub", g.h));
      g.items.forEach(function (it) {
        var d = el("div", "g-item"); d.appendChild(el("b", null, it[0])); d.appendChild(el("p", "g-p", it[1])); sec.appendChild(d);
      });
      body.appendChild(sec);
    });
  } else {
    renderCardsTab(body, focusId);
  }
}
function renderCardsTab(body, focusId) {
  var bar = el("div", "g-bar");
  var q = el("input"); q.type = "search"; q.id = "guideQ"; q.placeholder = "ค้นหาชื่อไพ่หรือคำในความหมาย"; q.value = guideQuery; q.setAttribute("aria-label", "ค้นหาไพ่");
  bar.appendChild(q);
  var chips = el("div", "tabs");
  [["all", "ทั้งหมด"], ["m", "เมเจอร์"], ["w", "ไม้เท้า · ไฟ"], ["c", "ถ้วย · น้ำ"], ["s", "ดาบ · ลม"], ["p", "เหรียญ · ดิน"]].forEach(function (g) {
    var b = el("button", "chip", g[1]); b.type = "button";
    b.setAttribute("aria-pressed", g[0] === guideGroup ? "true" : "false");
    b.addEventListener("click", function () { guideGroup = g[0]; renderGuide(); });
    chips.appendChild(b);
  });
  bar.appendChild(chips); body.appendChild(bar);
  var list = el("div", "g-cards"); body.appendChild(list);
  function fill() {
    list.textContent = "";
    var qq = guideQuery.trim().toLowerCase(), toks = tokenize(guideQuery), shown = 0;
    GUIDE.elements.forEach(function (g) {
      if (guideGroup !== "all" && guideGroup !== g.key) return;
      var cs = CARDS.filter(function (c) {
        if (c.group !== g.key) return false;
        if (!qq) return true;
        var m = MEAN[c.id] || [];
        return matchCard(c, toks) || m.join(" ").toLowerCase().indexOf(qq) >= 0;
      });
      if (!cs.length) return;
      var sec = el("section", "g-el");
      var h = el("h3", "g-h g-sub", g.name + " · " + g.el); sec.appendChild(h);
      if (!qq) sec.appendChild(el("p", "g-p", g.p));
      cs.forEach(function (c) {
        var d = el("details", "g-card"); d.id = "gc-" + c.id;
        var sm = el("summary");
        if (c.group === "m") sm.appendChild(el("span", "num", String(c.n)));
        sm.appendChild(document.createTextNode(c.th));
        sm.appendChild(el("small", null, c.en));
        d.appendChild(sm);
        if (MEAN[c.id]) { var inner = el("div", "g-card-body"); meanSections(inner, c.id, null); d.appendChild(inner); }
        if (focusId === c.id || qq) d.open = focusId === c.id || shown < 6;
        sec.appendChild(d); shown++;
      });
      list.appendChild(sec);
    });
    if (!shown) list.appendChild(el("p", "note", "ไม่พบไพ่ที่ตรงกับคำค้น"));
  }
  fill();
  q.addEventListener("input", function () { guideQuery = this.value; fill(); });
  if (focusId) {
    var t = document.getElementById("gc-" + focusId);
    if (t) setTimeout(function () { t.scrollIntoView({ block: "start" }); }, 30);
  }
}
function openGuide(tab, cardId) {
  guideTab = tab || guideTab;
  if (cardId) { guideQuery = ""; guideGroup = CARD_BY_ID[cardId].group; }
  $("guide").hidden = false;
  renderGuide(cardId);
  $("guideClose").focus();
}
$("btnGuide").addEventListener("click", function () { openGuide("tool"); });
$("guideClose").addEventListener("click", function () { $("guide").hidden = true; });
$("guide").addEventListener("click", function (e) { if (e.target === this) this.hidden = true; });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("guide").hidden = true; });

/* ---------- UI ---------- */
function $(id) { return document.getElementById(id); }
var tab = "m", query = "", sampleOn = false;
var HINT_NORMAL = (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
  ? "แตะไพ่เพื่อเลือก ลากเพื่อย้าย แล้วใช้ปุ่มด้านล่างเพื่อเลือกไพ่ / กลับหัว"
  : "แตะที่ไพ่เพื่อเลือก ลากเพื่อย้าย แตะสองครั้งเพื่อกลับหัว/หงายขึ้น";
var HINT_SAMPLE = "ไพ่บนโต๊ะตอนนี้เป็นตัวอย่าง กด “ล้างโต๊ะ” เพื่อเริ่มจัดของจริง";

function mkSlot(a) { return { label: a[0], x: a[1], y: a[2], turn: a[3] ? 1 : 0, card: null, rev: false }; }

function loadSpread(key, carry) {
  var def = spreadDef(key), old = S.slots, prevKey = S.spread;
  S.spread = key; S.sel = -1; meanSlot = -1;
  S.slots = def.slots.map(mkSlot);
  if (carry && !def.slots.length && old.length) {
    var od = spreadDef(prevKey), fx = def.w / od.w, fy = def.h / od.h;
    S.slots = old.map(function (o) { return { label: o.label, x: o.x * fx, y: o.y * fy, turn: o.turn, card: o.card, rev: o.rev }; });
  } else if (carry) old.forEach(function (o, i) { if (S.slots[i]) { S.slots[i].card = o.card; S.slots[i].rev = o.rev; } });
  S.labels = def.labels; S.legend = def.legend;
  $("optLabels").checked = S.labels; $("optLegend").checked = S.legend; $("optNums").checked = S.nums;
  refreshAll();
}
function refreshAll() { buildSpreadChips(); buildSlotChips(); buildGrid(); syncForm(); redraw(); }

function buildSpreadChips() {
  var box = $("spreadChips"); box.innerHTML = "";
  SPREADS.forEach(function (d) {
    var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = d.th;
    b.setAttribute("aria-pressed", d.key === S.spread ? "true" : "false");
    b.addEventListener("click", function () { if (d.key === S.spread) return; pushUndo(); loadSpread(d.key, !sampleOn); sampleOn = false; $("hintP").textContent = HINT_NORMAL; });
    box.appendChild(b);
  });
}
function buildSlotChips() {
  var box = $("slotChips"); box.innerHTML = "";
  if (!S.slots.length) { var p = document.createElement("p"); p.className = "note"; p.textContent = "ยังไม่มีช่อง กด “+ เพิ่มช่อง” เพื่อวางไพ่ใบแรก"; box.appendChild(p); }
  S.slots.forEach(function (sl, i) {
    var b = document.createElement("button"); b.type = "button"; b.className = "chip slot-chip" + (i === S.sel ? " on" : "");
    var c = slotName(sl);
    var nb = document.createElement("span"); nb.className = "num"; nb.textContent = String(i + 1);
    var top = document.createElement("span"); top.className = "slot-top"; top.appendChild(nb); top.appendChild(document.createTextNode(sl.label || "ช่อง"));
    b.appendChild(top);
    var sm = document.createElement("small"); sm.textContent = c ? c.th + (sl.rev ? " (กลับหัว)" : "") + (dupCount(sl.card) > 1 ? " · ซ้ำ" : "") : "ยังไม่เลือกไพ่"; b.appendChild(sm);
    b.addEventListener("click", function () { selectSlot(i); });
    box.appendChild(b);
  });
}
function buildTabs() {
  var box = $("tabs"); box.innerHTML = "";
  GROUPS.forEach(function (g) {
    var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = g.th;
    b.setAttribute("aria-pressed", g.key === tab && !query ? "true" : "false");
    b.addEventListener("click", function () { tab = g.key; query = ""; $("q").value = ""; buildTabs(); buildGrid(); });
    box.appendChild(b);
  });
}
function thumb(id) {
  var cv = document.createElement("canvas"); cv.className = "thumb"; cv.width = 68; cv.height = 120; cv.setAttribute("aria-hidden", "true");
  var t = cv.getContext("2d"); t.imageSmoothingQuality = "high"; t.translate(34, 60); drawImageCover(t, IMGS[id], 68, 120);
  return cv;
}
function buildGrid() {
  var box = $("grid"), keep = box.scrollTop; box.innerHTML = "";
  var toks = tokenize(query), searching = toks.length > 0;
  var cur = S.sel >= 0 && S.slots[S.sel] ? S.slots[S.sel].card : null;
  var used = {}; S.slots.forEach(function (s) { if (s.card) used[s.card] = 1; });
  var list = CARDS.filter(function (c) { return searching ? matchCard(c, toks) : c.group === tab; });
  LASTRES = searching ? list : [];
  if (searching && !list.length) {
    var np = document.createElement("p"); np.className = "note"; np.textContent = "ไม่พบไพ่ที่ตรงกับคำค้น ลองพิมพ์สั้นลง เช่น 3 ถ้วย หรือ tower"; box.appendChild(np);
  }
  list.forEach(function (c) {
    var b = document.createElement("button"); b.type = "button";
    b.style.setProperty("--sc", c.suit ? c.suit.color : "#c79a3e");
    b.className = "cardbtn" + (c.id === cur ? " cur" : "") + (used[c.id] ? " used" : "");
    b.setAttribute("aria-label", c.th + " " + c.en);
    if (IMGS[c.id]) b.appendChild(thumb(c.id)); else wantImage(c.id);
    var ct = document.createElement("span"); ct.className = "ct";
    if (c.group === "m") { var nm = document.createElement("span"); nm.className = "num"; nm.textContent = String(c.n); ct.appendChild(nm); }
    ct.appendChild(document.createTextNode(c.th));
    var sm = document.createElement("small"); sm.textContent = c.en; ct.appendChild(sm);
    b.appendChild(ct);
    b.addEventListener("click", function () { pickCard(c.id); });
    box.appendChild(b);
  });
  box.scrollTop = keep;
}
function syncForm() {
  var sl = S.sel >= 0 ? S.slots[S.sel] : null;
  $("slotEmpty").hidden = !!sl; $("slotForm").hidden = !sl;
  $("slotTitle").textContent = sl ? "ช่องที่ " + (S.sel + 1) + (slotName(sl) ? " · " + slotName(sl).th : "") : "ช่องที่เลือก";
  if (sl) { $("slotLabel").value = sl.label; $("slotRev").checked = !!sl.rev; $("slotTurn").checked = !!sl.turn; }
  renderMeaning();
  updateBar();
}
function selectSlot(i) { S.sel = i; meanSlot = i; buildSlotChips(); buildGrid(); syncForm(); redraw(); }

/* short message under the table; warn style, goes back to the normal hint by itself */
function flashHint(msg, ms) {
  var h = $("hintP"); h.textContent = msg; h.classList.add("warn");
  clearTimeout(hintTimer);
  hintTimer = setTimeout(function () { h.classList.remove("warn"); h.textContent = sampleOn ? HINT_SAMPLE : HINT_NORMAL; }, ms || 3500);
}

/* undo */
function snapshot() { return JSON.stringify({ spread: S.spread, slots: S.slots, labels: S.labels, legend: S.legend }); }
function syncUndo() { var b = $("btnUndo"); if (b) b.disabled = !UNDO.length; }
function pushUndo() { if (sampleOn) return; UNDO.push(snapshot()); if (UNDO.length > 30) UNDO.shift(); syncUndo(); }
function undo() {
  if (!UNDO.length) return;
  var o = JSON.parse(UNDO.pop());
  S.spread = o.spread; S.slots = o.slots; S.labels = o.labels; S.legend = o.legend; S.sel = -1; meanSlot = -1; sampleOn = false;
  $("optLabels").checked = S.labels; $("optLegend").checked = S.legend;
  refreshAll(); syncUndo(); flashHint("ย้อนกลับแล้ว", 2000);
}
function dupCount(id) { var n = 0; if (!id) return 0; S.slots.forEach(function (s) { if (s.card === id) n++; }); return n; }

function pickCard(id) {
  if (sampleOn) { sampleOn = false; S.slots.forEach(function (s) { s.card = null; s.rev = false; }); }
  else pushUndo();
  if (!S.slots.length) addSlot(true);
  if (S.sel < 0) {
    var e = -1; S.slots.forEach(function (s, i) { if (e < 0 && !s.card) e = i; });
    S.sel = e < 0 ? 0 : e;
  }
  var target = S.sel, dup = -1;
  S.slots.forEach(function (s, i) { if (dup < 0 && i !== target && s.card === id) dup = i; });
  S.slots[target].card = id; meanSlot = target;
  var nxt = -1; for (var i = target + 1; i < S.slots.length; i++) if (!S.slots[i].card) { nxt = i; break; }
  if (nxt >= 0) S.sel = nxt;
  $("hintP").textContent = HINT_NORMAL;
  buildSlotChips(); buildGrid(); syncForm(); redraw();
  if (nxt < 0) closeSheet();
  if (dup >= 0) flashHint("ใบนี้อยู่ที่ช่อง " + (dup + 1) + " แล้ว ถ้าตั้งใจวางซ้ำก็ไม่ต้องทำอะไร");
}
function addSlot(silent) {
  if (!silent) pushUndo();
  var d = curDef(), n = S.slots.length + 1, off = (S.slots.length % 6) * 28;
  S.slots.push({ label: "ช่อง " + n, x: d.w / 2 + off, y: d.h / 2 - 30 + off, turn: 0, card: null, rev: false });
  S.sel = S.slots.length - 1; meanSlot = -1; buildSlotChips(); buildGrid(); syncForm(); redraw();
}
$("btnAdd").addEventListener("click", function () { addSlot(false); });
$("slotLabel").addEventListener("input", function () { if (S.sel >= 0) { S.slots[S.sel].label = this.value; buildSlotChips(); redraw(); } });
$("slotRev").addEventListener("change", function () { if (S.sel >= 0) { pushUndo(); S.slots[S.sel].rev = this.checked; buildSlotChips(); redraw(); } });
$("slotTurn").addEventListener("change", function () { if (S.sel >= 0) { pushUndo(); S.slots[S.sel].turn = this.checked ? 1 : 0; redraw(); } });
$("btnClear").addEventListener("click", function () { if (S.sel >= 0 && S.slots[S.sel].card) { pushUndo(); S.slots[S.sel].card = null; S.slots[S.sel].rev = false; buildSlotChips(); buildGrid(); syncForm(); redraw(); } });
$("btnDel").addEventListener("click", function () { if (S.sel >= 0) { pushUndo(); S.slots.splice(S.sel, 1); S.sel = -1; meanSlot = -1; buildSlotChips(); buildGrid(); syncForm(); redraw(); } });
$("q").addEventListener("input", function () { query = this.value; buildTabs(); buildGrid(); });
$("q").addEventListener("keydown", function (e) {
  if (e.key !== "Enter" || e.isComposing) return;
  e.preventDefault();
  if (!LASTRES.length) return;
  var id = LASTRES[0].id;
  this.value = ""; query = ""; buildTabs();
  pickCard(id);
});
$("btnUndo").addEventListener("click", undo);
document.addEventListener("keydown", function (e) {
  if (!(e.ctrlKey || e.metaKey) || e.shiftKey || (e.key !== "z" && e.key !== "Z")) return;
  var t = document.activeElement && document.activeElement.tagName;
  if (t === "INPUT" || t === "TEXTAREA") return;
  if (!$("guide").hidden || !$("dlg").hidden) return;
  e.preventDefault(); undo();
});

/* remember the table in this browser */
function scheduleSave() {
  if (sampleOn || saveTimer) return;
  saveTimer = setTimeout(function () {
    saveTimer = 0;
    if (sampleOn) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ spread: S.spread, slots: S.slots, bg: S.bg, scale: S.scale, title: S.title, labels: S.labels, nums: S.nums, legend: S.legend }));
    } catch (e) {}
  }, 400);
}
function applySaved() {
  var o = null;
  try { o = JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch (e) { o = null; }
  if (!o || !Array.isArray(o.slots) || !SPREADS.some(function (d) { return d.key === o.spread; })) return false;
  S.spread = o.spread;
  S.slots = o.slots.slice(0, 40).map(function (x) {
    return { label: String(x.label == null ? "" : x.label).slice(0, 40), x: +x.x || 0, y: +x.y || 0, turn: x.turn ? 1 : 0, card: x.card && CARD_BY_ID[x.card] ? x.card : null, rev: !!x.rev };
  });
  if (BGS.some(function (b) { return b.key === o.bg; })) S.bg = o.bg;
  S.scale = Math.max(70, Math.min(130, +o.scale || 100));
  S.title = String(o.title || "").slice(0, 60);
  S.labels = !!o.labels; S.nums = o.nums !== false; S.legend = !!o.legend;
  S.sel = -1; meanSlot = -1; sampleOn = false;
  $("title").value = S.title; $("scale").value = String(S.scale);
  $("optLabels").checked = S.labels; $("optNums").checked = S.nums; $("optLegend").checked = S.legend;
  buildBg(); refreshAll();
  $("hintP").textContent = HINT_NORMAL;
  return true;
}
/* ask the browser not to wipe the stored card images when space runs low */
function askPersist() { try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {} }

/* settings */
$("title").addEventListener("input", function () { S.title = this.value; redraw(); });
$("scale").addEventListener("input", function () { S.scale = +this.value; redraw(); });
$("optLabels").addEventListener("change", function () { S.labels = this.checked; redraw(); });
$("optNums").addEventListener("change", function () { S.nums = this.checked; redraw(); });
$("optLegend").addEventListener("change", function () { S.legend = this.checked; redraw(); });
function buildBg() {
  var box = $("bgSw"); box.innerHTML = "";
  BGS.forEach(function (b) {
    var sw = document.createElement("button"); sw.type = "button"; sw.className = "sw" + (b.bg ? "" : " none");
    if (b.bg) sw.style.background = b.bg;
    sw.title = b.th; sw.setAttribute("aria-label", "พื้น" + b.th);
    sw.setAttribute("aria-pressed", b.key === S.bg ? "true" : "false");
    sw.addEventListener("click", function () { S.bg = b.key; buildBg(); redraw(); });
    box.appendChild(sw);
  });
}

/* reset */
var resetTimer = null;
$("btnReset").addEventListener("click", function () {
  var b = this;
  if (!b.dataset.arm) {
    b.dataset.arm = "1"; b.textContent = "ยืนยันล้าง?";
    resetTimer = setTimeout(function () { delete b.dataset.arm; b.textContent = "ล้างโต๊ะ"; }, 3000);
    return;
  }
  clearTimeout(resetTimer); delete b.dataset.arm; b.textContent = "ล้างโต๊ะ"; pushUndo();
  loadSpread(S.spread, false); sampleOn = false; $("hintP").textContent = HINT_NORMAL;
});

/* ---------- Your own card images ---------- */
var DB = "tarot-deck", ST = "imgs";
function idb() {
  return new Promise(function (res, rej) {
    try {
      var r = indexedDB.open(DB, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(ST); };
      r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); };
    } catch (e) { rej(e); }
  });
}
function idbPut(id, blob) { return idb().then(function (db) { return new Promise(function (res) { var t = db.transaction(ST, "readwrite"); t.objectStore(ST).put(blob, id); t.oncomplete = res; t.onerror = res; }); }).catch(function () {}); }
function idbAll() {
  return idb().then(function (db) { return new Promise(function (res) {
    var out = [], t = db.transaction(ST, "readonly"), rq = t.objectStore(ST).openCursor();
    rq.onsuccess = function () { var c = rq.result; if (c) { out.push([c.key, c.value]); c.continue(); } else res(out); };
    rq.onerror = function () { res(out); };
  }); }).catch(function () { return []; });
}
function idbClear() { return idb().then(function (db) { return new Promise(function (res) { var t = db.transaction(ST, "readwrite"); t.objectStore(ST).clear(); t.oncomplete = res; t.onerror = res; }); }).catch(function () {}); }

function putImage(id, blob, persist) {
  return new Promise(function (res) {
    var url = URL.createObjectURL(blob), im = new Image();
    im.onload = function () { IMGS[id] = shrink(im); SRC[id] = "mine"; if (persist) { idbPut(id, blob); askPersist(); } res(true); };
    im.onerror = function () { URL.revokeObjectURL(url); res(false); };
    im.src = url;
  });
}
var NUMW = ["ace","two","three","four","five","six","seven","eight","nine","ten","page","knight","queen","king"];
var SUITW = [["w", /wand|staff|stave|baton/], ["c", /cup|chalice/], ["s", /sword/], ["p", /pent|coin|disc|disk/]];
function matchFile(name) {
  var base = name.replace(/\.[^.]+$/, "").toLowerCase(), s = base.replace(/[^a-z0-9]/g, ""), i, m;
  var sk = null;
  for (i = 0; i < SUITW.length; i++) if (SUITW[i][1].test(s)) sk = SUITW[i][0];
  if (!sk) { m = s.match(/^([wcsp])(\d{1,2})$/); if (m && +m[2] >= 1 && +m[2] <= 14) return m[1] + (+m[2]); }
  if (sk) {
    m = s.match(/(\d{1,2})/); if (m && +m[1] >= 1 && +m[1] <= 14) return sk + (+m[1]);
    for (i = 0; i < NUMW.length; i++) if (s.indexOf(NUMW[i]) >= 0) return sk + (i + 1);
    return null;
  }
  var t = s.replace(/rws|tarot/g, "");
  var keys = MAJOR.map(function (x, n) { return [x[1].toLowerCase().replace(/^the /, "").replace(/[^a-z]/g, ""), n]; })
    .concat([["priestess", 2], ["wheel", 10], ["hanged", 12], ["pope", 5], ["judgment", 20]]);
  keys.sort(function (a, b) { return b[0].length - a[0].length; });
  for (i = 0; i < keys.length; i++) if (t.indexOf(keys[i][0]) >= 0) return "m" + keys[i][1];
  m = t.match(/^(?:m|ar|major|maj|trump|trumps)?0*(\d{1,2})$/);
  if (m && +m[1] <= 21) return "m" + (+m[1]);
  return null;
}
$("bulk").addEventListener("change", function () {
  var files = Array.prototype.slice.call(this.files), ok = 0, miss = [], jobs = [], inp = this;
  files.forEach(function (f) {
    var id = matchFile(f.name);
    if (!id || !CARD_BY_ID[id]) { miss.push(f.name); return; }
    jobs.push(putImage(id, f, true).then(function (good) { if (good) ok++; else miss.push(f.name); }));
  });
  Promise.all(jobs).then(function () {
    $("imgStatus").textContent = "จับคู่ได้ " + ok + " รูป" + (miss.length ? " · ไม่พบชื่อไพ่ในไฟล์: " + miss.slice(0, 4).join(", ") + (miss.length > 4 ? " และอีก " + (miss.length - 4) + " ไฟล์" : "") : "");
    buildGrid(); redraw(); inp.value = "";
  });
});
$("one").addEventListener("change", function () {
  var f = this.files[0], inp = this, sl = S.sel >= 0 ? S.slots[S.sel] : null;
  if (!f) return;
  if (!sl || !sl.card) { $("imgStatus").textContent = "เลือกช่องและไพ่ก่อน แล้วค่อยใส่รูปของไพ่ใบนั้น"; inp.value = ""; return; }
  putImage(sl.card, f, true).then(function (good) {
    $("imgStatus").textContent = good ? "ใส่รูปให้ " + CARD_BY_ID[sl.card].th + " แล้ว" : "เปิดไฟล์รูปนี้ไม่ได้";
    buildGrid(); redraw(); inp.value = "";
  });
});
var wipeTimer = null;
$("btnWipe").addEventListener("click", function () {
  var b = this;
  if (!b.dataset.arm) { b.dataset.arm = "1"; b.textContent = "กดอีกครั้งเพื่อลบรูปทั้งหมด"; wipeTimer = setTimeout(function () { delete b.dataset.arm; b.textContent = "ลบรูปที่เก็บไว้"; }, 3000); return; }
  clearTimeout(wipeTimer); delete b.dataset.arm; b.textContent = "ลบรูปที่เก็บไว้";
  IMGS = {}; SRC = {}; REPO.tried = {};
  idbClear().then(function () { $("imgStatus").textContent = "ลบรูปที่เก็บไว้แล้ว กลับไปใช้รูปจากเว็บ (ถ้ามี)"; buildGrid(); redraw(); });
});

/* ---------- Export ---------- */
var exportBlob = null, exportUrl = null, dlApi = null;
function stamp() { var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; }; return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()); }
$("btnExport").addEventListener("click", function () {
  var D = dims(), cv = document.createElement("canvas"), sc = 2;
  cv.width = D.W * sc; cv.height = D.H * sc;
  drawBoard(cv.getContext("2d"), sc, true);
  function fail() { flashHint("บันทึกรูปไม่ได้ เพราะเปิดไฟล์จากในเครื่องโดยตรงพร้อมรูปในโฟลเดอร์ cards ให้เปิดผ่านเว็บ GitHub หรือ Live Server แทน", 9000); }
  try {
    cv.toBlob(function (blob) {
      if (!blob) { fail(); return; }
      if (exportUrl) URL.revokeObjectURL(exportUrl);
      exportBlob = blob; exportUrl = URL.createObjectURL(blob);
      $("dlgImg").src = exportUrl; $("dlgStatus").textContent = "";
      $("dlgSave").hidden = false;
      $("dlg").hidden = false; $("dlgSave").focus();
    }, "image/png");
  } catch (e) { fail(); }
});
$("dlgClose").addEventListener("click", function () { $("dlg").hidden = true; });
$("dlg").addEventListener("click", function (e) { if (e.target === this) this.hidden = true; });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") $("dlg").hidden = true; });
$("dlgSave").addEventListener("click", function () {
  if (!exportBlob) return;
  var st = $("dlgStatus"); st.textContent = "";
  if (!dlApi) { var a = document.createElement("a"); a.href = exportUrl; a.download = "tarot-" + S.spread + "-" + stamp() + ".png"; document.body.appendChild(a); a.click(); a.remove(); st.textContent = "กำลังบันทึกรูป ดูในโฟลเดอร์ดาวน์โหลด"; return; }
  dlApi.save({ filename: "tarot-" + S.spread + "-" + stamp() + ".png", data: exportBlob }).then(function () {
    st.textContent = "บันทึกรูปแล้ว";
  }).catch(function (err) {
    var c = err && err.code;
    st.textContent = c === "declined" ? "ยังไม่ได้บันทึก กดบันทึกไฟล์อีกครั้งเมื่อพร้อม"
      : c === "rate_limited" ? "รอสักครู่แล้วกดอีกครั้ง"
      : "บันทึกจากปุ่มนี้ไม่ได้ ให้กดค้างที่รูปแล้วเลือกบันทึกรูปภาพ";
  });
});

/* ---------- Mobile helpers: bottom bar, picker sheet, zoom ---------- */
function NARROW() { return !!(window.matchMedia && window.matchMedia("(max-width: 940px)").matches); }
function openSheet() { if (NARROW() && S.sel >= 0) document.body.classList.add("sheet-open"); }
function closeSheet() { document.body.classList.remove("sheet-open"); }
function updateBar() {
  var sl = S.sel >= 0 ? S.slots[S.sel] : null, c = sl ? slotName(sl) : null;
  $("mbar").hidden = !sl;
  document.body.classList.toggle("has-bar", !!sl);
  $("mbTitle").textContent = sl ? "ช่องที่ " + (S.sel + 1) + " · " + (sl.label || "ช่อง") + " : " + (c ? c.th + (sl.rev ? " (กลับหัว)" : "") : "ยังไม่เลือกไพ่") : "";
  $("sheetTitle").textContent = sl ? "เลือกไพ่ให้ช่องที่ " + (S.sel + 1) + (sl.label ? " · " + sl.label : "") : "เลือกไพ่";
  $("mbPick").textContent = c ? "เปลี่ยนไพ่" : "เลือกไพ่";
  $("mbRev").disabled = !c; $("mbMean").disabled = !c; $("mbClear").disabled = !c;
  if (!sl) closeSheet();
}
$("mbPick").addEventListener("click", openSheet);
$("sheetClose").addEventListener("click", closeSheet);
$("mbRev").addEventListener("click", function () {
  if (S.sel < 0) return;
  pushUndo(); S.slots[S.sel].rev = !S.slots[S.sel].rev;
  buildSlotChips(); syncForm(); redraw();
});
$("mbClear").addEventListener("click", function () { $("btnClear").click(); });
$("mbMean").addEventListener("click", function () {
  var m = $("meanBox"); if (!m.hidden) m.scrollIntoView({ behavior: "smooth", block: "start" });
});
$("btnZoom").addEventListener("click", function () {
  var on = !$("stage").classList.contains("zoom");
  $("stage").classList.toggle("zoom", on);
  this.setAttribute("aria-pressed", on ? "true" : "false");
  this.textContent = on ? "ย่อให้พอดีจอ" : "ขยายโต๊ะ (เลื่อนดูซ้ายขวาได้)";
});
document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

/* ---------- Start ---------- */
buildTabs(); buildBg(); syncUndo();
if (!applySaved()) {
  loadSpread("celtic", false);
  (function sample() {
    var ids = ["m0", "m16", "c5", "s10", "w1", "p14", "m17", "c12", "s3", "m21"], rv = { 1: 1, 3: 1, 8: 1 };
    ids.forEach(function (id, i) { if (S.slots[i]) { S.slots[i].card = id; S.slots[i].rev = !!rv[i]; } });
    $("hintP").textContent = HINT_SAMPLE; sampleOn = true;
    buildSlotChips(); buildGrid(); redraw();
  })();
}
idbAll().then(function (rows) {
  var jobs = rows.map(function (r) { return putImage(r[0], r[1], false); });
  Promise.all(jobs).then(function () { if (rows.length) { $("imgStatus").textContent = "โหลดรูปไพ่ที่เก็บไว้ " + rows.length + " รูป"; buildGrid(); redraw(); } });
});
if (document.fonts && document.fonts.load) {
  Promise.all([
    document.fonts.load('700 20px "Mali"', "ไพ่กขค"), document.fonts.load('500 20px "Mali"', "ไพ่กขค"), document.fonts.load('600 20px "Mali"', "ไพ่กขค"),
    document.fonts.load('400 20px "Sriracha"', "ไพ่กขค"), document.fonts.load('600 20px "Fredoka"', "0123XVI")
  ]).then(redraw, redraw);
}
try {
  if (window.claude && window.claude.use) window.claude.use("downloads").then(function (d) { dlApi = d || null; }, function () { dlApi = null; });
} catch (e) { dlApi = null; }
