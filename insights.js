// Insights page: verified registers (real) + DEMO-watermarked sample analytics.
// Chart colors validated with the dataviz palette validator (light surface):
//  tier trio  #008300 (T3) / #2a78d6 (T2) / #eb6834 (T1): all checks pass
//  stack-5    #2a78d6,#eb6834,#1baf7a,#eda100,#e87ba4: pass, contrast WARN => direct labels + table relief provided
(function(){
var I = QI_I18N, N = I.insights;
var TIER = { 1:"#eb6834", 2:"#2a78d6", 3:"#008300" };
var STACK = ["#2a78d6","#eb6834","#1baf7a","#eda100","#e87ba4"];
var SEQ = ["#cfe3f7","#a6c8f0","#71a7e4","#4e90dd","#2a78d6"]; // one hue, light -> dark
var C = QI_COUNTRIES;

function el(id){ return document.getElementById(id); }
function badge(kind){ return '<span class="badge ' + (kind === "real" ? "real" : "demo") + '">' + esc(T(kind === "real" ? N.real : N.demo)) + '</span>'; }

// tooltip
var tip = document.createElement("div");
tip.style.cssText = "position:fixed;pointer-events:none;background:#0E3550;color:#fff;font-size:12px;padding:6px 9px;border-radius:6px;opacity:0;transition:opacity .12s;z-index:50;max-width:240px";
document.body.appendChild(tip);
window.qiTip = function(evt, html){
  if (!html) { tip.style.opacity = 0; return; }
  tip.innerHTML = html; tip.style.opacity = 1;
  var x = Math.min(evt.clientX + 14, window.innerWidth - 250);
  tip.style.left = x + "px"; tip.style.top = (evt.clientY + 14) + "px";
};

// ---------- KPI row (real) ----------
var t3 = C.filter(function(c){ return c.tier === 3; }).length;
var t2 = C.filter(function(c){ return c.tier === 2; }).length;
var t1 = C.filter(function(c){ return c.tier === 1; }).length;
el("kpis").innerHTML =
  '<div class="kpi"><b>55</b><span>' + esc(T(I.countries.title)) + '</span></div>' +
  '<div class="kpi"><b style="color:#008300">' + t3 + '</b><span>' + esc(T(I.tiers[3].name)) + '</span></div>' +
  '<div class="kpi"><b style="color:#2a78d6">' + t2 + '</b><span>' + esc(T(I.tiers[2].name)) + '</span></div>' +
  '<div class="kpi"><b style="color:#eb6834">' + t1 + '</b><span>' + esc(T(I.tiers[1].name)) + '</span></div>' +
  '<div class="kpi"><b>16</b><span>' + esc(T(I.countries.active)) + '</span></div>';

// ---------- donut (real) ----------
function donut(){
  var data = [ { k:T(I.tiers[3].name), v:t3, c:TIER[3] }, { k:T(I.tiers[2].name), v:t2, c:TIER[2] }, { k:T(I.tiers[1].name), v:t1, c:TIER[1] } ];
  var total = 55, r = 70, cx = 90, cy = 90, sw = 30, gap = 0.035; // ~2px gap as angle
  var a0 = -Math.PI / 2, paths = "";
  data.forEach(function(d){
    var a1 = a0 + (d.v / total) * Math.PI * 2;
    var s = a0 + gap / 2, e = a1 - gap / 2;
    var large = (e - s) > Math.PI ? 1 : 0;
    var x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s), x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
    var mid = (s + e) / 2, lx = cx + (r) * Math.cos(mid) * 1.0, ly = cy + r * Math.sin(mid);
    paths += '<path d="M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2 + ' ' + y2 + '" fill="none" stroke="' + d.c + '" stroke-width="' + sw + '" data-tip="' + esc(d.k) + ': ' + d.v + '"></path>';
    var tx = cx + (r) * Math.cos(mid), ty = cy + (r) * Math.sin(mid);
    paths += '<text x="' + tx + '" y="' + (ty + 4) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">' + d.v + '</text>';
    a0 = a1;
  });
  var svg = '<svg viewBox="0 0 180 180" width="180" height="180" role="img" aria-label="' + esc(T(N.tierDist)) + '">' + paths +
    '<text x="90" y="86" text-anchor="middle" font-size="30" font-weight="800" fill="#14486B">55</text>' +
    '<text x="90" y="104" text-anchor="middle" font-size="9" fill="#5A6B76">AU</text></svg>';
  var legend = '<div class="legend">' + data.map(function(d){ return '<span><i style="background:' + d.c + '"></i>' + esc(d.k) + ' (' + d.v + ')</span>'; }).join("") + '</div>';
  el("donut").innerHTML = '<div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">' + svg +
    '<div style="flex:1;min-width:220px">' + legend + '<p class="src">' + esc(T(N.asOf)) + '</p></div></div>';
}
donut();

// ---------- wave-1 (real) ----------
(function(){
  var groups = [3, 2, 1].map(function(t){
    var names = C.filter(function(c){ return c.w1 && c.tier === t; }).map(function(c){ return c[qiLang]; });
    return '<div class="mrow"><div class="rlab"><span class="tierpill t' + t + '">' + esc(T(I.tiers[t].name)) + '</span> · ' + names.length + '</div>' +
      '<div style="font-size:13px">' + esc(names.join(" · ")) + '</div></div>';
  }).join("");
  el("w1").innerHTML = '<div class="matrix">' + groups + '</div>';
})();

// ---------- status board (real) ----------
function board(filter){
  var q = (filter || "").toLowerCase();
  var rows = C.slice().sort(function(a, b){
    return (b.tier - a.tier) || (b.score - a.score) || a.en.localeCompare(b.en);
  }).filter(function(c){
    return !q || c.en.toLowerCase().indexOf(q) >= 0 || c.fr.toLowerCase().indexOf(q) >= 0 || c.ar.indexOf(filter) >= 0;
  }).map(function(c){
    return "<tr><td><b>" + esc(c[qiLang]) + "</b></td>" +
      '<td><span class="tierpill t' + c.tier + '">' + c.tier + (c.upper ? "+" : "") + '</span></td>' +
      "<td>" + c.score.toFixed(1) + "</td>" +
      "<td>" + esc(T(N.accLabels[c.acc])) + "</td>" +
      "<td>" + esc(T(N.metLabels[c.met])) + "</td>" +
      "<td>" + esc(T(N.isoLabels[c.iso])) + "</td>" +
      "<td>" + (c.gqii ? "#" + c.gqii : "·") + "</td>" +
      "<td>" + (c.w1 ? "W1" : "·") + "</td></tr>";
  }).join("");
  el("board").innerHTML = rows;
}
board("");
el("bsearch").addEventListener("input", function(){ board(this.value); });

// ---------- DEMO charts ----------
var FUND = {
  labels: [T({en:"Government budget",fr:"Budget de l'État",ar:"الموازنة الحكومية"}), T({en:"Fees and earned income",fr:"Redevances et recettes propres",ar:"الرسوم والإيرادات الذاتية"}),
           T({en:"Earmarked levies",fr:"Prélèvements affectés",ar:"الرسوم المخصصة"}), T({en:"Donor and concessional",fr:"Bailleurs et concessionnel",ar:"المانحون والتمويل الميسر"}),
           T({en:"Private and other",fr:"Privé et autres",ar:"القطاع الخاص وغيره"})],
  tiers: [ { name:T(I.tiers[1].name), c:TIER[1], v:[38,12,5,40,5] },
           { name:T(I.tiers[2].name), c:TIER[2], v:[45,27,8,15,5] },
           { name:T(I.tiers[3].name), c:TIER[3], v:[40,38,10,7,5] } ]
};
function stackChart(){
  var W = 640, rowH = 42, pad = 150, bh = 20;
  var rows = FUND.tiers.map(function(t, ri){
    var x = pad, y = 18 + ri * rowH, seg = "";
    t.v.forEach(function(v, i){
      var w = (W - pad - 10) * v / 100;
      seg += '<rect x="' + x + '" y="' + y + '" width="' + Math.max(w - 2, 1) + '" height="' + bh + '" rx="3" fill="' + STACK[i] + '" data-tip="' + esc(t.name) + " · " + esc(FUND.labels[i]) + ": " + v + '%"></rect>';
      if (v >= 10) seg += '<text x="' + (x + w / 2 - 1) + '" y="' + (y + 14) + '" text-anchor="middle" font-size="10.5" font-weight="700" fill="#fff">' + v + '</text>';
      x += w;
    });
    return '<text x="' + (pad - 8) + '" y="' + (y + 14) + '" text-anchor="end" font-size="11.5" fill="#222">' + esc(t.name) + '</text>' + seg;
  }).join("");
  el("c-fund").innerHTML = '<svg viewBox="0 0 ' + W + ' 150" style="width:100%;height:auto" role="img">' + rows + '</svg>' +
    '<div class="legend">' + FUND.labels.map(function(l, i){ return '<span><i style="background:' + STACK[i] + '"></i>' + esc(l) + '</span>'; }).join("") + '</div>';
}
stackChart();

function sevChart(){
  var data = [ { n:T(I.tiers[1].name), v:4.4, c:TIER[1] }, { n:T(I.tiers[2].name), v:3.8, c:TIER[2] }, { n:T(I.tiers[3].name), v:3.1, c:TIER[3] } ];
  var W = 640, pad = 150, rowH = 38;
  var bars = data.map(function(d, i){
    var w = (W - pad - 60) * d.v / 5, y = 12 + i * rowH;
    return '<text x="' + (pad - 8) + '" y="' + (y + 13) + '" text-anchor="end" font-size="11.5" fill="#222">' + esc(d.n) + '</text>' +
      '<rect x="' + pad + '" y="' + y + '" width="' + w + '" height="18" rx="3" fill="' + d.c + '" data-tip="' + esc(d.n) + ': ' + d.v + ' / 5"></rect>' +
      '<text x="' + (pad + w + 8) + '" y="' + (y + 13) + '" font-size="11.5" font-weight="700" fill="#222">' + d.v + '</text>';
  }).join("");
  el("c-sev").innerHTML = '<svg viewBox="0 0 ' + W + ' 130" style="width:100%;height:auto" role="img">' + bars +
    '<line x1="' + pad + '" y1="122" x2="' + (W - 50) + '" y2="122" stroke="#D5DEE5"/>' +
    '<text x="' + pad + '" y="118" font-size="9" fill="#5A6B76">1</text><text x="' + (W - 60) + '" y="118" font-size="9" fill="#5A6B76">5</text></svg>';
}
sevChart();

function gapChart(){
  var bands = [T({en:"Under 0.5M",fr:"Moins de 0,5 M",ar:"أقل من 0.5 مليون"}), T({en:"0.5-2M",fr:"0,5 à 2 M",ar:"0.5-2 مليون"}), T({en:"2-5M",fr:"2 à 5 M",ar:"2-5 ملايين"}), T({en:"5-20M",fr:"5 à 20 M",ar:"5-20 مليوناً"}), T({en:"Above 20M",fr:"Plus de 20 M",ar:"أكثر من 20 مليوناً"})];
  var vals = [6, 11, 12, 8, 3], max = 12;
  var W = 640, H = 170, pad = 40, bw = (W - pad - 20) / 5;
  var bars = vals.map(function(v, i){
    var bh = 110 * v / max, x = pad + i * bw + 8, y = 130 - bh;
    return '<rect x="' + x + '" y="' + y + '" width="' + (bw - 18) + '" height="' + bh + '" rx="3" fill="' + SEQ[i] + '" data-tip="' + esc(bands[i]) + " USD: " + v + '"></rect>' +
      '<text x="' + (x + (bw - 18) / 2) + '" y="' + (y - 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#222">' + v + '</text>' +
      '<text x="' + (x + (bw - 18) / 2) + '" y="147" text-anchor="middle" font-size="9.5" fill="#5A6B76">' + esc(bands[i]) + '</text>';
  }).join("");
  el("c-gap").innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto" role="img"><line x1="' + pad + '" y1="130" x2="' + (W - 12) + '" y2="130" stroke="#D5DEE5"/>' + bars + '</svg>';
}
gapChart();

// tooltips
document.addEventListener("mousemove", function(e){
  var t = e.target.closest ? e.target.closest("[data-tip]") : null;
  qiTip(e, t ? esc(t.getAttribute("data-tip")) : null);
});
})();
