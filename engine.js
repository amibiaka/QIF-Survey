// Survey engine: routing, screens of max 4 questions, widgets, validation, save/resume, submit.
(function(){
var I = QI_I18N, S = I.survey;
var BANK = {
  profile: QI_BANK_P1.profile, core: QI_BANK_P1.core,
  T1: QI_BANK_P2.T1, T2: QI_BANK_P2.T2, T3: QI_BANK_P2.T3, closing: QI_BANK_P2.closing,
  fams: QI_BANK_P3
};
var DRAFT_KEY = "qi_draft_v1";

var state = { step:"country", country:null, family:null, screen:0, answers:{}, contact:{org:"",email:""}, submitted:false };

function save(){ try{ localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); }catch(e){} }
function load(){ try{ var s = localStorage.getItem(DRAFT_KEY); return s ? JSON.parse(s) : null; }catch(e){ return null; } }
function clearDraft(){ try{ localStorage.removeItem(DRAFT_KEY); }catch(e){} }

function country(){ return QI_COUNTRIES.find(function(c){ return c.iso3 === state.country; }) || null; }

// ---- screens definition (groups of max 4) ----
function screens(){
  var c = country(); if (!c) return [];
  var tierQs = BANK["T" + c.tier];
  var famQs = BANK.fams[state.family || "F-GOV"];
  var pr = BANK.profile.filter(function(q){ return q.id !== "P1"; }); // P1 = country step
  var core = BANK.core;
  function byGroup(g){ return core.filter(function(q){ return q.group === g; }); }
  return [
    { title:"Profile 1/2", qs: pr.slice(0,3) },
    { title:"Profile 2/2", qs: pr.slice(3) },
    { title:"G1", qs: byGroup("G1") },
    { title:"G2", qs: byGroup("G2") },
    { title:"G3", qs: byGroup("G3") },
    { title:"G4", qs: byGroup("G4") },
    { title:"G5", qs: byGroup("G5") },
    { title:"Tier 1/2", qs: tierQs.slice(0,4) },
    { title:"Tier 2/2", qs: tierQs.slice(4) },
    { title:"Module 1/2", qs: famQs.slice(0,4) },
    { title:"Module 2/2", qs: famQs.slice(4) },
    { title:"Closing", qs: BANK.closing, closing:true }
  ];
}
function totalQuestions(){
  return screens().reduce(function(n, s){ return n + s.qs.length; }, 0) + 1; // +1 country
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
  var start = window.scrollY, dist = top - start, t0 = null, dur = 400;
  if (Math.abs(dist) < 4) return;
  function step(ts){
    if (t0 === null) t0 = ts;
    var p = Math.min(1, (ts - t0) / dur);
    var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    window.scrollTo(0, start + dist * e);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
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
  var c = country(); if (!c) return "";
  var bits = ['<span>' + esc(c[qiLang]) + '</span>', '<span>' + esc(T(I.tiers[c.tier].name)) + '</span>'];
  var p2 = state.answers["P2"];
  if (state.family && p2 && !p2.miss && p2.v) bits.push('<span>' + esc(T(I.families[state.family])) + '</span>');
  bits.push('<span>43 · ' + esc(T(S.minutes)) + '</span>');
  return '<div class="pathchips">' + bits.join("") + '</div>';
}

function stepCountry(){
  var draft = load();
  var resume = (draft && draft.country && draft.step === "screens") ?
    '<div class="okbox">' + esc(T(S.progressSaved)) + ' <button class="btn small nav" style="margin-inline-start:8px" onclick="QIE.resume()">' + esc(T(S.resume)) + '</button> <button class="btn small nav sec" onclick="QIE.reset()">' + esc(T(S.startOver)) + '</button></div>' : "";
  var opts = QI_COUNTRIES.slice().sort(function(a,b){ return a[qiLang].localeCompare(b[qiLang], qiLang); })
    .map(function(c){
      return '<option value="' + c.iso3 + '"' + (c.w1 ? "" : " disabled") + '>' + esc(c[qiLang]) + (c.w1 ? "" : " · " + esc(T(I.countries.later))) + '</option>';
    }).join("");
  h('<div class="scard">' + resume +
    '<h2 class="sec">' + esc(T(S.chooseCountry)) + '</h2><p class="sub">' + esc(T(S.countryNote)) + '</p>' +
    '<select id="csel" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:8px;font-size:16px;font-family:inherit"><option value="">…</option>' + opts + '</select>' +
    '<div class="notice">' + esc(T(S.notActive)) + '</div>' +
    '<div class="navrow"><span></span><button class="btn nav" id="cnext" disabled>' + esc(T(S.next)) + '</button></div></div>');
  var sel = document.getElementById("csel");
  if (state.country) sel.value = state.country;
  sel.addEventListener("change", function(){ document.getElementById("cnext").disabled = !this.value; });
  document.getElementById("cnext").disabled = !sel.value;
  document.getElementById("cnext").onclick = function(){
    state.country = sel.value; state.step = "consent"; save(); render();
  };
}

function stepConsent(){
  h('<div class="scard">' + pathChips() +
    '<h2 class="sec">' + esc(T(S.consentTitle)) + '</h2>' +
    '<p style="font-size:14.5px">' + esc(T(S.consent)) + '</p>' +
    '<p class="hint">' + esc(T(S.noRightWrong)) + '</p>' +
    '<div class="navrow"><button class="btn nav sec" onclick="QIE.toCountry()">' + esc(T(S.back)) + '</button>' +
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
    '<div class="notice">' + esc(T(S.demoNote)) + '</div>' +
    '<div class="navrow"><button class="btn nav sec" onclick="QIE.jump(' + (scr.length - 1) + ')">' + esc(T(S.back)) + '</button>' +
    '<button class="btn nav" id="sbm">' + esc(T(S.submit)) + '</button></div></div>');
  document.getElementById("sbm").onclick = doSubmit;
}

function payload(){
  var c = country();
  return {
    schema: "qi-survey-v2.0-prototype",
    submitted_at: new Date().toISOString(),
    language: qiLang,
    country: c ? c.en : null, country_iso3: state.country,
    tier: c ? c.tier : null, family: state.family,
    contact: state.contact,
    answers: state.answers
  };
}
function doSubmit(){
  var btn = document.getElementById("sbm"); btn.disabled = true;
  var p = payload();
  var body = new URLSearchParams({
    "form-name": "qi-survey",
    "language": p.language, "country": p.country || "", "country_iso3": p.country_iso3 || "",
    "tier": String(p.tier || ""), "family": p.family || "",
    "org": state.contact.org || "", "email": state.contact.email || "",
    "submitted_at": p.submitted_at, "answers_json": JSON.stringify(p.answers)
  }).toString();
  fetch("/", { method:"POST", headers:{ "Content-Type":"application/x-www-form-urlencoded" }, body: body })
    .then(function(r){ finish(r.ok); })
    .catch(function(){ finish(false); });
}
function finish(sent){
  state.submitted = true; save();
  var warn = sent ? "" : '<div class="notice">' + esc(T(S.submitError)) + '</div>';
  h('<div class="scard tc"><h2 class="sec">' + esc(T(S.thanksTitle)) + '</h2>' +
    '<p class="sub" style="margin:10px auto;max-width:40em">' + esc(T(S.thanks)) + '</p>' + warn +
    '<p style="margin-top:18px"><button class="btn nav" onclick="QIE.receipt()">' + esc(T(S.receipt)) + '</button></p>' +
    '<p><a class="btn nav sec" href="insights.html?lang=' + qiLang + '">' + esc(T(I.nav.insights)) + '</a></p></div>');
  clearDraft();
}

// ---- public API ----
window.QIE = {
  init: function(mount){
    root = mount;
    var draft = load();
    if (draft && draft.country) { state = draft; if (state.submitted) { state = { step:"country", screen:0, answers:{}, contact:{org:"",email:""} }; } }
    render();
  },
  toCountry: function(){ state.step = "country"; save(); render(); },
  agree: function(){
    state.step = "screens"; state.screen = 0;
    save(); render();
  },
  resume: function(){ var d = load(); if (d) { state = d; render(); } },
  reset: function(){ clearDraft(); state = { step:"country", screen:0, answers:{}, contact:{org:"",email:""} }; render(); },
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
  receipt: function(){
    var blob = new Blob([JSON.stringify(payload(), null, 2)], { type:"application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "qi-survey-receipt-" + (state.country || "xxx") + ".json";
    document.body.appendChild(a); a.click(); a.remove();
  }
};
function render(){
  if (state.step === "country") stepCountry();
  else if (state.step === "consent") stepConsent();
  else if (state.step === "review") stepReview();
  else stepScreens();
}
})();

