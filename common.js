// Shared chrome: language handling, header/footer, helpers
(function(){
  var I = window.QI_I18N;
  var LANGS = ["en","fr","ar"];
  function getLang(){
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) >= 0) { try{ localStorage.setItem("qi_lang", q); }catch(e){} return q; }
    try { var s = localStorage.getItem("qi_lang"); if (s && LANGS.indexOf(s) >= 0) return s; } catch(e){}
    return "en";
  }
  window.qiLang = getLang();
  window.T = function(obj){ if (obj == null) return ""; if (typeof obj === "string") return obj; return obj[window.qiLang] || obj.en || ""; };
  window.setLang = function(l){
    try{ localStorage.setItem("qi_lang", l); }catch(e){}
    var u = new URL(location.href); u.searchParams.set("lang", l); location.href = u.toString();
  };
  function applyDir(){
    document.documentElement.lang = window.qiLang;
    document.documentElement.dir = (window.qiLang === "ar") ? "rtl" : "ltr";
  }
  applyDir();

  window.qiHeader = function(active){
    var nav = [
      ["home.html","home"],["survey.html","survey"],["insights.html","insights"],["about.html","about"],["admin.html","admin"]
    ].map(function(n){
      var cur = (active === n[1]) ? ' aria-current="page"' : "";
      return '<a href="' + n[0] + '?lang=' + window.qiLang + '"' + cur + '>' + T(I.nav[n[1]]) + '</a>';
    }).join("");
    var langs = LANGS.map(function(l){
      return '<button type="button" aria-pressed="' + (l === window.qiLang) + '" onclick="setLang(\'' + l + '\')">' + I.langNames[l] + '</button>';
    }).join("");
    var sess = (window.QIA && QIA.session && QIA.session()) || null;
    if (sess) nav += '<a href="#" onclick="QIA.logout();location.href=\'index.html?lang=' + window.qiLang + '\';return false" style="border:1px solid rgba(255,255,255,.35);border-radius:6px">' + T(I.auth.logout) + '</a>';
    var who = sess ?
      '<div class="who"><span class="wid" title="' + T(I.auth.loggedInAs) + '">' + sess.id + '</span>' +
      '<button type="button" onclick="QIA.logout();location.href=\'index.html?lang=' + window.qiLang + '\'">' + T(I.auth.logout) + '</button></div>' :
      '<div class="who"><a href="index.html?lang=' + window.qiLang + '" style="color:#DCE8F0;font-size:12.5px;text-decoration:none;border:1px solid rgba(255,255,255,.35);border-radius:6px;padding:4px 9px">' + T(I.auth.login) + '</a></div>';
    return '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="site"><div class="wrap"><div class="topbar">' +
      '<a class="brand" href="home.html?lang=' + window.qiLang + '"><span class="mark">QI</span>' +
      '<span class="name">' + T(I.siteTitle) + ' <span class="badge-proto">' + T(I.prototype) + '</span></span></a>' +
      '<nav class="main" aria-label="Main">' + nav + '</nav>' + who +
      '<div class="langs" role="group" aria-label="Language">' + langs + '</div>' +
      '</div></div><div class="partnerline">' + T(I.partners) + '</div></header>';
  };

  window.qiFooter = function(){
    return '<footer class="site"><div class="wrap"><div class="cols">' +
      '<div><b>' + T(I.siteTitle) + '</b><br>' + T(I.partners) + '</div>' +
      '<div>' + T(I.footer.privacy) + '</div>' +
      '<div>' + T(I.footer.logos) + '</div>' +
      '</div><p style="margin-top:16px">Survey Package v2.0 · Prototype build · 19 August 2026</p></div></footer>';
  };

  window.qiMount = function(active){
    document.body.insertAdjacentHTML("afterbegin", qiHeader(active));
    document.body.insertAdjacentHTML("beforeend", qiFooter());
    document.title = T(I.siteTitle) + " · " + T(I.nav[active] || I.nav.home);
  };

  window.esc = function(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); };
})();

