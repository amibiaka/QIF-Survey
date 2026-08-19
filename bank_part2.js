// QI Financing Survey v2.0 question bank, part 2: Tier modules (T1, T2, T3) + Closing (Z1, Z2)
window.QI_BANK_P2 = {

T1: [
{ id:"T1.1", tag:"FACT", type:"matrix",
  t:{ en:"For each core QI function, how is the service actually obtained today? One answer per row.",
      fr:"Pour chaque fonction essentielle de l'IQ, comment le service est-il effectivement obtenu aujourd'hui ? Une réponse par ligne.",
      ar:"لكل وظيفة أساسية من وظائف البنية التحتية للجودة، كيف يتم الحصول على الخدمة فعلياً اليوم؟ إجابة واحدة لكل سطر." },
  rows:[
   { v:"std", t:{ en:"Standards development and information", fr:"Élaboration et information sur les normes", ar:"إعداد المواصفات وتوفير المعلومات عنها" } },
   { v:"cal", t:{ en:"Calibration with metrological traceability", fr:"Étalonnage avec traçabilité métrologique", ar:"المعايرة مع التتبعية المترولوجية" } },
   { v:"acc", t:{ en:"Accreditation", fr:"Accréditation", ar:"الاعتماد" } },
   { v:"tst", t:{ en:"Testing for export requirements", fr:"Essais pour les exigences à l'exportation", ar:"الاختبارات الخاصة بمتطلبات التصدير" } },
   { v:"crt", t:{ en:"Certification", fr:"Certification", ar:"إصدار الشهادات" } },
   { v:"lm", t:{ en:"Legal metrology verification", fr:"Vérification de métrologie légale", ar:"التحقق في إطار المترولوجيا القانونية" } }
  ],
  cols:[
   { v:"dom", t:{ en:"Delivered by a domestic institution", fr:"Assuré par une institution nationale", ar:"تقدمه مؤسسة وطنية" } },
   { v:"ext", t:{ en:"Delivered by a regional or foreign provider", fr:"Assuré par un prestataire régional ou étranger", ar:"يقدمه مزوّد إقليمي أو أجنبي" } },
   { v:"none", t:{ en:"Not available at all", fr:"Pas disponible du tout", ar:"غير متاح إطلاقاً" } }
  ] },

{ id:"T1.2", tag:"FACT", type:"single",
  t:{ en:"Does your institution appear as an identifiable line (or named sub-line) in the national budget law?",
      fr:"Votre institution figure-t-elle comme ligne identifiable (ou sous-ligne nommée) dans la loi de finances ?",
      ar:"هل تَرِد مؤسستكم كبند محدد (أو بند فرعي مسمّى) في قانون الموازنة العامة؟" },
  opts:[
   { v:"own", t:{ en:"Yes, own budget line", fr:"Oui, ligne budgétaire propre", ar:"نعم، بند موازنة خاص بها" } },
   { v:"sub", t:{ en:"Yes, a named sub-line under a ministry vote", fr:"Oui, une sous-ligne nommée dans le budget d'un ministère", ar:"نعم، بند فرعي مسمّى ضمن موازنة وزارة" } },
   { v:"inside", t:{ en:"No, funded inside a broader ministry allocation", fr:"Non, financée dans une allocation ministérielle globale", ar:"لا، تُموَّل ضمن مخصص وزاري أوسع" } },
   { v:"none", t:{ en:"No public funding received", fr:"Aucun financement public reçu", ar:"لا تتلقى تمويلاً عاماً" } }
  ] },

{ id:"T1.3", tag:"FACT", type:"multi",
  t:{ en:"In the last 12 months, were any of the following interrupted or delayed for lack of funds? Select all that apply.",
      fr:"Au cours des 12 derniers mois, l'un des éléments suivants a-t-il été interrompu ou retardé faute de fonds ? Sélectionnez tout ce qui s'applique.",
      ar:"خلال الاثني عشر شهراً الماضية، هل توقف أو تأخر أيٌّ مما يلي بسبب نقص الأموال؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"sal", t:{ en:"Salaries or allowances", fr:"Salaires ou indemnités", ar:"الرواتب أو البدلات" } },
   { v:"util", t:{ en:"Utilities (electricity, water, internet)", fr:"Services de base (électricité, eau, internet)", ar:"المرافق (كهرباء، مياه، إنترنت)" } },
   { v:"maint", t:{ en:"Equipment maintenance or calibration", fr:"Maintenance ou étalonnage des équipements", ar:"صيانة المعدات أو معايرتها" } },
   { v:"cons", t:{ en:"Consumables and reagents", fr:"Consommables et réactifs", ar:"المستهلكات والكواشف" } },
   { v:"memb", t:{ en:"International membership subscriptions", fr:"Cotisations aux organisations internationales", ar:"اشتراكات العضوية الدولية" } },
   { v:"field", t:{ en:"Field inspections or enforcement", fr:"Inspections de terrain ou contrôles", ar:"التفتيش الميداني أو إجراءات الإنفاذ" } },
   { v:"none", excl:true, t:{ en:"None of these", fr:"Aucun de ces éléments", ar:"لا شيء مما سبق" } }
  ] },

{ id:"T1.4", tag:"ESTIMATE", type:"single",
  t:{ en:"Approximately what share of your institution's total financing last fiscal year came from donors and technical assistance (cash and in-kind)?",
      fr:"Quelle part approximative du financement total de votre institution provenait, au dernier exercice, des bailleurs et de l'assistance technique (en espèces et en nature) ?",
      ar:"ما النسبة التقريبية من إجمالي تمويل مؤسستكم في آخر سنة مالية التي جاءت من الجهات المانحة والمساعدة الفنية (نقداً وعيناً)؟" },
  opts:[
   { v:"none", t:{ en:"None", fr:"Aucune", ar:"لا شيء" } },
   { v:"u25", t:{ en:"Under 25 percent", fr:"Moins de 25 %", ar:"أقل من 25%" } },
   { v:"25_49", t:{ en:"25-49 percent", fr:"25 à 49 %", ar:"من 25% إلى 49%" } },
   { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
   { v:"o75", t:{ en:"75 percent or more", fr:"75 % ou plus", ar:"75% أو أكثر" } }
  ] },

{ id:"T1.5", tag:"FACT", type:"single",
  t:{ en:"When a firm in your country needs an instrument calibrated so that results are internationally accepted, how does it typically obtain traceable calibration?",
      fr:"Lorsqu'une entreprise de votre pays doit faire étalonner un instrument pour que les résultats soient acceptés à l'international, comment obtient-elle généralement un étalonnage traçable ?",
      ar:"عندما تحتاج شركة في بلدكم إلى معايرة جهاز بحيث تُقبل النتائج دولياً، كيف تحصل عادةً على معايرة قابلة للتتبع؟" },
  opts:[
   { v:"dom", t:{ en:"From a domestic laboratory with recognized traceability", fr:"Auprès d'un laboratoire national à traçabilité reconnue", ar:"من مختبر وطني ذي تتبعية معترف بها" } },
   { v:"regio", t:{ en:"From a regional provider in a neighbouring country", fr:"Auprès d'un prestataire régional d'un pays voisin", ar:"من مزوّد إقليمي في بلد مجاور" } },
   { v:"abroad", t:{ en:"From a provider outside Africa", fr:"Auprès d'un prestataire hors d'Afrique", ar:"من مزوّد خارج أفريقيا" } },
   { v:"na", t:{ en:"Traceable calibration is effectively not available", fr:"L'étalonnage traçable n'est en pratique pas disponible", ar:"المعايرة القابلة للتتبع غير متاحة عملياً" } }
  ] },

{ id:"T1.6", tag:"FACT", type:"single",
  t:{ en:"How many conformity assessment bodies located in your country currently hold accreditation from any accreditation body?",
      fr:"Combien d'organismes d'évaluation de la conformité situés dans votre pays détiennent actuellement une accréditation, quel qu'en soit l'organisme émetteur ?",
      ar:"كم عدد جهات تقييم المطابقة الموجودة في بلدكم والحاصلة حالياً على اعتماد من أي هيئة اعتماد؟" },
  opts:[
   { v:"none", t:{ en:"None", fr:"Aucun", ar:"لا يوجد" } },
   { v:"1_5", t:{ en:"1 to 5", fr:"1 à 5", ar:"من 1 إلى 5" } },
   { v:"6_20", t:{ en:"6 to 20", fr:"6 à 20", ar:"من 6 إلى 20" } },
   { v:"o20", t:{ en:"More than 20", fr:"Plus de 20", ar:"أكثر من 20" } }
  ] },

{ id:"T1.7", tag:"PERCEPTION", type:"combo",
  t:{ en:"Which single QI function should be established or restored first, and what would the minimum viable investment package cost?",
      fr:"Quelle fonction de l'IQ faudrait-il établir ou rétablir en premier, et combien coûterait le paquet d'investissement minimal viable ?",
      ar:"ما الوظيفة الوحيدة من وظائف البنية التحتية للجودة التي ينبغي إنشاؤها أو استعادتها أولاً، وكم ستبلغ كلفة حزمة الاستثمار الأدنى القابلة للتنفيذ؟" },
  parts:[
   { key:"func", type:"single", t:{ en:"Priority function", fr:"Fonction prioritaire", ar:"الوظيفة ذات الأولوية" },
     opts:[
      { v:"std", t:{ en:"Standards development and information", fr:"Élaboration et information sur les normes", ar:"إعداد المواصفات والمعلومات عنها" } },
      { v:"cal", t:{ en:"Calibration with metrological traceability", fr:"Étalonnage avec traçabilité métrologique", ar:"المعايرة مع التتبعية المترولوجية" } },
      { v:"acc", t:{ en:"Accreditation", fr:"Accréditation", ar:"الاعتماد" } },
      { v:"tst", t:{ en:"Testing for export requirements", fr:"Essais pour l'exportation", ar:"اختبارات التصدير" } },
      { v:"crt", t:{ en:"Certification", fr:"Certification", ar:"إصدار الشهادات" } },
      { v:"lm", t:{ en:"Legal metrology verification", fr:"Vérification de métrologie légale", ar:"التحقق المترولوجي القانوني" } }
     ] },
   { key:"cost", type:"single", t:{ en:"Cost band (USD equivalent)", fr:"Fourchette de coût (équivalent USD)", ar:"نطاق التكلفة (بما يعادله بالدولار)" },
     opts:[
      { v:"c1", usd:[0,500000], t:{ en:"Under 500,000", fr:"Moins de 500 000", ar:"أقل من 500,000" } },
      { v:"c2", usd:[500000,2000000], t:{ en:"500,000 to 2 million", fr:"500 000 à 2 millions", ar:"من 500,000 إلى مليونين" } },
      { v:"c3", usd:[2000000,5000000], t:{ en:"2 to 5 million", fr:"2 à 5 millions", ar:"من 2 إلى 5 ملايين" } },
      { v:"c4", usd:[5000000,null], t:{ en:"Above 5 million", fr:"Plus de 5 millions", ar:"أكثر من 5 ملايين" } }
     ] }
  ] },

{ id:"T1.8", tag:"PERCEPTION", type:"multi", max:2,
  t:{ en:"Which support would help your institution most in the next two years? Select up to 2.",
      fr:"Quel appui aiderait le plus votre institution au cours des deux prochaines années ? Sélectionnez-en 2 au maximum.",
      ar:"أي دعم سيساعد مؤسستكم أكثر خلال السنتين المقبلتين؟ اختاروا اثنين على الأكثر." },
  opts:[
   { v:"twin", t:{ en:"Twinning with an established institution", fr:"Jumelage avec une institution établie", ar:"التوأمة مع مؤسسة راسخة" } },
   { v:"law", t:{ en:"Drafting QI laws and regulations", fr:"Rédaction de lois et règlements sur l'IQ", ar:"صياغة قوانين ولوائح البنية التحتية للجودة" } },
   { v:"train", t:{ en:"Staff training and secondments", fr:"Formation et détachements de personnel", ar:"تدريب الموظفين والإعارات" } },
   { v:"equip", t:{ en:"Basic equipment and reference standards", fr:"Équipements de base et étalons de référence", ar:"المعدات الأساسية والمعايير المرجعية" } },
   { v:"memb", t:{ en:"Support to join regional QI bodies and schemes", fr:"Appui à l'adhésion aux organismes et dispositifs régionaux de l'IQ", ar:"دعم الانضمام إلى الهيئات والمخططات الإقليمية للجودة" } },
   { v:"prep", t:{ en:"Preparation of a first investment project document", fr:"Préparation d'un premier document de projet d'investissement", ar:"إعداد أول وثيقة مشروع استثماري" } }
  ] }
],

T2: [
{ id:"T2.1", tag:"FACT", type:"single",
  t:{ en:"Government transfers as a share of your institution's total financing, most recent closed fiscal year.",
      fr:"Part des transferts de l'État dans le financement total de votre institution, dernier exercice clos.",
      ar:"حصة التحويلات الحكومية من إجمالي تمويل مؤسستكم في آخر سنة مالية مُقفلة." },
  opts:[
   { v:"u10", t:{ en:"Under 10 percent", fr:"Moins de 10 %", ar:"أقل من 10%" } },
   { v:"10_29", t:{ en:"10-29 percent", fr:"10 à 29 %", ar:"من 10% إلى 29%" } },
   { v:"30_49", t:{ en:"30-49 percent", fr:"30 à 49 %", ar:"من 30% إلى 49%" } },
   { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
   { v:"o75", t:{ en:"75 percent or more", fr:"75 % ou plus", ar:"75% أو أكثر" } }
  ] },

{ id:"T2.2", tag:"FACT", type:"single",
  t:{ en:"Cost-recovery ratio: own-source revenue as a share of total operating expenditure, most recent closed fiscal year.",
      fr:"Taux de recouvrement des coûts : recettes propres rapportées aux dépenses totales de fonctionnement, dernier exercice clos.",
      ar:"نسبة استرداد التكاليف: الإيرادات الذاتية كنسبة من إجمالي نفقات التشغيل في آخر سنة مالية مُقفلة." },
  opts:[
   { v:"u10", t:{ en:"Under 10 percent", fr:"Moins de 10 %", ar:"أقل من 10%" } },
   { v:"10_29", t:{ en:"10-29 percent", fr:"10 à 29 %", ar:"من 10% إلى 29%" } },
   { v:"30_49", t:{ en:"30-49 percent", fr:"30 à 49 %", ar:"من 30% إلى 49%" } },
   { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
   { v:"o75", t:{ en:"75 percent or more", fr:"75 % ou plus", ar:"75% أو أكثر" } }
  ] },

{ id:"T2.3", tag:"FACT", type:"single",
  t:{ en:"How predictable are government transfers? Releases actually received last fiscal year as a share of the approved amount.",
      fr:"Quelle est la prévisibilité des transferts de l'État ? Décaissements effectivement reçus au dernier exercice, en pourcentage du montant approuvé.",
      ar:"ما مدى انتظام التحويلات الحكومية؟ المبالغ المصروفة فعلياً في آخر سنة مالية كنسبة من المبلغ المعتمد." },
  opts:[
   { v:"u50", t:{ en:"Under 50 percent", fr:"Moins de 50 %", ar:"أقل من 50%" } },
   { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
   { v:"75_89", t:{ en:"75-89 percent", fr:"75 à 89 %", ar:"من 75% إلى 89%" } },
   { v:"90_100", t:{ en:"90-100 percent", fr:"90 à 100 %", ar:"من 90% إلى 100%" } }
  ] },

{ id:"T2.4", tag:"FACT", type:"single",
  t:{ en:"Is your institution covered by a multi-year financing framework (a medium-term expenditure framework allocation, a multi-year performance contract, or a statutory multi-year funding rule)?",
      fr:"Votre institution est-elle couverte par un cadre de financement pluriannuel (allocation d'un cadre de dépenses à moyen terme, contrat de performance pluriannuel ou règle légale de financement pluriannuel) ?",
      ar:"هل تستفيد مؤسستكم من إطار تمويل متعدد السنوات (مخصص ضمن إطار إنفاق متوسط الأجل، أو عقد أداء متعدد السنوات، أو قاعدة تمويل قانونية متعددة السنوات)؟" },
  opts:[
   { v:"y3", t:{ en:"Yes, covering 3 or more years", fr:"Oui, couvrant 3 ans ou plus", ar:"نعم، يغطي ثلاث سنوات أو أكثر" } },
   { v:"y2", t:{ en:"Yes, covering 2 years", fr:"Oui, couvrant 2 ans", ar:"نعم، يغطي سنتين" } },
   { v:"annual", t:{ en:"No, annual budgeting only", fr:"Non, budgétisation annuelle uniquement", ar:"لا، موازنة سنوية فقط" } }
  ] },

{ id:"T2.5", tag:"FACT", type:"combo",
  t:{ en:"Which international recognitions is your institution (or the institution you oversee) actively pursuing for the next three years, and what is the main obstacle?",
      fr:"Quelles reconnaissances internationales votre institution (ou l'institution que vous supervisez) poursuit-elle activement pour les trois prochaines années, et quel est le principal obstacle ?",
      ar:"ما جوانب الاعتراف الدولي التي تسعى إليها مؤسستكم (أو المؤسسة التي تشرفون عليها) بنشاط خلال السنوات الثلاث المقبلة، وما العقبة الرئيسية؟" },
  parts:[
   { key:"targets", type:"multi", t:{ en:"Targets (select all that apply)", fr:"Objectifs (sélectionnez tout ce qui s'applique)", ar:"الأهداف (اختاروا كل ما ينطبق)" },
     opts:[
      { v:"ilac", t:{ en:"ILAC MRA signatory status", fr:"Statut de signataire du MRA de l'ILAC", ar:"صفة الموقِّع على ترتيب الاعتراف المتبادل للإيلاك (ILAC MRA)" } },
      { v:"iaf", t:{ en:"IAF MLA status", fr:"Statut MLA de l'IAF", ar:"صفة العضوية في اتفاق الاعتراف متعدد الأطراف للإياف (IAF MLA)" } },
      { v:"cmc", t:{ en:"First CMCs published in the BIPM KCDB", fr:"Premières CMC publiées dans la KCDB du BIPM", ar:"نشر أولى قدرات المعايرة والقياس في قاعدة KCDB التابعة للمكتب الدولي للأوزان والمقاييس" } },
      { v:"scope", t:{ en:"Additional accreditation scopes", fr:"Extensions de portées d'accréditation", ar:"نطاقات اعتماد إضافية" } },
      { v:"peer", t:{ en:"Regional peer evaluation", fr:"Évaluation régionale par les pairs", ar:"تقييم الأقران الإقليمي" } }
     ] },
   { key:"obstacle", type:"single", t:{ en:"Main obstacle (select one)", fr:"Principal obstacle (une seule réponse)", ar:"العقبة الرئيسية (اختيار واحد)" },
     opts:[
      { v:"cost", t:{ en:"Assessment and membership costs", fr:"Coûts d'évaluation et de cotisation", ar:"تكاليف التقييم والعضوية" } },
      { v:"comp", t:{ en:"Technical competence gaps", fr:"Déficits de compétences techniques", ar:"فجوات الكفاءة الفنية" } },
      { v:"equip", t:{ en:"Equipment and facilities", fr:"Équipements et installations", ar:"المعدات والمنشآت" } },
      { v:"legal", t:{ en:"Legal framework", fr:"Cadre juridique", ar:"الإطار القانوني" } },
      { v:"ontrack", t:{ en:"None, on track", fr:"Aucun, en bonne voie", ar:"لا عقبة، المسار سليم" } }
     ] }
  ] },

{ id:"T2.6", tag:"FACT", type:"single",
  t:{ en:"Does the national QI coordination mechanism review QI institutions' budgets or investment plans before they are submitted for financing?",
      fr:"Le mécanisme national de coordination de l'IQ examine-t-il les budgets ou plans d'investissement des institutions avant leur soumission pour financement ?",
      ar:"هل تراجع آلية التنسيق الوطنية للبنية التحتية للجودة موازنات المؤسسات أو خططها الاستثمارية قبل تقديمها للتمويل؟" },
  opts:[
   { v:"bind", t:{ en:"Yes, a binding review", fr:"Oui, un examen contraignant", ar:"نعم، مراجعة ملزمة" } },
   { v:"adv", t:{ en:"Yes, an advisory review", fr:"Oui, un examen consultatif", ar:"نعم، مراجعة استشارية" } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },

{ id:"T2.7", tag:"FACT", type:"combo",
  t:{ en:"How many QI investment projects in your area of responsibility are ready or nearly ready for financing, and what preparation documents exist?",
      fr:"Combien de projets d'investissement d'IQ relevant de votre responsabilité sont prêts ou presque prêts pour le financement, et quels documents de préparation existent ?",
      ar:"كم عدد مشاريع الاستثمار في البنية التحتية للجودة ضمن نطاق مسؤوليتكم الجاهزة أو شبه الجاهزة للتمويل، وما وثائق الإعداد المتوفرة؟" },
  parts:[
   { key:"count", type:"single", t:{ en:"Number of projects", fr:"Nombre de projets", ar:"عدد المشاريع" },
     opts:[
      { v:"none", t:{ en:"None", fr:"Aucun", ar:"لا يوجد" } },
      { v:"1_2", t:{ en:"1-2", fr:"1 à 2", ar:"من 1 إلى 2" } },
      { v:"3_5", t:{ en:"3-5", fr:"3 à 5", ar:"من 3 إلى 5" } },
      { v:"o5", t:{ en:"More than 5", fr:"Plus de 5", ar:"أكثر من 5" } }
     ] },
   { key:"docs", type:"multi", t:{ en:"Existing documents (select all that apply)", fr:"Documents existants (sélectionnez tout ce qui s'applique)", ar:"الوثائق المتوفرة (اختاروا كل ما ينطبق)" },
     opts:[
      { v:"concept", t:{ en:"Concept note", fr:"Note conceptuelle", ar:"مذكرة مفاهيمية" } },
      { v:"feas", t:{ en:"Pre-feasibility or feasibility study", fr:"Étude de préfaisabilité ou de faisabilité", ar:"دراسة جدوى أولية أو كاملة" } },
      { v:"specs", t:{ en:"Costed technical specifications", fr:"Spécifications techniques chiffrées", ar:"مواصفات فنية مُكلفَنة" } },
      { v:"esia", t:{ en:"Environmental and social screening", fr:"Examen environnemental et social", ar:"فرز بيئي واجتماعي" } },
      { v:"model", t:{ en:"Financial model", fr:"Modèle financier", ar:"نموذج مالي" } },
      { v:"none", excl:true, t:{ en:"None", fr:"Aucun", ar:"لا شيء" } }
     ] }
  ] },

{ id:"T2.8", tag:"PERCEPTION", type:"rank", k:2,
  t:{ en:"What most holds back the consolidation of your national QI system? Rank your top 2.",
      fr:"Qu'est-ce qui freine le plus la consolidation de votre système national d'IQ ? Classez vos 2 premiers facteurs.",
      ar:"ما أكثر ما يعرقل توطيد المنظومة الوطنية للبنية التحتية للجودة لديكم؟ رتّبوا أهم عاملين." },
  opts:[
   { v:"overlap", t:{ en:"Overlapping or unclear mandates", fr:"Mandats redondants ou flous", ar:"تداخل الصلاحيات أو غموضها" } },
   { v:"frag", t:{ en:"Fragmented budgets across ministries", fr:"Budgets fragmentés entre ministères", ar:"تشتت الموازنات بين الوزارات" } },
   { v:"coord", t:{ en:"Weak coordination mechanism", fr:"Mécanisme de coordination faible", ar:"ضعف آلية التنسيق" } },
   { v:"staff", t:{ en:"Shortage of technical staff", fr:"Pénurie de personnel technique", ar:"نقص الكوادر الفنية" } },
   { v:"fees", t:{ en:"Fee levels set below cost", fr:"Tarifs fixés en dessous des coûts", ar:"رسوم محددة دون مستوى التكلفة" } },
   { v:"retain", t:{ en:"Revenue not retained by institutions", fr:"Recettes non conservées par les institutions", ar:"عدم احتفاظ المؤسسات بإيراداتها" } },
   { v:"pol", t:{ en:"Political attention elsewhere", fr:"Attention politique portée ailleurs", ar:"انصراف الاهتمام السياسي إلى أولويات أخرى" } }
  ] }
],

T3: [
{ id:"T3.1", tag:"FACT", type:"single",
  t:{ en:"Operating result of your institution, most recent closed fiscal year: operating revenue minus operating expenditure, as a share of revenue.",
      fr:"Résultat d'exploitation de votre institution au dernier exercice clos : recettes moins dépenses de fonctionnement, en pourcentage des recettes.",
      ar:"النتيجة التشغيلية لمؤسستكم في آخر سنة مالية مُقفلة: الإيرادات التشغيلية ناقص النفقات التشغيلية، كنسبة من الإيرادات." },
  opts:[
   { v:"d10", t:{ en:"Deficit greater than 10 percent of revenue", fr:"Déficit supérieur à 10 % des recettes", ar:"عجز يتجاوز 10% من الإيرادات" } },
   { v:"d0", t:{ en:"Deficit up to 10 percent", fr:"Déficit jusqu'à 10 %", ar:"عجز حتى 10%" } },
   { v:"be", t:{ en:"Broadly break-even", fr:"Globalement à l'équilibre", ar:"توازن تقريبي" } },
   { v:"s10", t:{ en:"Surplus up to 10 percent", fr:"Excédent jusqu'à 10 %", ar:"فائض حتى 10%" } },
   { v:"s10p", t:{ en:"Surplus greater than 10 percent", fr:"Excédent supérieur à 10 %", ar:"فائض يتجاوز 10%" } }
  ] },

{ id:"T3.2", tag:"FACT", type:"combo",
  t:{ en:"Own-source revenue as a share of total financing: current year and five years ago.",
      fr:"Part des recettes propres dans le financement total : cette année et il y a cinq ans.",
      ar:"حصة الإيرادات الذاتية من إجمالي التمويل: في السنة الحالية وقبل خمس سنوات." },
  parts:[
   { key:"now", type:"single", t:{ en:"Most recent closed fiscal year", fr:"Dernier exercice clos", ar:"آخر سنة مالية مُقفلة" },
     opts:[
      { v:"u10", t:{ en:"Under 10 percent", fr:"Moins de 10 %", ar:"أقل من 10%" } },
      { v:"10_29", t:{ en:"10-29 percent", fr:"10 à 29 %", ar:"من 10% إلى 29%" } },
      { v:"30_49", t:{ en:"30-49 percent", fr:"30 à 49 %", ar:"من 30% إلى 49%" } },
      { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
      { v:"o75", t:{ en:"75 percent or more", fr:"75 % ou plus", ar:"75% أو أكثر" } }
     ] },
   { key:"before", type:"single", t:{ en:"Five fiscal years ago", fr:"Il y a cinq exercices", ar:"قبل خمس سنوات مالية" }, optsFrom:"now" }
  ] },

{ id:"T3.3", tag:"FACT", type:"matrix",
  t:{ en:"Rate your institution's practical autonomy in each area. One answer per row.",
      fr:"Évaluez l'autonomie effective de votre institution dans chaque domaine. Une réponse par ligne.",
      ar:"قيّموا الاستقلالية الفعلية لمؤسستكم في كل مجال. إجابة واحدة لكل سطر." },
  rows:[
   { v:"fees", t:{ en:"Setting fees for services", fr:"Fixation des tarifs des services", ar:"تحديد رسوم الخدمات" } },
   { v:"retain", t:{ en:"Retaining and reinvesting revenue", fr:"Conservation et réinvestissement des recettes", ar:"الاحتفاظ بالإيرادات وإعادة استثمارها" } },
   { v:"virement", t:{ en:"Reallocating funds between budget lines", fr:"Réaffectation des fonds entre lignes budgétaires", ar:"إعادة توزيع الأموال بين بنود الموازنة" } },
   { v:"staff", t:{ en:"Hiring and remunerating staff", fr:"Recrutement et rémunération du personnel", ar:"تعيين الموظفين وتحديد أجورهم" } }
  ],
  cols:[
   { v:"full", t:{ en:"Full autonomy", fr:"Autonomie totale", ar:"استقلالية كاملة" } },
   { v:"limits", t:{ en:"Autonomy within approved limits", fr:"Autonomie dans des limites approuvées", ar:"استقلالية ضمن حدود معتمدة" } },
   { v:"case", t:{ en:"Requires case-by-case approval", fr:"Approbation au cas par cas requise", ar:"تتطلب موافقة لكل حالة على حدة" } },
   { v:"none", t:{ en:"No autonomy", fr:"Aucune autonomie", ar:"لا استقلالية" } }
  ] },

{ id:"T3.4", tag:"FACT", type:"single",
  t:{ en:"Does your institution have legal authority to borrow, and has it borrowed in the last five fiscal years?",
      fr:"Votre institution a-t-elle le pouvoir légal d'emprunter, et a-t-elle emprunté au cours des cinq derniers exercices ?",
      ar:"هل تملك مؤسستكم صلاحية قانونية للاقتراض، وهل اقترضت خلال السنوات المالية الخمس الأخيرة؟" },
  opts:[
   { v:"yb", t:{ en:"Yes, and it has borrowed", fr:"Oui, et elle a emprunté", ar:"نعم، وقد اقترضت" } },
   { v:"ynb", t:{ en:"Yes, but it has not borrowed", fr:"Oui, mais elle n'a pas emprunté", ar:"نعم، لكنها لم تقترض" } },
   { v:"no", t:{ en:"No legal authority to borrow", fr:"Pas de pouvoir légal d'emprunter", ar:"لا تملك صلاحية قانونية للاقتراض" } }
  ] },

{ id:"T3.5", tag:"FACT", type:"matrix",
  t:{ en:"Experience with advanced financing instruments. One answer per row.",
      fr:"Expérience des instruments de financement avancés. Une réponse par ligne.",
      ar:"الخبرة في أدوات التمويل المتقدمة. إجابة واحدة لكل سطر." },
  rows:[
   { v:"ppp", t:{ en:"Public-private partnership or concession", fr:"Partenariat public-privé ou concession", ar:"شراكة بين القطاعين أو امتياز" } },
   { v:"blend", t:{ en:"Blended finance structure", fr:"Montage de financement mixte", ar:"هيكل تمويل مختلط" } },
   { v:"green", t:{ en:"Green or climate finance", fr:"Financement vert ou climatique", ar:"تمويل أخضر أو مناخي" } },
   { v:"rbf", t:{ en:"Results-based financing", fr:"Financement basé sur les résultats", ar:"تمويل قائم على النتائج" } },
   { v:"chal", t:{ en:"Competitive challenge or innovation funds", fr:"Fonds compétitifs ou d'innovation", ar:"صناديق تنافسية أو صناديق ابتكار" } }
  ],
  cols:[
   { v:"used", t:{ en:"Used or accessed", fr:"Utilisé ou obtenu", ar:"استُخدم أو تم الحصول عليه" } },
   { v:"prep", t:{ en:"Application prepared or under discussion", fr:"Dossier préparé ou en discussion", ar:"طلب قيد الإعداد أو النقاش" } },
   { v:"none", t:{ en:"No experience", fr:"Aucune expérience", ar:"لا توجد خبرة" } }
  ] },

{ id:"T3.6", tag:"FACT", type:"combo",
  t:{ en:"Cross-border services: in how many other countries did your institution serve clients last fiscal year, and what share of own-source revenue came from abroad?",
      fr:"Services transfrontaliers : dans combien d'autres pays votre institution a-t-elle servi des clients au dernier exercice, et quelle part des recettes propres provenait de l'étranger ?",
      ar:"الخدمات العابرة للحدود: في كم بلداً آخر خدمت مؤسستكم عملاء في آخر سنة مالية، وما نسبة الإيرادات الذاتية الآتية من الخارج؟" },
  parts:[
   { key:"countries", type:"single", t:{ en:"Countries served", fr:"Pays servis", ar:"عدد البلدان المخدومة" },
     opts:[
      { v:"none", t:{ en:"None", fr:"Aucun", ar:"لا يوجد" } },
      { v:"1_2", t:{ en:"1-2", fr:"1 à 2", ar:"من 1 إلى 2" } },
      { v:"3_5", t:{ en:"3-5", fr:"3 à 5", ar:"من 3 إلى 5" } },
      { v:"o5", t:{ en:"More than 5", fr:"Plus de 5", ar:"أكثر من 5" } }
     ] },
   { key:"share", type:"single", t:{ en:"Revenue share from abroad", fr:"Part des recettes venant de l'étranger", ar:"نسبة الإيرادات من الخارج" },
     opts:[
      { v:"none", t:{ en:"None", fr:"Aucune", ar:"لا شيء" } },
      { v:"u5", t:{ en:"Under 5 percent", fr:"Moins de 5 %", ar:"أقل من 5%" } },
      { v:"5_14", t:{ en:"5-14 percent", fr:"5 à 14 %", ar:"من 5% إلى 14%" } },
      { v:"o15", t:{ en:"15 percent or more", fr:"15 % ou plus", ar:"15% أو أكثر" } }
     ] }
  ] },

{ id:"T3.7", tag:"FACT", type:"multi",
  t:{ en:"Which regional roles does your institution currently hold? Select all that apply.",
      fr:"Quels rôles régionaux votre institution assume-t-elle actuellement ? Sélectionnez tout ce qui s'applique.",
      ar:"ما الأدوار الإقليمية التي تضطلع بها مؤسستكم حالياً؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"coe", t:{ en:"Designated regional centre of excellence or reference laboratory", fr:"Centre d'excellence régional désigné ou laboratoire de référence", ar:"مركز تميّز إقليمي معيَّن أو مختبر مرجعي" } },
   { v:"host", t:{ en:"Hosting a regional body, scheme secretariat or shared facility", fr:"Accueil d'un organisme régional, d'un secrétariat de dispositif ou d'une installation partagée", ar:"استضافة هيئة إقليمية أو أمانة مخطط أو مرفق مشترك" } },
   { v:"lead", t:{ en:"Leadership positions in AFRIMETS, AFRAC, ARSO, AFSEC or international QI bodies", fr:"Fonctions dirigeantes au sein d'AFRIMETS, AFRAC, ARSO, AFSEC ou d'organismes internationaux de l'IQ", ar:"مناصب قيادية في أفريميتس أو أفراك أو أرسو أو أفسيك أو هيئات الجودة الدولية" } },
   { v:"twin", t:{ en:"Twinning or mentoring support to other countries", fr:"Jumelage ou mentorat au profit d'autres pays", ar:"توأمة أو إرشاد لبلدان أخرى" } },
   { v:"none", excl:true, t:{ en:"None of these", fr:"Aucun de ces rôles", ar:"لا شيء مما سبق" } }
  ] },

{ id:"T3.8", tag:"FACT", type:"combo",
  t:{ en:"Digital maturity: what share of certificates and reports was issued in secure digital form last fiscal year, and what is the status of your laboratory or workflow management system?",
      fr:"Maturité numérique : quelle part des certificats et rapports a été émise sous forme numérique sécurisée au dernier exercice, et quel est l'état de votre système de gestion de laboratoire ou de flux de travail ?",
      ar:"النضج الرقمي: ما نسبة الشهادات والتقارير الصادرة بصيغة رقمية آمنة في آخر سنة مالية، وما حالة نظام إدارة المختبر أو سير العمل لديكم؟" },
  parts:[
   { key:"share", type:"single", t:{ en:"Digital share", fr:"Part numérique", ar:"النسبة الرقمية" },
     opts:[
      { v:"none", t:{ en:"None", fr:"Aucune", ar:"لا شيء" } },
      { v:"u25", t:{ en:"Under 25 percent", fr:"Moins de 25 %", ar:"أقل من 25%" } },
      { v:"25_74", t:{ en:"25-74 percent", fr:"25 à 74 %", ar:"من 25% إلى 74%" } },
      { v:"o75", t:{ en:"75 percent or more", fr:"75 % ou plus", ar:"75% أو أكثر" } }
     ] },
   { key:"lims", type:"single", t:{ en:"System status", fr:"État du système", ar:"حالة النظام" },
     opts:[
      { v:"none", t:{ en:"None", fr:"Aucun système", ar:"لا يوجد نظام" } },
      { v:"partial", t:{ en:"Basic or partial", fr:"Basique ou partiel", ar:"أساسي أو جزئي" } },
      { v:"full", t:{ en:"Fully deployed and integrated", fr:"Pleinement déployé et intégré", ar:"مُشغَّل بالكامل ومتكامل" } }
     ] }
  ] }
],

closing: [
{ id:"Z1", type:"single", noMiss:true,
  t:{ en:"Would you be willing to participate in a regional stakeholder validation workshop?",
      fr:"Seriez-vous disposé(e) à participer à un atelier régional de validation des parties prenantes ?",
      ar:"هل أنتم مستعدون للمشاركة في ورشة إقليمية لأصحاب المصلحة للمصادقة على النتائج؟" },
  opts:[
   { v:"yes", t:{ en:"Yes", fr:"Oui", ar:"نعم" } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } },
   { v:"maybe", t:{ en:"Maybe, more information needed", fr:"Peut-être, plus d'informations nécessaires", ar:"ربما، نحتاج مزيداً من المعلومات" } }
  ] },

{ id:"Z2", type:"text", multiline:true, optional:true, noMiss:true,
  t:{ en:"Please share any additional information, recommendations or financing needs not covered above. After submitting, you can also attach supporting documents (budget laws, audited statements, strategies); documents strengthen your country profile but are never required.",
      fr:"Partagez toute information, recommandation ou besoin de financement supplémentaire non couvert ci-dessus. Après l'envoi, vous pourrez joindre des documents justificatifs (lois de finances, états financiers audités, stratégies) ; ils renforcent le profil de votre pays mais ne sont jamais obligatoires.",
      ar:"يُرجى مشاركة أي معلومات أو توصيات أو احتياجات تمويلية إضافية لم تُذكر أعلاه. بعد الإرسال يمكنكم إرفاق وثائق داعمة (قوانين الموازنة، القوائم المالية المدققة، الاستراتيجيات)؛ فهي تعزز ملف بلدكم لكنها غير إلزامية أبداً." } }
]
};

