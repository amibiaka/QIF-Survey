// QIF Survey Master - platform administration console (v3).
// Live mode: Supabase auth + RLS-scoped data. Demo mode: localStorage.
(function(){
var I = QI_I18N, AX = I.adminx, DX = I.dbx;
function el(id){ return document.getElementById(id); }
var LIVE = QIDB.mode() === "live";
var ME = null;           // live profile
var DEMO_ROLE = null;    // demo role: 'super' | org admin
var STATUS = {};         // iso3 -> enabled

function demoRole(){
  try { return localStorage.getItem("qi_admin_role") || "unido"; } catch(e){ return "unido"; }
}
function isSuper(){ return LIVE ? (ME && ME.role === "super") : demoRole() === "super"; }
function canDownload(){ return LIVE ? (ME && ME.can_download) : true; }
function myScopeRegions(){
  if (!LIVE) return ["africa","caribbean","pacific"];
  if (ME && ME.role === "super") return ["africa","caribbean","pacific"];
  return (ME && ME.scope_regions) || [];
}
function inScope(c){
  if (!LIVE || (ME && ME.role === "super")) return true;
  return myScopeRegions().indexOf(c.region) >= 0 || ((ME && ME.scope_countries) || []).indexOf(c.iso3) >= 0;
}

// ---------------- sign-in / mode ----------------
function paintMode(){
  el("v3-mode").innerHTML = '<span class="modechip ' + (LIVE ? "live" : "demo") + '">' + esc(T(LIVE ? DX.live : DX.demo)) + '</span>' +
    (LIVE && ME ? ' <span style="font-size:12.5px;color:var(--grey)">' + esc(ME.email) + ' · ' + esc(T(AX.roles[ME.role] || { en:ME.role })) + '</span>' : "");
}
function showLogin(){
  el("v3-login").style.display = "block";
  el("v3-console").style.display = "none";
}
function showConsole(){
  el("v3-login").style.display = "none";
  el("v3-console").style.display = "block";
  paintMode(); paintSpaces(); paintTeam(); paintInvites(); paintRequests(); paintDownloads(); paintLog();
}
function boot(){
  paintMode();
  if (!LIVE) { showConsole(); return; }
  if (!QIDB.authed()) { showLogin(); return; }
  QIDB.myProfile().then(function(p){
    if (!p || p.ok === false) { QIDB.signOut(); showLogin(); return; }
    ME = p;
    if (p.must_change) { el("v3-changepw").style.display = "block"; el("v3-login").style.display = "none"; el("v3-console").style.display = "none"; return; }
    showConsole();
  });
}
el("v3-li-btn").onclick = function(e){
  e.preventDefault();
  var m = el("v3-li-msg"); m.className = "gatemsg";
  QIDB.signIn(el("v3-li-email").value.trim(), el("v3-li-pw").value).then(function(r){
    if (!r.ok) { m.className = "gatemsg err"; m.textContent = T(DX.badLogin); return; }
    ME = r.profile;
    if (ME && ME.must_change) { el("v3-login").style.display = "none"; el("v3-changepw").style.display = "block"; return; }
    showConsole();
  });
};
el("v3-pw-btn").onclick = function(e){
  e.preventDefault();
  var pw = el("v3-pw-new").value;
  var m = el("v3-pw-msg"); m.className = "gatemsg";
  if (!pw || pw.length < 12) { m.className = "gatemsg err"; m.textContent = T(DX.newPassword); return; }
  QIDB.changePassword(pw).then(function(r){
    if (!r.ok) { m.className = "gatemsg err"; m.textContent = r.why || "error"; return; }
    if (ME) ME.must_change = false;
    el("v3-changepw").style.display = "none";
    showConsole();
  });
};

// ---------------- spaces & countries ----------------
function paintSpaces(){
  QIDB.countryStatus().then(function(st){
    STATUS = st;
    var sup = isSuper();
    el("v3-spaces").innerHTML = ["africa","caribbean","pacific"].map(function(reg){
      var cs = QI_COUNTRIES.filter(function(c){ return c.region === reg; })
        .sort(function(a, b){ return a[qiLang].localeCompare(b[qiLang], qiLang); });
      var open = cs.filter(function(c){ return STATUS[c.iso3]; }).length;
      return '<div class="cbox"><h4>' + esc(T(I.regions[reg])) + ' <span class="locknote">' + open + ' / ' + cs.length + ' ' + esc(T(I.regions.open)) + '</span></h4>' +
        '<div class="cgridt">' + cs.map(function(c){
          var on = !!STATUS[c.iso3];
          return '<div class="ctoggle"><span>' + esc(c[qiLang]) + '</span>' +
            '<button type="button" class="' + (on ? "on" : "") + '" data-iso="' + c.iso3 + '" ' + (sup ? "" : "disabled") + '>' +
            (on ? esc(T(I.regions.statusOpen)) : esc(T(I.regions.statusClosed))) + '</button></div>';
        }).join("") + '</div></div>';
    }).join("");
    if (sup) el("v3-spaces").querySelectorAll("button[data-iso]").forEach(function(b){
      b.onclick = function(){
        var iso = b.getAttribute("data-iso"), next = !STATUS[iso];
        QIDB.setCountryEnabled(iso, next).then(function(r){
          if (r && r.ok !== false) { STATUS[iso] = next; paintSpaces(); paintInviteCountry(); QIDB.log("country_" + (next ? "enabled" : "disabled"), { iso3: iso }); }
        });
      };
    });
    paintInviteCountry();
  });
}

// ---------------- administrators & rights ----------------
var ROLE_KEYS = ["country","mdb","regional","oacps","partner","super"];
function paintTeam(){
  var sup = isSuper();
  el("v3-team-create").style.display = sup ? "block" : "none";
  QIDB.listAdmins().then(function(rows){
    el("v3-team-list").innerHTML = (rows || []).map(function(a){
      var scope = (a.scope_regions || []).map(function(r){ return T(I.regions[r] || { en:r }); }).join(", ") +
        ((a.scope_countries || []).length ? " · " + (a.scope_countries || []).join(" ") : "");
      return '<div class="pitem"><div class="grow"><b>' + esc(a.name || a.email) + '</b> · ' + esc(a.email) +
        '<br><span style="font-size:12px;color:var(--grey)">' + esc(T(AX.roles[a.role] || { en:a.role })) +
        (scope ? " · " + esc(scope) : "") + (a.can_download ? " · XLSX" : "") +
        (a.must_change ? ' · <span class="why manual">' + esc(T(DX.mustChange)) + '</span>' : "") + '</span></div>' +
        (sup && a.role !== "super" ? '<button class="cbtn warn" data-rm="' + esc(a.id) + '">✕</button>' : "") + '</div>';
    }).join("") || '<p class="note">—</p>';
    if (sup) el("v3-team-list").querySelectorAll("button[data-rm]").forEach(function(b){
      b.onclick = function(){ QIDB.removeAdmin(b.getAttribute("data-rm")).then(paintTeam); };
    });
  });
}
el("v3-adm-role").innerHTML = ROLE_KEYS.map(function(r){
  return '<option value="' + r + '">' + esc(T(AX.roles[r])) + '</option>';
}).join("");
el("v3-adm-regions").innerHTML = ["africa","caribbean","pacific"].map(function(r){
  return '<label class="ck"><input type="checkbox" value="' + r + '"> <span>' + esc(T(I.regions[r])) + '</span></label>';
}).join("");
el("v3-adm-btn").onclick = function(e){
  e.preventDefault();
  var m = el("v3-adm-msg"); m.className = "gatemsg"; el("v3-adm-out").style.display = "none";
  var email = el("v3-adm-email").value.trim();
  if (!email) { m.className = "gatemsg err"; m.textContent = T({ en:"Email required.", fr:"Courriel requis.", ar:"البريد الإلكتروني مطلوب." }); return; }
  var regions = [].map.call(el("v3-adm-regions").querySelectorAll("input:checked"), function(i){ return i.value; });
  var countries = el("v3-adm-countries").value.trim().toUpperCase().split(/[\s,;]+/).filter(Boolean);
  QIDB.createAdmin({
    email: email, name: el("v3-adm-name").value.trim(), org: el("v3-adm-org").value.trim(),
    role: el("v3-adm-role").value, scope_regions: regions, scope_countries: countries,
    can_download: el("v3-adm-dl").checked, origin: location.origin
  }).then(function(r){
    if (!r.ok) { m.className = "gatemsg err"; m.textContent = r.why || "error"; return; }
    QIDB.log("admin_created", { email: email, role: el("v3-adm-role").value });
    var out = el("v3-adm-out"); out.style.display = "block";
    out.innerHTML = r.emailed
      ? "<b>" + esc(T(AX.emailSent)) + "</b>"
      : "<b>" + esc(T(AX.tempPw)) + "</b> <code>" + esc(r.temp_password || "-") + "</code>";
    paintTeam();
  });
};

// ---------------- respondent invitations ----------------
function paintInviteCountry(){
  var sel = el("v3-inv-country");
  var groups = ["africa","caribbean","pacific"].map(function(reg){
    var opts = QI_COUNTRIES.filter(function(c){ return c.region === reg && STATUS[c.iso3] && inScope(c); })
      .sort(function(a, b){ return a[qiLang].localeCompare(b[qiLang], qiLang); })
      .map(function(c){ return '<option value="' + c.iso3 + '">' + esc(c[qiLang]) + '</option>'; }).join("");
    return opts ? '<optgroup label="' + esc(T(I.regions[reg])) + '">' + opts + '</optgroup>' : "";
  }).join("");
  sel.innerHTML = groups || "<option value=''>—</option>";
}
var P2 = QI_BANK_P1.profile.find(function(q){ return q.id === "P2"; });
var P3 = QI_BANK_P1.profile.find(function(q){ return q.id === "P3"; });
el("v3-inv-cat").innerHTML = P2.opts.map(function(o){ return '<option value="' + o.v + '">' + esc(T(o.t)) + '</option>'; }).join("");
el("v3-inv-level").innerHTML = P3.opts.map(function(o){ return '<option value="' + o.v + '">' + esc(T(o.t)) + '</option>'; }).join("");

function inviteLink(tk){ return location.origin + location.pathname.replace(/admin\.html.*$/, "") + "survey.html?rt=" + tk; }

el("v3-inv-btn").onclick = function(e){
  e.preventDefault();
  var m = el("v3-inv-msg"); m.className = "gatemsg"; el("v3-inv-out").style.display = "none";
  var email = el("v3-inv-email").value.trim();
  var iso = el("v3-inv-country").value;
  if (!email || !iso) { m.className = "gatemsg err"; m.textContent = T({ en:"Email and country required.", fr:"Courriel et pays requis.", ar:"البريد والبلد مطلوبان." }); return; }
  QIDB.createInvite({ email: email, name: el("v3-inv-name").value.trim(), iso3: iso,
    category: el("v3-inv-cat").value, level: el("v3-inv-level").value }).then(function(r){
    if (!r.ok) {
      m.className = "gatemsg err";
      m.textContent = r.why === "quota" ? T({ en:"Quota reached for this profile in this country.", fr:"Quota atteint pour ce profil dans ce pays.", ar:"اكتمل الحد الأقصى لهذا الملف في هذا البلد." }) : (r.why || "error");
      return;
    }
    QIDB.log("invite_created", { iso3: iso, email: email });
    var link = inviteLink(r.token);
    var out = el("v3-inv-out"); out.style.display = "block";
    out.innerHTML = "<b>" + esc(T(AX.respLink)) + "</b><div class='big' style='font-size:12.5px;word-break:break-all'>" + esc(link) + "</div>" +
      '<button class="cbtn sec" id="v3-inv-copy">' + esc(T(AX.copyLink)) + "</button> " +
      (LIVE ? '<button class="cbtn" id="v3-inv-mail">' + esc(T({ en:"Send by email", fr:"Envoyer par courriel", ar:"إرسال بالبريد" })) + "</button>" : "");
    el("v3-inv-copy").onclick = function(){
      navigator.clipboard.writeText(link).then(function(){ m.className = "gatemsg ok"; m.textContent = T(AX.linkCopied); });
    };
    if (LIVE) el("v3-inv-mail").onclick = function(){
      QIDB.sendInviteEmail(r.token).then(function(x){
        m.className = "gatemsg " + (x.emailed ? "ok" : "err");
        m.textContent = x.emailed ? T(AX.emailSent) : T({ en:"Email provider not configured; copy the link instead.", fr:"Fournisseur d'e-mail non configuré ; copiez le lien.", ar:"مزوّد البريد غير مهيأ؛ انسخوا الرابط بدلاً من ذلك." });
      });
    };
    paintInvites();
  });
};
function paintInvites(){
  QIDB.listInvites().then(function(rows){
    el("v3-inv-list").innerHTML = (rows || []).slice(0, 40).map(function(v){
      var st = v.used_at ? "active" : (new Date(v.expires_at) < new Date() ? "revoked" : "invited");
      var lbl = v.used_at ? { en:"responded", fr:"a répondu", ar:"أجاب" } : (st === "revoked" ? { en:"expired", fr:"expiré", ar:"منتهي" } : { en:"pending", fr:"en attente", ar:"قيد الانتظار" });
      return '<div class="pitem"><div class="grow"><b>' + esc(v.email) + '</b> · ' + esc(v.iso3) +
        ' · <span style="font-size:12px;color:var(--grey)">' + esc(v.category) + " / " + esc(v.level) + '</span></div>' +
        '<span class="statuschip ' + st + '">' + esc(T(lbl)) + '</span></div>';
    }).join("") || '<p class="note">—</p>';
  });
}

// ---------------- sign-up requests (live) ----------------
function paintRequests(){
  if (!LIVE) { el("v3-req-box").style.display = "none"; return; }
  QIDB.listRequests().then(function(rows){
    var pend = (rows || []).filter(function(r){ return r.status === "pending"; });
    el("v3-req-list").innerHTML = pend.map(function(r){
      return '<div class="pitem"><div class="grow"><b>' + esc(r.name || r.email) + '</b> · ' + esc(r.email || r.phone || "") + ' · ' + esc(r.iso3) +
        ' <span class="why ' + (r.reason === "quota" ? "quota" : "wave") + '">' + esc(r.reason || "") + '</span></div>' +
        '<button class="cbtn" data-ap="' + r.id + '">✓</button>' +
        (isSuper() ? '<button class="cbtn warn" data-rj="' + r.id + '">✕</button>' : "") + '</div>';
    }).join("") || '<p class="note">—</p>';
    el("v3-req-list").querySelectorAll("button[data-ap]").forEach(function(b){
      b.onclick = function(){ QIDB.decideRequest(b.getAttribute("data-ap"), true).then(function(){ paintRequests(); paintInvites(); }); };
    });
    el("v3-req-list").querySelectorAll("button[data-rj]").forEach(function(b){
      b.onclick = function(){ QIDB.decideRequest(b.getAttribute("data-rj"), false).then(paintRequests); };
    });
  });
}

// ---------------- data downloads ----------------
var THEMES = [
  ["profile", { en:"Respondent profile (P)", fr:"Profil du répondant (P)", ar:"ملف المجيب (P)" }, /^P\d/],
  ["legal", { en:"Legal and institutional (A1-A4)", fr:"Cadre légal et institutionnel (A1-A4)", ar:"الأطر القانونية والمؤسسية (A1-A4)" }, /^A[1-4]$/],
  ["funding", { en:"Funding today (A5-A8)", fr:"Financement actuel (A5-A8)", ar:"التمويل الحالي (A5-A8)" }, /^A[5-8]$/],
  ["gaps", { en:"Adequacy and gaps (A9-A12)", fr:"Adéquation et déficits (A9-A12)", ar:"الكفاية والفجوات (A9-A12)" }, /^A(9|1[0-2])$/],
  ["msme", { en:"MSMEs and demand (A13-A15)", fr:"MPME et demande (A13-A15)", ar:"المنشآت الصغيرة والطلب (A13-A15)" }, /^A1[3-5]$/],
  ["solutions", { en:"Solutions and priorities (A16-A19)", fr:"Solutions et priorités (A16-A19)", ar:"الحلول والأولويات (A16-A19)" }, /^A1[6-9]$/],
  ["tier", { en:"Country-tier module (T)", fr:"Module palier pays (T)", ar:"وحدة فئة البلد (T)" }, /^T\d/],
  ["family", { en:"Respondent module (F)", fr:"Module répondant (F)", ar:"وحدة المجيب (F)" }, /^F-/],
  ["closing", { en:"Closing (Z)", fr:"Clôture (Z)", ar:"الختام (Z)" }, /^Z\d/]
];
function paintDownloads(){
  el("v3-dl-box").style.display = canDownload() ? "block" : "none";
  var sel = el("v3-dl-scope");
  var regions = myScopeRegions();
  var opts = ['<option value="all">' + esc(T(AX.scopeAllData)) + '</option>'];
  regions.forEach(function(r){ opts.push('<option value="reg:' + r + '">' + esc(T(AX.byRegion)) + " · " + esc(T(I.regions[r])) + '</option>'); });
  QI_COUNTRIES.filter(inScope).sort(function(a, b){ return a[qiLang].localeCompare(b[qiLang], qiLang); }).forEach(function(c){
    opts.push('<option value="iso:' + c.iso3 + '">' + esc(T(AX.byCountry)) + " · " + esc(c[qiLang]) + '</option>');
  });
  sel.innerHTML = opts.join("");
  el("v3-dl-theme").innerHTML = '<option value="all">' + esc(T(AX.scopeAllData)) + '</option>' +
    THEMES.map(function(t){ return '<option value="' + t[0] + '">' + esc(T(AX.byThematic)) + " · " + esc(T(t[1])) + '</option>'; }).join("");
}
function flatRows(rows, themeKey){
  var theme = THEMES.find(function(t){ return t[0] === themeKey; });
  var keys = {};
  rows.forEach(function(r){ Object.keys(r.answers || {}).forEach(function(k){ if (!theme || theme[2].test(k)) keys[k] = true; }); });
  var qids = Object.keys(keys).sort();
  var head = ["response_id","submitted_at","respondent_id","region","country_iso3","tier","family","category","level","language"].concat(qids);
  var out = [head];
  rows.forEach(function(r){
    var base = [r.id || "", r.submitted_at || "", r.respondent_id || "", r.region || "", r.iso3 || "", r.tier || "", r.family || "", r.category || "", r.level || "", r.language || ""];
    out.push(base.concat(qids.map(function(q){
      var a = (r.answers || {})[q];
      if (a == null) return "";
      if (a.miss) return "[" + a.miss + "]";
      var v = a.v !== undefined ? a.v : a;
      return typeof v === "object" ? JSON.stringify(v) : String(v);
    })));
  });
  return out;
}
function scopedRows(rows){
  var scope = el("v3-dl-scope").value;
  var resp = el("v3-dl-resp").value.trim().toLowerCase();
  return rows.filter(function(r){
    if (scope.indexOf("reg:") === 0 && r.region !== scope.slice(4)) return false;
    if (scope.indexOf("iso:") === 0 && r.iso3 !== scope.slice(4)) return false;
    if (resp && String(r.respondent_id || "").toLowerCase().indexOf(resp) < 0) return false;
    var c = QI_COUNTRIES.find(function(x){ return x.iso3 === r.iso3; });
    return !c || inScope(c);
  });
}
function dlBlob(content, name, mime){
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
}
function stamp(){ var d = new Date(); function p(x){ return x < 10 ? "0" + x : x; } return "" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()); }
el("v3-dl-xls").onclick = function(e){
  e.preventDefault();
  QIDB.fetchResponses().then(function(rows){
    var data = flatRows(scopedRows(rows), el("v3-dl-theme").value);
    function x(v){ return String(v == null ? "" : v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
    var xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      '<Styles><Style ss:ID="h"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#14486B" ss:Pattern="Solid"/></Style></Styles>' +
      '<Worksheet ss:Name="responses"><Table>' +
      data.map(function(row, ri){
        return '<Row>' + row.map(function(v){
          var num = /^-?\d+(\.\d+)?$/.test(String(v));
          return '<Cell' + (ri === 0 ? ' ss:StyleID="h"' : "") + '><Data ss:Type="' + (ri > 0 && num ? "Number" : "String") + '">' + x(v) + '</Data></Cell>';
        }).join("") + '</Row>';
      }).join("") + '</Table></Worksheet></Workbook>';
    dlBlob(xml, "qif-responses-" + stamp() + ".xls", "application/vnd.ms-excel");
    QIDB.log("download", { format:"xls", scope: el("v3-dl-scope").value, theme: el("v3-dl-theme").value, rows: data.length - 1 });
  });
};
el("v3-dl-csv").onclick = function(e){
  e.preventDefault();
  QIDB.fetchResponses().then(function(rows){
    var data = flatRows(scopedRows(rows), el("v3-dl-theme").value);
    function q(v){ return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; }
    var csv = "﻿" + data.map(function(r){ return r.map(q).join(","); }).join("\r\n");
    dlBlob(csv, "qif-responses-" + stamp() + ".csv", "text/csv;charset=utf-8");
    QIDB.log("download", { format:"csv", scope: el("v3-dl-scope").value, theme: el("v3-dl-theme").value, rows: data.length - 1 });
  });
};

// ---------------- activity log ----------------
function paintLog(){
  QIDB.fetchLog().then(function(rows){
    el("v3-log").innerHTML = (rows || []).slice(0, 60).map(function(r){
      return "<li><time>" + esc(String(r.at || "").replace("T", " ").slice(0, 16)) + "</time>" +
        esc((r.actor ? r.actor + " · " : "") + r.action) + "</li>";
    }).join("") || "<li>—</li>";
  });
}

// ---------------- static labels ----------------
el("v3-title").textContent = T(I.product.name) + " · " + T({ en:"Platform administration", fr:"Administration de la plateforme", ar:"إدارة المنصة" });
el("v3-sub").textContent = T({ en:"Survey spaces, administrators and rights, respondent invitations, and scoped data downloads.",
  fr:"Espaces d'enquête, administrateurs et droits, invitations des répondants et téléchargements de données selon les droits.",
  ar:"فضاءات الاستبيان، والمديرون والصلاحيات، ودعوات المجيبين، وتنزيل البيانات وفق الصلاحيات." });
el("v3-li-t").textContent = T(DX.adminLogin);
el("v3-li-l1").textContent = T(DX.email);
el("v3-li-l2").textContent = T(DX.password);
el("v3-li-btn").textContent = T(DX.signIn);
el("v3-pw-t").textContent = T(DX.mustChange);
el("v3-pw-new").placeholder = T(DX.newPassword);
el("v3-pw-btn").textContent = T(DX.signIn);
el("v3-sp-t").textContent = T(AX.spaces);
el("v3-sp-n").textContent = T(AX.spacesNote);
el("v3-team-t").textContent = T(AX.team);
el("v3-team-n").textContent = T(AX.teamNote);
el("v3-l-email").textContent = T(DX.email);
el("v3-l-name").textContent = T({ en:"Full name", fr:"Nom complet", ar:"الاسم الكامل" });
el("v3-l-org").textContent = T({ en:"Organization", fr:"Organisation", ar:"المنظمة" });
el("v3-l-role").textContent = T({ en:"Role", fr:"Rôle", ar:"الدور" });
el("v3-l-regions").textContent = T({ en:"Data scope: regions", fr:"Portée des données : régions", ar:"نطاق البيانات: المناطق" });
el("v3-l-countries").textContent = T({ en:"Data scope: extra countries (ISO3, optional)", fr:"Portée : pays supplémentaires (ISO3, facultatif)", ar:"النطاق: بلدان إضافية (ISO3، اختياري)" });
el("v3-l-dl").textContent = T({ en:"Can download data", fr:"Peut télécharger les données", ar:"يمكنه تنزيل البيانات" });
el("v3-adm-btn").textContent = T({ en:"Create administrator", fr:"Créer l'administrateur", ar:"إنشاء المدير" });
el("v3-inv-t").textContent = T(AX.invites);
el("v3-inv-n").textContent = T(AX.invitesNote);
el("v3-l-iemail").textContent = T(DX.email);
el("v3-l-iname").textContent = T({ en:"Full name", fr:"Nom complet", ar:"الاسم الكامل" });
el("v3-l-icountry").textContent = T({ en:"Country (open countries only)", fr:"Pays (pays ouverts uniquement)", ar:"البلد (البلدان المفتوحة فقط)" });
el("v3-l-icat").textContent = T({ en:"Organization type / sector", fr:"Type d'organisation / secteur", ar:"نوع المنظمة / القطاع" });
el("v3-l-ilevel").textContent = T({ en:"Hierarchical level", fr:"Niveau hiérarchique", ar:"المستوى الوظيفي" });
el("v3-inv-btn").textContent = T({ en:"Create respondent and generate link", fr:"Créer le répondant et générer le lien", ar:"إنشاء المجيب وتوليد الرابط" });
el("v3-req-t").textContent = T({ en:"Pending sign-up requests", fr:"Demandes d'accès en attente", ar:"طلبات الوصول قيد الانتظار" });
el("v3-dl-t").textContent = T(AX.downloads);
el("v3-dl-n").textContent = T(AX.downloadsNote);
el("v3-l-scope").textContent = T({ en:"Scope", fr:"Portée", ar:"النطاق" });
el("v3-l-theme").textContent = T(AX.byThematic);
el("v3-l-resp").textContent = T(AX.byRespondent);
el("v3-log-t").textContent = T({ en:"Activity log", fr:"Journal d'activité", ar:"سجل النشاط" });

boot();
})();

