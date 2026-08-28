// QIF Survey Master v3.1 - regional instrument overlay: Caribbean and Pacific adaptations.
// Source: QI Financing Survey Adaptive Instruments, Caribbean and Pacific editions (28.08.2026, UNIDO).
// The African baseline bank is untouched. This overlay converts only the adapted fields into
// getters that resolve the respondent's region at render time (invitation session country,
// else the saved draft country). No engine.js changes. Loads after bank_part3.js.
(function(){
"use strict";
if (!window.QI_BANK_P1 || !window.QI_BANK_P2 || !window.QI_BANK_P3 || !window.QI_I18N) return;

function regionNow(){
  var iso = null;
  try { var s = window.QIA && QIA.session && QIA.session(); if (s && s.iso3) iso = s.iso3; } catch(e){}
  if (!iso) { try { var d = JSON.parse(localStorage.getItem("qi_draft_v1") || "null"); if (d && d.country) iso = d.country; } catch(e){} }
  if (iso && window.QI_COUNTRIES) {
    var c = QI_COUNTRIES.find(function(x){ return x.iso3 === iso; });
    if (c && c.region) return c.region;
  }
  return "africa";
}
function reg(obj, key, car, pac){
  if (!obj) return;
  var base = obj[key];
  Object.defineProperty(obj, key, { configurable:true, enumerable:true, get:function(){
    var r = regionNow();
    if (r === "caribbean" && car) return car;
    if (r === "pacific" && pac) return pac;
    return base;
  }});
}
// Index every question object by id across the three bank parts.
var Q = {};
[window.QI_BANK_P1, window.QI_BANK_P2, window.QI_BANK_P3].forEach(function(root){
  (function w(n){
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) { n.forEach(w); return; }
    if (n.id && n.type) Q[n.id] = n;
    for (var k in n) if (Object.prototype.hasOwnProperty.call(n, k) && n[k] && typeof n[k] === "object") w(n[k]);
  })(root);
});
function opt(qo, v){ return qo && (qo.opts || []).find(function(o){ return o.v === v; }); }
function part(qo, key){ return qo && (qo.parts || []).find(function(p){ return p.key === key; }); }
var FU = { key:"other_txt", kind:"text", t:{ en:"Please specify", fr:"Veuillez préciser", ar:"يُرجى التحديد" } };

// ---- T1.5: calibration sourced from outside the region ----
reg(opt(Q["T1.5"], "abroad"), "t",
  { en:"From a provider outside the Caribbean", fr:"Auprès d'un prestataire hors des Caraïbes", ar:"من مزوّد من خارج منطقة الكاريبي" },
  { en:"From a provider outside the Pacific", fr:"Auprès d'un prestataire hors du Pacifique", ar:"من مزوّد من خارج منطقة المحيط الهادئ" });

// ---- A18: regional bodies actor label ----
reg(opt(part(Q["A18"], "actor1"), "reg"), "t",
  { en:"Regional bodies (CARICOM, CROSQ)", fr:"Organisations régionales (CARICOM, CROSQ)", ar:"الهيئات الإقليمية (كاريكوم وكروسك)" },
  { en:"Regional bodies (PIFS, SPC, MSG, PACER Plus Implementation Unit)",
    fr:"Organisations régionales (FIP, CPS, GFLM, unité de mise en œuvre du PACER Plus)",
    ar:"الهيئات الإقليمية (منتدى جزر المحيط الهادئ، وجماعة المحيط الهادئ، ومجموعة الطليعة الميلانيزية، ووحدة تنفيذ اتفاق باسر بلس)" });

// ---- A19: Pacific value chains (Caribbean keeps the baseline list per its instrument) ----
(function(){
  var q = Q["A19"]; if (!q) return;
  var b = {}; (q.opts || []).forEach(function(o){ b[o.v] = o; });
  var pac = [
    { v:"fish", t:{ en:"Fisheries, tuna processing and aquaculture", fr:"Pêche, transformation du thon et aquaculture", ar:"مصايد الأسماك وتجهيز التونة وتربية الأحياء المائية" } },
    { v:"agri", t:{ en:"Agri-food, root crops and fresh produce (taro, ginger, cassava, fruit and vegetables)", fr:"Agroalimentaire, tubercules et produits frais (taro, gingembre, manioc, fruits et légumes)", ar:"الأغذية الزراعية والمحاصيل الجذرية والمنتجات الطازجة (التارو والزنجبيل والكسافا والفواكه والخضروات)" } },
    { v:"kava", t:{ en:"Kava", fr:"Kava", ar:"الكافا" } },
    { v:"coco", t:{ en:"Coconut, copra and virgin coconut oil products", fr:"Produits du cocotier, coprah et huile de coco vierge", ar:"منتجات جوز الهند والكوبرا وزيت جوز الهند البكر" } },
    { v:"cocoa", t:{ en:"Cocoa, coffee, vanilla and spices", fr:"Cacao, café, vanille et épices", ar:"الكاكاو والقهوة والفانيليا والتوابل" } },
    { v:"timber", t:{ en:"Timber and wood products", fr:"Bois et produits dérivés", ar:"الأخشاب ومنتجات الخشب" } },
    { v:"tour", t:{ en:"Tourism and hospitality services", fr:"Tourisme et hôtellerie", ar:"خدمات السياحة والضيافة" } },
    { v:"health", t:{ en:"Health products, pharmaceuticals and medical supplies", fr:"Produits de santé, produits pharmaceutiques et fournitures médicales", ar:"المنتجات الصحية والمستحضرات الصيدلانية والمستلزمات الطبية" } },
    b.cons, b.energy, b.digital,
    { v:"mining", t:{ en:"Mining, petroleum, gas and other extractives", fr:"Mines, pétrole, gaz et autres industries extractives", ar:"التعدين والنفط والغاز والصناعات الاستخراجية الأخرى" } },
    { v:"handi", t:{ en:"Handicrafts, cosmetics and natural products", fr:"Artisanat, cosmétiques et produits naturels", ar:"الحرف اليدوية ومستحضرات التجميل والمنتجات الطبيعية" } }
  ].filter(Boolean);
  reg(q, "opts", null, pac);
})();

// ---- T2.5: Pacific recognition targets (obstacles unchanged) ----
(function(){
  var p = part(Q["T2.5"], "targets"); if (!p) return;
  var b = {}; (p.opts || []).forEach(function(o){ b[o.v] = o; });
  var pac = [
    { v:"jas", t:{ en:"Accreditation of a domestic laboratory or certification body through JAS-ANZ, NATA, IANZ or another APAC signatory",
        fr:"Accréditation d'un laboratoire ou d'un organisme de certification national par JAS-ANZ, NATA, IANZ ou un autre signataire de l'APAC",
        ar:"اعتماد مختبر أو جهة إصدار شهادات محلية عبر JAS-ANZ أو NATA أو IANZ أو جهة أخرى موقعة على ترتيب APAC" } },
    b.cmc, b.scope,
    { v:"apmp", t:{ en:"APMP or APLMF technical participation", fr:"Participation technique à l'APMP ou à l'APLMF", ar:"مشاركة فنية في APMP أو APLMF" } },
    { v:"isoup", t:{ en:"ISO or IEC membership upgrade", fr:"Rehaussement du statut de membre ISO ou IEC", ar:"ترقية العضوية في ISO أو IEC" } },
    { v:"peer", t:{ en:"Regional peer evaluation through PQI mechanisms", fr:"Évaluation régionale par les pairs via les mécanismes PQI", ar:"تقييم الأقران الإقليمي عبر آليات مبادرة البنية التحتية للجودة في المحيط الهادئ" } }
  ].filter(Boolean);
  reg(p, "opts", null, pac);
})();

// ---- T3.7: regional roles ----
(function(){
  var q = Q["T3.7"]; if (!q) return;
  var none = opt(q, "none");
  var coe = { v:"coe", t:{ en:"Regional centre of excellence or reference laboratory", fr:"Centre d'excellence régional ou laboratoire de référence", ar:"مركز تميّز إقليمي أو مختبر مرجعي" } };
  var host = { v:"host", t:{ en:"Host of a regional secretariat, technical committee, scheme, or shared facility", fr:"Accueil d'un secrétariat régional, d'un comité technique, d'un dispositif ou d'une installation partagée", ar:"استضافة أمانة إقليمية أو لجنة فنية أو مخطط أو مرفق مشترك" } };
  var other = { v:"other", fu:FU, t:{ en:"Other regional function (please specify)", fr:"Autre fonction régionale (veuillez préciser)", ar:"وظيفة إقليمية أخرى (يُرجى التحديد)" } };
  var car = [ coe, host,
    { v:"lead", t:{ en:"Leadership role in CROSQ, SIM, IAAC, or international QI organizations", fr:"Fonctions dirigeantes au sein du CROSQ, du SIM, de l'IAAC ou d'organisations internationales de l'IQ", ar:"دور قيادي في كروسك أو SIM أو IAAC أو المنظمات الدولية للبنية التحتية للجودة" } },
    { v:"twin", t:{ en:"Provider of twinning, mentoring, or technical support to other Caribbean countries", fr:"Jumelage, mentorat ou appui technique à d'autres pays des Caraïbes", ar:"تقديم التوأمة أو الإرشاد أو الدعم الفني لبلدان كاريبية أخرى" } },
    other, none ].filter(Boolean);
  var pac = [ coe, host,
    { v:"lead", t:{ en:"Leadership or technical committee role in PISC, PASC, APMP, APLMF, APAC, ISO, IEC or OIML", fr:"Fonctions dirigeantes ou participation aux comités techniques du PISC, de la PASC, de l'APMP, de l'APLMF, de l'APAC, de l'ISO, de l'IEC ou de l'OIML", ar:"دور قيادي أو عضوية لجان فنية في PISC أو PASC أو APMP أو APLMF أو APAC أو ISO أو IEC أو OIML" } },
    { v:"pqi", t:{ en:"Participation in PQI Initiative working groups convened by PIFS", fr:"Participation aux groupes de travail de l'initiative PQI convoqués par le Forum des îles du Pacifique", ar:"المشاركة في مجموعات عمل مبادرة البنية التحتية للجودة التي يعقدها منتدى جزر المحيط الهادئ" } },
    { v:"twin", t:{ en:"Provider of twinning, mentoring or technical support to other Pacific Island countries", fr:"Jumelage, mentorat ou appui technique à d'autres pays insulaires du Pacifique", ar:"تقديم التوأمة أو الإرشاد أو الدعم الفني لبلدان جزر المحيط الهادئ الأخرى" } },
    other, none ].filter(Boolean);
  reg(q, "opts", car, pac);
})();

// ---- F-QIP-4: international recognitions held ----
(function(){
  var q = Q["F-QIP-4"]; if (!q) return;
  var none = opt(q, "none");
  var o17025 = { v:"17025", t:{ en:"Accreditation to ISO/IEC 17025 (testing and/or calibration laboratory)", fr:"Accréditation ISO/IEC 17025 (laboratoire d'essais et/ou d'étalonnage)", ar:"اعتماد ISO/IEC 17025 (مختبر فحص و/أو معايرة)" } };
  var othacc = { v:"othacc", t:{ en:"Accreditation to ISO/IEC 17020, ISO/IEC 17021-1, ISO/IEC 17065, ISO 15189, or other relevant conformity assessment standard", fr:"Accréditation ISO/IEC 17020, ISO/IEC 17021-1, ISO/IEC 17065, ISO 15189 ou autre norme pertinente d'évaluation de la conformité", ar:"اعتماد وفق ISO/IEC 17020 أو ISO/IEC 17021-1 أو ISO/IEC 17065 أو ISO 15189 أو معيار آخر ذي صلة بتقييم المطابقة" } };
  var cmc = { v:"cmc", t:{ en:"Calibration and Measurement Capabilities (CMCs) published in the BIPM KCDB", fr:"Capacités de mesure et d'étalonnage (CMC) publiées dans la KCDB du BIPM", ar:"قدرات معايرة وقياس (CMC) منشورة في قاعدة KCDB التابعة للمكتب الدولي للأوزان والمقاييس" } };
  var peer = { v:"peer", t:{ en:"Successfully completed a regional or international peer evaluation", fr:"Évaluation par les pairs régionale ou internationale menée à bien", ar:"استكمال تقييم أقران إقليمي أو دولي بنجاح" } };
  var cipm = { v:"cipm", t:{ en:"Designated participant in the CIPM MRA", fr:"Participant désigné au MRA du CIPM", ar:"مشارك معيَّن في ترتيب الاعتراف المتبادل للجنة الدولية للأوزان والمقاييس" } };
  var car = [ o17025, othacc, cmc,
    { v:"arr", t:{ en:"Recognition under a regional or international arrangement (e.g. IAAC MLA, ILAC MRA, Global Accreditation Cooperation (GLOBAC) arrangements, where applicable)",
        fr:"Reconnaissance au titre d'un accord régional ou international (p. ex. MLA de l'IAAC, MRA de l'ILAC, accords de la Global Accreditation Cooperation (GLOBAC), le cas échéant)",
        ar:"اعتراف بموجب ترتيب إقليمي أو دولي (مثل اتفاق IAAC متعدد الأطراف، وترتيب ILAC للاعتراف المتبادل، وترتيبات التعاون العالمي للاعتماد GLOBAC حيثما ينطبق)" } },
    peer, cipm, none ].filter(Boolean);
  var pac = [ o17025, othacc, cmc,
    { v:"arr", t:{ en:"Recognition under a regional or international arrangement (APAC MRA, ILAC MRA, IAF MLA, or arrangements accessed through JAS-ANZ, NATA or IANZ)",
        fr:"Reconnaissance au titre d'un accord régional ou international (MRA de l'APAC, MRA de l'ILAC, MLA de l'IAF, ou accords via JAS-ANZ, NATA ou IANZ)",
        ar:"اعتراف بموجب ترتيب إقليمي أو دولي (ترتيب APAC للاعتراف المتبادل، وترتيب ILAC، واتفاق IAF متعدد الأطراف، أو ترتيبات يُنفَذ إليها عبر JAS-ANZ أو NATA أو IANZ)" } },
    peer, cipm,
    { v:"trace", t:{ en:"Documented traceability to MSL New Zealand, NMIA Australia or another national metrology institute",
        fr:"Traçabilité documentée vers le MSL (Nouvelle-Zélande), le NMIA (Australie) ou un autre institut national de métrologie",
        ar:"تتبعية موثَّقة إلى معهد MSL في نيوزيلندا أو NMIA في أستراليا أو معهد وطني آخر للمترولوجيا" } },
    none ].filter(Boolean);
  reg(q, "opts", car, pac);
})();

// ---- F-DEV family label and F-DEV-7 wording (both regions) ----
(function(){
  var lbl = { en:"Development partners, regional organizations, academia and subnational",
    fr:"Partenaires au développement, organisations régionales, académie et collectivités",
    ar:"الشركاء الإنمائيون والمنظمات الإقليمية والأوساط الأكاديمية والحكومات المحلية" };
  reg(QI_I18N.families, "F-DEV", lbl, lbl);
  var t7 = { en:"For regional organization respondents: which regional QI instruments does your organization operate or host? Others: select what your organization participates in.",
    fr:"Pour les organisations régionales : quels instruments régionaux d'IQ votre organisation gère-t-elle ou héberge-t-elle ? Autres répondants : indiquez ceux auxquels votre organisation participe.",
    ar:"لممثلي المنظمات الإقليمية: ما الأدوات الإقليمية للجودة التي تديرها أو تستضيفها منظمتكم؟ وللآخرين: اختاروا ما تشارك فيه منظمتكم." };
  reg(Q["F-DEV-7"], "t", t7, t7);
})();

// ---- Consent and thank-you attribution ----
(function(){
  var S = QI_I18N.survey; if (!S) return;
  reg(S, "consent",
    { en:"I understand that participation is voluntary, that my answers will be treated in strict confidence, used only in aggregated and anonymized form by UNIDO, in partnership with CROSQ, under the ACP QI Programme, and that I can stop at any time. No individual answer is ever published with a name or institution attached.",
      fr:"Je comprends que la participation est volontaire, que mes réponses seront traitées de façon strictement confidentielle, utilisées uniquement sous forme agrégée et anonymisée par l'ONUDI, en partenariat avec le CROSQ, dans le cadre du programme ACP IQ, et que je peux arrêter à tout moment. Aucune réponse individuelle n'est publiée avec un nom ou une institution.",
      ar:"أفهم أن المشاركة طوعية، وأن إجاباتي ستُعامل بسرية تامة وتُستخدم فقط بشكل مجمّع ومجهول الهوية من قبل اليونيدو، بالشراكة مع كروسك، في إطار برنامج البنية التحتية للجودة لدول أفريقيا والكاريبي والمحيط الهادئ، وأن بإمكاني التوقف في أي وقت. ولا تُنشر أي إجابة فردية مقرونة باسم أو مؤسسة." },
    { en:"I understand that participation is voluntary, that my answers will be treated in strict confidence, used only in aggregated and anonymized form by UNIDO under the ACP QI Programme, and that I can stop at any time. No individual answer is ever published with a name or institution attached.",
      fr:"Je comprends que la participation est volontaire, que mes réponses seront traitées de façon strictement confidentielle, utilisées uniquement sous forme agrégée et anonymisée par l'ONUDI dans le cadre du programme ACP IQ, et que je peux arrêter à tout moment. Aucune réponse individuelle n'est publiée avec un nom ou une institution.",
      ar:"أفهم أن المشاركة طوعية، وأن إجاباتي ستُعامل بسرية تامة وتُستخدم فقط بشكل مجمّع ومجهول الهوية من قبل اليونيدو في إطار برنامج البنية التحتية للجودة لدول أفريقيا والكاريبي والمحيط الهادئ، وأن بإمكاني التوقف في أي وقت. ولا تُنشر أي إجابة فردية مقرونة باسم أو مؤسسة." });
  reg(S, "thanks",
    { en:"Your contribution becomes part of the regional evidence base on financing quality infrastructure in the Caribbean, prepared by UNIDO under the ACP QI Programme in partnership with CROSQ.",
      fr:"Votre contribution rejoint la base factuelle régionale sur le financement de l'infrastructure de la qualité dans les Caraïbes, préparée par l'ONUDI dans le cadre du programme ACP IQ, en partenariat avec le CROSQ.",
      ar:"تصبح مساهمتكم جزءاً من قاعدة الأدلة الإقليمية حول تمويل البنية التحتية للجودة في منطقة الكاريبي، التي تُعدّها اليونيدو في إطار برنامج البنية التحتية للجودة لدول أفريقيا والكاريبي والمحيط الهادئ بالشراكة مع كروسك." },
    { en:"Your contribution becomes part of the regional evidence base on financing quality infrastructure in the Pacific, prepared by UNIDO under the ACP QI Programme.",
      fr:"Votre contribution rejoint la base factuelle régionale sur le financement de l'infrastructure de la qualité dans le Pacifique, préparée par l'ONUDI dans le cadre du programme ACP IQ.",
      ar:"تصبح مساهمتكم جزءاً من قاعدة الأدلة الإقليمية حول تمويل البنية التحتية للجودة في منطقة المحيط الهادئ، التي تُعدّها اليونيدو في إطار برنامج البنية التحتية للجودة لدول أفريقيا والكاريبي والمحيط الهادئ." });
})();
})();
