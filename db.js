// QIF Survey Master data layer. Two backends behind one API:
//  - live: Supabase (PostgREST + GoTrue over plain fetch, no SDK, low bandwidth)
//  - demo: localStorage (everything works offline for demonstrations)
// The active backend is chosen from config.js. All writes in live mode go
// through SECURITY DEFINER RPCs; Row Level Security enforces admin scopes.
(function(){
  var CFG = window.QI_SUPABASE || {};
  var LIVE = !!(CFG.url && CFG.anon);
  var TOKKEY = "qi_admin_jwt_v1";

  function hdrs(auth){
    var h = { "apikey": CFG.anon, "Content-Type": "application/json" };
    var t = auth === false ? null : jwt();
    h["Authorization"] = "Bearer " + (t || CFG.anon);
    return h;
  }
  function jwt(){
    try { var s = JSON.parse(sessionStorage.getItem(TOKKEY) || "null"); return s && s.access_token; } catch(e){ return null; }
  }
  function saveJwt(o){ try { sessionStorage.setItem(TOKKEY, JSON.stringify(o)); } catch(e){} }
  function clearJwt(){ try { sessionStorage.removeItem(TOKKEY); } catch(e){} }

  function rpc(name, args, auth){
    return fetch(CFG.url + "/rest/v1/rpc/" + name, {
      method: "POST", headers: hdrs(auth), body: JSON.stringify(args || {})
    }).then(function(r){
      return r.text().then(function(tx){
        var j = null; try { j = tx ? JSON.parse(tx) : null; } catch(e){}
        if (!r.ok) return { ok:false, why:(j && (j.message || j.hint)) || ("http_" + r.status) };
        return (j && typeof j === "object" && !Array.isArray(j)) ? j : { ok:true, data:j };
      });
    }).catch(function(){ return { ok:false, why:"network" }; });
  }
  function rest(path, auth){
    return fetch(CFG.url + "/rest/v1/" + path, { headers: hdrs(auth) })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(r.status); });
  }

  // ---------------- demo store ----------------
  var DKEY = "qi_master_demo_v1";
  function dload(){
    try { var d = JSON.parse(localStorage.getItem(DKEY) || "null"); if (d) return d; } catch(e){}
    var seed = { overrides:{}, invites:[], responses:[], admins:[
      { id:"a1", email:"super.admin@auda-nepad.org", name:"Demo Super Admin", role:"super",
        scope_regions:["africa","caribbean","pacific"], scope_countries:[], can_view:true, can_download:true, must_change:false }
    ], requests:[], log:[] };
    dsave(seed); return seed;
  }
  function dsave(d){ try { localStorage.setItem(DKEY, JSON.stringify(d)); } catch(e){} }
  function tok(){ var s = ""; for (var i = 0; i < 32; i++) s += "0123456789abcdef"[Math.floor(Math.random() * 16)]; return s; }

  function enabledMap(){
    var base = {};
    (window.QI_COUNTRIES || []).forEach(function(c){ base[c.iso3] = !!c.w1; });
    return base;
  }

  window.QIDB = {
    mode: function(){ return LIVE ? "live" : "demo"; },

    // ---- country enablement (defaults from countries.js, overridden by admin) ----
    countryStatus: function(){
      var base = enabledMap();
      if (!LIVE) {
        var d = dload(); Object.keys(d.overrides).forEach(function(k){ base[k] = d.overrides[k]; });
        return Promise.resolve(base);
      }
      return rest("country_status?select=iso3,enabled", false).then(function(rows){
        rows.forEach(function(r){ base[r.iso3] = r.enabled; });
        return base;
      }).catch(function(){ return base; });
    },
    setCountryEnabled: function(iso3, enabled){
      if (!LIVE) { var d = dload(); d.overrides[iso3] = !!enabled; dsave(d); return Promise.resolve({ ok:true }); }
      return rpc("set_country_enabled", { p_iso3: iso3, p_enabled: !!enabled });
    },

    // ---- respondent invites (7-day links) ----
    createInvite: function(p){
      if (!LIVE) {
        var d = dload(), t = tok();
        var cap = (["nsb","nmi","nab","nlmb"].indexOf(p.category) >= 0 && ["ao","pol"].indexOf(p.level) >= 0) ? 1 : 2;
        var used = d.invites.filter(function(i){ return i.iso3 === p.iso3 && i.category === p.category && i.level === p.level && (i.used_at || new Date(i.expires_at) > new Date()); }).length;
        if (used >= cap) return Promise.resolve({ ok:false, why:"quota" });
        var inv = { id:tok(), token:t, email:p.email, name:p.name || "", iso3:p.iso3, category:p.category,
          level:p.level, created_at:new Date().toISOString(),
          expires_at:new Date(Date.now() + 7 * 864e5).toISOString(), used_at:null, created_by:p.created_by || "demo" };
        d.invites.push(inv); dsave(d);
        return Promise.resolve({ ok:true, token:t, expires_at:inv.expires_at });
      }
      return rpc("create_invite", { p: p });
    },
    listInvites: function(){
      if (!LIVE) return Promise.resolve(dload().invites);
      return rest("invites?select=*&order=created_at.desc").catch(function(){ return []; });
    },
    validateInvite: function(token){
      if (!LIVE) {
        var d = dload();
        var inv = d.invites.find(function(i){ return i.token === token; });
        if (!inv) return Promise.resolve({ ok:false, why:"not_found" });
        if (inv.used_at) return Promise.resolve({ ok:false, why:"used" });
        if (new Date(inv.expires_at) < new Date()) return Promise.resolve({ ok:false, why:"expired" });
        return Promise.resolve({ ok:true, invite:inv });
      }
      return rpc("validate_invite", { p_token: token }, false);
    },

    // ---- responses ----
    submitResponse: function(token, meta, answers){
      if (!LIVE) {
        var d = dload();
        var inv = token ? d.invites.find(function(i){ return i.token === token; }) : null;
        if (inv) inv.used_at = new Date().toISOString();
        d.responses.push({ id:tok(), submitted_at:new Date().toISOString(), respondent_id:meta.respondent_id || (inv && inv.email) || "demo",
          iso3:meta.iso3, region:meta.region, tier:meta.tier, family:meta.family, language:meta.language,
          category:meta.category, level:meta.level, answers:answers });
        dsave(d); return Promise.resolve({ ok:true });
      }
      return rpc("submit_response", { p_token: token || "", p_meta: meta, p_answers: answers }, false);
    },
    fetchResponses: function(){
      if (!LIVE) return Promise.resolve(dload().responses);
      return rest("responses?select=*&order=submitted_at.desc").catch(function(){ return []; });
    },

    // ---- public access requests (sign-up) ----
    requestAccess: function(p){
      if (!LIVE) return Promise.resolve(null); // demo path handled by QIA
      return rpc("request_access", { p: p }, false);
    },
    listRequests: function(){
      if (!LIVE) return Promise.resolve(dload().requests);
      return rest("signup_requests?select=*&order=created_at.desc").catch(function(){ return []; });
    },
    decideRequest: function(id, approve){
      if (!LIVE) return Promise.resolve({ ok:true });
      return rpc("decide_request", { p_id: id, p_approve: !!approve });
    },

    // ---- admin auth (live mode: Supabase GoTrue) ----
    signIn: function(email, password){
      if (!LIVE) return Promise.resolve({ ok:false, why:"demo" });
      return fetch(CFG.url + "/auth/v1/token?grant_type=password", {
        method:"POST", headers:{ "apikey":CFG.anon, "Content-Type":"application/json" },
        body: JSON.stringify({ email:email, password:password })
      }).then(function(r){ return r.json().then(function(j){
        if (!r.ok) return { ok:false, why:(j.error_description || j.msg || "auth") };
        saveJwt(j);
        return rpc("my_profile", {}).then(function(p){ return { ok:true, profile:p }; });
      }); }).catch(function(){ return { ok:false, why:"network" }; });
    },
    signOut: function(){ clearJwt(); return Promise.resolve({ ok:true }); },
    authed: function(){ return !!jwt(); },
    changePassword: function(pw){
      if (!LIVE) return Promise.resolve({ ok:true });
      return fetch(CFG.url + "/auth/v1/user", {
        method:"PUT", headers:hdrs(), body: JSON.stringify({ password: pw })
      }).then(function(r){ return r.json().then(function(j){
        if (!r.ok) return { ok:false, why:(j.msg || "auth") };
        return rpc("password_changed", {}).then(function(){ return { ok:true }; });
      }); });
    },
    myProfile: function(){
      if (!LIVE) return Promise.resolve(null);
      return rpc("my_profile", {});
    },

    // ---- admin management (live: via edge function for user creation) ----
    listAdmins: function(){
      if (!LIVE) return Promise.resolve(dload().admins);
      return rest("profiles?select=*&order=created_at.asc").catch(function(){ return []; });
    },
    createAdmin: function(p){
      if (!LIVE) {
        var d = dload();
        if (d.admins.some(function(a){ return a.email === p.email; })) return Promise.resolve({ ok:false, why:"duplicate" });
        var temp = "QIF-" + tok().slice(0, 8);
        d.admins.push({ id:tok(), email:p.email, name:p.name || "", org:p.org || "", role:p.role,
          scope_regions:p.scope_regions || [], scope_countries:p.scope_countries || [],
          can_view:true, can_download:!!p.can_download, must_change:true, created_at:new Date().toISOString() });
        dsave(d); return Promise.resolve({ ok:true, temp_password:temp, emailed:false });
      }
      return fetch(CFG.url + "/functions/v1/admin-ops", {
        method:"POST", headers:hdrs(), body: JSON.stringify({ action:"create_admin", p:p })
      }).then(function(r){ return r.json(); }).catch(function(){ return { ok:false, why:"network" }; });
    },
    updateRights: function(id, rights){
      if (!LIVE) {
        var d = dload(); var a = d.admins.find(function(x){ return x.id === id; });
        if (a) { Object.assign(a, rights); dsave(d); }
        return Promise.resolve({ ok:true });
      }
      return rpc("update_rights", { p_id:id, p:rights });
    },
    removeAdmin: function(id){
      if (!LIVE) { var d = dload(); d.admins = d.admins.filter(function(a){ return a.id !== id; }); dsave(d); return Promise.resolve({ ok:true }); }
      return fetch(CFG.url + "/functions/v1/admin-ops", {
        method:"POST", headers:hdrs(), body: JSON.stringify({ action:"remove_admin", p:{ id:id } })
      }).then(function(r){ return r.json(); }).catch(function(){ return { ok:false, why:"network" }; });
    },
    sendInviteEmail: function(inviteToken){
      if (!LIVE) return Promise.resolve({ ok:true, emailed:false });
      return fetch(CFG.url + "/functions/v1/admin-ops", {
        method:"POST", headers:hdrs(), body: JSON.stringify({ action:"email_invite", p:{ token:inviteToken, origin:location.origin } })
      }).then(function(r){ return r.json(); }).catch(function(){ return { ok:false, why:"network" }; });
    },

    log: function(action, detail){
      if (!LIVE) { var d = dload(); d.log.unshift({ at:new Date().toISOString(), action:action, detail:detail }); d.log = d.log.slice(0, 200); dsave(d); return Promise.resolve({ ok:true }); }
      return rpc("log_action", { p_action:action, p_detail:detail || {} }).catch(function(){ return { ok:false }; });
    },
    fetchLog: function(){
      if (!LIVE) return Promise.resolve(dload().log);
      return rest("audit_log?select=*&order=at.desc&limit=200").catch(function(){ return []; });
    },
    demoStore: dload
  };
})();

