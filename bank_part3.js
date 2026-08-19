// QI Financing Survey v2.0 question bank, part 3: the seven respondent-family modules
window.QI_BANK_P3 = {

"F-FIN": [
{ id:"F-FIN-1", tag:"FACT", type:"single",
  t:{ en:"QI appropriations as a share of the total national budget, most recent closed fiscal year.",
      fr:"Part des crédits alloués à l'IQ dans le budget national total, dernier exercice clos.",
      ar:"حصة اعتمادات البنية التحتية للجودة من إجمالي الموازنة الوطنية في آخر سنة مالية مُقفلة." },
  opts:[
   { v:"u001", t:{ en:"Under 0.01 percent", fr:"Moins de 0,01 %", ar:"أقل من 0.01%" } },
   { v:"001_005", t:{ en:"0.01-0.05 percent", fr:"0,01 à 0,05 %", ar:"من 0.01% إلى 0.05%" } },
   { v:"006_01", t:{ en:"0.06-0.1 percent", fr:"0,06 à 0,1 %", ar:"من 0.06% إلى 0.1%" } },
   { v:"011_05", t:{ en:"0.11-0.5 percent", fr:"0,11 à 0,5 %", ar:"من 0.11% إلى 0.5%" } },
   { v:"o05", t:{ en:"Over 0.5 percent", fr:"Plus de 0,5 %", ar:"أكثر من 0.5%" } }
  ] },
{ id:"F-FIN-2", tag:"FACT", type:"single",
  t:{ en:"What share of approved QI budget allocations was actually released last fiscal year?",
      fr:"Quelle part des crédits approuvés pour l'IQ a été effectivement décaissée au dernier exercice ?",
      ar:"ما نسبة مخصصات موازنة البنية التحتية للجودة المعتمدة التي صُرفت فعلياً في آخر سنة مالية؟" },
  opts:[
   { v:"u50", t:{ en:"Under 50 percent", fr:"Moins de 50 %", ar:"أقل من 50%" } },
   { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
   { v:"75_89", t:{ en:"75-89 percent", fr:"75 à 89 %", ar:"من 75% إلى 89%" } },
   { v:"90_100", t:{ en:"90-100 percent", fr:"90 à 100 %", ar:"من 90% إلى 100%" } }
  ] },
{ id:"F-FIN-3", tag:"FACT", type:"single",
  t:{ en:"Are QI budget lines separately identifiable in the annual budget law?",
      fr:"Les lignes budgétaires de l'IQ sont-elles identifiables séparément dans la loi de finances annuelle ?",
      ar:"هل بنود موازنة البنية التحتية للجودة قابلة للتحديد بشكل منفصل في قانون الموازنة السنوية؟" },
  opts:[
   { v:"all", t:{ en:"Yes, for all QI institutions", fr:"Oui, pour toutes les institutions de l'IQ", ar:"نعم، لجميع مؤسسات البنية التحتية للجودة" } },
   { v:"some", t:{ en:"Yes, for some", fr:"Oui, pour certaines", ar:"نعم، لبعضها" } },
   { v:"no", t:{ en:"No, embedded in ministry votes", fr:"Non, intégrées dans les budgets ministériels", ar:"لا، مدمجة ضمن موازنات الوزارات" } }
  ] },
{ id:"F-FIN-4", tag:"FACT", type:"single",
  t:{ en:"Do statutory taxes, earmarked levies or parafiscal charges fund any QI institution? If yes, name the levy and its legal basis.",
      fr:"Des taxes légales, prélèvements affectés ou charges parafiscales financent-ils une institution de l'IQ ? Si oui, indiquez le prélèvement et sa base juridique.",
      ar:"هل تموّل ضرائب قانونية أو رسوم مخصصة أو اقتطاعات شبه ضريبية أيّ مؤسسة للبنية التحتية للجودة؟ إذا كان الجواب نعم، فاذكروا الرسم وأساسه القانوني." },
  opts:[
   { v:"yes", t:{ en:"Yes", fr:"Oui", ar:"نعم" },
     fu:{ key:"levy", kind:"text", t:{ en:"Levy name and legal basis", fr:"Nom du prélèvement et base juridique", ar:"اسم الرسم وأساسه القانوني" } } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },
{ id:"F-FIN-5", tag:"FACT", type:"multi",
  t:{ en:"Which QI institutions are legally entitled to retain and reinvest their own revenues? Select all that apply.",
      fr:"Quelles institutions de l'IQ sont légalement autorisées à conserver et réinvestir leurs recettes propres ? Sélectionnez tout ce qui s'applique.",
      ar:"ما مؤسسات البنية التحتية للجودة المخوَّلة قانوناً بالاحتفاظ بإيراداتها الذاتية وإعادة استثمارها؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"nsb", t:{ en:"National standards body", fr:"Organisme national de normalisation", ar:"الهيئة الوطنية للمواصفات" } },
   { v:"nmi", t:{ en:"National metrology institute", fr:"Institut national de métrologie", ar:"المعهد الوطني للمترولوجيا" } },
   { v:"nab", t:{ en:"National accreditation body", fr:"Organisme national d'accréditation", ar:"هيئة الاعتماد الوطنية" } },
   { v:"cabs", t:{ en:"Public conformity assessment bodies", fr:"Organismes publics d'évaluation de la conformité", ar:"جهات تقييم المطابقة العامة" } },
   { v:"msv", t:{ en:"Market surveillance authority", fr:"Autorité de surveillance du marché", ar:"هيئة مراقبة السوق" } },
   { v:"none", excl:true, t:{ en:"None", fr:"Aucune", ar:"لا أحد" } }
  ] },
{ id:"F-FIN-6", tag:"FACT", type:"single",
  t:{ en:"Are QI institutions' accounts audited by the supreme audit institution or external auditors, with reports tabled in parliament?",
      fr:"Les comptes des institutions de l'IQ sont-ils audités par l'institution supérieure de contrôle ou des auditeurs externes, avec dépôt des rapports au parlement ?",
      ar:"هل تُدقَّق حسابات مؤسسات البنية التحتية للجودة من قِبل الجهاز الأعلى للرقابة المالية أو مدققين خارجيين، مع عرض التقارير على البرلمان؟" },
  opts:[
   { v:"reg", t:{ en:"Yes, regularly audited and tabled", fr:"Oui, audités régulièrement et déposés", ar:"نعم، تُدقَّق وتُعرض بانتظام" } },
   { v:"aud", t:{ en:"Audited, not systematically tabled", fr:"Audités, mais pas systématiquement déposés", ar:"تُدقَّق دون عرض منتظم على البرلمان" } },
   { v:"no", t:{ en:"Not regularly audited", fr:"Pas d'audit régulier", ar:"لا تُدقَّق بانتظام" } }
  ] },
{ id:"F-FIN-7", tag:"PERCEPTION", type:"scale",
  t:{ en:"How much fiscal space exists to increase public financing of QI over the next 3-5 years?",
      fr:"Quelle marge budgétaire existe-t-il pour accroître le financement public de l'IQ dans les 3 à 5 prochaines années ?",
      ar:"ما حجم الحيّز المالي المتاح لزيادة التمويل العام للبنية التحتية للجودة خلال السنوات الثلاث إلى الخمس المقبلة؟" },
  pts:[
   { v:1, t:{ en:"1 None, the fiscal position is deteriorating", fr:"1 Aucune, la situation budgétaire se dégrade", ar:"1 لا حيّز، والوضع المالي يتدهور" } },
   { v:2, t:{ en:"2 Very limited", fr:"2 Très limitée", ar:"2 محدود جداً" } },
   { v:3, t:{ en:"3 Limited but real if well justified", fr:"3 Limitée mais réelle si bien justifiée", ar:"3 محدود لكنه حقيقي إذا بُرِّر جيداً" } },
   { v:4, t:{ en:"4 Moderate", fr:"4 Modérée", ar:"4 متوسط" } },
   { v:5, t:{ en:"5 Substantial", fr:"5 Substantielle", ar:"5 كبير" } }
  ] },
{ id:"F-FIN-8", tag:"PERCEPTION", type:"rank", k:2,
  t:{ en:"Which conditions would make increased budget allocations to QI feasible? Rank your top 2.",
      fr:"Quelles conditions rendraient possible une augmentation des allocations budgétaires à l'IQ ? Classez vos 2 premières.",
      ar:"ما الشروط التي تجعل زيادة مخصصات الموازنة للبنية التحتية للجودة ممكنة؟ رتّبوا أهم شرطين." },
  opts:[
   { v:"impact", t:{ en:"Demonstrated export or revenue impact", fr:"Impact démontré sur les exportations ou les recettes", ar:"أثر مُثبت على الصادرات أو الإيرادات" } },
   { v:"plans", t:{ en:"Credible costed investment plans", fr:"Plans d'investissement chiffrés et crédibles", ar:"خطط استثمارية موثوقة ومُكلفَنة" } },
   { v:"consol", t:{ en:"Consolidation of overlapping institutions", fr:"Consolidation des institutions redondantes", ar:"دمج المؤسسات المتداخلة" } },
   { v:"audit", t:{ en:"Stronger audit and reporting", fr:"Audit et reporting renforcés", ar:"تعزيز التدقيق والإبلاغ" } },
   { v:"cofin", t:{ en:"Co-financing from partners or private sector", fr:"Cofinancement des partenaires ou du secteur privé", ar:"تمويل مشترك من الشركاء أو القطاع الخاص" } },
   { v:"earmark", t:{ en:"Statutory earmarking", fr:"Affectation légale de ressources", ar:"تخصيص قانوني للموارد" } }
  ] }
],

"F-GOV": [
{ id:"F-GOV-1", tag:"PERCEPTION", type:"scale",
  t:{ en:"How high is QI on the current national political agenda?",
      fr:"Quelle place l'IQ occupe-t-elle actuellement dans l'agenda politique national ?",
      ar:"ما مكانة البنية التحتية للجودة في جدول الأعمال السياسي الوطني حالياً؟" },
  pts:[
   { v:1, t:{ en:"1 Not on the agenda", fr:"1 Absente de l'agenda", ar:"1 ليست على جدول الأعمال" } },
   { v:2, t:{ en:"2 Mentioned but no priority", fr:"2 Mentionnée mais sans priorité", ar:"2 تُذكر دون أولوية" } },
   { v:3, t:{ en:"3 Recognized priority without resources", fr:"3 Priorité reconnue sans ressources", ar:"3 أولوية معلنة دون موارد" } },
   { v:4, t:{ en:"4 Priority with some resources", fr:"4 Priorité avec quelques ressources", ar:"4 أولوية مع بعض الموارد" } },
   { v:5, t:{ en:"5 Top-tier priority with visible commitments", fr:"5 Priorité majeure avec des engagements visibles", ar:"5 أولوية عليا مع التزامات ملموسة" } }
  ] },
{ id:"F-GOV-2", tag:"FACT", type:"single",
  t:{ en:"If a National Quality Policy or QI strategy exists, does it have a costed and budgeted implementation plan?",
      fr:"Si une Politique nationale de la qualité ou une stratégie d'IQ existe, dispose-t-elle d'un plan de mise en œuvre chiffré et budgétisé ?",
      ar:"إذا كانت هناك سياسة وطنية للجودة أو استراتيجية للبنية التحتية للجودة، فهل لها خطة تنفيذ مُكلفَنة ومدرجة في الموازنة؟" },
  opts:[
   { v:"cb", t:{ en:"Yes, costed and budgeted", fr:"Oui, chiffré et budgétisé", ar:"نعم، مُكلفَنة ومدرجة في الموازنة" } },
   { v:"c", t:{ en:"Costed but not budgeted", fr:"Chiffré mais non budgétisé", ar:"مُكلفَنة لكن غير مدرجة في الموازنة" } },
   { v:"none", t:{ en:"Neither costed nor budgeted", fr:"Ni chiffré ni budgétisé", ar:"لا مُكلفَنة ولا مدرجة" } },
   { v:"nopol", t:{ en:"No policy exists", fr:"Aucune politique n'existe", ar:"لا توجد سياسة" } }
  ] },
{ id:"F-GOV-3", tag:"FACT", type:"combo",
  t:{ en:"Are QI investment projects included in the current national development plan or public investment programme? If yes, how many?",
      fr:"Des projets d'investissement d'IQ figurent-ils dans le plan national de développement ou le programme d'investissements publics en cours ? Si oui, combien ?",
      ar:"هل تتضمن خطة التنمية الوطنية الحالية أو برنامج الاستثمار العام مشاريع استثمارية للبنية التحتية للجودة؟ وإذا كان الجواب نعم، فكم عددها؟" },
  parts:[
   { key:"inc", type:"single", t:{ en:"Included?", fr:"Inclus ?", ar:"مُدرجة؟" },
     opts:[
      { v:"yes", t:{ en:"Yes", fr:"Oui", ar:"نعم" } },
      { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
     ] },
   { key:"count", type:"single", showIf:{ inc:"yes" }, t:{ en:"Number of projects", fr:"Nombre de projets", ar:"عدد المشاريع" },
     opts:[
      { v:"1_2", t:{ en:"1-2", fr:"1 à 2", ar:"من 1 إلى 2" } },
      { v:"3_5", t:{ en:"3-5", fr:"3 à 5", ar:"من 3 إلى 5" } },
      { v:"o5", t:{ en:"More than 5", fr:"Plus de 5", ar:"أكثر من 5" } }
     ] }
  ] },
{ id:"F-GOV-4", tag:"FACT", type:"single",
  t:{ en:"Did parliament review QI-related budget allocations during the budget cycle in any of the last three fiscal years?",
      fr:"Le parlement a-t-il examiné les allocations budgétaires liées à l'IQ au cours du cycle budgétaire durant l'un des trois derniers exercices ?",
      ar:"هل راجع البرلمان مخصصات الموازنة المتعلقة بالبنية التحتية للجودة خلال دورة الموازنة في أي من السنوات المالية الثلاث الأخيرة؟" },
  opts:[
   { v:"annual", t:{ en:"Yes, annually", fr:"Oui, chaque année", ar:"نعم، سنوياً" } },
   { v:"occ", t:{ en:"Yes, occasionally", fr:"Oui, occasionnellement", ar:"نعم، أحياناً" } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },
{ id:"F-GOV-5", tag:"FACT", type:"single",
  t:{ en:"Is there an identifiable political or institutional champion for QI investment?",
      fr:"Existe-t-il un porteur politique ou institutionnel identifiable pour l'investissement dans l'IQ ?",
      ar:"هل يوجد نصير سياسي أو مؤسسي واضح للاستثمار في البنية التحتية للجودة؟" },
  opts:[
   { v:"cab", t:{ en:"Yes, at cabinet level", fr:"Oui, au niveau du gouvernement", ar:"نعم، على مستوى مجلس الوزراء" } },
   { v:"off", t:{ en:"Yes, at senior official level", fr:"Oui, au niveau des hauts fonctionnaires", ar:"نعم، على مستوى كبار المسؤولين" } },
   { v:"parl", t:{ en:"Yes, in parliament", fr:"Oui, au parlement", ar:"نعم، في البرلمان" } },
   { v:"none", t:{ en:"No identifiable champion", fr:"Pas de porteur identifiable", ar:"لا يوجد نصير واضح" } }
  ] },
{ id:"F-GOV-6", tag:"FACT", type:"multi",
  t:{ en:"Which ministries and agencies participate in national QI financing and investment coordination? Select all that apply.",
      fr:"Quels ministères et organismes participent à la coordination nationale du financement et des investissements de l'IQ ? Sélectionnez tout ce qui s'applique.",
      ar:"ما الوزارات والهيئات المشاركة في التنسيق الوطني لتمويل واستثمارات البنية التحتية للجودة؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"moi", t:{ en:"Ministry of industry or trade", fr:"Ministère de l'industrie ou du commerce", ar:"وزارة الصناعة أو التجارة" } },
   { v:"mof", t:{ en:"Ministry of finance", fr:"Ministère des finances", ar:"وزارة المالية" } },
   { v:"mop", t:{ en:"Ministry of planning", fr:"Ministère de la planification", ar:"وزارة التخطيط" } },
   { v:"moa", t:{ en:"Ministry of agriculture or health", fr:"Ministère de l'agriculture ou de la santé", ar:"وزارة الزراعة أو الصحة" } },
   { v:"qi", t:{ en:"QI institutions", fr:"Institutions de l'IQ", ar:"مؤسسات البنية التحتية للجودة" } },
   { v:"ps", t:{ en:"Private sector representatives", fr:"Représentants du secteur privé", ar:"ممثلو القطاع الخاص" } },
   { v:"dp", t:{ en:"Development partners", fr:"Partenaires au développement", ar:"الشركاء الإنمائيون" } },
   { v:"none", excl:true, t:{ en:"No coordination takes place", fr:"Aucune coordination n'a lieu", ar:"لا يوجد تنسيق" } }
  ] },
{ id:"F-GOV-7", tag:"FACT", type:"single",
  t:{ en:"For border, revenue, investment, SEZ and PPP authorities: what is your authority's main role in relation to QI? Others: answer for the authority you oversee.",
      fr:"Pour les autorités frontalières, fiscales, d'investissement, de ZES et de PPP : quel est le rôle principal de votre autorité vis-à-vis de l'IQ ? Autres répondants : répondez pour l'autorité que vous supervisez.",
      ar:"لهيئات الحدود والإيرادات والاستثمار والمناطق الاقتصادية الخاصة والشراكات: ما الدور الرئيسي لهيئتكم تجاه البنية التحتية للجودة؟ للآخرين: أجيبوا عن الهيئة التي تشرفون عليها." },
  opts:[
   { v:"levy", t:{ en:"Collects levies or charges that fund QI", fr:"Perçoit des prélèvements ou redevances finançant l'IQ", ar:"تُحصِّل رسوماً أو اقتطاعات تموّل البنية التحتية للجودة" } },
   { v:"buy", t:{ en:"Purchases or requires QI services", fr:"Achète ou exige des services d'IQ", ar:"تشتري خدمات الجودة أو تشترطها" } },
   { v:"host", t:{ en:"Hosts QI facilities (zones, border posts)", fr:"Héberge des installations d'IQ (zones, postes frontières)", ar:"تستضيف مرافق للجودة (مناطق، معابر حدودية)" } },
   { v:"dev", t:{ en:"Develops QI-related projects (including PPP)", fr:"Développe des projets liés à l'IQ (y compris PPP)", ar:"تطوّر مشاريع متصلة بالجودة (بما فيها الشراكات)" } },
   { v:"none", t:{ en:"No current role", fr:"Aucun rôle actuellement", ar:"لا دور حالياً" } }
  ] },
{ id:"F-GOV-8", tag:"FACT", type:"combo",
  t:{ en:"Are any QI projects (laboratories, inspection facilities, metrology infrastructure) in the national PPP pipeline, and how suitable are QI assets for PPP models in your view?",
      fr:"Des projets d'IQ (laboratoires, installations d'inspection, infrastructures de métrologie) figurent-ils dans le portefeuille national de PPP, et dans quelle mesure les actifs d'IQ se prêtent-ils selon vous aux modèles de PPP ?",
      ar:"هل توجد مشاريع للبنية التحتية للجودة (مختبرات، مرافق تفتيش، بنى مترولوجية) ضمن محفظة الشراكات الوطنية بين القطاعين، وما مدى ملاءمة أصول الجودة لنماذج الشراكة برأيكم؟" },
  parts:[
   { key:"pipe", type:"single", t:{ en:"In the PPP pipeline?", fr:"Dans le portefeuille PPP ?", ar:"ضمن محفظة الشراكات؟" },
     opts:[
      { v:"yes", t:{ en:"Yes", fr:"Oui", ar:"نعم" },
        fu:{ key:"n", kind:"text", t:{ en:"Number of projects", fr:"Nombre de projets", ar:"عدد المشاريع" } } },
      { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
     ] },
   { key:"suit", type:"single", t:{ en:"Suitability of QI assets for PPP (1 = not suitable, 5 = highly suitable)", fr:"Adéquation des actifs d'IQ aux PPP (1 = pas adaptés, 5 = très adaptés)", ar:"ملاءمة أصول الجودة للشراكات (1 = غير ملائمة، 5 = ملائمة جداً)" },
     opts:[
      { v:"1", t:{ en:"1", fr:"1", ar:"1" } }, { v:"2", t:{ en:"2", fr:"2", ar:"2" } }, { v:"3", t:{ en:"3", fr:"3", ar:"3" } }, { v:"4", t:{ en:"4", fr:"4", ar:"4" } }, { v:"5", t:{ en:"5", fr:"5", ar:"5" } }
     ] }
  ] }
],

"F-QIP": [
{ id:"F-QIP-1", tag:"FACT", type:"single",
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
{ id:"F-QIP-2", tag:"FACT", type:"single",
  t:{ en:"Who sets the fees for your services?",
      fr:"Qui fixe les tarifs de vos services ?",
      ar:"من يحدد رسوم خدماتكم؟" },
  opts:[
   { v:"board", t:{ en:"Our governing board, autonomously", fr:"Notre conseil d'administration, de façon autonome", ar:"مجلس إدارتنا باستقلالية" } },
   { v:"board_min", t:{ en:"Our board, subject to ministry approval", fr:"Notre conseil, sous réserve de l'approbation du ministère", ar:"مجلسنا بشرط موافقة الوزارة" } },
   { v:"ministry", t:{ en:"Parent ministry", fr:"Ministère de tutelle", ar:"الوزارة الوصية" } },
   { v:"mof", t:{ en:"Ministry of finance", fr:"Ministère des finances", ar:"وزارة المالية" } },
   { v:"law", t:{ en:"Set in legislation", fr:"Fixés par la loi", ar:"محددة في التشريع" } }
  ] },
{ id:"F-QIP-3", tag:"FACT", type:"single",
  t:{ en:"What share of its own revenue was your institution legally entitled and practically able to retain and reinvest last fiscal year?",
      fr:"Quelle part de ses recettes propres votre institution a-t-elle pu, légalement et en pratique, conserver et réinvestir au dernier exercice ?",
      ar:"ما نسبة الإيرادات الذاتية التي كان يحق لمؤسستكم قانوناً وعملياً الاحتفاظ بها وإعادة استثمارها في آخر سنة مالية؟" },
  opts:[
   { v:"none", t:{ en:"None, all remitted to treasury", fr:"Aucune, tout est reversé au Trésor", ar:"لا شيء، يُحوَّل كل شيء إلى الخزانة" } },
   { v:"part", t:{ en:"Part retained", fr:"Une partie conservée", ar:"احتُفظ بجزء" },
     fu:{ key:"share", kind:"text", t:{ en:"Approximate share retained (%)", fr:"Part approximative conservée (%)", ar:"النسبة التقريبية المحتفظ بها (%)" } } },
   { v:"all", t:{ en:"All retained", fr:"Totalité conservée", ar:"احتُفظ بالكامل" } }
  ] },
{ id:"F-QIP-4", tag:"FACT", type:"multi",
  t:{ en:"Which international recognitions does your institution currently hold? Select all that apply.",
      fr:"Quelles reconnaissances internationales votre institution détient-elle actuellement ? Sélectionnez tout ce qui s'applique.",
      ar:"ما جوانب الاعتراف الدولي التي تحوزها مؤسستكم حالياً؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"ilac", t:{ en:"ILAC MRA signatory status (own or through AFRAC)", fr:"Statut de signataire du MRA de l'ILAC (en propre ou via l'AFRAC)", ar:"صفة الموقِّع على ترتيب ILAC MRA (مباشرة أو عبر أفراك)" } },
   { v:"iaf", t:{ en:"IAF MLA signatory status", fr:"Statut de signataire du MLA de l'IAF", ar:"صفة الموقِّع على اتفاق IAF MLA" } },
   { v:"cmc", t:{ en:"CMCs published in the BIPM KCDB", fr:"CMC publiées dans la KCDB du BIPM", ar:"قدرات معايرة وقياس منشورة في قاعدة KCDB" } },
   { v:"17025", t:{ en:"ISO/IEC 17025 accreditation", fr:"Accréditation ISO/IEC 17025", ar:"اعتماد ISO/IEC 17025" } },
   { v:"othacc", t:{ en:"ISO/IEC 17020, 17021-1, 17065 or 15189 accreditation", fr:"Accréditation ISO/IEC 17020, 17021-1, 17065 ou 15189", ar:"اعتماد ISO/IEC 17020 أو 17021-1 أو 17065 أو 15189" } },
   { v:"peer", t:{ en:"Regional peer evaluation completed", fr:"Évaluation régionale par les pairs achevée", ar:"استكمال تقييم الأقران الإقليمي" } },
   { v:"none", excl:true, t:{ en:"None yet", fr:"Aucune pour l'instant", ar:"لا شيء حتى الآن" } }
  ] },
{ id:"F-QIP-5", tag:"FACT", type:"scale",
  t:{ en:"Rate the maturity of your maintenance, calibration and equipment replacement arrangements.",
      fr:"Évaluez la maturité de vos dispositifs de maintenance, d'étalonnage et de renouvellement des équipements.",
      ar:"قيّموا نضج ترتيبات الصيانة والمعايرة واستبدال المعدات لديكم." },
  pts:[
   { v:0, t:{ en:"0 Absent", fr:"0 Inexistants", ar:"0 غير موجودة" } },
   { v:1, t:{ en:"1 Ad hoc", fr:"1 Ponctuels", ar:"1 ظرفية" } },
   { v:2, t:{ en:"2 Partially established", fr:"2 Partiellement établis", ar:"2 قائمة جزئياً" } },
   { v:3, t:{ en:"3 Established and functioning", fr:"3 Établis et fonctionnels", ar:"3 قائمة وتعمل" } },
   { v:4, t:{ en:"4 Fully established and evidenced", fr:"4 Pleinement établis et documentés", ar:"4 راسخة وموثَّقة بالكامل" } }
  ] },
{ id:"F-QIP-6", tag:"FACT", type:"single",
  t:{ en:"Vacancy rate in technical and scientific posts (approved posts unfilled).",
      fr:"Taux de vacance des postes techniques et scientifiques (postes approuvés non pourvus).",
      ar:"معدل الشواغر في الوظائف الفنية والعلمية (وظائف معتمدة غير مشغولة)." },
  opts:[
   { v:"u5", t:{ en:"Under 5 percent", fr:"Moins de 5 %", ar:"أقل من 5%" } },
   { v:"5_14", t:{ en:"5-14 percent", fr:"5 à 14 %", ar:"من 5% إلى 14%" } },
   { v:"15_29", t:{ en:"15-29 percent", fr:"15 à 29 %", ar:"من 15% إلى 29%" } },
   { v:"o30", t:{ en:"30 percent or more", fr:"30 % ou plus", ar:"30% أو أكثر" } }
  ] },
{ id:"F-QIP-7", tag:"FACT", type:"single",
  t:{ en:"Does your institution deliver QI services to clients in other countries?",
      fr:"Votre institution fournit-elle des services d'IQ à des clients d'autres pays ?",
      ar:"هل تقدم مؤسستكم خدمات البنية التحتية للجودة لعملاء في بلدان أخرى؟" },
  opts:[
   { v:"reg", t:{ en:"Yes, regularly", fr:"Oui, régulièrement", ar:"نعم، بانتظام" } },
   { v:"occ", t:{ en:"Yes, occasionally", fr:"Oui, occasionnellement", ar:"نعم، أحياناً" } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },
{ id:"F-QIP-8", tag:"FACT", type:"multi",
  t:{ en:"For your single most important investment need, which preparation documents already exist? Select all that apply.",
      fr:"Pour votre besoin d'investissement le plus important, quels documents de préparation existent déjà ? Sélectionnez tout ce qui s'applique.",
      ar:"بالنسبة لأهم احتياج استثماري لديكم، ما وثائق الإعداد المتوفرة بالفعل؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"concept", t:{ en:"Concept note", fr:"Note conceptuelle", ar:"مذكرة مفاهيمية" } },
   { v:"feas", t:{ en:"Pre-feasibility or feasibility study", fr:"Étude de préfaisabilité ou de faisabilité", ar:"دراسة جدوى أولية أو كاملة" } },
   { v:"specs", t:{ en:"Costed technical specifications", fr:"Spécifications techniques chiffrées", ar:"مواصفات فنية مُكلفَنة" } },
   { v:"esia", t:{ en:"Environmental and social screening", fr:"Examen environnemental et social", ar:"فرز بيئي واجتماعي" } },
   { v:"model", t:{ en:"Financial model or business case", fr:"Modèle financier ou analyse de rentabilité", ar:"نموذج مالي أو دراسة جدوى اقتصادية" } },
   { v:"none", excl:true, t:{ en:"None yet", fr:"Aucun pour l'instant", ar:"لا شيء حتى الآن" } }
  ] }
],

"F-REG": [
{ id:"F-REG-1", tag:"FACT", type:"single",
  t:{ en:"What is the main source of funding for market surveillance operations?",
      fr:"Quelle est la principale source de financement des opérations de surveillance du marché ?",
      ar:"ما المصدر الرئيسي لتمويل عمليات مراقبة السوق؟" },
  opts:[
   { v:"gov", t:{ en:"Government budget", fr:"Budget de l'État", ar:"الموازنة الحكومية" } },
   { v:"fees", t:{ en:"Fees and fines retained by the authority", fr:"Redevances et amendes conservées par l'autorité", ar:"رسوم وغرامات تحتفظ بها الهيئة" } },
   { v:"donor", t:{ en:"Donor support", fr:"Appui des bailleurs", ar:"دعم الجهات المانحة" } },
   { v:"mixed", t:{ en:"Mixed, no dominant source", fr:"Mixte, sans source dominante", ar:"مختلط دون مصدر غالب" } },
   { v:"none", t:{ en:"Effectively unfunded", fr:"Pratiquement sans financement", ar:"دون تمويل فعلي" } }
  ] },
{ id:"F-REG-2", tag:"PERCEPTION", type:"scale",
  t:{ en:"How adequate is the laboratory and testing capacity available to support your enforcement work? 1 = Very inadequate, 5 = Fully adequate.",
      fr:"Dans quelle mesure la capacité de laboratoire et d'essais disponible soutient-elle vos activités de contrôle ? 1 = Très insuffisante, 5 = Pleinement suffisante.",
      ar:"ما مدى كفاية قدرات المختبرات والاختبار المتاحة لدعم أعمال الإنفاذ لديكم؟ 1 = غير كافية إطلاقاً، 5 = كافية تماماً." },
  pts:[
   { v:1, t:{ en:"1 Very inadequate", fr:"1 Très insuffisante", ar:"1 غير كافية إطلاقاً" } },
   { v:2, t:{ en:"2 Inadequate", fr:"2 Insuffisante", ar:"2 غير كافية" } },
   { v:3, t:{ en:"3 Partially adequate", fr:"3 Partiellement suffisante", ar:"3 كافية جزئياً" } },
   { v:4, t:{ en:"4 Adequate", fr:"4 Suffisante", ar:"4 كافية" } },
   { v:5, t:{ en:"5 Fully adequate", fr:"5 Pleinement suffisante", ar:"5 كافية تماماً" } }
  ] },
{ id:"F-REG-3", tag:"FACT", type:"single",
  t:{ en:"How many inspectors or enforcement officers are currently in post?",
      fr:"Combien d'inspecteurs ou d'agents de contrôle sont actuellement en poste ?",
      ar:"كم عدد المفتشين أو موظفي الإنفاذ العاملين حالياً؟" },
  opts:[
   { v:"u10", t:{ en:"Under 10", fr:"Moins de 10", ar:"أقل من 10" } },
   { v:"10_49", t:{ en:"10-49", fr:"10 à 49", ar:"من 10 إلى 49" } },
   { v:"50_199", t:{ en:"50-199", fr:"50 à 199", ar:"من 50 إلى 199" } },
   { v:"o200", t:{ en:"200 or more", fr:"200 ou plus", ar:"200 أو أكثر" } }
  ] },
{ id:"F-REG-4", tag:"FACT", type:"single",
  t:{ en:"Approximately how many premises or products were inspected last fiscal year?",
      fr:"Environ combien d'établissements ou de produits ont été inspectés au dernier exercice ?",
      ar:"كم عدد المنشآت أو المنتجات التي جرى تفتيشها تقريباً في آخر سنة مالية؟" },
  opts:[
   { v:"u100", t:{ en:"Under 100", fr:"Moins de 100", ar:"أقل من 100" } },
   { v:"100_999", t:{ en:"100-999", fr:"100 à 999", ar:"من 100 إلى 999" } },
   { v:"1k_10k", t:{ en:"1,000-9,999", fr:"1 000 à 9 999", ar:"من 1,000 إلى 9,999" } },
   { v:"o10k", t:{ en:"10,000 or more", fr:"10 000 ou plus", ar:"10,000 أو أكثر" } }
  ] },
{ id:"F-REG-5", tag:"FACT", type:"single",
  t:{ en:"What share of technical regulations in force is substantially based on international or regional standards?",
      fr:"Quelle part des règlements techniques en vigueur repose substantiellement sur des normes internationales ou régionales ?",
      ar:"ما نسبة اللوائح الفنية السارية المبنية جوهرياً على مواصفات دولية أو إقليمية؟" },
  opts:[
   { v:"u25", t:{ en:"Under 25 percent", fr:"Moins de 25 %", ar:"أقل من 25%" } },
   { v:"25_49", t:{ en:"25-49 percent", fr:"25 à 49 %", ar:"من 25% إلى 49%" } },
   { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
   { v:"o75", t:{ en:"75 percent or more", fr:"75 % ou plus", ar:"75% أو أكثر" } }
  ] },
{ id:"F-REG-6", tag:"FACT", type:"scale",
  t:{ en:"Rate the maturity of the national product-safety alert, recall and consumer information system.",
      fr:"Évaluez la maturité du système national d'alerte, de rappel et d'information des consommateurs sur la sécurité des produits.",
      ar:"قيّموا نضج النظام الوطني للإنذار بسلامة المنتجات واستدعائها وإعلام المستهلكين." },
  pts:[
   { v:0, t:{ en:"0 Absent", fr:"0 Inexistant", ar:"0 غير موجود" } },
   { v:1, t:{ en:"1 Ad hoc", fr:"1 Ponctuel", ar:"1 ظرفي" } },
   { v:2, t:{ en:"2 Partially established", fr:"2 Partiellement établi", ar:"2 قائم جزئياً" } },
   { v:3, t:{ en:"3 Established and functioning", fr:"3 Établi et fonctionnel", ar:"3 قائم ويعمل" } },
   { v:4, t:{ en:"4 Fully established and evidenced", fr:"4 Pleinement établi et documenté", ar:"4 راسخ وموثَّق بالكامل" } }
  ] },
{ id:"F-REG-7", tag:"FACT", type:"single",
  t:{ en:"In the last three years, has your authority participated in joint surveillance actions or information exchange with other countries?",
      fr:"Au cours des trois dernières années, votre autorité a-t-elle participé à des actions conjointes de surveillance ou à des échanges d'informations avec d'autres pays ?",
      ar:"خلال السنوات الثلاث الماضية، هل شاركت هيئتكم في عمليات مراقبة مشتركة أو تبادل معلومات مع بلدان أخرى؟" },
  opts:[
   { v:"reg", t:{ en:"Yes, regularly", fr:"Oui, régulièrement", ar:"نعم، بانتظام" } },
   { v:"occ", t:{ en:"Yes, occasionally", fr:"Oui, occasionnellement", ar:"نعم، أحياناً" } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },
{ id:"F-REG-8", tag:"PERCEPTION", type:"text", multiline:true,
  t:{ en:"Which products or sectors does surveillance currently not cover although coverage is legally required? List up to 3, in order of risk.",
      fr:"Quels produits ou secteurs la surveillance ne couvre-t-elle pas actuellement alors que la loi l'exige ? Listez-en jusqu'à 3, par ordre de risque.",
      ar:"ما المنتجات أو القطاعات التي لا تغطيها المراقبة حالياً رغم أن التغطية مطلوبة قانوناً؟ اذكروا حتى ثلاثة، مرتبةً حسب الخطورة." } }
],

"F-PSU": [
{ id:"F-PSU-1", tag:"ESTIMATE", type:"single",
  t:{ en:"Typical annual spending of a member firm on QI services (testing, certification, inspection, calibration, standards), USD equivalent.",
      fr:"Dépense annuelle typique d'une entreprise membre en services d'IQ (essais, certification, inspection, étalonnage, normes), équivalent USD.",
      ar:"الإنفاق السنوي المعتاد لشركة عضو على خدمات البنية التحتية للجودة (اختبار، شهادات، تفتيش، معايرة، مواصفات)، بما يعادله بالدولار." },
  opts:[
   { v:"u1k", usd:[0,1000], t:{ en:"Under 1,000", fr:"Moins de 1 000", ar:"أقل من 1,000" } },
   { v:"1k_10k", usd:[1000,10000], t:{ en:"1,000-9,999", fr:"1 000 à 9 999", ar:"من 1,000 إلى 9,999" } },
   { v:"10k_50k", usd:[10000,50000], t:{ en:"10,000-49,999", fr:"10 000 à 49 999", ar:"من 10,000 إلى 49,999" } },
   { v:"o50k", usd:[50000,null], t:{ en:"50,000 or more", fr:"50 000 ou plus", ar:"50,000 أو أكثر" } }
  ] },
{ id:"F-PSU-2", tag:"PERCEPTION", type:"rank", k:3,
  t:{ en:"From the user side, what most prevents firms from using QI services? Rank your top 3.",
      fr:"Du point de vue des utilisateurs, qu'est-ce qui empêche le plus les entreprises d'utiliser les services d'IQ ? Classez vos 3 premiers obstacles.",
      ar:"من وجهة نظر المستخدمين، ما أكثر ما يمنع الشركات من استخدام خدمات الجودة؟ رتّبوا أهم ثلاثة عوائق." },
  opts:[
   { v:"cost", t:{ en:"Cost of services", fr:"Coût des services", ar:"تكلفة الخدمات" } },
   { v:"dist", t:{ en:"Distance or coverage", fr:"Distance ou couverture", ar:"البُعد أو التغطية" } },
   { v:"aware", t:{ en:"Awareness", fr:"Manque d'information", ar:"ضعف الوعي" } },
   { v:"slow", t:{ en:"Turnaround times", fr:"Délais de traitement", ar:"مدد الإنجاز" } },
   { v:"noacc", t:{ en:"No locally accredited option", fr:"Pas d'option accréditée localement", ar:"غياب خيار معتمد محلياً" } },
   { v:"doc", t:{ en:"Documentation complexity", fr:"Complexité documentaire", ar:"تعقيد المستندات" } },
   { v:"benefit", t:{ en:"Low perceived benefit", fr:"Bénéfice perçu faible", ar:"ضعف الجدوى المتصوَّرة" } },
   { v:"fin", t:{ en:"Cannot finance compliance costs", fr:"Impossibilité de financer la mise en conformité", ar:"تعذُّر تمويل تكاليف الامتثال" } }
  ] },
{ id:"F-PSU-3", tag:"PERCEPTION", type:"scale",
  t:{ en:"How adequate are turnaround times for the QI services your members use? 1 = Very inadequate, 5 = Fully adequate.",
      fr:"Les délais de traitement des services d'IQ utilisés par vos membres sont-ils satisfaisants ? 1 = Très insuffisants, 5 = Pleinement satisfaisants.",
      ar:"ما مدى ملاءمة مدد إنجاز خدمات الجودة التي يستخدمها أعضاؤكم؟ 1 = غير ملائمة إطلاقاً، 5 = ملائمة تماماً." },
  pts:[
   { v:1, t:{ en:"1 Very inadequate", fr:"1 Très insuffisants", ar:"1 غير ملائمة إطلاقاً" } },
   { v:2, t:{ en:"2 Inadequate", fr:"2 Insuffisants", ar:"2 غير ملائمة" } },
   { v:3, t:{ en:"3 Partially adequate", fr:"3 Partiellement satisfaisants", ar:"3 ملائمة جزئياً" } },
   { v:4, t:{ en:"4 Adequate", fr:"4 Satisfaisants", ar:"4 ملائمة" } },
   { v:5, t:{ en:"5 Fully adequate", fr:"5 Pleinement satisfaisants", ar:"5 ملائمة تماماً" } }
  ] },
{ id:"F-PSU-4", tag:"PERCEPTION", type:"scale",
  t:{ en:"How reasonable are current fee levels for the QI services your members use? 1 = Very inadequate (prohibitive), 5 = Fully adequate.",
      fr:"Les tarifs actuels des services d'IQ utilisés par vos membres sont-ils raisonnables ? 1 = Très excessifs (prohibitifs), 5 = Pleinement raisonnables.",
      ar:"ما مدى معقولية مستويات الرسوم الحالية لخدمات الجودة التي يستخدمها أعضاؤكم؟ 1 = باهظة تمنع الاستخدام، 5 = معقولة تماماً." },
  pts:[
   { v:1, t:{ en:"1 Prohibitive", fr:"1 Prohibitifs", ar:"1 باهظة" } },
   { v:2, t:{ en:"2 High", fr:"2 Élevés", ar:"2 مرتفعة" } },
   { v:3, t:{ en:"3 Mixed", fr:"3 Mitigés", ar:"3 متفاوتة" } },
   { v:4, t:{ en:"4 Reasonable", fr:"4 Raisonnables", ar:"4 معقولة" } },
   { v:5, t:{ en:"5 Fully reasonable", fr:"5 Pleinement raisonnables", ar:"5 معقولة تماماً" } }
  ] },
{ id:"F-PSU-5", tag:"FACT", type:"single",
  t:{ en:"Do your members use QI providers in other countries? If yes, for which services?",
      fr:"Vos membres recourent-ils à des prestataires d'IQ d'autres pays ? Si oui, pour quels services ?",
      ar:"هل يستخدم أعضاؤكم مزوّدي خدمات جودة في بلدان أخرى؟ وإذا كان الجواب نعم، فلأي خدمات؟" },
  opts:[
   { v:"reg", t:{ en:"Yes, regularly", fr:"Oui, régulièrement", ar:"نعم، بانتظام" },
     fu:{ key:"svc", kind:"text", t:{ en:"Which services", fr:"Quels services", ar:"ما الخدمات" } } },
   { v:"occ", t:{ en:"Yes, occasionally", fr:"Oui, occasionnellement", ar:"نعم، أحياناً" },
     fu:{ key:"svc", kind:"text", t:{ en:"Which services", fr:"Quels services", ar:"ما الخدمات" } } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },
{ id:"F-PSU-6", tag:"FACT", type:"single",
  t:{ en:"In the last three years, how many cases do you know of where member firms lost exports or contracts because of missing or unrecognized tests or certificates?",
      fr:"Au cours des trois dernières années, combien de cas connaissez-vous où des entreprises membres ont perdu des exportations ou des contrats faute d'essais ou de certificats reconnus ?",
      ar:"خلال السنوات الثلاث الماضية، كم حالة تعرفونها خسرت فيها شركات أعضاء صادرات أو عقوداً بسبب نقص الاختبارات أو الشهادات أو عدم الاعتراف بها؟" },
  opts:[
   { v:"none", t:{ en:"None", fr:"Aucun", ar:"لا حالات" } },
   { v:"1_5", t:{ en:"1-5 cases", fr:"1 à 5 cas", ar:"من 1 إلى 5 حالات" } },
   { v:"6_20", t:{ en:"6-20 cases", fr:"6 à 20 cas", ar:"من 6 إلى 20 حالة" } },
   { v:"o20", t:{ en:"More than 20 cases", fr:"Plus de 20 cas", ar:"أكثر من 20 حالة" } }
  ] },
{ id:"F-PSU-7", tag:"ESTIMATE", type:"single",
  t:{ en:"What share of your members would be willing and able to pay cost-reflective fees for faster or internationally recognized QI services?",
      fr:"Quelle part de vos membres serait disposée et en mesure de payer des tarifs reflétant les coûts pour des services d'IQ plus rapides ou reconnus à l'international ?",
      ar:"ما نسبة أعضائكم المستعدين والقادرين على دفع رسوم تعكس التكلفة مقابل خدمات جودة أسرع أو معترف بها دولياً؟" },
  opts:[
   { v:"u10", t:{ en:"Under 10 percent", fr:"Moins de 10 %", ar:"أقل من 10%" } },
   { v:"10_29", t:{ en:"10-29 percent", fr:"10 à 29 %", ar:"من 10% إلى 29%" } },
   { v:"30_49", t:{ en:"30-49 percent", fr:"30 à 49 %", ar:"من 30% إلى 49%" } },
   { v:"o50", t:{ en:"50 percent or more", fr:"50 % ou plus", ar:"50% أو أكثر" } }
  ] },
{ id:"F-PSU-8", tag:"FACT", type:"single",
  t:{ en:"Are your members aware of, and have they used, subsidized QI support schemes for MSMEs (vouchers, grants, group certification)?",
      fr:"Vos membres connaissent-ils et ont-ils utilisé des dispositifs subventionnés d'appui à l'IQ pour les MPME (bons, subventions, certification groupée) ?",
      ar:"هل يعرف أعضاؤكم مخططات الدعم المُعانة لخدمات الجودة للمنشآت الصغرى والصغيرة والمتوسطة (قسائم، منح، شهادات جماعية)، وهل استخدموها؟" },
  opts:[
   { v:"used", t:{ en:"Aware and widely used", fr:"Connus et largement utilisés", ar:"معروفة ومستخدمة على نطاق واسع" } },
   { v:"aware", t:{ en:"Aware but little used", fr:"Connus mais peu utilisés", ar:"معروفة لكن قليلة الاستخدام" } },
   { v:"noaware", t:{ en:"Not aware", fr:"Non connus", ar:"غير معروفة" } },
   { v:"none", t:{ en:"No such schemes exist", fr:"Aucun dispositif de ce type n'existe", ar:"لا توجد مخططات من هذا النوع" } }
  ] }
],

"F-BDF": [
{ id:"F-BDF-1", tag:"FACT", type:"combo",
  t:{ en:"In the last five fiscal years, have members provided financing to QI institutions or QI-related businesses? If yes, what type?",
      fr:"Au cours des cinq derniers exercices, vos membres ont-ils financé des institutions de l'IQ ou des entreprises liées à l'IQ ? Si oui, sous quelle forme ?",
      ar:"خلال السنوات المالية الخمس الأخيرة، هل قدّم أعضاؤكم تمويلاً لمؤسسات البنية التحتية للجودة أو أعمال مرتبطة بها؟ وإذا كان الجواب نعم، فما نوعه؟" },
  parts:[
   { key:"did", type:"single", t:{ en:"Financing provided?", fr:"Financement accordé ?", ar:"هل قُدِّم تمويل؟" },
     opts:[
      { v:"yes", t:{ en:"Yes", fr:"Oui", ar:"نعم" } },
      { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
     ] },
   { key:"types", type:"multi", showIf:{ did:"yes" }, t:{ en:"Type (select all that apply)", fr:"Forme (sélectionnez tout ce qui s'applique)", ar:"النوع (اختاروا كل ما ينطبق)" },
     opts:[
      { v:"term", t:{ en:"Term loans", fr:"Prêts à terme", ar:"قروض لأجل" } },
      { v:"lease", t:{ en:"Leasing", fr:"Crédit-bail", ar:"تأجير تمويلي" } },
      { v:"wc", t:{ en:"Working capital", fr:"Fonds de roulement", ar:"رأس مال عامل" } },
      { v:"guar", t:{ en:"Guarantees", fr:"Garanties", ar:"ضمانات" } },
      { v:"equity", t:{ en:"Equity", fr:"Prises de participation", ar:"مساهمات في رأس المال" } },
      { v:"proj", t:{ en:"Project finance", fr:"Financement de projet", ar:"تمويل مشاريع" } }
     ] }
  ] },
{ id:"F-BDF-2", tag:"PERCEPTION", type:"scale",
  t:{ en:"Current willingness of your members to lend to QI institutions or QI-service businesses.",
      fr:"Disposition actuelle de vos membres à prêter aux institutions de l'IQ ou aux entreprises de services d'IQ.",
      ar:"مدى استعداد أعضائكم حالياً لإقراض مؤسسات البنية التحتية للجودة أو شركات خدمات الجودة." },
  pts:[
   { v:1, t:{ en:"1 Unwilling", fr:"1 Réticents", ar:"1 غير مستعدين" } },
   { v:2, t:{ en:"2 Reluctant, exceptional cases only", fr:"2 Hésitants, cas exceptionnels seulement", ar:"2 مترددون، حالات استثنائية فقط" } },
   { v:3, t:{ en:"3 Selective", fr:"3 Sélectifs", ar:"3 انتقائيون" } },
   { v:4, t:{ en:"4 Willing with risk mitigation", fr:"4 Disposés avec atténuation des risques", ar:"4 مستعدون مع تخفيف المخاطر" } },
   { v:5, t:{ en:"5 Actively seeking such assets", fr:"5 Recherchent activement ces actifs", ar:"5 يسعون بنشاط لهذه الأصول" } }
  ] },
{ id:"F-BDF-3", tag:"PERCEPTION", type:"scale",
  t:{ en:"How bankable do QI investment projects currently appear to your members?",
      fr:"Dans quelle mesure les projets d'investissement d'IQ paraissent-ils actuellement bancables à vos membres ?",
      ar:"ما مدى قابلية مشاريع الاستثمار في البنية التحتية للجودة للتمويل المصرفي من منظور أعضائكم حالياً؟" },
  pts:[
   { v:1, t:{ en:"1 Not bankable", fr:"1 Non bancables", ar:"1 غير قابلة للتمويل" } },
   { v:2, t:{ en:"2 Rarely bankable", fr:"2 Rarement bancables", ar:"2 نادراً ما تكون قابلة" } },
   { v:3, t:{ en:"3 Occasionally bankable", fr:"3 Parfois bancables", ar:"3 قابلة أحياناً" } },
   { v:4, t:{ en:"4 Often bankable", fr:"4 Souvent bancables", ar:"4 قابلة غالباً" } },
   { v:5, t:{ en:"5 Consistently bankable", fr:"5 Systématiquement bancables", ar:"5 قابلة باستمرار" } }
  ] },
{ id:"F-BDF-4", tag:"PERCEPTION", type:"rank", k:2,
  t:{ en:"Which conditions would most increase member willingness to finance QI? Rank your top 2.",
      fr:"Quelles conditions augmenteraient le plus la disposition de vos membres à financer l'IQ ? Classez vos 2 premières.",
      ar:"ما الشروط التي ستزيد استعداد أعضائكم لتمويل البنية التحتية للجودة أكثر من غيرها؟ رتّبوا أهم شرطين." },
  opts:[
   { v:"audit", t:{ en:"Audited financial statements of QI institutions", fr:"États financiers audités des institutions de l'IQ", ar:"قوائم مالية مدققة لمؤسسات الجودة" } },
   { v:"pred", t:{ en:"Predictable government transfers", fr:"Transferts publics prévisibles", ar:"تحويلات حكومية منتظمة" } },
   { v:"guar", t:{ en:"Partial credit guarantees", fr:"Garanties de crédit partielles", ar:"ضمانات ائتمانية جزئية" } },
   { v:"offtake", t:{ en:"Offtake or service contracts", fr:"Contrats d'achat ou de service", ar:"عقود شراء أو خدمات مضمونة" } },
   { v:"blend", t:{ en:"Blended structures with DFIs", fr:"Montages mixtes avec les IFD", ar:"هياكل مختلطة مع مؤسسات التمويل الإنمائي" } },
   { v:"regul", t:{ en:"Regulatory clarity on fees and revenue retention", fr:"Clarté réglementaire sur les tarifs et la rétention des recettes", ar:"وضوح تنظيمي بشأن الرسوم والاحتفاظ بالإيرادات" } }
  ] },
{ id:"F-BDF-5", tag:"FACT", type:"multi",
  t:{ en:"Which instruments could your members realistically offer for QI investments within two years? Select all that apply.",
      fr:"Quels instruments vos membres pourraient-ils réalistement proposer pour des investissements d'IQ d'ici deux ans ? Sélectionnez tout ce qui s'applique.",
      ar:"ما الأدوات التي يمكن لأعضائكم واقعياً تقديمها لاستثمارات البنية التحتية للجودة خلال سنتين؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"term", t:{ en:"Term loans", fr:"Prêts à terme", ar:"قروض لأجل" } },
   { v:"lease", t:{ en:"Equipment leasing", fr:"Crédit-bail d'équipements", ar:"تأجير تمويلي للمعدات" } },
   { v:"guar", t:{ en:"Guarantees", fr:"Garanties", ar:"ضمانات" } },
   { v:"bond", t:{ en:"Bonds or capital-market instruments", fr:"Obligations ou instruments de marché", ar:"سندات أو أدوات سوق رأس المال" } },
   { v:"equity", t:{ en:"Equity or quasi-equity", fr:"Fonds propres ou quasi-fonds propres", ar:"مساهمات أو شبه مساهمات" } },
   { v:"adv", t:{ en:"Advisory only", fr:"Conseil uniquement", ar:"خدمات استشارية فقط" } },
   { v:"none", excl:true, t:{ en:"None", fr:"Aucun", ar:"لا شيء" } }
  ] },
{ id:"F-BDF-6", tag:"FACT", type:"scale",
  t:{ en:"To what extent do members use certification, standards compliance or accreditation status as a positive signal in credit appraisal of firms?",
      fr:"Dans quelle mesure vos membres utilisent-ils la certification, la conformité aux normes ou l'accréditation comme signal positif dans l'évaluation du crédit des entreprises ?",
      ar:"إلى أي مدى يستخدم أعضاؤكم الشهادات أو الامتثال للمواصفات أو حالة الاعتماد كمؤشر إيجابي في تقييم الجدارة الائتمانية للشركات؟" },
  pts:[
   { v:1, t:{ en:"1 Never", fr:"1 Jamais", ar:"1 أبداً" } },
   { v:2, t:{ en:"2 Rarely", fr:"2 Rarement", ar:"2 نادراً" } },
   { v:3, t:{ en:"3 Sometimes", fr:"3 Parfois", ar:"3 أحياناً" } },
   { v:4, t:{ en:"4 Often", fr:"4 Souvent", ar:"4 غالباً" } },
   { v:5, t:{ en:"5 Systematically", fr:"5 Systématiquement", ar:"5 بشكل منهجي" } }
  ] },
{ id:"F-BDF-7", tag:"ESTIMATE", type:"single",
  t:{ en:"What share of your members' MSME clients cite compliance, testing or certification costs as a barrier to accessing finance?",
      fr:"Quelle part des clients MPME de vos membres cite les coûts de conformité, d'essais ou de certification comme obstacle à l'accès au financement ?",
      ar:"ما نسبة عملاء أعضائكم من المنشآت الصغرى والصغيرة والمتوسطة الذين يذكرون تكاليف الامتثال أو الاختبار أو الشهادات كعائق أمام الحصول على التمويل؟" },
  opts:[
   { v:"u10", t:{ en:"Under 10 percent", fr:"Moins de 10 %", ar:"أقل من 10%" } },
   { v:"10_24", t:{ en:"10-24 percent", fr:"10 à 24 %", ar:"من 10% إلى 24%" } },
   { v:"25_49", t:{ en:"25-49 percent", fr:"25 à 49 %", ar:"من 25% إلى 49%" } },
   { v:"o50", t:{ en:"50 percent or more", fr:"50 % ou plus", ar:"50% أو أكثر" } }
  ] },
{ id:"F-BDF-8", tag:"FACT", type:"single",
  t:{ en:"Have members participated in DFI or MDB operations with QI components (credit lines, guarantees, technical assistance)? If yes, name the partners.",
      fr:"Vos membres ont-ils participé à des opérations d'IFD ou de BMD comportant des composantes d'IQ (lignes de crédit, garanties, assistance technique) ? Si oui, indiquez les partenaires.",
      ar:"هل شارك أعضاؤكم في عمليات لمؤسسات التمويل الإنمائي أو بنوك التنمية تتضمن مكونات للجودة (خطوط ائتمان، ضمانات، مساعدة فنية)؟ إذا نعم، اذكروا الشركاء." },
  opts:[
   { v:"yes", t:{ en:"Yes", fr:"Oui", ar:"نعم" },
     fu:{ key:"partners", kind:"text", t:{ en:"Partners", fr:"Partenaires", ar:"الشركاء" } } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] }
],

"F-DEV": [
{ id:"F-DEV-1", tag:"FACT", type:"combo",
  t:{ en:"Your organization's current QI-related portfolio in this country: number of active projects and total committed value (USD band).",
      fr:"Portefeuille actuel de votre organisation lié à l'IQ dans ce pays : nombre de projets actifs et valeur totale engagée (fourchette USD).",
      ar:"محفظة منظمتكم الحالية المتصلة بالبنية التحتية للجودة في هذا البلد: عدد المشاريع النشطة وإجمالي القيمة الملتزم بها (نطاق بالدولار)." },
  parts:[
   { key:"n", type:"single", t:{ en:"Active projects", fr:"Projets actifs", ar:"المشاريع النشطة" },
     opts:[
      { v:"none", t:{ en:"None", fr:"Aucun", ar:"لا يوجد" } },
      { v:"1_2", t:{ en:"1-2", fr:"1 à 2", ar:"من 1 إلى 2" } },
      { v:"3_5", t:{ en:"3-5", fr:"3 à 5", ar:"من 3 إلى 5" } },
      { v:"o5", t:{ en:"More than 5", fr:"Plus de 5", ar:"أكثر من 5" } }
     ] },
   { key:"val", type:"single", t:{ en:"Committed value (USD)", fr:"Valeur engagée (USD)", ar:"القيمة الملتزم بها (دولار)" },
     opts:[
      { v:"u1", usd:[0,1000000], t:{ en:"Under 1 million", fr:"Moins de 1 million", ar:"أقل من مليون" } },
      { v:"1_5", usd:[1000000,5000000], t:{ en:"1-5 million", fr:"1 à 5 millions", ar:"من 1 إلى 5 ملايين" } },
      { v:"5_20", usd:[5000000,20000000], t:{ en:"5-20 million", fr:"5 à 20 millions", ar:"من 5 إلى 20 مليوناً" } },
      { v:"o20", usd:[20000000,null], t:{ en:"Above 20 million", fr:"Plus de 20 millions", ar:"أكثر من 20 مليوناً" } }
     ] }
  ] },
{ id:"F-DEV-2", tag:"FACT", type:"multi",
  t:{ en:"Which financing instruments does your organization use for QI in this country? Select all that apply.",
      fr:"Quels instruments de financement votre organisation utilise-t-elle pour l'IQ dans ce pays ? Sélectionnez tout ce qui s'applique.",
      ar:"ما أدوات التمويل التي تستخدمها منظمتكم للبنية التحتية للجودة في هذا البلد؟ اختاروا كل ما ينطبق." },
  opts:[
   { v:"grant", t:{ en:"Grants and in-kind support", fr:"Dons et appui en nature", ar:"منح ودعم عيني" } },
   { v:"conc", t:{ en:"Concessional loans", fr:"Prêts concessionnels", ar:"قروض ميسَّرة" } },
   { v:"rbf", t:{ en:"Results-based financing", fr:"Financement basé sur les résultats", ar:"تمويل قائم على النتائج" } },
   { v:"trust", t:{ en:"Trust funds or pooled funds", fr:"Fonds fiduciaires ou fonds communs", ar:"صناديق استئمانية أو مجمّعة" } },
   { v:"guar", t:{ en:"Guarantees", fr:"Garanties", ar:"ضمانات" } },
   { v:"ta", t:{ en:"Technical assistance only", fr:"Assistance technique uniquement", ar:"مساعدة فنية فقط" } }
  ] },
{ id:"F-DEV-3", tag:"PERCEPTION", type:"scale",
  t:{ en:"How well is your organization's QI support aligned with the country's own QI priorities and systems? 1 = Very inadequate, 5 = Fully adequate.",
      fr:"Dans quelle mesure l'appui de votre organisation à l'IQ est-il aligné sur les priorités et systèmes nationaux ? 1 = Très insuffisamment, 5 = Pleinement.",
      ar:"ما مدى اتساق دعم منظمتكم للبنية التحتية للجودة مع أولويات البلد ونظمه؟ 1 = ضعيف جداً، 5 = تام." },
  pts:[
   { v:1, t:{ en:"1 Very inadequate", fr:"1 Très insuffisant", ar:"1 ضعيف جداً" } },
   { v:2, t:{ en:"2 Inadequate", fr:"2 Insuffisant", ar:"2 ضعيف" } },
   { v:3, t:{ en:"3 Partially adequate", fr:"3 Partiellement aligné", ar:"3 متسق جزئياً" } },
   { v:4, t:{ en:"4 Adequate", fr:"4 Aligné", ar:"4 متسق" } },
   { v:5, t:{ en:"5 Fully adequate", fr:"5 Pleinement aligné", ar:"5 متسق تماماً" } }
  ] },
{ id:"F-DEV-4", tag:"FACT", type:"combo",
  t:{ en:"Does your organization have a QI-related pipeline for this country for the next three years? If yes, indicative value (USD band).",
      fr:"Votre organisation a-t-elle un portefeuille de projets d'IQ prévu pour ce pays sur les trois prochaines années ? Si oui, valeur indicative (fourchette USD).",
      ar:"هل لدى منظمتكم خط مشاريع متصلة بالبنية التحتية للجودة لهذا البلد للسنوات الثلاث المقبلة؟ إذا نعم، فما القيمة الإرشادية (نطاق بالدولار)؟" },
  parts:[
   { key:"has", type:"single", t:{ en:"Pipeline?", fr:"Portefeuille prévu ?", ar:"خط مشاريع؟" },
     opts:[
      { v:"yes", t:{ en:"Yes", fr:"Oui", ar:"نعم" } },
      { v:"disc", t:{ en:"Under discussion", fr:"En discussion", ar:"قيد النقاش" } },
      { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
     ] },
   { key:"val", type:"single", showIf:{ has:"yes" }, t:{ en:"Indicative value (USD)", fr:"Valeur indicative (USD)", ar:"القيمة الإرشادية (دولار)" },
     opts:[
      { v:"u1", usd:[0,1000000], t:{ en:"Under 1 million", fr:"Moins de 1 million", ar:"أقل من مليون" } },
      { v:"1_5", usd:[1000000,5000000], t:{ en:"1-5 million", fr:"1 à 5 millions", ar:"من 1 إلى 5 ملايين" } },
      { v:"5_20", usd:[5000000,20000000], t:{ en:"5-20 million", fr:"5 à 20 millions", ar:"من 5 إلى 20 مليوناً" } },
      { v:"o20", usd:[20000000,null], t:{ en:"Above 20 million", fr:"Plus de 20 millions", ar:"أكثر من 20 مليوناً" } }
     ] }
  ] },
{ id:"F-DEV-5", tag:"PERCEPTION", type:"scale",
  t:{ en:"What level of coordination exists among development partners supporting QI in this country (joint programming, pooled funds, information sharing)?",
      fr:"Quel niveau de coordination existe-t-il entre les partenaires au développement soutenant l'IQ dans ce pays (programmation conjointe, fonds communs, partage d'informations) ?",
      ar:"ما مستوى التنسيق بين الشركاء الإنمائيين الداعمين للبنية التحتية للجودة في هذا البلد (برمجة مشتركة، صناديق مجمّعة، تبادل معلومات)؟" },
  pts:[
   { v:1, t:{ en:"1 None", fr:"1 Aucun", ar:"1 لا يوجد" } },
   { v:2, t:{ en:"2 Information sharing only", fr:"2 Partage d'informations uniquement", ar:"2 تبادل معلومات فقط" } },
   { v:3, t:{ en:"3 Some joint activities", fr:"3 Quelques activités conjointes", ar:"3 بعض الأنشطة المشتركة" } },
   { v:4, t:{ en:"4 Structured coordination", fr:"4 Coordination structurée", ar:"4 تنسيق منظّم" } },
   { v:5, t:{ en:"5 Joint programming or pooled funding", fr:"5 Programmation conjointe ou fonds communs", ar:"5 برمجة مشتركة أو تمويل مجمّع" } }
  ] },
{ id:"F-DEV-6", tag:"PERCEPTION", type:"scale",
  t:{ en:"How sustainable are donor-funded QI capacity gains in this country after projects end?",
      fr:"Dans quelle mesure les acquis de capacités d'IQ financés par les bailleurs se maintiennent-ils dans ce pays après la fin des projets ?",
      ar:"ما مدى استدامة مكاسب القدرات الممولة من المانحين في مجال الجودة في هذا البلد بعد انتهاء المشاريع؟" },
  pts:[
   { v:1, t:{ en:"1 Not sustainable, gains dissipate", fr:"1 Non durables, les acquis se dissipent", ar:"1 غير مستدامة وتتبدد المكاسب" } },
   { v:2, t:{ en:"2 Mostly lost", fr:"2 En grande partie perdus", ar:"2 تُفقد في معظمها" } },
   { v:3, t:{ en:"3 Partially retained", fr:"3 Partiellement conservés", ar:"3 يُحتفظ بها جزئياً" } },
   { v:4, t:{ en:"4 Largely retained", fr:"4 Largement conservés", ar:"4 يُحتفظ بها إلى حد كبير" } },
   { v:5, t:{ en:"5 Fully institutionalized", fr:"5 Pleinement institutionnalisés", ar:"5 مؤسَّسة بالكامل" } }
  ] },
{ id:"F-DEV-7", tag:"FACT", type:"multi",
  t:{ en:"For REC respondents: which regional QI instruments does your organization operate or host? Others: select what your organization participates in.",
      fr:"Pour les CER : quels instruments régionaux d'IQ votre organisation gère-t-elle ou héberge-t-elle ? Autres répondants : indiquez ceux auxquels votre organisation participe.",
      ar:"للتجمعات الاقتصادية الإقليمية: ما الأدوات الإقليمية للجودة التي تديرها أو تستضيفها منظمتكم؟ وللآخرين: اختاروا ما تشارك فيه منظمتكم." },
  opts:[
   { v:"mra", t:{ en:"Mutual recognition arrangements", fr:"Accords de reconnaissance mutuelle", ar:"ترتيبات الاعتراف المتبادل" } },
   { v:"harm", t:{ en:"Regional standards harmonization", fr:"Harmonisation régionale des normes", ar:"مواءمة المواصفات إقليمياً" } },
   { v:"svc", t:{ en:"Regional accreditation or metrology services", fr:"Services régionaux d'accréditation ou de métrologie", ar:"خدمات إقليمية للاعتماد أو المترولوجيا" } },
   { v:"fund", t:{ en:"Regional pooled funds", fr:"Fonds régionaux communs", ar:"صناديق إقليمية مجمّعة" } },
   { v:"train", t:{ en:"Regional training programmes", fr:"Programmes régionaux de formation", ar:"برامج تدريب إقليمية" } },
   { v:"none", excl:true, t:{ en:"None", fr:"Aucun", ar:"لا شيء" } }
  ] },
{ id:"F-DEV-8", tag:"PERCEPTION", type:"scale",
  t:{ en:"For academia and professional bodies: how adequate is the national skills pipeline for QI professions (metrologists, assessors, auditors, laboratory scientists)? Others: answer from your observation. 1 = Very inadequate, 5 = Fully adequate.",
      fr:"Pour les universités et ordres professionnels : le vivier national de compétences pour les métiers de l'IQ (métrologues, évaluateurs, auditeurs, scientifiques de laboratoire) est-il suffisant ? Autres répondants : répondez selon votre observation. 1 = Très insuffisant, 5 = Pleinement suffisant.",
      ar:"للجامعات والهيئات المهنية: ما مدى كفاية خط إعداد الكفاءات الوطنية لمهن الجودة (مترولوجيون، مقيّمون، مدققون، علماء مختبرات)؟ وللآخرين: أجيبوا وفق ملاحظاتكم. 1 = غير كافٍ إطلاقاً، 5 = كافٍ تماماً." },
  pts:[
   { v:1, t:{ en:"1 Very inadequate", fr:"1 Très insuffisant", ar:"1 غير كافٍ إطلاقاً" } },
   { v:2, t:{ en:"2 Inadequate", fr:"2 Insuffisant", ar:"2 غير كافٍ" } },
   { v:3, t:{ en:"3 Partially adequate", fr:"3 Partiellement suffisant", ar:"3 كافٍ جزئياً" } },
   { v:4, t:{ en:"4 Adequate", fr:"4 Suffisant", ar:"4 كافٍ" } },
   { v:5, t:{ en:"5 Fully adequate", fr:"5 Pleinement suffisant", ar:"5 كافٍ تماماً" } }
  ] }
]
};

