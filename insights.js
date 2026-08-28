// Insights page: verified registers (real) + DEMO-watermarked sample analytics.
// Chart colors validated with the dataviz palette validator (light surface):
//  tier trio  #008300 (T3) / #2a78d6 (T2) / #eb6834 (T1): all checks pass
//  stack-5    #2a78d6,#eb6834,#1baf7a,#eda100,#e87ba4: pass, contrast WARN => direct labels + table relief provided
(function(){
var I = QI_I18N, N = I.insights;
var TIER = { 1:"#eb6834", 2:"#2a78d6", 3:"#008300" };
var STACK = ["#2a78d6","#eb6834","#1baf7a","#eda100","#e87ba4"];
var SEQ = ["#cfe3f7","#a6c8f0","#71a7e4","#4e90dd","#2a78d6"]; // one hue, light -> dark
var CLIST = QI_COUNTRIES.filter(function(c){ return c.region === "africa"; });      // full AU listing
var C = CLIST.filter(function(c){ return c.iso3 !== "ESH"; });                     // aggregation basis

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
  '<div class="kpi"><b>' + CLIST.length + '</b><span>' + esc(T(I.countries.title)) + '</span></div>' +
  '<div class="kpi"><b style="color:#008300">' + t3 + '</b><span>' + esc(T(I.tiers[3].name)) + '</span></div>' +
  '<div class="kpi"><b style="color:#2a78d6">' + t2 + '</b><span>' + esc(T(I.tiers[2].name)) + '</span></div>' +
  '<div class="kpi"><b style="color:#eb6834">' + t1 + '</b><span>' + esc(T(I.tiers[1].name)) + '</span></div>' +
  '<div class="kpi"><b>' + CLIST.filter(function(c){ return c.w1; }).length + '</b><span>' + esc(T(I.regions.statusOpen)) + '</span></div>';

// ---------- donut (real) ----------
function donut(){
  var data = [ { k:T(I.tiers[3].name), v:t3, c:TIER[3] }, { k:T(I.tiers[2].name), v:t2, c:TIER[2] }, { k:T(I.tiers[1].name), v:t1, c:TIER[1] } ];
  var total = C.length, r = 70, cx = 90, cy = 90, sw = 30, gap = 0.035; // ~2px gap as angle
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
  var rows = CLIST.slice().sort(function(a, b){
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

// ============================================================================
// Round 3 additions: more verified figures, demo figures, and the report
// builder with client-side CSV / Excel / Word / PowerPoint export engines.
// No external libraries; everything stays low-bandwidth and offline-capable.
// ============================================================================
(function(){
var I = QI_I18N, N = I.insights;
var C = QI_COUNTRIES.filter(function(c){ return c.region === "africa" && c.iso3 !== "ESH"; });
var ALL = QI_COUNTRIES;
var TIER = { 1:"#eb6834", 2:"#2a78d6", 3:"#008300" };
var SEQ = ["#cfe3f7","#a6c8f0","#71a7e4","#4e90dd","#2a78d6"];
function el(id){ return document.getElementById(id); }
function tt(o){ return T(o); }
var L = {
  routes:{ en:"Accreditation routes across the African member states", fr:"Voies d'accréditation des États membres africains", ar:"مسارات الاعتماد في الدول الأفريقية الأعضاء" },
  met:{ en:"Metrology recognition (BIPM) across the African member states", fr:"Reconnaissance métrologique (BIPM) des États membres africains", ar:"الاعتراف المترولوجي (BIPM) في الدول الأفريقية الأعضاء" },
  hist:{ en:"Distribution of recognition scores S (0-10)", fr:"Distribution des scores de reconnaissance S (0-10)", ar:"توزيع درجات الاعتراف S (0-10)" },
  gqii:{ en:"Top 10 African economies in GQII 2025", fr:"Top 10 africain au GQII 2025", ar:"أفضل 10 اقتصادات أفريقية في مؤشر GQII 2025" },
  gcols:[ {en:"Rank in Africa",fr:"Rang en Afrique",ar:"الترتيب في أفريقيا"}, {en:"Country",fr:"Pays",ar:"البلد"}, {en:"GQII 2025 (global rank)",fr:"GQII 2025 (rang mondial)",ar:"GQII 2025 (الترتيب العالمي)"}, {en:"Tier",fr:"Palier",ar:"الفئة"} ],
  lang:{ en:"Responses by survey language (sample)", fr:"Réponses par langue de l'enquête (exemple)", ar:"الإجابات حسب لغة الاستبيان (عينة)" },
  mins:{ en:"Median completion minutes by respondent module (sample)", fr:"Minutes médianes de complétion par module (exemple)", ar:"الوسيط بالدقائق حسب وحدة المجيب (عينة)" },
  rbTitle:{ en:"Report builder: search, combine and download", fr:"Générateur de rapports : rechercher, combiner et télécharger", ar:"منشئ التقارير: بحث ودمج وتنزيل" },
  rbLead:{ en:"Choose any combination of countries and data sections, then download the report in the format you need. Verified register data and DEMO sample aggregates are always labeled.",
           fr:"Choisissez toute combinaison de pays et de sections de données, puis téléchargez le rapport au format voulu. Les données vérifiées et les agrégats d'exemple DEMO restent toujours étiquetés.",
           ar:"اختاروا أي مزيج من البلدان وأقسام البيانات ثم نزّلوا التقرير بالصيغة المطلوبة. تبقى البيانات المُتحقَّق منها وعينات DEMO موسومة دائماً." },
  scope:{ en:"Countries", fr:"Pays", ar:"البلدان" },
  scopeAll:{ en:"All ACP countries (Africa, Caribbean, Pacific)", fr:"Tous les pays ACP (Afrique, Caraïbes, Pacifique)", ar:"جميع بلدان مجموعة أفريقيا والكاريبي والمحيط الهادئ" },
  scopeAfrica:{ en:"Africa (55 AU member states)", fr:"Afrique (55 États membres de l'UA)", ar:"أفريقيا (55 دولة عضواً في الاتحاد الأفريقي)" },
  scopeCarib:{ en:"Caribbean (16 OACPS members)", fr:"Caraïbes (16 membres de l'OEACP)", ar:"الكاريبي (16 عضواً في الأواكبس)" },
  scopePacific:{ en:"Pacific (15 OACPS members)", fr:"Pacifique (15 membres de l'OEACP)", ar:"المحيط الهادئ (15 عضواً في الأواكبس)" },
  scopeW1:{ en:"Countries open for the survey", fr:"Pays ouverts à l'enquête", ar:"البلدان المفتوحة للاستبيان" },
  scopeT:{ en:"Tier", fr:"Palier", ar:"الفئة" },
  scopeCustom:{ en:"Custom selection (pick below)", fr:"Sélection personnalisée (choisir ci-dessous)", ar:"اختيار مخصص (حدّدوا أدناه)" },
  customHint:{ en:"Hold Ctrl / Cmd to pick several countries.", fr:"Maintenez Ctrl / Cmd pour choisir plusieurs pays.", ar:"اضغطوا Ctrl / Cmd باستمرار لاختيار عدة بلدان." },
  sections:{ en:"Data sections", fr:"Sections de données", ar:"أقسام البيانات" },
  s_reg:{ en:"Country recognition register (verified)", fr:"Registre de reconnaissance par pays (vérifié)", ar:"سجل الاعتراف حسب البلد (مُتحقَّق)" },
  s_tier:{ en:"Tier and wave summary (verified)", fr:"Synthèse paliers et vagues (vérifié)", ar:"ملخص الفئات والموجات (مُتحقَّق)" },
  s_route:{ en:"Recognition route summaries (verified)", fr:"Synthèses des voies de reconnaissance (vérifié)", ar:"ملخصات مسارات الاعتراف (مُتحقَّق)" },
  s_fund:{ en:"Funding-source composition (DEMO sample)", fr:"Composition des financements (exemple DEMO)", ar:"تركيبة مصادر التمويل (عينة DEMO)" },
  s_sev:{ en:"Financing constraint severity (DEMO sample)", fr:"Sévérité de la contrainte (exemple DEMO)", ar:"شدة قيد التمويل (عينة DEMO)" },
  s_gap:{ en:"Funding-gap bands (DEMO sample)", fr:"Fourchettes de déficit (exemple DEMO)", ar:"نطاقات الفجوة التمويلية (عينة DEMO)" },
  fmt:{ en:"Download the report", fr:"Télécharger le rapport", ar:"تنزيل التقرير" },
  meta:{ en:"Files are generated on your device from the data above; nothing is sent to a server. Excel and Word files open directly in Office and LibreOffice; the PowerPoint file is a native .pptx.",
         fr:"Les fichiers sont générés sur votre appareil à partir des données ci-dessus ; rien n'est envoyé à un serveur. Excel et Word s'ouvrent directement dans Office et LibreOffice ; le fichier PowerPoint est un .pptx natif.",
         ar:"تُنشأ الملفات على جهازكم من البيانات أعلاه ولا يُرسل شيء إلى أي خادم. تفتح ملفات Excel وWord مباشرة في أوفيس وليبر أوفيس؛ وملف PowerPoint بصيغة pptx أصلية." },
  none:{ en:"Pick at least one country and one section.", fr:"Choisissez au moins un pays et une section.", ar:"اختاروا بلداً واحداً وقسماً واحداً على الأقل." },
  reportTitle:{ en:"QI Financing Survey report", fr:"Rapport de l'enquête sur le financement de l'IQ", ar:"تقرير استبيان تمويل البنية التحتية للجودة" },
  generated:{ en:"Generated from the prototype platform", fr:"Généré depuis la plateforme prototype", ar:"أُنشئ من المنصة التجريبية" },
  countriesIncl:{ en:"Countries included", fr:"Pays inclus", ar:"البلدان المشمولة" }
};

// ---------- REAL: accreditation routes ----------
(function(){
  el("t-routes").textContent = tt(L.routes);
  var keys = ["own","sadcas","soac","afrac","none"];
  var data = keys.map(function(k){ return { k:k, n:tt(N.accLabels[k]), v:C.filter(function(c){ return c.acc === k; }).length }; });
  var W = 640, pad = 210, rowH = 32, max = Math.max.apply(null, data.map(function(d){ return d.v; }));
  var bars = data.map(function(d, i){
    var w = (W - pad - 60) * d.v / max, y = 10 + i * rowH;
    return '<text x="' + (pad - 8) + '" y="' + (y + 13) + '" text-anchor="end" font-size="11.5" fill="#222">' + esc(d.n) + '</text>' +
      '<rect x="' + pad + '" y="' + y + '" width="' + Math.max(w, 2) + '" height="18" rx="3" fill="#2a78d6" data-tip="' + esc(d.n) + ': ' + d.v + '"></rect>' +
      '<text x="' + (pad + Math.max(w, 2) + 7) + '" y="' + (y + 13) + '" font-size="11.5" font-weight="700" fill="#222">' + d.v + '</text>';
  }).join("");
  el("c-routes").innerHTML = '<svg viewBox="0 0 ' + W + ' ' + (12 + data.length * rowH) + '" style="width:100%;height:auto" role="img">' + bars + '</svg>';
})();

// ---------- REAL: metrology recognition ----------
(function(){
  el("t-met").textContent = tt(L.met);
  var keys = ["member","assoc_cmc","assoc","none"];
  var data = keys.map(function(k){ return { n:tt(N.metLabels[k]), v:C.filter(function(c){ return c.met === k; }).length }; });
  var W = 640, pad = 210, rowH = 32, max = Math.max.apply(null, data.map(function(d){ return d.v; }));
  var bars = data.map(function(d, i){
    var w = (W - pad - 60) * d.v / max, y = 10 + i * rowH;
    return '<text x="' + (pad - 8) + '" y="' + (y + 13) + '" text-anchor="end" font-size="11.5" fill="#222">' + esc(d.n) + '</text>' +
      '<rect x="' + pad + '" y="' + y + '" width="' + Math.max(w, 2) + '" height="18" rx="3" fill="#1F7A8C" data-tip="' + esc(d.n) + ': ' + d.v + '"></rect>' +
      '<text x="' + (pad + Math.max(w, 2) + 7) + '" y="' + (y + 13) + '" font-size="11.5" font-weight="700" fill="#222">' + d.v + '</text>';
  }).join("");
  el("c-met").innerHTML = '<svg viewBox="0 0 ' + W + ' ' + (12 + data.length * rowH) + '" style="width:100%;height:auto" role="img">' + bars + '</svg>';
})();

// ---------- REAL: score histogram ----------
(function(){
  el("t-hist").textContent = tt(L.hist);
  var bins = [[0,2],[2,4],[4,6],[6,8],[8,10.01]];
  var labels = ["0-2","2-4","4-6","6-8","8-10"];
  var vals = bins.map(function(b){ return C.filter(function(c){ return c.score >= b[0] && c.score < b[1]; }).length; });
  var max = Math.max.apply(null, vals);
  var W = 640, pad = 40, bw = (W - pad - 20) / 5;
  var bars = vals.map(function(v, i){
    var bh = 110 * v / max, x = pad + i * bw + 8, y = 130 - bh;
    return '<rect x="' + x + '" y="' + y + '" width="' + (bw - 18) + '" height="' + Math.max(bh, 1) + '" rx="3" fill="' + SEQ[i] + '" data-tip="S ' + labels[i] + ': ' + v + '"></rect>' +
      '<text x="' + (x + (bw - 18) / 2) + '" y="' + (y - 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#222">' + v + '</text>' +
      '<text x="' + (x + (bw - 18) / 2) + '" y="147" text-anchor="middle" font-size="10" fill="#5A6B76">' + labels[i] + '</text>';
  }).join("");
  el("c-hist").innerHTML = '<svg viewBox="0 0 ' + W + ' 165" style="width:100%;height:auto" role="img"><line x1="' + pad + '" y1="130" x2="' + (W - 12) + '" y2="130" stroke="#D5DEE5"/>' + bars + '</svg>';
})();

// ---------- REAL: GQII top 10 ----------
(function(){
  el("t-gqii").textContent = tt(L.gqii);
  el("ghead").innerHTML = L.gcols.map(function(c){ return "<th>" + esc(tt(c)) + "</th>"; }).join("");
  var ranked = C.filter(function(c){ return c.gqii; }).sort(function(a, b){ return (+a.gqii) - (+b.gqii); }).slice(0, 10);
  el("gtop").innerHTML = ranked.map(function(c, i){
    return "<tr><td>" + (i + 1) + "</td><td><b>" + esc(c[qiLang]) + "</b></td><td>#" + c.gqii + "</td>" +
      '<td><span class="tierpill t' + c.tier + '">' + c.tier + "</span></td></tr>";
  }).join("");
})();

// ---------- DEMO: responses by language ----------
var DLANG = [ { n:"English", v:47 }, { n:"Français", v:31 }, { n:"العربية", v:8 } ];
(function(){
  el("t-lang").textContent = tt(L.lang);
  var W = 640, pad = 130, rowH = 32, max = 47;
  var bars = DLANG.map(function(d, i){
    var w = (W - pad - 60) * d.v / max, y = 10 + i * rowH;
    return '<text x="' + (pad - 8) + '" y="' + (y + 13) + '" text-anchor="end" font-size="11.5" fill="#222">' + esc(d.n) + '</text>' +
      '<rect x="' + pad + '" y="' + y + '" width="' + w + '" height="18" rx="3" fill="#eda100" data-tip="' + esc(d.n) + ': ' + d.v + '"></rect>' +
      '<text x="' + (pad + w + 7) + '" y="' + (y + 13) + '" font-size="11.5" font-weight="700" fill="#222">' + d.v + '</text>';
  }).join("");
  el("c-lang").innerHTML = '<svg viewBox="0 0 ' + W + ' 110" style="width:100%;height:auto" role="img">' + bars + '</svg>';
})();

// ---------- DEMO: median minutes by module ----------
var DMINS = [["F-FIN",22],["F-GOV",21],["F-QIP",24],["F-REG",20],["F-PSU",18],["F-BDF",19],["F-DEV",21]];
(function(){
  el("t-mins").textContent = tt(L.mins);
  var W = 640, pad = 60, bw = (W - pad - 20) / 7, max = 25;
  var bars = DMINS.map(function(d, i){
    var bh = 100 * d[1] / max, x = pad + i * bw + 6, y = 120 - bh;
    return '<rect x="' + x + '" y="' + y + '" width="' + (bw - 14) + '" height="' + bh + '" rx="3" fill="#1baf7a" data-tip="' + esc(tt(I.families[d[0]])) + ': ' + d[1] + ' min"></rect>' +
      '<text x="' + (x + (bw - 14) / 2) + '" y="' + (y - 5) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#222">' + d[1] + '</text>' +
      '<text x="' + (x + (bw - 14) / 2) + '" y="137" text-anchor="middle" font-size="9.5" fill="#5A6B76">' + d[0] + '</text>';
  }).join("");
  el("c-mins").innerHTML = '<svg viewBox="0 0 ' + W + ' 150" style="width:100%;height:auto" role="img"><line x1="' + pad + '" y1="120" x2="' + (W - 12) + '" y2="120" stroke="#D5DEE5"/>' + bars + '</svg>';
})();

// ============================ REPORT BUILDER ================================
var RB = el("rb");
function catList(){ return ALL.slice().sort(function(a,b){ return a[qiLang].localeCompare(b[qiLang], qiLang); }); }
RB.innerHTML =
  '<h3>' + esc(tt(L.rbTitle)) + '</h3><p class="sub" style="font-size:13px">' + esc(tt(L.rbLead)) + '</p>' +
  '<div class="rbgrid">' +
  '<fieldset><legend>' + esc(tt(L.scope)) + '</legend>' +
    '<select id="rb-scope">' +
      '<option value="africa">' + esc(tt(L.scopeAfrica)) + '</option>' +
      '<option value="all">' + esc(tt(L.scopeAll)) + '</option>' +
      '<option value="carib">' + esc(tt(L.scopeCarib)) + '</option>' +
      '<option value="pacific">' + esc(tt(L.scopePacific)) + '</option>' +
      '<option value="w1">' + esc(tt(L.scopeW1)) + '</option>' +
      '<option value="t3">' + esc(tt(L.scopeT)) + ' 3</option>' +
      '<option value="t2">' + esc(tt(L.scopeT)) + ' 2</option>' +
      '<option value="t1">' + esc(tt(L.scopeT)) + ' 1</option>' +
      '<option value="custom">' + esc(tt(L.scopeCustom)) + '</option>' +
    '</select>' +
    '<select id="rb-countries" multiple style="margin-top:8px;display:none">' +
      catList().map(function(c){ return '<option value="' + c.iso3 + '">' + esc(c[qiLang]) + '</option>'; }).join("") +
    '</select><div class="rbmeta" id="rb-customhint" style="display:none">' + esc(tt(L.customHint)) + '</div>' +
  '</fieldset>' +
  '<fieldset><legend>' + esc(tt(L.sections)) + '</legend>' +
    [["reg",L.s_reg,1],["tier",L.s_tier,1],["route",L.s_route,1],["fund",L.s_fund,0],["sev",L.s_sev,0],["gap",L.s_gap,0]].map(function(s){
      return '<label class="ck"><input type="checkbox" id="rb-s-' + s[0] + '"' + (s[2] ? " checked" : "") + '> <span>' + esc(tt(s[1])) + '</span></label>';
    }).join("") +
  '</fieldset>' +
  '</div>' +
  '<div class="rbbtns">' +
  '<span style="align-self:center;font-size:13px;font-weight:700;color:var(--navy)">' + esc(tt(L.fmt)) + ':</span>' +
  '<button class="rbbtn csv" id="rb-csv">CSV</button>' +
  '<button class="rbbtn xls" id="rb-xls">Excel</button>' +
  '<button class="rbbtn doc" id="rb-doc">Word</button>' +
  '<button class="rbbtn ppt" id="rb-ppt">PowerPoint</button>' +
  '</div><div class="rbmeta">' + esc(tt(L.meta)) + '</div>' +
  '<div class="gatemsg" id="rb-msg"></div>';

el("rb-scope").addEventListener("change", function(){
  var custom = this.value === "custom";
  el("rb-countries").style.display = custom ? "block" : "none";
  el("rb-customhint").style.display = custom ? "block" : "none";
});

function pickCountries(){
  var s = el("rb-scope").value;
  if (s === "all") return ALL.slice();
  if (s === "africa") return ALL.filter(function(c){ return c.region === "africa"; });
  if (s === "carib") return ALL.filter(function(c){ return c.region === "caribbean"; });
  if (s === "pacific") return ALL.filter(function(c){ return c.region === "pacific"; });
  if (s === "w1") return ALL.filter(function(c){ return c.w1; });
  if (s[0] === "t") return C.filter(function(c){ return c.tier === +s[1]; });
  var sel = [].slice.call(el("rb-countries").selectedOptions).map(function(o){ return o.value; });
  return ALL.filter(function(c){ return sel.indexOf(c.iso3) >= 0; });
}

// Assemble the report as an array of sections: { title, demo, head[], rows[][] }
function buildReport(){
  var cs = pickCountries();
  var secs = [];
  if (el("rb-s-reg").checked) {
    secs.push({ id:"register", title:tt(L.s_reg), demo:false,
      head:[tt(N.cols.country),"ISO3",tt({en:"Region",fr:"Région",ar:"المنطقة"}),tt(N.cols.tier),tt(N.cols.score),tt(N.cols.acc),tt(N.cols.met),tt(N.cols.iso),tt(N.cols.gqii),tt(N.cols.wave)],
      rows: cs.slice().sort(function(a,b){ return (b.tier - a.tier) || (b.score - a.score) || a.en.localeCompare(b.en); }).map(function(c){
        return [c[qiLang], c.iso3, tt(I.regions[c.region] || {en:c.region}), String(c.tier) + (c.upper ? "+" : ""), c.score.toFixed(1),
          tt(N.accLabels[c.acc] || {en:c.acc}), tt(N.metLabels[c.met] || {en:c.met}), tt(N.isoLabels[c.iso] || {en:c.iso}), c.gqii ? "#" + c.gqii : "", c.w1 ? tt(I.regions.statusOpen) : ""];
      }) });
  }
  if (el("rb-s-tier").checked) {
    var rows = [3,2,1].map(function(t){
      var g = cs.filter(function(c){ return c.tier === t; });
      return [tt(I.tiers[t].name), String(g.length), String(g.filter(function(c){ return c.w1; }).length),
        g.length ? (g.reduce(function(s,c){ return s + c.score; }, 0) / g.length).toFixed(1) : ""];
    });
    secs.push({ id:"tiers", title:tt(L.s_tier), demo:false,
      head:[tt(N.cols.tier), tt({en:"Countries",fr:"Pays",ar:"البلدان"}), "W1", tt({en:"Average score S",fr:"Score S moyen",ar:"متوسط الدرجة S"})], rows:rows });
  }
  if (el("rb-s-route").checked) {
    var rr = [];
    ["own","sadcas","soac","afrac","none"].forEach(function(k){
      rr.push([tt({en:"Accreditation",fr:"Accréditation",ar:"الاعتماد"}), tt(N.accLabels[k]), String(cs.filter(function(c){ return c.acc === k; }).length)]);
    });
    ["member","assoc_cmc","assoc","none"].forEach(function(k){
      rr.push([tt({en:"Metrology",fr:"Métrologie",ar:"المترولوجيا"}), tt(N.metLabels[k]), String(cs.filter(function(c){ return c.met === k; }).length)]);
    });
    ["full","corr","none"].forEach(function(k){
      rr.push(["ISO", tt(N.isoLabels[k]), String(cs.filter(function(c){ return c.iso === k; }).length)]);
    });
    secs.push({ id:"routes", title:tt(L.s_route), demo:false,
      head:[tt({en:"Register",fr:"Registre",ar:"السجل"}), tt({en:"Status",fr:"Statut",ar:"الحالة"}), tt({en:"Countries",fr:"Pays",ar:"البلدان"})], rows:rr });
  }
  if (el("rb-s-fund").checked) {
    var fr = [];
    FUNDX.tiers.forEach(function(t){ t.v.forEach(function(v, i){ fr.push([t.name, FUNDX.labels[i], v + "%"]); }); });
    secs.push({ id:"funding", title:tt(L.s_fund), demo:true,
      head:[tt(N.cols.tier), tt({en:"Source",fr:"Source",ar:"المصدر"}), tt({en:"Share",fr:"Part",ar:"الحصة"})], rows:fr });
  }
  if (el("rb-s-sev").checked) {
    secs.push({ id:"severity", title:tt(L.s_sev), demo:true,
      head:[tt(N.cols.tier), tt({en:"Mean severity (1-5)",fr:"Sévérité moyenne (1-5)",ar:"متوسط الشدة (1-5)"})],
      rows:[[tt(I.tiers[1].name),"4.4"],[tt(I.tiers[2].name),"3.8"],[tt(I.tiers[3].name),"3.1"]] });
  }
  if (el("rb-s-gap").checked) {
    var bands = [["<0.5M USD",6],["0.5-2M USD",11],["2-5M USD",12],["5-20M USD",8],[">20M USD",3]];
    secs.push({ id:"gaps", title:tt(L.s_gap), demo:true,
      head:[tt({en:"Band",fr:"Fourchette",ar:"النطاق"}), tt({en:"Respondents",fr:"Répondants",ar:"المجيبون"})],
      rows: bands.map(function(b){ return [b[0], String(b[1])]; }) });
  }
  return { countries: cs, sections: secs,
    title: tt(L.reportTitle), sub: tt(I.partners),
    scopeLabel: el("rb-scope").selectedOptions[0].textContent };
}
var FUNDX = {
  labels:[tt({en:"Government budget",fr:"Budget de l'État",ar:"الموازنة الحكومية"}), tt({en:"Fees and earned income",fr:"Redevances et recettes propres",ar:"الرسوم والإيرادات الذاتية"}),
          tt({en:"Earmarked levies",fr:"Prélèvements affectés",ar:"الرسوم المخصصة"}), tt({en:"Donor and concessional",fr:"Bailleurs et concessionnel",ar:"المانحون والتمويل الميسر"}),
          tt({en:"Private and other",fr:"Privé et autres",ar:"القطاع الخاص وغيره"})],
  tiers:[ { name:tt(I.tiers[1].name), v:[38,12,5,40,5] }, { name:tt(I.tiers[2].name), v:[45,27,8,15,5] }, { name:tt(I.tiers[3].name), v:[40,38,10,7,5] } ]
};

function dl(blob, name){
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
}
function stampName(ext){
  var d = new Date(); function p(x){ return x < 10 ? "0" + x : x; }
  return "qi-financing-report-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "." + ext;
}
function guard(){
  var r = buildReport(); var m = el("rb-msg"); m.className = "gatemsg";
  if (!r.countries.length || !r.sections.length) { m.className = "gatemsg err"; m.textContent = tt(L.none); return null; }
  return r;
}
function demoTag(s){ return s.demo ? " [" + tt(N.demo) + "]" : " [" + tt(N.real) + "]"; }

// ---- CSV ----
window.QIR_csv = function(r){
  function q(v){ v = String(v == null ? "" : v); return '"' + v.replace(/"/g, '""') + '"'; }
  var out = ["﻿" + q(r.title) + "," + q(r.scopeLabel) + "," + q(new Date().toISOString().slice(0,10))];
  r.sections.forEach(function(s){
    out.push(""); out.push(q(s.title + demoTag(s)));
    out.push(s.head.map(q).join(","));
    s.rows.forEach(function(row){ out.push(row.map(q).join(",")); });
  });
  return out.join("\r\n");
};
// ---- Excel (SpreadsheetML 2003: opens natively in Excel / LibreOffice) ----
window.QIR_xls = function(r){
  function x(v){ return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function sheetName(s, i){ return x((i + 1) + " " + s.title).slice(0, 28).replace(/[\\\/\?\*\[\]:]/g, " "); }
  var xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>' +
    '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
    '<Styles><Style ss:ID="h"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#14486B" ss:Pattern="Solid"/></Style>' +
    '<Style ss:ID="t"><Font ss:Bold="1" ss:Size="13" ss:Color="#14486B"/></Style>' +
    '<Style ss:ID="d"><Font ss:Italic="1" ss:Color="#8F1D16"/></Style></Styles>';
  r.sections.forEach(function(s, i){
    xml += '<Worksheet ss:Name="' + sheetName(s, i) + '"><Table>';
    xml += '<Row><Cell ss:StyleID="t"><Data ss:Type="String">' + x(s.title) + '</Data></Cell></Row>';
    xml += '<Row><Cell ss:StyleID="d"><Data ss:Type="String">' + x((s.demo ? tt(N.demo) : tt(N.real)) + " · " + r.scopeLabel) + '</Data></Cell></Row>';
    xml += '<Row>' + s.head.map(function(h){ return '<Cell ss:StyleID="h"><Data ss:Type="String">' + x(h) + '</Data></Cell>'; }).join("") + '</Row>';
    s.rows.forEach(function(row){
      xml += '<Row>' + row.map(function(v){
        var num = /^-?\d+(\.\d+)?$/.test(String(v));
        return '<Cell><Data ss:Type="' + (num ? "Number" : "String") + '">' + x(v) + '</Data></Cell>';
      }).join("") + '</Row>';
    });
    xml += '</Table></Worksheet>';
  });
  xml += '</Workbook>';
  return xml;
};
// ---- Word (HTML .doc: opens directly in Word / LibreOffice) ----
window.QIR_doc = function(r){
  function x(v){ return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  var rtl = qiLang === "ar";
  var h = '<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>' + x(r.title) + '</title>' +
    '<style>body{font-family:Calibri,Arial,sans-serif;color:#222;' + (rtl ? "direction:rtl;" : "") + '}h1{color:#14486B;font-size:22pt}h2{color:#14486B;font-size:14pt;margin-top:22pt}' +
    '.sub{color:#5A6B76;font-size:10pt}.demo{color:#8F1D16;font-weight:bold;font-size:9pt}' +
    'table{border-collapse:collapse;width:100%;margin-top:6pt}th{background:#14486B;color:#fff;font-size:9pt;padding:4pt 6pt;text-align:' + (rtl ? "right" : "left") + '}' +
    'td{border:1pt solid #D5DEE5;font-size:9pt;padding:3pt 6pt}</style></head><body>' +
    '<h1>' + x(r.title) + '</h1><p class="sub">' + x(r.sub) + '<br>' + x(tt(L.generated)) + ' · ' + new Date().toISOString().slice(0,10) +
    '<br>' + x(tt(L.countriesIncl)) + ': ' + x(r.scopeLabel) + ' (' + r.countries.length + ')</p>';
  r.sections.forEach(function(s){
    h += '<h2>' + x(s.title) + '</h2><p class="demo">' + x(s.demo ? tt(N.demo) : tt(N.real)) + '</p><table><tr>' +
      s.head.map(function(c){ return '<th>' + x(c) + '</th>'; }).join("") + '</tr>' +
      s.rows.map(function(row){ return '<tr>' + row.map(function(v){ return '<td>' + x(v) + '</td>'; }).join("") + '</tr>'; }).join("") + '</table>';
  });
  h += '</body></html>';
  return h;
};

// ---------- PowerPoint engine: dependency-free ZIP + minimal OOXML ----------
var CRT = null;
function crc32(u8){
  if (!CRT) { CRT = []; for (var n = 0; n < 256; n++){ var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); CRT[n] = c >>> 0; } }
  var x = 0xFFFFFFFF;
  for (var i = 0; i < u8.length; i++) x = CRT[(x ^ u8[i]) & 0xFF] ^ (x >>> 8);
  return (x ^ 0xFFFFFFFF) >>> 0;
}
function zipStore(files){
  var enc = new TextEncoder(), parts = [], cds = [], off = 0;
  files.forEach(function(f){
    var nm = enc.encode(f.name), d = (typeof f.data === "string") ? enc.encode(f.data) : f.data, crc = crc32(d);
    var lh = new Uint8Array(30 + nm.length), v = new DataView(lh.buffer);
    v.setUint32(0, 0x04034b50, true); v.setUint16(4, 20, true); v.setUint16(6, 0, true); v.setUint16(8, 0, true);
    v.setUint16(10, 0x6000, true); v.setUint16(12, 0x5D13, true);
    v.setUint32(14, crc, true); v.setUint32(18, d.length, true); v.setUint32(22, d.length, true);
    v.setUint16(26, nm.length, true); v.setUint16(28, 0, true);
    lh.set(nm, 30); parts.push(lh, d);
    var ce = new Uint8Array(46 + nm.length), w = new DataView(ce.buffer);
    w.setUint32(0, 0x02014b50, true); w.setUint16(4, 20, true); w.setUint16(6, 20, true);
    w.setUint16(12, 0x6000, true); w.setUint16(14, 0x5D13, true);
    w.setUint32(16, crc, true); w.setUint32(20, d.length, true); w.setUint32(24, d.length, true);
    w.setUint16(28, nm.length, true); w.setUint32(42, off, true);
    ce.set(nm, 46); cds.push(ce);
    off += lh.length + d.length;
  });
  var cdLen = 0; cds.forEach(function(c){ cdLen += c.length; });
  var eo = new Uint8Array(22), e = new DataView(eo.buffer);
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, cdLen, true); e.setUint32(16, off, true);
  var out = new Uint8Array(off + cdLen + 22), p = 0;
  parts.concat(cds, [eo]).forEach(function(u){ out.set(u, p); p += u.length; });
  return out;
}
window.QIR_pptx = function(r){
  var rtl = (qiLang === "ar");
  function x(s){ return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var NAVY = "14486B", GREEN = "008300", BLUE = "2a78d6", INK = "222222", GREY = "5A6B76";
  var A = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
  function run(t, sz, b, col){
    return '<a:r><a:rPr lang="' + (rtl ? "ar-SA" : "en-US") + '" sz="' + sz + '" b="' + (b ? 1 : 0) + '" dirty="0"><a:solidFill><a:srgbClr val="' + col + '"/></a:solidFill><a:latin typeface="Calibri"/><a:cs typeface="Arial"/></a:rPr><a:t>' + x(t) + '</a:t></a:r>';
  }
  function para(t, sz, b, col){
    return '<a:p><a:pPr' + (rtl ? ' algn="r" rtl="1"' : ' algn="l"') + '/>' + run(t, sz, b, col) + '</a:p>';
  }
  var sid = 1;
  function txbox(ox, oy, cx, cy, paras){
    sid++;
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + sid + '" name="tx' + sid + '"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr>' +
      '<p:spPr><a:xfrm><a:off x="' + ox + '" y="' + oy + '"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm>' +
      '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr>' +
      '<p:txBody><a:bodyPr wrap="square"><a:normAutofit/></a:bodyPr><a:lstStyle/>' + paras + '</p:txBody></p:sp>';
  }
  function bar(ox, oy, cx, cy, col){
    sid++;
    return '<p:sp><p:nvSpPr><p:cNvPr id="' + sid + '" name="bar' + sid + '"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>' +
      '<p:spPr><a:xfrm><a:off x="' + ox + '" y="' + oy + '"/><a:ext cx="' + cx + '" cy="' + cy + '"/></a:xfrm>' +
      '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="' + col + '"/></a:solidFill>' +
      '<a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp>';
  }
  function cell(t, hdr){
    return '<a:tc><a:txBody><a:bodyPr/><a:lstStyle/><a:p><a:pPr' + (rtl ? ' algn="r" rtl="1"' : ' algn="l"') + '/>' +
      run(t, 1000, hdr, hdr ? "FFFFFF" : INK) + '</a:p></a:txBody>' +
      '<a:tcPr marL="45720" marR="45720" marT="18288" marB="18288"' + (hdr ? '><a:solidFill><a:srgbClr val="' + NAVY + '"/></a:solidFill>' : '><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>') + '</a:tcPr></a:tc>';
  }
  function table(ox, oy, cx, head, rows){
    sid++;
    var cols = head.length, cw = Math.floor(cx / cols);
    var grid = ""; for (var i = 0; i < cols; i++) grid += '<a:gridCol w="' + cw + '"/>';
    var trs = '<a:tr h="335280">' + head.map(function(h){ return cell(h, true); }).join("") + '</a:tr>';
    rows.forEach(function(row){ trs += '<a:tr h="304800">' + row.map(function(v){ return cell(v, false); }).join("") + '</a:tr>'; });
    return '<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="' + sid + '" name="tbl' + sid + '"/>' +
      '<p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr><p:nvPr/></p:nvGraphicFramePr>' +
      '<p:xfrm><a:off x="' + ox + '" y="' + oy + '"/><a:ext cx="' + (cw * cols) + '" cy="' + (335280 + rows.length * 304800) + '"/></p:xfrm>' +
      '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table"><a:tbl>' +
      '<a:tblPr firstRow="1" bandRow="0"/><a:tblGrid>' + grid + '</a:tblGrid>' + trs + '</a:tbl></a:graphicData></a:graphic></p:graphicFrame>';
  }
  function slide(body){
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:sld ' + A + '><p:cSld><p:spTree>' +
      '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>' +
      '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>' +
      body + '</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>';
  }
  var slides = [];
  var today = new Date().toISOString().slice(0, 10);
  slides.push(slide(
    bar(0, 0, 12192000, 274638, GREEN) +
    bar(0, 274638, 12192000, 91546, BLUE) +
    txbox(838200, 1600200, 10515600, 1400000, para(r.title, 3600, true, NAVY)) +
    txbox(838200, 3000000, 10515600, 900000, para(r.sub, 1600, false, INK)) +
    txbox(838200, 4000000, 10515600, 1400000,
      para(tt(L.countriesIncl) + ": " + r.scopeLabel + " (" + r.countries.length + ")", 1400, false, GREY) +
      para(tt(L.generated) + " · " + today, 1400, false, GREY)) +
    bar(838200, 5900000, 3000000, 68580, GREEN)
  ));
  var PER = 9;
  r.sections.forEach(function(s){
    for (var i = 0; i < s.rows.length; i += PER){
      var part = s.rows.slice(i, i + PER);
      var suffix = (s.rows.length > PER) ? " (" + (Math.floor(i / PER) + 1) + "/" + Math.ceil(s.rows.length / PER) + ")" : "";
      slides.push(slide(
        bar(0, 0, 12192000, 137319, GREEN) +
        txbox(685800, 320000, 10820400, 700000, para(s.title + suffix, 2000, true, NAVY)) +
        txbox(685800, 1000000, 10820400, 400000, para(s.demo ? tt(N.demo) : tt(N.real), 1100, true, s.demo ? "B3541E" : GREEN)) +
        table(685800, 1500000, 10820400, s.head, part)
      ));
    }
  });
  var files = [];
  var ctypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>' +
    '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>' +
    '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>' +
    '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>';
  slides.forEach(function(_, i){ ctypes += '<Override PartName="/ppt/slides/slide' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>'; });
  ctypes += '</Types>';
  files.push({ name: "[Content_Types].xml", data: ctypes });
  files.push({ name: "_rels/.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>' });
  var sldIds = "", sldRels = "";
  slides.forEach(function(_, i){
    sldIds += '<p:sldId id="' + (256 + i) + '" r:id="rId' + (i + 2) + '"/>';
    sldRels += '<Relationship Id="rId' + (i + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide' + (i + 1) + '.xml"/>';
  });
  files.push({ name: "ppt/presentation.xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:presentation ' + A + '><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst><p:sldIdLst>' + sldIds + '</p:sldIdLst><p:sldSz cx="12192000" cy="6858000"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>' });
  files.push({ name: "ppt/_rels/presentation.xml.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>' + sldRels + '</Relationships>' });
  var emptyTree = '<p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld>';
  files.push({ name: "ppt/slideMasters/slideMaster1.xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:sldMaster ' + A + '>' + emptyTree +
    '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>' +
    '<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>' });
  files.push({ name: "ppt/slideMasters/_rels/slideMaster1.xml.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>' });
  files.push({ name: "ppt/slideLayouts/slideLayout1.xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<p:sldLayout ' + A + ' type="blank">' + emptyTree + '<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>' });
  files.push({ name: "ppt/slideLayouts/_rels/slideLayout1.xml.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>' });
  files.push({ name: "ppt/theme/theme1.xml", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="QIF"><a:themeElements>' +
    '<a:clrScheme name="QIF"><a:dk1><a:srgbClr val="222222"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="14486B"/></a:dk2><a:lt2><a:srgbClr val="F2F6F4"/></a:lt2>' +
    '<a:accent1><a:srgbClr val="008300"/></a:accent1><a:accent2><a:srgbClr val="2a78d6"/></a:accent2><a:accent3><a:srgbClr val="1baf7a"/></a:accent3><a:accent4><a:srgbClr val="1F7A8C"/></a:accent4>' +
    '<a:accent5><a:srgbClr val="005C1F"/></a:accent5><a:accent6><a:srgbClr val="14486B"/></a:accent6><a:hlink><a:srgbClr val="2a78d6"/></a:hlink><a:folHlink><a:srgbClr val="005C1F"/></a:folHlink></a:clrScheme>' +
    '<a:fontScheme name="QIF"><a:majorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface="Arial"/></a:majorFont><a:minorFont><a:latin typeface="Calibri"/><a:ea typeface=""/><a:cs typeface="Arial"/></a:minorFont></a:fontScheme>' +
    '<a:fmtScheme name="QIF"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst>' +
    '<a:lnStyleLst><a:ln w="6350"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="12700"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln><a:ln w="19050"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst>' +
    '<a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>' +
    '<a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme>' +
    '</a:themeElements></a:theme>' });
  slides.forEach(function(sx, i){
    files.push({ name: "ppt/slides/slide" + (i + 1) + ".xml", data: sx });
    files.push({ name: "ppt/slides/_rels/slide" + (i + 1) + ".xml.rels", data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>' });
  });
  return zipStore(files);
};

// ---------- download buttons ----------
el("rb-csv").onclick = function(e){
  e.preventDefault(); var r = guard(); if (!r) return;
  dl(new Blob([QIR_csv(r)], { type: "text/csv;charset=utf-8" }), stampName("csv"));
};
el("rb-xls").onclick = function(e){
  e.preventDefault(); var r = guard(); if (!r) return;
  dl(new Blob([QIR_xls(r)], { type: "application/vnd.ms-excel" }), stampName("xls"));
};
el("rb-doc").onclick = function(e){
  e.preventDefault(); var r = guard(); if (!r) return;
  dl(new Blob([QIR_doc(r)], { type: "application/msword" }), stampName("doc"));
};
el("rb-ppt").onclick = function(e){
  e.preventDefault(); var r = guard(); if (!r) return;
  dl(new Blob([QIR_pptx(r)], { type: "application/vnd.openxmlformats-officedocument.presentationml.presentation" }), stampName("pptx"));
};
})();

