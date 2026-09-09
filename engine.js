// Survey engine: routing, screens of max 4 questions, widgets, validation, save/resume, submit.
(function(){
var I = QI_I18N, S = I.survey, EN = I.entry;
var BANK = {
  profile: QI_BANK_P1.profile, core: QI_BANK_P1.core,
  T1: QI_BANK_P2.T1, T2: QI_BANK_P2.T2, T3: QI_BANK_P2.T3, closing: QI_BANK_P2.closing,
  fams: QI_BANK_P3
};
var DRAFT_KEY = "qi_draft_v1";

var state = { step:"type", mode:"national", country:null,
  scope:{ institution:"", institutionOther:"", regions:[] },
  who:{ name:"", email:"" },
  family:null, screen:0, answers:{}, contact:{org:"",email:""}, submitted:false };

// human-readable label for the selected international coverage
function scopeLabel(){
  var codes = state.scope.regions || [];
  var map = { global:EN.global, "africa-all":EN.africaAll, "af-north":EN.afNorth, "af-west":EN.afWest,
    "af-central":EN.afCentral, "af-east":EN.afEast, "af-southern":EN.afSouthern,
    caribbean:EN.caribbean, pacific:EN.pacific };
  var parts = codes.map(function(c){ return map[c] ? T(map[c]) : c; });
  if (state.scope.institutionOther && codes.indexOf("__other")>=0) parts.push(state.scope.institutionOther);
  return parts.join(", ");
}
function institutionLabel(){
  var v = state.scope.institution;
  if (v === "other") return state.scope.institutionOther || T({en:"Other organisation",fr:"Autre organisation",ar:"منظمة أخرى"});
  var found = "";
  (I.institutions.groups || []).forEach(function(g){ g.items.forEach(function(it){ if (it[0] === v) found = it[1]; }); });
  return found || v;
}
function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "").trim()); }

function save(){ try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); }catch(e){} }
function load(){ try{ var s = localStorage.getItem(DRAFT_KEY); return s ? JSON.parse(s) : null; }catch(e){ return null; } }
function clearDraft(){ try{ localStorage.removeItem(DRAFT_KEY); }catch(e){} }

function country(){ return QI_COUNTRIES.find(function(c){ return c.iso3 === state.country; }) || null; }
function sess(){ return (window.QIA && QIA.session) ? QIA.session() : null; }
function applyProfile(s){
  state.country = s.iso3;
  state.answers.P2 = { v: s.cat };
  var p2q = BANK.profile.find(function(q){ return q.id === "P2"; });
  var o = p2q && p2q.opts.find(function(x){ return x.v === s.cat; });
  if (o) state.family = o.fam;
}

// ---- screens definition (groups of max 4) ----
function screens(){
  var intl = state.mode === "international";
  var c = intl ? null : country();
  if (!intl && !c) return [];
  var famQs = BANK.fams[state.family || "F-GOV"];
  var sn = sess();
  var pr = BANK.profile.filter(function(q){ return q.id !== "P1" && !(sn && q.id === "P2"); }); // P1 = entry step; P2 from access profile when invited
  var core = BANK.core;
  function byGroup(g){ return core.filter(function(q){ return q.group === g; }); }
  var list = [
    { title:"Profile 1/2", qs: pr.slice(0,3) },
    { title:"Profile 2/2", qs: pr.slice(3) },
    { title:"G1", qs: byGroup("G1") },
    { title:"G2", qs: byGroup("G2") },
    { title:"G3", qs: byGroup("G3") },
    { title:"G4", qs: byGroup("G4") },
    { title:"G5", qs: byGroup("G5") }
  ];
  if (!intl) {   // country-tier module applies to national respondents only
    var tierQs = BANK["T" + c.tier];
    list.push({ title:"Tier 1/2", qs: tierQs.slice(0,4) });
    list.push({ title:"Tier 2/2", qs: tierQs.slice(4) });
  }
  list.push({ title:"Module 1/2", qs: famQs.slice(0,4) });
  list.push({ title:"Module 2/2", qs: famQs.slice(4) });
  list.push({ title:"Closing", qs: BANK.closing, closing:true });
  return list;
}
function totalQuestions(){
  return screens().reduce(function(n, sc){ return n + sc.qs.length; }, 0) + (sess() ? 0 : 1); // +1 entry step when not invited
}

// ---- rendering ----
var root, lastView = "";
function h(html){
  var key = state.step + ":" + state.screen;
  var keep = (key === lastView);
  var y = window.scrollY || 0;
  root.innerHTML = html;
  if (keep) { window.scrollTo(0, y); } else { window.scrollTo(0, 0); lastView = key; }
}
// currency helpers: indicative local-currency equivalents on USD bands (wave-1 countries)
function fxc(){ var c = country(); return (c && c.cur && c.rate) ? c : null; }
function fmtBig(v){
  var lang = qiLang;
  var M = { en:" million", fr:" million(s)", ar:" مليون" }[lang];
  var B = { en:" billion", fr:" milliard(s)", ar:" مليار" }[lang];
  function sf2(x){ var m = Math.pow(10, Math.max(0, 2 - Math.ceil(Math.log10(Math.abs(x))))); return Math.round(x * m) / m; }
  if (v >= 1e9) return sf2(v / 1e9) + B;
  if (v >= 1e6) return sf2(v / 1e6) + M;
  var r = sf2(v);
  return String(Math.round(r)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
function fmtLocal(usd){
  var c = fxc(); if (!c || !usd) return "";
  var lo = usd[0] != null ? usd[0] * c.rate : null;
  var hi = usd[1] != null ? usd[1] * c.rate : null;
  var cur = c.cur;
  var t = { en:{ under:"under ", above:"above ", to:" to " }, fr:{ under:"moins de ", above:"plus de ", to:" à " }, ar:{ under:"أقل من ", above:"أكثر من ", to:" إلى " } }[qiLang];
  if (lo === 0 || lo == null) return "≈ " + t.under + fmtBig(hi) + " " + cur;
  if (hi == null) return "≈ " + t.above + fmtBig(lo) + " " + cur;
  return "≈ " + fmtBig(lo) + t.to + fmtBig(hi) + " " + cur;
}
// guided flow: after a question is completed, glide to the next open one
// rAF-based glide: works even where programmatic smooth scrolling is disabled
function glideTo(top){
  var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  top = Math.max(0, Math.min(top, max));
  var start = window.scrollY, dist = top - start, t0 = null, dur = 400, done = false;
  if (Math.abs(dist) < 4) return;
  function step(ts){
    if (done) return;
    if (t0 === null) t0 = ts;
    var p = Math.min(1, (ts - t0) / dur);
    var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    window.scrollTo(0, start + dist * e);
    if (p < 1) requestAnimationFrame(step); else done = true;
  }
  requestAnimationFrame(step);
  // watchdog: if frames are throttled (hidden or occluded window), land instantly
  setTimeout(function(){ if (!done) { done = true; window.scrollTo(0, top); } }, dur + 150);
}
function scrollToBlock(id){
  var el = document.getElementById(id);
  if (el) { glideTo(el.getBoundingClientRect().top + window.scrollY - 84); }
}
function advanceFocus(qid){
  var scr = screens(); var sc = scr[state.screen]; if (!sc) return;
  var idx = -1;
  sc.qs.forEach(function(q, i){ if (q.id === qid) idx = i; });
  for (var i = idx + 1; i < sc.qs.length; i++) {
    if (!validQ(sc.qs[i])) { scrollToBlock("qb_" + sc.qs[i].id); return; }
  }
  for (var j = 0; j < sc.qs.length; j++) {
    if (j !== idx && !validQ(sc.qs[j])) { scrollToBlock("qb_" + sc.qs[j].id); return; }
  }
  var btn = root.querySelector(".navrow .btn.nav:not(.sec)");
  if (btn) { btn.classList.add("pulse"); glideTo(btn.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2)); }
}
function afterAnswer(qid, complete){
  save(); rerenderScreen();
  if (complete) setTimeout(function(){ advanceFocus(qid); }, 60);
}

function pathChips(){
  var bits = [];
  if (state.mode === "international") {
    bits.push('<span>' + esc(institutionLabel()) + '</span>');
    var sl = scopeLabel(); if (sl) bits.push('<span>' + esc(sl) + '</span>');
  } else {
    var c = country(); if (!c) return "";
    bits.push('<span>' + esc(c[qiLang]) + '</span>');
    bits.push('<span>' + esc(T(I.tiers[c.tier].name)) + '</span>');
  }
  var p2 = state.answers["P2"];
  if (state.family && p2 && !p2.miss && p2.v) bits.push('<span>' + esc(T(I.families[state.family])) + '</span>');
  var sn = sess();
  if (sn) bits.unshift('<span>' + esc(sn.id) + '</span>');
  else if (state.who && state.who.name) bits.unshift('<span>' + esc(state.who.name) + '</span>');
  bits.push('<span>' + totalQuestions() + ' · ' + esc(T(S.minutes)) + '</span>');
  return '<div class="pathchips">' + bits.join("") + '</div>';
}

function resumeBox(){
  var draft = load();
  return (draft && (draft.country || draft.mode === "international") && draft.step === "screens" && !draft.submitted) ?
    '<div class="okbox">' + esc(T(S.progressSaved)) + ' <button class="btn small nav" style="margin-inline-start:8px" onclick="QIE.resume()">' + esc(T(S.resume)) + '</button> <button class="btn small nav sec" onclick="QIE.reset()">' + esc(T(S.startOver)) + '</button></div>' : "";
}
var STY = 'width:100%;padding:11px;border:1px solid var(--line);border-radius:8px;font-size:16px;font-family:inherit;box-sizing:border-box';
function idFields(){
  return '<div style="display:grid;gap:8px;margin-top:14px">' +
    '<input type="text" id="who-name" placeholder="' + esc(T(EN.yourName)) + '" value="' + esc(state.who.name || "") + '" style="' + STY + '">' +
    '<input type="email" id="who-email" placeholder="' + esc(T(EN.yourEmail)) + '" value="' + esc(state.who.email || "") + '" style="' + STY + '">' +
    '<div class="hint">' + esc(T(EN.emailWhy)) + '</div></div>';
}
function bindId(){
  var n = document.getElementById("who-name"), e = document.getElementById("who-email");
  if (n) n.addEventListener("input", function(){ state.who.name = n.value; save(); });
  if (e) e.addEventListener("input", function(){ state.who.email = e.value; save(); });
}

function stepType(){
  h('<div class="scard">' + resumeBox() +
    '<h2 class="sec">' + esc(T(EN.who)) + '</h2><p class="sub">' + esc(T(EN.whoNote)) + '</p>' +
    '<div class="entrytypes">' +
    '<button type="button" class="entrytype" onclick="QIE.pick(\'national\')"><b>' + esc(T(EN.national)) + '</b><span>' + esc(T(EN.nationalNote)) + '</span></button>' +
    '<button type="button" class="entrytype" onclick="QIE.pick(\'international\')"><b>' + esc(T(EN.international)) + '</b><span>' + esc(T(EN.internationalNote)) + '</span></button>' +
    '</div></div>');
}

function stepCountry(){
  var opts = QI_COUNTRIES.filter(function(c){ return c.region !== "partners"; })
    .sort(function(a,b){ return a[qiLang].localeCompare(b[qiLang], qiLang); })
    .map(function(c){ return '<option value="' + c.iso3 + '">' + esc(c[qiLang]) + '</option>'; }).join("");
  var partners = QI_COUNTRIES.filter(function(c){ return c.region === "partners"; })
    .map(function(c){ return '<option value="' + c.iso3 + '">' + esc(c[qiLang]) + '</option>'; }).join("");
  h('<div class="scard">' +
    '<h2 class="sec">' + esc(T(S.chooseCountry)) + '</h2>' +
    '<select id="csel" style="' + STY + '"><option value="">…</option>' + opts +
    (partners ? '<optgroup label="' + esc(T(I.regions.partners)) + '">' + partners + '</optgroup>' : "") + '</select>' +
    idFields() +
    '<div class="gatemsg" id="e-msg"></div>' +
    '<div class="navrow"><button class="btn nav sec" onclick="QIE.toType()">' + esc(T(S.back)) + '</button>' +
    '<button class="btn nav" id="cnext">' + esc(T(EN.start)) + '</button></div></div>');
  var sel = document.getElementById("csel");
  if (state.country) sel.value = state.country;
  bindId();
  document.getElementById("cnext").onclick = function(){
    var msg = document.getElementById("e-msg");
    if (!sel.value) { msg.className = "gatemsg err"; msg.textContent = T(EN.needCountry); return; }
    if (!state.who.name || !state.who.name.trim()) { msg.className = "gatemsg err"; msg.textContent = T(EN.needName); return; }
    if (!validEmail(state.who.email)) { msg.className = "gatemsg err"; msg.textContent = T(EN.needEmail); return; }
    state.mode = "national"; state.country = sel.value; state.step = "consent"; save(); render();
  };
}

function stepIntl(){
  var instOpts = (I.institutions.groups || []).map(function(g){
    return '<optgroup label="' + esc(T(g.label)) + '">' +
      g.items.map(function(it){ return '<option value="' + it[0] + '">' + esc(it[1]) + '</option>'; }).join("") + '</optgroup>';
  }).join("");
  function ck(code, label, cls){
    var on = (state.scope.regions || []).indexOf(code) >= 0;
    return '<label class="ck ' + (cls||"") + '"><input type="checkbox" data-scope="' + code + '"' + (on ? " checked" : "") + '> <span>' + esc(T(label)) + '</span></label>';
  }
  h('<div class="scard">' +
    '<h2 class="sec">' + esc(T(EN.selectInstitution)) + '</h2>' +
    '<select id="isel" style="' + STY + '"><option value="">…</option>' + instOpts + '</select>' +
    '<input type="text" id="iother" placeholder="' + esc(T(EN.institutionOther)) + '" value="' + esc(state.scope.institutionOther || "") + '" style="' + STY + ';margin-top:8px;display:' + (state.scope.institution === "other" ? "block" : "none") + '">' +
    '<h3 style="font-size:15px;margin:20px 0 4px">' + esc(T(EN.scopeTitle)) + '</h3><p class="sub">' + esc(T(EN.scopeNote)) + '</p>' +
    '<div class="scopegrid">' +
      ck("global", EN.global) +
      ck("africa-all", EN.africaAll) +
      '<div class="scopesub">' + ck("af-north",EN.afNorth) + ck("af-west",EN.afWest) + ck("af-central",EN.afCentral) + ck("af-east",EN.afEast) + ck("af-southern",EN.afSouthern) + '</div>' +
      ck("caribbean", EN.caribbean) +
      ck("pacific", EN.pacific) +
    '</div>' +
    idFields() +
    '<div class="gatemsg" id="e-msg"></div>' +
    '<div class="navrow"><button class="btn nav sec" onclick="QIE.toType()">' + esc(T(S.back)) + '</button>' +
    '<button class="btn nav" id="inext">' + esc(T(EN.start)) + '</button></div></div>');
  var isel = document.getElementById("isel"), iother = document.getElementById("iother");
  if (state.scope.institution) isel.value = state.scope.institution;
  isel.addEventListener("change", function(){
    state.scope.institution = isel.value;
    iother.style.display = isel.value === "other" ? "block" : "none"; save();
  });
  iother.addEventListener("input", function(){ state.scope.institutionOther = iother.value; save(); });
  root.querySelectorAll("[data-scope]").forEach(function(elm){
    elm.addEventListener("change", function(){
      var code = elm.getAttribute("data-scope");
      var arr = state.scope.regions || (state.scope.regions = []);
      var i = arr.indexOf(code);
      if (elm.checked) { if (i < 0) arr.push(code); if (code === "africa-all") ["af-north","af-west","af-central","af-east","af-southern"].forEach(function(x){ if (arr.indexOf(x)<0) arr.push(x); }); }
      else { if (i >= 0) arr.splice(i, 1); if (code === "africa-all") state.scope.regions = arr.filter(function(x){ return x.indexOf("af-") !== 0; }); }
      save();
    });
  });
  bindId();
  document.getElementById("inext").onclick = function(){
    var msg = document.getElementById("e-msg");
    if (!state.scope.institution || (state.scope.institution === "other" && !state.scope.institutionOther.trim())) { msg.className = "gatemsg err"; msg.textContent = T(EN.needInstitution); return; }
    if (!(state.scope.regions || []).length) { msg.className = "gatemsg err"; msg.textContent = T(EN.needScope); return; }
    if (!state.who.name || !state.who.name.trim()) { msg.className = "gatemsg err"; msg.textContent = T(EN.needName); return; }
    if (!validEmail(state.who.email)) { msg.className = "gatemsg err"; msg.textContent = T(EN.needEmail); return; }
    state.mode = "international"; state.country = null; state.step = "consent"; save(); render();
  };
}

function stepConsent(){
  var intlBanner = (state.mode === "international") ?
    '<div class="notice">' + esc(T(EN.intlBanner)) + '</div>' : "";
  h('<div class="scard">' + pathChips() +
    '<h2 class="sec">' + esc(T(S.consentTitle)) + '</h2>' +
    '<div class="objbox" style="margin:12px 0"><h2 style="font-size:15px">' + esc(T(I.objectives.title)) + '</h2><p>' + esc(T(I.objectives.body)) + '</p></div>' +
    intlBanner +
    '<p style="font-size:14.5px">' + esc(T(S.consent)) + '</p>' +
    '<p class="hint">' + esc(T(S.noRightWrong)) + '</p>' +
    '<div class="navrow">' +
    (sess() ? '<a class="btn nav sec" href="home.html?lang=' + qiLang + '">' + esc(T(S.back)) + '</a>'
            : '<button class="btn nav sec" onclick="QIE.toEntry()">' + esc(T(S.back)) + '</button>') +
    '<button class="btn nav" onclick="QIE.agree()">' + esc(T(S.agree)) + '</button></div></div>');
}

function optHtml(q, o, kind, checked){
  var id = q.id + "_" + o.v;
  var loc = (o.usd && fxc()) ? '<span class="loc">' + esc(fmtLocal(o.usd)) + '</span>' : "";
  return '<label class="opt' + (checked ? " sel" : "") + '" for="' + id + '">' +
    '<input type="' + kind + '" name="' + q.id + '" id="' + id + '" value="' + o.v + '"' + (checked ? " checked" : "") + '>' +
    '<span>' + esc(T(o.t)) + loc + '</span></label>' + fuHtml(q, o);
}
function fuHtml(q, o){
  if (!o.fu) return "";
  var a = state.answers[q.id];
  var show = a && !a.miss && (a.v === o.v || (Array.isArray(a.v) && a.v.indexOf(o.v) >= 0));
  var val = (a && a.fu && a.fu[o.v]) || "";
  return '<div class="fu" data-fu-for="' + q.id + ':' + o.v + '" style="display:' + (show ? "block" : "none") + '">' +
    '<input type="text" placeholder="' + esc(T(o.fu.t)) + '" data-fukey="' + q.id + ':' + o.v + '" value="' + esc(val) + '"></div>';
}

function missHtml(q){
  if (q.noMiss) return "";
  var a = state.answers[q.id]; var m = a && a.miss;
  function b(code, label){
    return '<button type="button" data-miss="' + code + '" data-q="' + q.id + '" class="' + (m === code ? "sel" : "") + '">' + esc(T(label)) + '</button>';
  }
  return '<div class="miss">' + b(-97, S.dk) + b(-98, S.na) + b(-99, S.pnts) + '</div>';
}

function qHtml(q){
  var a = state.answers[q.id];
  var inner = "";
  if (q.type === "single") {
    inner = '<div class="opts">' + q.opts.map(function(o){ return optHtml(q, o, "radio", a && !a.miss && a.v === o.v); }).join("") + '</div>';
  } else if (q.type === "scale") {
    inner = '<div class="opts">' + q.pts.map(function(p){
      var checked = a && !a.miss && a.v === p.v;
      return '<label class="opt' + (checked ? " sel" : "") + '"><input type="radio" name="' + q.id + '" value="' + p.v + '"' + (checked ? " checked" : "") + '><span>' + esc(T(p.t)) + '</span></label>';
    }).join("") + '</div>';
  } else if (q.type === "multi") {
    var hint = q.max ? '<div class="hint">' + esc(T(S.selectUpTo)) + ' ' + q.max + '</div>' : "";
    inner = hint + '<div class="opts">' + q.opts.map(function(o){
      var checked = a && !a.miss && Array.isArray(a.v) && a.v.indexOf(o.v) >= 0;
      return optHtml(q, o, "checkbox", checked);
    }).join("") + '</div>';
  } else if (q.type === "rank") {
    var order = (a && !a.miss && a.v) || [];
    inner = '<div class="hint">' + esc(T(S.rankHint)) + ' (' + esc(T(S.rankNeed)) + ' ' + q.k + ' ' + esc(T(S.items)) + ')</div>' +
      '<div class="opts rank">' + q.opts.map(function(o){
        var idx = order.indexOf(o.v);
        return '<div class="opt' + (idx >= 0 ? " sel" : "") + '" data-rank="' + q.id + ':' + o.v + '" role="button" tabindex="0">' +
          '<span>' + esc(T(o.t)) + '</span>' + (idx >= 0 ? '<span class="rk">' + (idx + 1) + '</span>' : "") + '</div>';
      }).join("") + '</div>';
  } else if (q.type === "matrix") {
    var vals = (a && !a.miss && a.v) || {};
    inner = '<div class="matrix">' + q.rows.map(function(r){
      return '<div class="mrow"><div class="rlab">' + esc(T(r.t)) + '</div><div class="mopts">' +
        q.cols.map(function(c){
          var sel = vals[r.v] === c.v;
          return '<button type="button" data-mx="' + q.id + ':' + r.v + ':' + c.v + '" class="' + (sel ? "sel" : "") + '">' + esc(T(c.t)) + '</button>';
        }).join("") + '</div></div>';
    }).join("") + '</div>';
  } else if (q.type === "composition") {
    var cv = (a && !a.miss && a.v) || {};
    var sum = q.rows.reduce(function(s, r){ return s + (parseInt(cv[r.v], 10) || 0); }, 0);
    inner = '<div class="matrix comp">' + q.rows.map(function(r){
      var v = cv[r.v] != null ? cv[r.v] : "";
      return '<div class="mrow"><div class="rlab">' + esc(T(r.t)) + '</div>' +
        '<input type="number" inputmode="numeric" min="0" max="100" step="1" data-comp="' + q.id + ':' + r.v + '" value="' + esc(v) + '"> %</div>';
    }).join("") +
    '<div class="sumline ' + (sum === 100 ? "ok" : "bad") + '" id="sum_' + q.id + '">' + esc(T(S.sumMustBe)) + ' ' + sum + '%</div></div>';
  } else if (q.type === "text") {
    var tv = (a && !a.miss && a.v) || "";
    inner = '<div class="txt" style="margin-top:10px">' + (q.multiline ?
      '<textarea rows="4" data-txt="' + q.id + '">' + esc(tv) + '</textarea>' :
      '<input type="text" data-txt="' + q.id + '" value="' + esc(tv) + '">') +
      (q.optional ? '<div class="hint">(' + esc(T(S.optional)) + ')</div>' : "") + '</div>';
  } else if (q.type === "combo") {
    var pv = (a && !a.miss && a.v) || {};
    inner = q.parts.map(function(p){
      var popts = p.opts || (p.optsFrom ? q.parts.find(function(x){ return x.key === p.optsFrom; }).opts : null);
      var shown = !p.showIf || Object.keys(p.showIf).every(function(k){ return pv[k] && pv[k].v === p.showIf[k]; });
      var lab = '<div class="rlab" style="margin-top:10px">' + esc(T(p.t)) + (p.optional ? ' <span class="hint">(' + esc(T(S.optional)) + ')</span>' : "") + '</div>';
      var body = "";
      if (p.type === "text") {
        body = '<input type="text" data-part="' + q.id + ':' + p.key + '" value="' + esc(pv[p.key] && pv[p.key].v || "") + '" style="width:100%;padding:9px 11px;border:1px solid var(--line);border-radius:8px;font-family:inherit;font-size:14.5px">';
      } else if (p.type === "single") {
        body = '<div class="mopts">' + popts.map(function(o){
          var sel = pv[p.key] && pv[p.key].v === o.v;
          var loc = (o.usd && fxc()) ? ' <small>' + esc(fmtLocal(o.usd)) + '</small>' : "";
          return '<button type="button" data-partopt="' + q.id + ':' + p.key + ':' + o.v + '" class="' + (sel ? "sel" : "") + '">' + esc(T(o.t)) + loc + '</button>';
        }).join("") + '</div>' + partFuHtml(q, p, popts, pv);
      } else if (p.type === "multi") {
        body = '<div class="mopts">' + popts.map(function(o){
          var sel = pv[p.key] && Array.isArray(pv[p.key].v) && pv[p.key].v.indexOf(o.v) >= 0;
          return '<button type="button" data-partmulti="' + q.id + ':' + p.key + ':' + o.v + '" class="' + (sel ? "sel" : "") + '">' + esc(T(o.t)) + '</button>';
        }).join("") + '</div>';
      }
      return '<div class="mrow" data-partrow="' + q.id + ':' + p.key + '" style="display:' + (shown ? "block" : "none") + ';margin-top:8px">' + lab + body + '</div>';
    }).join("");
    inner = '<div class="matrix">' + inner + '</div>';
  }
  // rating guide legend (e.g. A10) shown BEFORE the rows so the scale is understood first
  if (q.scaleLegend) {
    inner = '<div class="legendbox"><b>' + esc(T(S.ratingGuide)) + '</b>' +
      q.scaleLegend.map(function(l){ return '<span><i>' + esc(l.n) + '</i> ' + esc(T(l.t)) + '</span>'; }).join("") +
      '</div>' + inner;
  }
  // indicative local-currency note when this question shows converted bands
  var hasFx = fxc() && ((q.opts || []).some(function(o){ return o.usd; }) ||
    (q.parts || []).some(function(p){ return (p.opts || []).some(function(o){ return o.usd; }); }));
  if (hasFx) inner += '<div class="hint">' + esc(T(S.fxNote)) + '</div>';
  var tag = q.tag ? '<span class="qtag">[' + q.tag + ']</span>' : "";
  return '<div class="qb" id="qb_' + q.id + '"><span class="qid">' + q.id + '</span>' + tag +
    '<span class="qtext">' + esc(T(q.t)) + '</span>' + inner + missHtml(q) +
    '<div class="err">' + esc(T(S.required)) + '</div></div>';
}
function partFuHtml(q, p, popts, pv){
  var out = "";
  (popts || []).forEach(function(o){
    if (!o.fu) return;
    var show = pv[p.key] && pv[p.key].v === o.v;
    var val = (pv[p.key] && pv[p.key].fu) || "";
    out += '<div class="fu" data-pfu="' + q.id + ':' + p.key + ':' + o.v + '" style="display:' + (show ? "block" : "none") + '">' +
      '<input type="text" placeholder="' + esc(T(o.fu.t)) + '" data-pfukey="' + q.id + ':' + p.key + '" value="' + esc(val) + '"></div>';
  });
  return out;
}

function stepScreens(){
  var scr = screens(); var i = state.screen; var sc = scr[i];
  var pct = Math.round(((i) / scr.length) * 100);
  var contact = sc.closing ?
    '<div class="qb"><span class="qtext">' + esc(T(S.contact)) + '</span>' +
    '<div class="contact" style="display:grid;gap:8px;margin-top:10px">' +
    '<input type="text" id="c_org" placeholder="' + esc(T(S.org)) + '" value="' + esc(state.contact.org) + '">' +
    '<input type="email" id="c_email" placeholder="' + esc(T(S.email)) + '" value="' + esc(state.contact.email) + '">' +
    '</div></div>' : "";
  h('<div class="scard">' + pathChips() +
    '<div class="progress" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><div style="width:' + pct + '%"></div></div>' +
    '<div class="pmeta"><span>' + esc(T(S.screen)) + ' ' + (i + 1) + ' ' + esc(T(S.of)) + ' ' + scr.length + '</span><span>' + esc(T(S.saved)) + ' ✓</span></div>' +
    sc.qs.map(qHtml).join("") + contact +
    '<div class="navrow">' +
    '<button class="btn nav sec" onclick="QIE.prev()">' + esc(T(S.back)) + '</button>' +
    '<button class="btn nav" onclick="QIE.next()">' + esc(T(i === scr.length - 1 ? S.review : S.next)) + '</button>' +
    '</div><p class="hint">' + esc(T(S.progressSaved)) + '</p></div>');
  bind(sc);
}

// ---- event binding ----
function findQ(id){
  var all = [].concat(BANK.profile, BANK.core, BANK.T1, BANK.T2, BANK.T3, BANK.closing);
  Object.keys(BANK.fams).forEach(function(k){ all = all.concat(BANK.fams[k]); });
  return all.find(function(q){ return q.id === id; });
}
function ans(qid){ return state.answers[qid] || (state.answers[qid] = {}); }
function clearMiss(qid){ delete ans(qid).miss; }
function setMiss(qid, code){ state.answers[qid] = { miss: code }; }

function bind(sc){
  root.querySelectorAll("input[type=radio]").forEach(function(el){
    el.addEventListener("change", function(){
      var q = findQ(el.name); if (!q) return;
      clearMiss(q.id);
      var a = ans(q.id);
      a.v = (q.type === "scale") ? parseInt(el.value, 10) : el.value;
      var opt = (q.opts || []).find(function(o){ return o.v === el.value; });
      afterAnswer(q.id, !(opt && opt.fu));   // pause on options with a follow-up field
    });
  });
  root.querySelectorAll("input[type=checkbox]").forEach(function(el){
    el.addEventListener("change", function(){
      var q = findQ(el.name); if (!q) return;
      clearMiss(q.id);
      var a = ans(q.id); a.v = Array.isArray(a.v) ? a.v : [];
      var opt = q.opts.find(function(o){ return o.v === el.value; });
      if (el.checked) {
        if (opt && opt.excl) a.v = [el.value];
        else {
          a.v = a.v.filter(function(v){ var o = q.opts.find(function(x){ return x.v === v; }); return !(o && o.excl); });
          if (q.max && a.v.length >= q.max) { el.checked = false; return; }
          a.v.push(el.value);
        }
      } else a.v = a.v.filter(function(v){ return v !== el.value; });
      var done = (opt && opt.excl) || (q.max && a.v.length >= q.max);
      afterAnswer(q.id, !!done);
    });
  });
  root.querySelectorAll("[data-rank]").forEach(function(el){
    function toggle(){
      var pr = el.getAttribute("data-rank").split(":"), qid = pr[0], val = pr[1];
      var q = findQ(qid); clearMiss(qid);
      var a = ans(qid); a.v = Array.isArray(a.v) ? a.v : [];
      var idx = a.v.indexOf(val);
      if (idx >= 0) a.v.splice(idx, 1);
      else { if (a.v.length >= q.k) return; a.v.push(val); }
      afterAnswer(qid, a.v.length === q.k);
    }
    el.addEventListener("click", toggle);
    el.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
  root.querySelectorAll("[data-mx]").forEach(function(el){
    el.addEventListener("click", function(){
      var pr = el.getAttribute("data-mx").split(":"), qid = pr[0], row = pr[1], col = pr[2];
      clearMiss(qid); var a = ans(qid); a.v = a.v && typeof a.v === "object" && !Array.isArray(a.v) ? a.v : {};
      a.v[row] = isNaN(+col) ? col : +col;
      var q = findQ(qid);
      afterAnswer(qid, validQ(q));
    });
  });
  root.querySelectorAll("[data-comp]").forEach(function(el){
    el.addEventListener("input", function(){
      var pr = el.getAttribute("data-comp").split(":"), qid = pr[0], row = pr[1];
      clearMiss(qid); var a = ans(qid); a.v = a.v && typeof a.v === "object" ? a.v : {};
      a.v[row] = el.value === "" ? null : Math.max(0, Math.min(100, parseInt(el.value, 10) || 0));
      var q = findQ(qid);
      var prev = el.__qiPrevSum || 0;
      var sum = q.rows.reduce(function(s, r){ return s + (parseInt(a.v[r.v], 10) || 0); }, 0);
      el.__qiPrevSum = sum;
      var sl = document.getElementById("sum_" + qid);
      if (sl) { sl.textContent = T(S.sumMustBe) + " " + sum + "%"; sl.className = "sumline " + (sum === 100 ? "ok" : "bad"); }
      save();
      if (sum === 100 && prev !== 100) setTimeout(function(){ advanceFocus(qid); }, 250);
    });
  });
  root.querySelectorAll("[data-txt]").forEach(function(el){
    el.addEventListener("input", function(){
      var qid = el.getAttribute("data-txt"); clearMiss(qid);
      ans(qid).v = el.value; save();
    });
  });
  root.querySelectorAll("[data-fukey]").forEach(function(el){
    el.addEventListener("input", function(){
      var pr = el.getAttribute("data-fukey").split(":"), qid = pr[0], ov = pr[1];
      var a = ans(qid); a.fu = a.fu || {}; a.fu[ov] = el.value; save();
    });
  });
  root.querySelectorAll("[data-partopt]").forEach(function(el){
    el.addEventListener("click", function(){
      var pr = el.getAttribute("data-partopt").split(":"), qid = pr[0], key = pr[1], val = pr[2];
      clearMiss(qid); var a = ans(qid); a.v = a.v || {};
      a.v[key] = { v: val };
      afterAnswer(qid, validQ(findQ(qid)));
    });
  });
  root.querySelectorAll("[data-partmulti]").forEach(function(el){
    el.addEventListener("click", function(){
      var pr = el.getAttribute("data-partmulti").split(":"), qid = pr[0], key = pr[1], val = pr[2];
      clearMiss(qid); var a = ans(qid); a.v = a.v || {}; a.v[key] = a.v[key] || { v: [] };
      var arr = a.v[key].v; var idx = arr.indexOf(val);
      var q = findQ(qid); var p = q.parts.find(function(x){ return x.key === key; });
      var popts = p.opts || q.parts.find(function(x){ return x.key === p.optsFrom; }).opts;
      var opt = popts.find(function(o){ return o.v === val; });
      if (idx >= 0) arr.splice(idx, 1);
      else if (opt && opt.excl) a.v[key].v = [val];
      else { arr = arr.filter(function(v){ var o = popts.find(function(x){ return x.v === v; }); return !(o && o.excl); }); arr.push(val); a.v[key].v = arr; }
      afterAnswer(qid, false);
    });
  });
  root.querySelectorAll("[data-part]").forEach(function(el){
    el.addEventListener("input", function(){
      var pr = el.getAttribute("data-part").split(":"), qid = pr[0], key = pr[1];
      clearMiss(qid); var a = ans(qid); a.v = a.v || {}; a.v[key] = { v: el.value };
      save();
    });
  });
  root.querySelectorAll("[data-pfukey]").forEach(function(el){
    el.addEventListener("input", function(){
      var pr = el.getAttribute("data-pfukey").split(":"), qid = pr[0], key = pr[1];
      var a = ans(qid); if (a.v && a.v[key]) a.v[key].fu = el.value; save();
    });
  });
  root.querySelectorAll("[data-miss]").forEach(function(el){
    el.addEventListener("click", function(){
      var qid = el.getAttribute("data-q"), code = parseInt(el.getAttribute("data-miss"), 10);
      var a = state.answers[qid];
      var nowSet = !(a && a.miss === code);
      if (a && a.miss === code) delete state.answers[qid]; else setMiss(qid, code);
      afterAnswer(qid, nowSet);
    });
  });
  var org = document.getElementById("c_org"), em = document.getElementById("c_email");
  if (org) org.addEventListener("input", function(){ state.contact.org = org.value; save(); });
  if (em) em.addEventListener("input", function(){ state.contact.email = em.value; save(); });
}
function rerenderScreen(){ stepScreens(); }

// ---- validation ----
function validQ(q){
  var a = state.answers[q.id];
  if (a && a.miss) return true;
  if (!a) return !!(q.type === "text" && q.optional);
  if (q.type === "single" || q.type === "scale") return a.v != null;
  if (q.type === "multi") return Array.isArray(a.v) && a.v.length > 0;
  if (q.type === "rank") return Array.isArray(a.v) && a.v.length === q.k;
  if (q.type === "matrix") return q.rows.every(function(r){ return a.v && a.v[r.v] != null; });
  if (q.type === "composition") {
    var sum = q.rows.reduce(function(s, r){ return s + (parseInt(a.v && a.v[r.v], 10) || 0); }, 0);
    return sum === 100;
  }
  if (q.type === "text") return q.optional || (a.v && String(a.v).trim().length > 0);
  if (q.type === "combo") {
    return q.parts.every(function(p){
      if (p.optional) return true;
      if (p.showIf && !Object.keys(p.showIf).every(function(k){ return a.v && a.v[k] && a.v[k].v === p.showIf[k]; })) return true;
      var pv = a.v && a.v[p.key];
      if (!pv) return false;
      if (p.type === "multi") return Array.isArray(pv.v) && pv.v.length > 0;
      return pv.v != null && String(pv.v).trim() !== "";
    });
  }
  return true;
}
function validateScreen(sc){
  var firstBad = null;
  sc.qs.forEach(function(q){
    var ok = validQ(q);
    var el = document.getElementById("qb_" + q.id);
    if (el) el.classList.toggle("invalid", !ok);
    if (!ok && !firstBad) firstBad = el;
  });
  if (firstBad) glideTo(firstBad.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (firstBad.offsetHeight / 2));
  return !firstBad;
}

// ---- review & submit ----
function labelFor(q, a){
  if (!a) return "…";
  if (a.miss) return { "-97":T(S.dk), "-98":T(S.na), "-99":T(S.pnts) }[String(a.miss)];
  function optLabel(opts, v){ var o = (opts || []).find(function(x){ return String(x.v) === String(v); }); return o ? T(o.t) : v; }
  if (q.type === "single") return optLabel(q.opts, a.v) + (a.fu ? " · " + Object.values(a.fu).filter(Boolean).join(" / ") : "");
  if (q.type === "scale") return String(a.v);
  if (q.type === "multi") return (a.v || []).map(function(v){ return optLabel(q.opts, v); }).join("; ");
  if (q.type === "rank") return (a.v || []).map(function(v, i){ return (i + 1) + ". " + optLabel(q.opts, v); }).join("; ");
  if (q.type === "matrix") return q.rows.map(function(r){ return T(r.t) + ": " + optLabel(q.cols, a.v[r.v]); }).join("; ");
  if (q.type === "composition") return q.rows.map(function(r){ return T(r.t) + " " + (a.v[r.v] || 0) + "%"; }).join("; ");
  if (q.type === "text") return a.v || "";
  if (q.type === "combo") return q.parts.map(function(p){
    var pv = a.v && a.v[p.key]; if (!pv || pv.v == null || pv.v === "") return null;
    var popts = p.opts || (p.optsFrom ? q.parts.find(function(x){ return x.key === p.optsFrom; }).opts : null);
    var val = Array.isArray(pv.v) ? pv.v.map(function(v){ return optLabel(popts, v); }).join(", ") : (popts ? optLabel(popts, pv.v) : pv.v);
    return T(p.t) + ": " + val + (pv.fu ? " (" + pv.fu + ")" : "");
  }).filter(Boolean).join("; ");
  return JSON.stringify(a.v);
}

function stepReview(){
  var scr = screens();
  var rows = "";
  scr.forEach(function(sc, si){
    sc.qs.forEach(function(q){
      rows += '<dt>' + q.id + ' · <a href="#" onclick="QIE.jump(' + si + ');return false">' + esc(T(S.back)) + '</a></dt>' +
        '<dd>' + esc(labelFor(q, state.answers[q.id])) + '</dd>';
    });
  });
  h('<div class="scard">' + pathChips() +
    '<h2 class="sec">' + esc(T(S.review)) + '</h2>' +
    '<div class="review"><dl>' + rows + '</dl></div>' +
    '<div class="notice">' + esc(T((window.QIDB && QIDB.mode && QIDB.mode() === "live") ? S.liveNote : S.demoNote)) + '</div>' +
    '<div class="navrow"><button class="btn nav sec" onclick="QIE.jump(' + (scr.length - 1) + ')">' + esc(T(S.back)) + '</button>' +
    '<button class="btn nav" id="sbm">' + esc(T(S.submit)) + '</button></div></div>');
  document.getElementById("sbm").onclick = doSubmit;
}

function respLabel(){
  var sn = sess();
  if (sn && sn.id) return sn.id;
  var who = (state.who && state.who.name) ? state.who.name : "";
  var where = state.mode === "international" ? (institutionLabel() + (scopeLabel() ? " · " + scopeLabel() : "")) : (country() ? country().en : "");
  var lab = [where, who].filter(Boolean).join(" · ") || (state.who && state.who.email) || "open";
  return lab.slice(0, 160);
}
function payload(){
  var c = country();
  return {
    schema: "qi-survey-v3.7",
    submitted_at: new Date().toISOString(),
    language: qiLang,
    mode: state.mode,
    country: c ? c.en : null, country_iso3: c ? state.country : "",
    institution: state.mode === "international" ? institutionLabel() : "",
    coverage: state.mode === "international" ? scopeLabel() : "",
    scope_codes: state.mode === "international" ? (state.scope.regions || []) : [],
    respondent_name: (state.who && state.who.name) || "",
    respondent_email: (state.who && state.who.email) || "",
    tier: c ? c.tier : null, family: state.family,
    respondent_id: respLabel(),
    contact: state.contact,
    answers: state.answers
  };
}
function doSubmit(){
  var btn = document.getElementById("sbm"); btn.disabled = true;
  var p = payload();
  var c = country();
  var rt = "";
  try { rt = sessionStorage.getItem("qi_invite_rt") || ""; } catch(e){}
  var region = state.mode === "international"
    ? ((state.scope.regions || []).indexOf("global") >= 0 ? "global"
       : (state.scope.regions || []).length > 1 ? "multi" : ((state.scope.regions || [])[0] || "multi"))
    : ((c && c.region) || "africa");
  var meta = { respondent_id: p.respondent_id, iso3: p.country_iso3, region: region,
    tier: p.tier, family: p.family, language: p.language,
    category: (state.answers.P2 && state.answers.P2.v) || "", level: (state.answers.P3 && state.answers.P3.v) || "",
    mode: p.mode, institution: p.institution, coverage: p.coverage, scope_codes: p.scope_codes,
    respondent_name: p.respondent_name, respondent_email: p.respondent_email };
  var dbCall = (window.QIDB ? QIDB.submitResponse(rt, meta, p.answers) : Promise.resolve({ ok:false }));
  dbCall.then(function(r){
    if (r && r.ok) { finish(true); return; }
    var body = new URLSearchParams({
      "form-name": "qi-survey",
      "language": p.language, "country": p.country || "", "country_iso3": p.country_iso3 || "",
      "tier": String(p.tier || ""), "family": p.family || "", "respondent_id": p.respondent_id || "",
      "org": state.contact.org || "", "email": state.contact.email || "",
      "submitted_at": p.submitted_at, "answers_json": JSON.stringify(p.answers)
    }).toString();
    fetch("/", { method:"POST", headers:{ "Content-Type":"application/x-www-form-urlencoded" }, body: body })
      .then(function(x){ finish(x.ok); })
      .catch(function(){ finish(false); });
  });
}
function docFilename(){
  var base = state.mode === "international" ? (state.scope.institution || "organisation") : (state.country || "survey");
  return "QIF-response-" + String(base).replace(/[^A-Za-z0-9]+/g, "-").slice(0, 40) + ".doc";
}
function buildConfirmationDoc(){
  var scr = screens(), rows = "";
  scr.forEach(function(sc){
    sc.qs.forEach(function(q){
      var a = state.answers[q.id];
      var ansTxt = a ? esc(labelFor(q, a)) : "—";
      rows += '<tr><td style="border:1px solid #b8c4cf;padding:6px 8px;vertical-align:top;width:58%"><b>' + q.id + '</b> &#160; ' + esc(T(q.t)) + '</td>' +
        '<td style="border:1px solid #b8c4cf;padding:6px 8px;vertical-align:top">' + ansTxt + '</td></tr>';
    });
  });
  var c = country();
  var scopeTxt = state.mode === "international" ? (institutionLabel() + (scopeLabel() ? " — " + scopeLabel() : "")) : (c ? c[qiLang] : "");
  var meta = '<table style="border-collapse:collapse;margin:0 0 14px">' +
    '<tr><td style="padding:2px 12px 2px 0"><b>' + esc(T(EN.fRespondent)) + ':</b></td><td>' + esc(state.who.name || "") + '</td></tr>' +
    '<tr><td style="padding:2px 12px 2px 0"><b>' + esc(T(EN.fEmail)) + ':</b></td><td>' + esc(state.who.email || "") + '</td></tr>' +
    '<tr><td style="padding:2px 12px 2px 0"><b>' + esc(T(EN.fScope)) + ':</b></td><td>' + esc(scopeTxt) + '</td></tr>' +
    '<tr><td style="padding:2px 12px 2px 0"><b>' + esc(T(EN.fSubmitted)) + ':</b></td><td>' + esc(new Date().toLocaleString()) + '</td></tr></table>';
  var dir = (qiLang === "ar") ? ' dir="rtl"' : '';
  return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
    '<head><meta charset="utf-8"><title>' + esc(T(EN.confirmDocTitle)) + '</title></head>' +
    '<body' + dir + ' style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#10233A">' +
    '<h2 style="color:#14486B">' + esc(T(EN.confirmDocTitle)) + '</h2>' +
    '<p>' + esc(T(EN.confirmIntro)) + '</p>' + meta +
    '<table style="border-collapse:collapse;width:100%">' +
    '<tr><th style="border:1px solid #b8c4cf;background:#14486B;color:#fff;padding:6px 8px;text-align:start">' + esc(T(EN.colQuestion)) + '</th>' +
    '<th style="border:1px solid #b8c4cf;background:#14486B;color:#fff;padding:6px 8px;text-align:start">' + esc(T(EN.colAnswer)) + '</th></tr>' + rows + '</table>' +
    '<p style="margin-top:16px;font-size:9pt;color:#55646F">' + esc(T(I.partners)) + '</p></body></html>';
}
function downloadDoc(){
  try {
    var blob = new Blob(['﻿' + buildConfirmationDoc()], { type:"application/msword" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = docFilename();
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
    return true;
  } catch(e){ return false; }
}
function finish(sent){
  state.submitted = true; save();
  var warn = sent ? "" : '<div class="notice">' + esc(T(S.submitError)) + '</div>';
  downloadDoc();   // best-effort auto-download of the Word confirmation
  h('<div class="scard tc"><h2 class="sec">' + esc(T(S.thanksTitle)) + '</h2>' +
    '<p class="sub" style="margin:10px auto;max-width:40em">' + esc(T(S.thanks)) + '</p>' + warn +
    '<div class="okbox" style="margin:14px auto;max-width:44em;text-align:start">' + esc(T(EN.confirmReady)) + '</div>' +
    '<p style="margin-top:18px"><button class="btn nav" onclick="QIE.receipt()">' + esc(T(EN.confirmBtn)) + '</button></p>' +
    '<p><a class="btn nav sec" href="insights.html?lang=' + qiLang + '">' + esc(T(I.nav.insights)) + '</a></p></div>');
  clearDraft();
}

// ---- public API ----
window.QIE = {
  init: function(mount){
    root = mount;
    var draft = load();
    var s = sess();
    if (s) {   // invited via a personal link: national, country pre-set
      if (draft && draft.country === s.iso3 && !draft.submitted) { state = draft; }
      else { state = { step:"consent", mode:"national", country:s.iso3, scope:{ institution:"", institutionOther:"", regions:[] }, who:{ name:s.name||"", email:"" }, family:null, screen:0, answers:{}, contact:{org:"",email:""}, submitted:false }; }
      applyProfile(s);
      render(); return;
    }
    if (draft && (draft.country || draft.mode === "international") && !draft.submitted) { state = draft; }
    render();
  },
  pick: function(mode){
    state.mode = mode;
    state.step = (mode === "international") ? "intl" : "country";
    save(); render();
  },
  toType: function(){ state.step = "type"; save(); render(); },
  toEntry: function(){ state.step = (state.mode === "international") ? "intl" : "country"; save(); render(); },
  agree: function(){
    state.step = "screens"; state.screen = 0;
    save(); render();
  },
  resume: function(){ var d = load(); if (d) { state = d; render(); } },
  reset: function(){
    clearDraft();
    var s = sess();
    if (s) { state = { step:"consent", mode:"national", country:s.iso3, scope:{ institution:"", institutionOther:"", regions:[] }, who:{ name:s.name||"", email:"" }, family:null, screen:0, answers:{}, contact:{org:"",email:""}, submitted:false }; applyProfile(s); }
    else { state = { step:"type", mode:"national", country:null, scope:{ institution:"", institutionOther:"", regions:[] }, who:{ name:"", email:"" }, family:null, screen:0, answers:{}, contact:{org:"",email:""}, submitted:false }; }
    render();
  },
  prev: function(){
    if (state.screen === 0) { state.step = "consent"; } else { state.screen--; }
    save(); render();
  },
  next: function(){
    var scr = screens(); var sc = scr[state.screen];
    if (!validateScreen(sc)) return;
    // after profile screen 1 (contains P2), lock family routing
    var p2 = state.answers["P2"];
    if (p2 && !p2.miss && p2.v) {
      var opt = BANK.profile.find(function(q){ return q.id === "P2"; }).opts.find(function(o){ return o.v === p2.v; });
      if (opt) state.family = opt.fam;
    }
    if (state.screen === scr.length - 1) { state.step = "review"; } else { state.screen++; }
    save(); render();
  },
  jump: function(si){ state.step = "screens"; state.screen = si; save(); render(); },
  receipt: function(){ downloadDoc(); }
};
function render(){
  if (state.step === "type") stepType();
  else if (state.step === "country") stepCountry();
  else if (state.step === "intl") stepIntl();
  else if (state.step === "consent") stepConsent();
  else if (state.step === "review") stepReview();
  else stepScreens();
}
})();
