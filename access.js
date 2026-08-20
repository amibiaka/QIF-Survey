// Access layer (PROTOTYPE): respondent register, sign-up requests, quotas, admin rosters.
// Demo only: everything is stored in this browser's localStorage. The production build
// replaces this with server-side accounts, partner SSO/MFA and real email/SMS delivery.
(function(){
  var KEY = "qi_access_v2", SKEY = "qi_session_v1";

  // Short codes used to build simple respondent IDs, one per P2 institutional category.
  var CAT_CODE = { gov_pol:"MIN", fin:"FIN", parl:"PAR", nsb:"NSB", nmi:"NMI", nab:"NAB",
    cab:"CAB", reg:"REG", bor:"BOR", psu:"PSU", bdf:"BDF", dev:"DEV", aca:"ACA", other:"OTH" };

  // Quota rule (per country x category x level):
  // default cap 2; heads of the unique national QI institutions (NSB, NMI, NAB) cap 1.
  // Ministries can have two directors general for the same sector, hence cap 2 there.
  function quotaCap(cat, level){
    var unique = { nsb:1, nmi:1, nab:1 };
    if (unique[cat] && (level === "ao" || level === "pol")) return 1;
    return 2;
  }

  var SEED = {
    respondents: [
      { id:"GHA-NSB-01", code:"2468", name:"Demo respondent, head of the national standards body",
        iso3:"GHA", cat:"nsb", level:"ao", email:"demo.nsb@example.org", status:"active" },
      { id:"CIV-FIN-01", code:"1357", name:"Repondant demo, direction du budget",
        iso3:"CIV", cat:"fin", level:"dir", email:"demo.fin@example.org", status:"active" },
      { id:"EGY-REG-01", code:"8642", name:"Demo respondent, market surveillance authority",
        iso3:"EGY", cat:"reg", level:"tm", phone:"+20 100 000 0000", status:"active" },
      { id:"UGA-PSU-01", code:"5093", name:"Demo respondent, business association",
        iso3:"UGA", cat:"psu", level:"dir", email:"demo.psu@example.org", status:"invited" }
    ],
    pending: [
      { ref:"REQ-001", name:"Demo request, testing laboratory manager", iso3:"ETH", cat:"cab", level:"tm",
        email:"demo.lab@example.org", org:"National testing laboratory", title:"Laboratory manager", reason:"manual" }
    ],
    admins: {
      unido: [ { name:"UNIDO admin 1 (demo)", email:"admin1@unido.example" },
               { name:"UNIDO admin 2 (demo)", email:"admin2@unido.example" } ],
      auda:  [ { name:"AUDA-NEPAD admin 1 (demo)", email:"admin1@auda.example" },
               { name:"AUDA-NEPAD admin 2 (demo)", email:"admin2@auda.example" } ],
      auc:   [ { name:"AUC admin 1 (demo)", email:"admin1@auc.example" } ]
    },
    log: [
      { t:"2026-08-19 18:02", a:"Seed register created with 4 demo respondents (super admin)" },
      { t:"2026-08-19 18:05", a:"Invitation sent to UGA-PSU-01 (simulated email)" }
    ]
  };

  function load(){
    try {
      var s = localStorage.getItem(KEY);
      if (s) return JSON.parse(s);
    } catch(e){}
    return JSON.parse(JSON.stringify(SEED));
  }
  function save(st){ try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){} }
  var store = load(); save(store);

  function norm(s){ return String(s || "").trim().toUpperCase(); }
  function findR(id){ id = norm(id); return store.respondents.find(function(r){ return r.id === id; }) || null; }
  function used(iso3, cat, level){
    return store.respondents.filter(function(r){
      return r.iso3 === iso3 && r.cat === cat && r.level === level &&
        (r.status === "active" || r.status === "invited");
    }).length;
  }
  function nextId(iso3, cat){
    var code = CAT_CODE[cat] || "OTH", n = 1;
    store.respondents.forEach(function(r){
      if (r.iso3 === iso3 && r.cat === cat) {
        var m = /-(\d+)$/.exec(r.id); if (m) n = Math.max(n, parseInt(m[1], 10) + 1);
      }
    });
    return iso3 + "-" + code + "-" + (n < 10 ? "0" + n : String(n));
  }
  function genCode(){ return String(1000 + Math.floor(Math.random() * 9000)); }
  function stamp(){ var d = new Date(); function p(x){ return x < 10 ? "0" + x : x; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()); }
  function logIt(a){ store.log.unshift({ t: stamp(), a: a }); store.log = store.log.slice(0, 30); save(store); }
  function validEmail(e){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(e || "")); }
  function validPhone(p){ return String(p || "").replace(/\D/g, "").length >= 8; }
  function country(iso3){ return (window.QI_COUNTRIES || []).find(function(c){ return c.iso3 === iso3; }) || null; }

  window.QIA = {
    CAT_CODE: CAT_CODE,
    quotaCap: quotaCap,
    quotaUsed: used,
    state: function(){ return store; },
    reload: function(){ store = load(); return store; },
    resetDemo: function(){ store = JSON.parse(JSON.stringify(SEED)); save(store); },

    session: function(){
      try { var s = localStorage.getItem(SKEY); return s ? JSON.parse(s) : null; } catch(e){ return null; }
    },
    login: function(id, code){
      var r = findR(id);
      if (!r) return { ok:false, why:"id" };
      if (String(r.code) !== String(code || "").trim()) return { ok:false, why:"code" };
      if (r.status === "revoked") return { ok:false, why:"revoked" };
      if (r.status === "invited") { r.status = "active"; save(store); }
      var sess = { id:r.id, iso3:r.iso3, cat:r.cat, level:r.level, name:r.name };
      try { localStorage.setItem(SKEY, JSON.stringify(sess)); } catch(e){}
      logIt("Respondent " + r.id + " signed in");
      return { ok:true, session:sess };
    },
    logout: function(){
      try { localStorage.removeItem(SKEY); localStorage.removeItem("qi_draft_v1"); } catch(e){}
    },

    // Sign-up: auto-validation when the profile data checks out and a quota slot is free,
    // otherwise the request is queued for the super admin.
    signup: function(p){
      if (!p.name || !p.iso3 || !p.cat || !p.level || !(validEmail(p.email) || validPhone(p.phone)))
        return { ok:false, why:"fields" };
      var c = country(p.iso3);
      if (!c) return { ok:false, why:"fields" };
      if (findDuplicate(p)) return { ok:false, why:"duplicate" };
      if (!c.w1) { queue(p, "wave"); return { ok:true, mode:"pending", reason:"wave" }; }
      if (used(p.iso3, p.cat, p.level) >= quotaCap(p.cat, p.level)) {
        queue(p, "quota"); return { ok:true, mode:"pending", reason:"quota" };
      }
      var rec = issue(p, "auto-validated sign-up");
      return { ok:true, mode:"auto", rec:rec };
    },

    // Super admin: create a respondent directly.
    create: function(p){
      if (!p.name || !p.iso3 || !p.cat || !p.level || !(validEmail(p.email) || validPhone(p.phone)))
        return { ok:false, why:"fields" };
      if (used(p.iso3, p.cat, p.level) >= quotaCap(p.cat, p.level)) return { ok:false, why:"quota" };
      var rec = issue(p, "created by super admin");
      return { ok:true, rec:rec };
    },

    approve: function(ref, role){
      var i = store.pending.findIndex(function(q){ return q.ref === ref; });
      if (i < 0) return { ok:false };
      var p = store.pending[i];
      if (used(p.iso3, p.cat, p.level) >= quotaCap(p.cat, p.level)) return { ok:false, why:"quota" };
      store.pending.splice(i, 1);
      var rec = issue(p, "approved by " + (role || "admin"));
      return { ok:true, rec:rec };
    },
    reject: function(ref, role){
      var i = store.pending.findIndex(function(q){ return q.ref === ref; });
      if (i < 0) return { ok:false };
      var p = store.pending.splice(i, 1)[0];
      logIt("Request " + p.ref + " (" + p.iso3 + ", " + p.cat + "/" + p.level + ") rejected by " + (role || "admin"));
      save(store);
      return { ok:true };
    },
    revoke: function(id, role){
      var r = findR(id); if (!r) return { ok:false };
      r.status = "revoked"; save(store);
      logIt("Access " + r.id + " revoked by " + (role || "admin"));
      return { ok:true };
    },
    resend: function(id, role){
      var r = findR(id); if (!r) return { ok:false };
      logIt("Invitation re-sent to " + r.id + " by " + (role || "admin") + " (simulated)");
      save(store);
      return { ok:true, rec:r };
    },

    addAdmin: function(org, name, email){
      var list = store.admins[org]; if (!list) return { ok:false };
      if (list.length >= 5) return { ok:false, why:"cap" };
      if (!name || !validEmail(email)) return { ok:false, why:"fields" };
      list.push({ name:name, email:email }); save(store);
      logIt("Admin added to " + org.toUpperCase() + ": " + name + " (super admin)");
      return { ok:true };
    },
    removeAdmin: function(org, idx){
      var list = store.admins[org]; if (!list || !list[idx]) return { ok:false };
      var a = list.splice(idx, 1)[0]; save(store);
      logIt("Admin removed from " + org.toUpperCase() + ": " + a.name + " (super admin)");
      return { ok:true };
    },

    invitation: function(rec, lang){
      var c = country(rec.iso3) || {};
      var url = location.origin + "/index.html?lang=" + (lang || "en");
      var tpl = {
        en: "Subject: Your access to the QI Financing Survey\n\nDear respondent,\n\nYou are invited to the Survey on Financing Quality Infrastructure and MSME Access to Finance in Africa (AUDA-NEPAD, UNIDO, AUC), for " + (c.en || rec.iso3) + ".\n\nYour respondent ID: " + rec.id + "\nYour access code: " + rec.code + "\n\nOpen " + url + " and enter both. The survey takes 20 to 25 minutes and can be paused at any time.",
        fr: "Objet : Votre acces a l'enquete sur le financement de l'IQ\n\nCher repondant, chere repondante,\n\nVous etes invite(e) a l'Enquete sur le financement de l'infrastructure de la qualite et l'acces des MPME au financement en Afrique (AUDA-NEPAD, ONUDI, CUA), pour " + (c.fr || rec.iso3) + ".\n\nVotre identifiant : " + rec.id + "\nVotre code d'acces : " + rec.code + "\n\nOuvrez " + url + " et saisissez les deux. L'enquete dure 20 a 25 minutes et peut etre reprise a tout moment.",
        ar: "الموضوع: بيانات دخولكم إلى استبيان تمويل البنية التحتية للجودة\n\nتحية طيبة،\n\nأنتم مدعوون إلى استبيان تمويل البنية التحتية للجودة ووصول المنشآت الصغرى والصغيرة والمتوسطة إلى التمويل في أفريقيا (أودا-نيباد، اليونيدو، مفوضية الاتحاد الأفريقي) عن " + (c.ar || rec.iso3) + ".\n\nمعرّفكم: " + rec.id + "\nرمز الدخول: " + rec.code + "\n\nافتحوا " + url + " وأدخلوا الاثنين. يستغرق الاستبيان من 20 إلى 25 دقيقة ويمكن استئنافه في أي وقت."
      };
      return tpl[lang] || tpl.en;
    }
  };

  function findDuplicate(p){
    var e = String(p.email || "").toLowerCase();
    return store.respondents.some(function(r){ return e && String(r.email || "").toLowerCase() === e; }) ||
           store.pending.some(function(q){ return e && String(q.email || "").toLowerCase() === e; });
  }
  function queue(p, reason){
    var ref = "REQ-" + String(100 + store.pending.length + Math.floor(Math.random() * 900));
    store.pending.push({ ref:ref, name:p.name, iso3:p.iso3, cat:p.cat, level:p.level,
      email:p.email || "", phone:p.phone || "", org:p.org || "", title:p.title || "", reason:reason });
    logIt("Sign-up request " + ref + " queued (" + p.iso3 + ", " + p.cat + "/" + p.level + ", reason: " + reason + ")");
    save(store);
  }
  function issue(p, how){
    var rec = { id: nextId(p.iso3, p.cat), code: genCode(), name: p.name, iso3: p.iso3,
      cat: p.cat, level: p.level, email: p.email || "", phone: p.phone || "",
      org: p.org || "", title: p.title || "", status: "invited" };
    store.respondents.push(rec);
    logIt("Access " + rec.id + " issued (" + how + "); invitation sent (simulated)");
    save(store);
    return rec;
  }
})();
