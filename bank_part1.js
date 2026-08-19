// QI Financing Survey v2.0 question bank, part 1: Profile (P1-P6) + Common core (A1-A19)
// Trilingual EN/FR/AR. Types: single, multi, rank, matrix, composition, scale, text, combo.
// Every question gets Don't know / Not applicable / Prefer not to say controls unless noMiss.
window.QI_BANK_P1 = {

profile: [
{ id:"P1", type:"country", noMiss:true,
  t:{ en:"Country. Confirm the country you are answering for.",
      fr:"Pays. Confirmez le pays pour lequel vous répondez.",
      ar:"البلد. يُرجى تأكيد البلد الذي تجيبون عنه." } },

{ id:"P2", type:"single", noMiss:true,
  t:{ en:"Institutional category. Which single category best describes your organization? This answer assigns your respondent module.",
      fr:"Catégorie institutionnelle. Quelle catégorie décrit le mieux votre organisation ? Cette réponse détermine votre module de répondant.",
      ar:"الفئة المؤسسية. ما الفئة الوحيدة التي تصف مؤسستكم على أفضل وجه؟ تحدد هذه الإجابة وحدة الأسئلة الخاصة بكم." },
  opts:[
   { v:"gov_pol", fam:"F-GOV", t:{ en:"Ministry responsible for industry, trade or planning", fr:"Ministère chargé de l'industrie, du commerce ou de la planification", ar:"الوزارة المسؤولة عن الصناعة أو التجارة أو التخطيط" } },
   { v:"fin", fam:"F-FIN", t:{ en:"Ministry of finance, budget or treasury", fr:"Ministère des finances, du budget ou du trésor", ar:"وزارة المالية أو الموازنة أو الخزانة" } },
   { v:"parl", fam:"F-GOV", t:{ en:"National parliament (committee or secretariat)", fr:"Parlement national (commission ou secrétariat)", ar:"البرلمان الوطني (لجنة أو أمانة)" } },
   { v:"nsb", fam:"F-QIP", t:{ en:"National standards body (NSB)", fr:"Organisme national de normalisation (ONN)", ar:"الهيئة الوطنية للمواصفات والتقييس" } },
   { v:"nmi", fam:"F-QIP", t:{ en:"National metrology institute or legal metrology authority (NMI)", fr:"Institut national de métrologie ou autorité de métrologie légale (INM)", ar:"المعهد الوطني للمترولوجيا أو هيئة المترولوجيا القانونية" } },
   { v:"nab", fam:"F-QIP", t:{ en:"National accreditation body or accreditation focal point (NAB)", fr:"Organisme national d'accréditation ou point focal d'accréditation (ONA)", ar:"هيئة الاعتماد الوطنية أو نقطة الاتصال الوطنية للاعتماد" } },
   { v:"cab", fam:"F-QIP", t:{ en:"Conformity assessment body, public or private (testing, certification, inspection)", fr:"Organisme d'évaluation de la conformité, public ou privé (essais, certification, inspection)", ar:"جهة تقييم المطابقة، عامة أو خاصة (اختبار، إصدار شهادات، تفتيش)" } },
   { v:"reg", fam:"F-REG", t:{ en:"Market surveillance or technical regulatory authority", fr:"Autorité de surveillance du marché ou de réglementation technique", ar:"هيئة مراقبة السوق أو الجهة التنظيمية الفنية" } },
   { v:"bor", fam:"F-GOV", t:{ en:"Tax, customs, investment, export, SEZ or PPP authority", fr:"Autorité fiscale, douanière, d'investissement, d'exportation, de zones économiques spéciales ou de PPP", ar:"هيئة الضرائب أو الجمارك أو الاستثمار أو التصدير أو المناطق الاقتصادية الخاصة أو الشراكة بين القطاعين" } },
   { v:"psu", fam:"F-PSU", t:{ en:"Business association, chamber, consumer association or individual firm", fr:"Association professionnelle, chambre, association de consommateurs ou entreprise individuelle", ar:"اتحاد أعمال أو غرفة تجارية أو جمعية مستهلكين أو شركة منفردة" } },
   { v:"bdf", fam:"F-BDF", t:{ en:"Bank, development finance institution or investor (or their association)", fr:"Banque, institution de financement du développement ou investisseur (ou leur association)", ar:"مصرف أو مؤسسة تمويل إنمائي أو مستثمر (أو اتحاداتها)" } },
   { v:"dev", fam:"F-DEV", t:{ en:"Development partner or regional economic community", fr:"Partenaire au développement ou communauté économique régionale", ar:"شريك إنمائي أو تجمع اقتصادي إقليمي" } },
   { v:"aca", fam:"F-DEV", t:{ en:"University, research or training institution, professional body, or subnational government", fr:"Université, institution de recherche ou de formation, ordre professionnel ou collectivité territoriale", ar:"جامعة أو مؤسسة بحث أو تدريب، أو هيئة مهنية، أو حكومة محلية" } },
   { v:"other", fam:"F-GOV", t:{ en:"Other (specify; the country coordinator assigns the module)", fr:"Autre (précisez ; le coordonnateur national attribuera le module)", ar:"أخرى (حدِّدوا؛ يتولى المنسق الوطني إسناد الوحدة)" },
     fu:{ key:"other_txt", kind:"text", t:{ en:"Please specify", fr:"Veuillez préciser", ar:"يُرجى التحديد" } } }
  ] },

{ id:"P3", type:"single", noMiss:true,
  t:{ en:"Decision-making level. Which best describes your position?",
      fr:"Niveau de décision. Quelle description correspond le mieux à votre fonction ?",
      ar:"مستوى اتخاذ القرار. أيّ وصف يعبّر عن موقعكم الوظيفي على أفضل وجه؟" },
  opts:[
   { v:"pol", t:{ en:"Political principal (minister, deputy minister, MP or committee chair)", fr:"Responsable politique (ministre, vice-ministre, député ou président de commission)", ar:"مسؤول سياسي (وزير، نائب وزير، نائب برلماني أو رئيس لجنة)" } },
   { v:"ao", t:{ en:"Accounting officer (permanent secretary, CEO or DG with statutory financial accountability)", fr:"Responsable comptable statutaire (secrétaire général, directeur général financièrement responsable)", ar:"المسؤول المالي الأول (أمين عام أو مدير عام يتحمل المسؤولية المالية القانونية)" } },
   { v:"dir", t:{ en:"Director or executive", fr:"Directeur ou cadre dirigeant", ar:"مدير أو عضو إدارة عليا" } },
   { v:"tm", t:{ en:"Technical manager", fr:"Responsable technique", ar:"مدير فني" } },
   { v:"spec", t:{ en:"Operational specialist", fr:"Spécialiste opérationnel", ar:"أخصائي تشغيلي" } },
   { v:"analyst", t:{ en:"Analyst or desk officer", fr:"Analyste ou chargé de dossier", ar:"محلل أو موظف مكتب" } }
  ] },

{ id:"P4", type:"single", noMiss:true,
  t:{ en:"Formal authority over budget allocation.",
      fr:"Autorité formelle sur l'allocation budgétaire.",
      ar:"الصلاحية الرسمية في تخصيص الموازنة." },
  opts:[
   { v:"none", t:{ en:"None", fr:"Aucune", ar:"لا توجد" } },
   { v:"rec", t:{ en:"Recommends or prepares", fr:"Recommande ou prépare", ar:"يوصي أو يُعِدّ" } },
   { v:"del", t:{ en:"Approves within delegated limits", fr:"Approuve dans des limites déléguées", ar:"يعتمد ضمن حدود مفوَّضة" } },
   { v:"stat", t:{ en:"Statutory approval authority", fr:"Autorité d'approbation statutaire", ar:"صلاحية اعتماد قانونية" } }
  ] },

{ id:"P5", type:"single", noMiss:true,
  t:{ en:"Direct access to administrative or financial records relevant to your answers.",
      fr:"Accès direct aux documents administratifs ou financiers pertinents pour vos réponses.",
      ar:"الاطّلاع المباشر على السجلات الإدارية أو المالية ذات الصلة بإجاباتكم." },
  opts:[
   { v:"none", t:{ en:"None, professional experience only", fr:"Aucun, expérience professionnelle uniquement", ar:"لا يوجد، خبرة مهنية فقط" } },
   { v:"ind", t:{ en:"Indirect (published reports, briefings)", fr:"Indirect (rapports publiés, notes d'information)", ar:"غير مباشر (تقارير منشورة، إحاطات)" } },
   { v:"part", t:{ en:"Direct but partial (own unit's records)", fr:"Direct mais partiel (documents de ma propre unité)", ar:"مباشر لكن جزئي (سجلات وحدتي فقط)" } },
   { v:"full", t:{ en:"Direct and full (primary records of the institution concerned)", fr:"Direct et complet (documents primaires de l'institution concernée)", ar:"مباشر وكامل (السجلات الأولية للمؤسسة المعنية)" } }
  ] },

{ id:"P6", type:"single", noMiss:true,
  t:{ en:"Years of relevant experience.", fr:"Années d'expérience pertinente.", ar:"سنوات الخبرة ذات الصلة." },
  opts:[
   { v:"u2", t:{ en:"Under 2 years", fr:"Moins de 2 ans", ar:"أقل من سنتين" } },
   { v:"2_5", t:{ en:"2-5 years", fr:"2 à 5 ans", ar:"من 2 إلى 5 سنوات" } },
   { v:"6_10", t:{ en:"6-10 years", fr:"6 à 10 ans", ar:"من 6 إلى 10 سنوات" } },
   { v:"11_20", t:{ en:"11-20 years", fr:"11 à 20 ans", ar:"من 11 إلى 20 سنة" } },
   { v:"o20", t:{ en:"More than 20 years", fr:"Plus de 20 ans", ar:"أكثر من 20 سنة" } }
  ] }
],

core: [
// ---- G1 Legal and institutional foundations ----
{ id:"A1", group:"G1", tag:"FACT", type:"single",
  t:{ en:"Does your country have a National Quality Policy (NQP) or an equivalent national QI strategy?",
      fr:"Votre pays dispose-t-il d'une Politique nationale de la qualité (PNQ) ou d'une stratégie nationale équivalente pour l'infrastructure de la qualité ?",
      ar:"هل لدى بلدكم سياسة وطنية للجودة أو استراتيجية وطنية معادلة للبنية التحتية للجودة؟" },
  opts:[
   { v:"inforce", t:{ en:"Yes, adopted and in force", fr:"Oui, adoptée et en vigueur", ar:"نعم، معتمدة وسارية" },
     fu:{ key:"year", kind:"year", t:{ en:"Year adopted", fr:"Année d'adoption", ar:"سنة الاعتماد" } } },
   { v:"draft", t:{ en:"Under development or being drafted", fr:"En cours d'élaboration ou de rédaction", ar:"قيد الإعداد أو الصياغة" } },
   { v:"none", t:{ en:"No formal NQP exists", fr:"Aucune politique nationale formelle de la qualité", ar:"لا توجد سياسة وطنية رسمية للجودة" } }
  ] },

{ id:"A2", group:"G1", tag:"FACT", type:"matrix",
  t:{ en:"Which of the following laws are currently in force? One answer per row.",
      fr:"Parmi les lois suivantes, lesquelles sont actuellement en vigueur ? Une réponse par ligne.",
      ar:"أيٌّ من القوانين التالية ساري المفعول حالياً؟ إجابة واحدة لكل سطر." },
  rows:[
   { v:"std", t:{ en:"Standards act or law", fr:"Loi sur la normalisation", ar:"قانون المواصفات والتقييس" } },
   { v:"met", t:{ en:"Metrology or legal metrology law", fr:"Loi sur la métrologie ou la métrologie légale", ar:"قانون المترولوجيا أو المترولوجيا القانونية" } },
   { v:"acc", t:{ en:"Accreditation law or regulation", fr:"Loi ou règlement sur l'accréditation", ar:"قانون أو لائحة الاعتماد" } },
   { v:"tr", t:{ en:"Technical regulation framework law", fr:"Loi-cadre sur la réglementation technique", ar:"القانون الإطاري للوائح الفنية" } },
   { v:"cp", t:{ en:"Consumer protection or product safety law", fr:"Loi sur la protection des consommateurs ou la sécurité des produits", ar:"قانون حماية المستهلك أو سلامة المنتجات" } },
   { v:"levy", t:{ en:"Provisions creating earmarked levies or revenue retention rights for QI institutions", fr:"Dispositions créant des prélèvements affectés ou des droits de rétention de recettes pour les institutions de l'IQ", ar:"أحكام تُنشئ رسوماً مخصصة أو حقوق احتفاظ بالإيرادات لمؤسسات البنية التحتية للجودة" } }
  ],
  cols:[
   { v:"inforce", t:{ en:"In force", fr:"En vigueur", ar:"ساري" } },
   { v:"draft", t:{ en:"Drafted, not yet adopted", fr:"Rédigée, non encore adoptée", ar:"تمت صياغته ولم يُعتمد بعد" } },
   { v:"absent", t:{ en:"Absent", fr:"Inexistante", ar:"غير موجود" } }
  ] },

{ id:"A3", group:"G1", tag:"FACT", type:"matrix",
  t:{ en:"Current status of the core national QI institutions. One answer per row.",
      fr:"Statut actuel des principales institutions nationales de l'infrastructure de la qualité. Une réponse par ligne.",
      ar:"الوضع الحالي للمؤسسات الوطنية الأساسية للبنية التحتية للجودة. إجابة واحدة لكل سطر." },
  rows:[
   { v:"nsb", t:{ en:"National standards body", fr:"Organisme national de normalisation", ar:"الهيئة الوطنية للمواصفات" } },
   { v:"nmi", t:{ en:"National metrology institute", fr:"Institut national de métrologie", ar:"المعهد الوطني للمترولوجيا" } },
   { v:"lm", t:{ en:"Legal metrology authority", fr:"Autorité de métrologie légale", ar:"هيئة المترولوجيا القانونية" } },
   { v:"nab", t:{ en:"National accreditation body or focal point", fr:"Organisme national d'accréditation ou point focal", ar:"هيئة الاعتماد الوطنية أو نقطة الاتصال" } },
   { v:"cabs", t:{ en:"Public testing, certification or inspection bodies", fr:"Organismes publics d'essais, de certification ou d'inspection", ar:"جهات عامة للاختبار أو إصدار الشهادات أو التفتيش" } },
   { v:"msv", t:{ en:"Market surveillance authority", fr:"Autorité de surveillance du marché", ar:"هيئة مراقبة السوق" } },
   { v:"council", t:{ en:"National QI coordination body or council", fr:"Organe ou conseil national de coordination de l'IQ", ar:"مجلس أو جهاز وطني لتنسيق البنية التحتية للجودة" } }
  ],
  cols:[
   { v:"op", t:{ en:"Operational", fr:"Opérationnelle", ar:"عاملة" } },
   { v:"lim", t:{ en:"Exists, limited capacity", fr:"Existe, capacité limitée", ar:"موجودة بقدرات محدودة" } },
   { v:"law", t:{ en:"In law, not operational", fr:"Prévue par la loi, non opérationnelle", ar:"منصوص عليها قانوناً وغير عاملة" } },
   { v:"absent", t:{ en:"Absent", fr:"Inexistante", ar:"غير موجودة" } },
   { v:"ext", t:{ en:"Provided regionally or from abroad", fr:"Fonction assurée au niveau régional ou depuis l'étranger", ar:"تُوفَّر إقليمياً أو من الخارج" } }
  ] },

{ id:"A4", group:"G1", tag:"FACT", type:"single",
  t:{ en:"Is there a formal national mechanism that coordinates QI policy, financing and investment planning (a national quality council or inter-ministerial committee)?",
      fr:"Existe-t-il un mécanisme national formel de coordination des politiques, du financement et de la planification des investissements de l'IQ (conseil national de la qualité ou comité interministériel) ?",
      ar:"هل توجد آلية وطنية رسمية لتنسيق سياسات البنية التحتية للجودة وتمويلها وتخطيط استثماراتها (مجلس وطني للجودة أو لجنة وزارية مشتركة)؟" },
  opts:[
   { v:"reg", t:{ en:"Yes, established and meeting regularly", fr:"Oui, établi et se réunissant régulièrement", ar:"نعم، قائمة وتجتمع بانتظام" } },
   { v:"rare", t:{ en:"Yes, established but rarely meets", fr:"Oui, établi mais se réunissant rarement", ar:"نعم، قائمة لكنها نادراً ما تجتمع" } },
   { v:"plan", t:{ en:"Planned or under establishment", fr:"Prévu ou en cours de création", ar:"مخطَّط لها أو قيد الإنشاء" } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },

// ---- G2 Funding today ----
{ id:"A5", group:"G2", tag:"ESTIMATE", type:"composition", sum:100,
  t:{ en:"Approximate composition of your institution's funding in the most recent closed fiscal year (ministries answer for the QI institutions they oversee, taken together). Percentages must total 100.",
      fr:"Composition approximative du financement de votre institution au cours du dernier exercice budgétaire clos (les ministères répondent pour l'ensemble des institutions de l'IQ qu'ils supervisent). Le total doit être égal à 100 %.",
      ar:"التركيبة التقريبية لتمويل مؤسستكم في آخر سنة مالية مُقفلة (تجيب الوزارات عن مجموع مؤسسات البنية التحتية للجودة الخاضعة لإشرافها). يجب أن يبلغ المجموع 100%." },
  rows:[
   { v:"gov", t:{ en:"Government budget transfers", fr:"Transferts du budget de l'État", ar:"تحويلات الموازنة الحكومية" } },
   { v:"fees", t:{ en:"Service fees and earned income", fr:"Redevances de services et recettes propres", ar:"رسوم الخدمات والإيرادات المكتسبة" } },
   { v:"levy", t:{ en:"Earmarked levies and statutory charges", fr:"Prélèvements affectés et redevances légales", ar:"الرسوم المخصصة والاقتطاعات القانونية" } },
   { v:"donor", t:{ en:"Donor grants and concessional finance", fr:"Dons des bailleurs et financements concessionnels", ar:"منح الجهات المانحة والتمويل الميسَّر" } },
   { v:"priv", t:{ en:"Private, commercial and other sources", fr:"Sources privées, commerciales et autres", ar:"مصادر خاصة وتجارية وأخرى" } }
  ] },

{ id:"A6", group:"G2", tag:"ESTIMATE", type:"single",
  t:{ en:"In real terms (after inflation), how has this financing changed over the past five fiscal years?",
      fr:"En termes réels (après inflation), comment ce financement a-t-il évolué au cours des cinq derniers exercices ?",
      ar:"بالقيمة الحقيقية (بعد التضخم)، كيف تغيّر هذا التمويل خلال السنوات المالية الخمس الأخيرة؟" },
  opts:[
   { v:"d20", t:{ en:"Decreased by more than 20 percent", fr:"Baisse de plus de 20 %", ar:"انخفض بأكثر من 20%" } },
   { v:"d5", t:{ en:"Decreased by 5-20 percent", fr:"Baisse de 5 à 20 %", ar:"انخفض بنسبة 5-20%" } },
   { v:"flat", t:{ en:"Broadly stable (within 5 percent)", fr:"Globalement stable (à 5 % près)", ar:"مستقر عموماً (في حدود 5%)" } },
   { v:"u5", t:{ en:"Increased by 5-20 percent", fr:"Hausse de 5 à 20 %", ar:"ارتفع بنسبة 5-20%" } },
   { v:"u20", t:{ en:"Increased by more than 20 percent", fr:"Hausse de plus de 20 %", ar:"ارتفع بأكثر من 20%" } }
  ] },

{ id:"A7", group:"G2", tag:"ESTIMATE", type:"single",
  t:{ en:"Approximate annual operating budget of your institution, most recent closed fiscal year (USD equivalent).",
      fr:"Budget de fonctionnement annuel approximatif de votre institution, dernier exercice clos (équivalent USD).",
      ar:"الموازنة التشغيلية السنوية التقريبية لمؤسستكم في آخر سنة مالية مُقفلة (بما يعادلها بالدولار الأمريكي)." },
  opts:[
   { v:"b1", t:{ en:"Under 100,000", fr:"Moins de 100 000", ar:"أقل من 100,000" } },
   { v:"b2", t:{ en:"100,000 to 500,000", fr:"100 000 à 500 000", ar:"من 100,000 إلى 500,000" } },
   { v:"b3", t:{ en:"500,001 to 2 million", fr:"500 001 à 2 millions", ar:"من 500,001 إلى مليونين" } },
   { v:"b4", t:{ en:"2 to 5 million", fr:"2 à 5 millions", ar:"من 2 إلى 5 ملايين" } },
   { v:"b5", t:{ en:"5 to 20 million", fr:"5 à 20 millions", ar:"من 5 إلى 20 مليوناً" } },
   { v:"b6", t:{ en:"Above 20 million", fr:"Plus de 20 millions", ar:"أكثر من 20 مليوناً" } }
  ] },

{ id:"A8", group:"G2", tag:"FACT", type:"single",
  t:{ en:"What share of the budget approved for your institution was actually released in the most recent closed fiscal year?",
      fr:"Quelle part du budget approuvé pour votre institution a été effectivement décaissée au cours du dernier exercice clos ?",
      ar:"ما نسبة الموازنة المعتمدة لمؤسستكم التي صُرفت فعلياً في آخر سنة مالية مُقفلة؟" },
  opts:[
   { v:"u50", t:{ en:"Under 50 percent", fr:"Moins de 50 %", ar:"أقل من 50%" } },
   { v:"50_74", t:{ en:"50-74 percent", fr:"50 à 74 %", ar:"من 50% إلى 74%" } },
   { v:"75_89", t:{ en:"75-89 percent", fr:"75 à 89 %", ar:"من 75% إلى 89%" } },
   { v:"90_100", t:{ en:"90-100 percent", fr:"90 à 100 %", ar:"من 90% إلى 100%" } }
  ] },

// ---- G3 Adequacy and gaps ----
{ id:"A9", group:"G3", tag:"PERCEPTION", type:"scale",
  t:{ en:"Overall, how severely does financing constrain the development of QI in your country today?",
      fr:"Globalement, dans quelle mesure le financement freine-t-il aujourd'hui le développement de l'IQ dans votre pays ?",
      ar:"إجمالاً، إلى أي مدى يقيّد التمويل اليوم تطوير البنية التحتية للجودة في بلدكم؟" },
  pts:[
   { v:1, t:{ en:"1 Not a constraint", fr:"1 Pas une contrainte", ar:"1 لا يشكّل قيداً" } },
   { v:2, t:{ en:"2 Minor constraint", fr:"2 Contrainte mineure", ar:"2 قيد طفيف" } },
   { v:3, t:{ en:"3 Moderate constraint", fr:"3 Contrainte modérée", ar:"3 قيد متوسط" } },
   { v:4, t:{ en:"4 Serious constraint", fr:"4 Contrainte sérieuse", ar:"4 قيد شديد" } },
   { v:5, t:{ en:"5 Binding constraint, it prevents core functions from operating", fr:"5 Contrainte bloquante, elle empêche le fonctionnement des fonctions essentielles", ar:"5 قيد حاسم يمنع عمل الوظائف الأساسية" } }
  ] },

{ id:"A10", group:"G3", tag:"PERCEPTION", type:"matrix", scaleCols:true,
  t:{ en:"Rate the current national capacity to deliver internationally recognized QI services. One rating per row. 1 = Very inadequate, 5 = Fully adequate.",
      fr:"Évaluez la capacité nationale actuelle à fournir des services d'IQ reconnus à l'international. Une note par ligne. 1 = Très insuffisante, 5 = Pleinement suffisante.",
      ar:"قيّموا القدرة الوطنية الحالية على تقديم خدمات بنية تحتية للجودة معترف بها دولياً. تقييم واحد لكل سطر. 1 = غير كافية إطلاقاً، 5 = كافية تماماً." },
  rows:[
   { v:"std", t:{ en:"Standardization", fr:"Normalisation", ar:"التقييس" } },
   { v:"met", t:{ en:"Metrology", fr:"Métrologie", ar:"المترولوجيا" } },
   { v:"acc", t:{ en:"Accreditation", fr:"Accréditation", ar:"الاعتماد" } },
   { v:"tst", t:{ en:"Testing", fr:"Essais", ar:"الاختبارات" } },
   { v:"crt", t:{ en:"Certification", fr:"Certification", ar:"إصدار الشهادات" } },
   { v:"ins", t:{ en:"Inspection", fr:"Inspection", ar:"التفتيش" } },
   { v:"msv", t:{ en:"Market surveillance", fr:"Surveillance du marché", ar:"مراقبة السوق" } }
  ],
  cols:[
   { v:1, t:{ en:"1", fr:"1", ar:"1" } }, { v:2, t:{ en:"2", fr:"2", ar:"2" } }, { v:3, t:{ en:"3", fr:"3", ar:"3" } }, { v:4, t:{ en:"4", fr:"4", ar:"4" } }, { v:5, t:{ en:"5", fr:"5", ar:"5" } }
  ] },

{ id:"A11", group:"G3", tag:"PERCEPTION", type:"rank", k:3,
  t:{ en:"Which investment needs are most critical for the next 3-5 years? Rank your top 3 (1 = most critical).",
      fr:"Quels besoins d'investissement sont les plus critiques pour les 3 à 5 prochaines années ? Classez vos 3 premiers (1 = le plus critique).",
      ar:"ما أكثر الاحتياجات الاستثمارية أهمية للسنوات الثلاث إلى الخمس المقبلة؟ رتّبوا أهم ثلاثة (1 = الأكثر أهمية)." },
  opts:[
   { v:"lab", t:{ en:"Laboratory equipment and instruments", fr:"Équipements et instruments de laboratoire", ar:"معدات وأجهزة المختبرات" } },
   { v:"crm", t:{ en:"Reference standards and certified reference materials", fr:"Étalons de référence et matériaux de référence certifiés", ar:"المعايير المرجعية والمواد المرجعية المعتمدة" } },
   { v:"infra", t:{ en:"Physical infrastructure (buildings, utilities)", fr:"Infrastructures physiques (bâtiments, réseaux)", ar:"البنية المادية (مبانٍ ومرافق)" } },
   { v:"ict", t:{ en:"ICT systems and digital infrastructure", fr:"Systèmes informatiques et infrastructure numérique", ar:"نظم المعلومات والبنية الرقمية" } },
   { v:"hr", t:{ en:"Staff capacity building and training", fr:"Renforcement des capacités et formation du personnel", ar:"بناء قدرات الموظفين وتدريبهم" } },
   { v:"intl", t:{ en:"International accreditation and peer evaluation", fr:"Accréditation internationale et évaluation par les pairs", ar:"الاعتماد الدولي وتقييم الأقران" } },
   { v:"qms", t:{ en:"Quality management system implementation", fr:"Mise en place de systèmes de management de la qualité", ar:"تطبيق نظم إدارة الجودة" } },
   { v:"aware", t:{ en:"Outreach and awareness programmes", fr:"Programmes de sensibilisation et de communication", ar:"برامج التوعية والتواصل" } }
  ] },

{ id:"A12", group:"G3", tag:"ESTIMATE", type:"single",
  t:{ en:"Estimated total funding gap for those investments (USD equivalent).",
      fr:"Déficit de financement total estimé pour ces investissements (équivalent USD).",
      ar:"الفجوة التمويلية الإجمالية المقدَّرة لهذه الاستثمارات (بما يعادلها بالدولار الأمريكي)." },
  opts:[
   { v:"g1", t:{ en:"Under 500,000", fr:"Moins de 500 000", ar:"أقل من 500,000" } },
   { v:"g2", t:{ en:"500,000 to 2 million", fr:"500 000 à 2 millions", ar:"من 500,000 إلى مليونين" } },
   { v:"g3", t:{ en:"2 to 5 million", fr:"2 à 5 millions", ar:"من 2 إلى 5 ملايين" } },
   { v:"g4", t:{ en:"5 to 20 million", fr:"5 à 20 millions", ar:"من 5 إلى 20 مليوناً" } },
   { v:"g5", t:{ en:"Above 20 million", fr:"Plus de 20 millions", ar:"أكثر من 20 مليوناً" } },
   { v:"une", t:{ en:"Unable to estimate", fr:"Impossible à estimer", ar:"يتعذر التقدير" } }
  ] },

// ---- G4 MSMEs and demand ----
{ id:"A13", group:"G4", tag:"PERCEPTION", type:"scale",
  t:{ en:"How affordable are QI services for micro, small and medium enterprises (MSMEs) in your country? 1 = Very inadequate (unaffordable), 5 = Fully adequate.",
      fr:"Dans quelle mesure les services d'IQ sont-ils financièrement accessibles aux micro, petites et moyennes entreprises (MPME) de votre pays ? 1 = Très insuffisant (inabordable), 5 = Pleinement satisfaisant.",
      ar:"إلى أي مدى تُعدّ خدمات البنية التحتية للجودة ميسورة التكلفة للمنشآت الصغرى والصغيرة والمتوسطة في بلدكم؟ 1 = غير ميسورة إطلاقاً، 5 = ميسورة تماماً." },
  pts:[
   { v:1, t:{ en:"1 Very inadequate", fr:"1 Très insuffisant", ar:"1 غير ميسورة إطلاقاً" } },
   { v:2, t:{ en:"2 Inadequate", fr:"2 Insuffisant", ar:"2 غير ميسورة" } },
   { v:3, t:{ en:"3 Partially adequate", fr:"3 Partiellement satisfaisant", ar:"3 ميسورة جزئياً" } },
   { v:4, t:{ en:"4 Adequate", fr:"4 Satisfaisant", ar:"4 ميسورة" } },
   { v:5, t:{ en:"5 Fully adequate", fr:"5 Pleinement satisfaisant", ar:"5 ميسورة تماماً" } }
  ] },

{ id:"A14", group:"G4", tag:"PERCEPTION", type:"single",
  t:{ en:"In the past three years, have QI gaps (missing tests, certificates or accreditations) caused export rejections, border delays or lost contracts for firms you know of?",
      fr:"Au cours des trois dernières années, des lacunes de l'IQ (essais, certificats ou accréditations manquants) ont-elles causé des rejets à l'exportation, des retards aux frontières ou des pertes de contrats pour des entreprises que vous connaissez ?",
      ar:"خلال السنوات الثلاث الماضية، هل تسببت فجوات البنية التحتية للجودة (نقص الاختبارات أو الشهادات أو الاعتماد) في رفض صادرات أو تأخيرات حدودية أو خسارة عقود لشركات تعرفونها؟" },
  opts:[
   { v:"rep", t:{ en:"Yes, repeatedly", fr:"Oui, de façon répétée", ar:"نعم، بشكل متكرر" },
     fu:{ key:"sect", kind:"text", t:{ en:"Sector(s) and destination market(s)", fr:"Secteur(s) et marché(s) de destination", ar:"القطاعات وأسواق الوجهة" } } },
   { v:"occ", t:{ en:"Yes, occasionally", fr:"Oui, occasionnellement", ar:"نعم، أحياناً" },
     fu:{ key:"sect", kind:"text", t:{ en:"Sector(s) and destination market(s)", fr:"Secteur(s) et marché(s) de destination", ar:"القطاعات وأسواق الوجهة" } } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },

{ id:"A15", group:"G4", tag:"PERCEPTION", type:"rank", k:3,
  t:{ en:"What most prevents firms from using QI services? Rank your top 3 (1 = biggest barrier).",
      fr:"Qu'est-ce qui empêche le plus les entreprises d'utiliser les services d'IQ ? Classez vos 3 premiers obstacles (1 = le plus important).",
      ar:"ما أكثر ما يمنع الشركات من استخدام خدمات البنية التحتية للجودة؟ رتّبوا أهم ثلاثة عوائق (1 = الأكبر)." },
  opts:[
   { v:"cost", t:{ en:"Cost of services", fr:"Coût des services", ar:"تكلفة الخدمات" } },
   { v:"dist", t:{ en:"Distance or limited geographic coverage", fr:"Distance ou couverture géographique limitée", ar:"البُعد الجغرافي أو محدودية التغطية" } },
   { v:"aware", t:{ en:"Low awareness of available services", fr:"Faible connaissance des services disponibles", ar:"ضعف الوعي بالخدمات المتاحة" } },
   { v:"slow", t:{ en:"Slow turnaround times", fr:"Délais de traitement trop longs", ar:"بطء مدد الإنجاز" } },
   { v:"noacc", t:{ en:"Lack of locally accredited services (tests must be done abroad)", fr:"Absence de services accrédités localement (essais à réaliser à l'étranger)", ar:"غياب خدمات معتمدة محلياً (تُجرى الاختبارات في الخارج)" } },
   { v:"doc", t:{ en:"Complex documentation and procedures", fr:"Documentation et procédures complexes", ar:"تعقيد المستندات والإجراءات" } },
   { v:"benefit", t:{ en:"Low perceived benefit", fr:"Bénéfice perçu comme faible", ar:"ضعف الجدوى المتصوَّرة" } },
   { v:"fin", t:{ en:"Difficulty financing compliance costs", fr:"Difficulté à financer les coûts de mise en conformité", ar:"صعوبة تمويل تكاليف الامتثال" } }
  ] },

// ---- G5 Solutions and priorities ----
{ id:"A16", group:"G5", tag:"PERCEPTION", type:"rank", k:3,
  t:{ en:"Which financing modalities would be most appropriate for QI in your country? Rank your top 3.",
      fr:"Quelles modalités de financement seraient les plus appropriées pour l'IQ dans votre pays ? Classez vos 3 premières.",
      ar:"ما أنسب صيغ التمويل للبنية التحتية للجودة في بلدكم؟ رتّبوا أهم ثلاث صيغ." },
  opts:[
   { v:"grant", t:{ en:"Grants", fr:"Dons", ar:"المنح" } },
   { v:"conc", t:{ en:"Concessional loans", fr:"Prêts concessionnels", ar:"القروض الميسَّرة" } },
   { v:"ta", t:{ en:"Technical assistance and in-kind support", fr:"Assistance technique et appui en nature", ar:"المساعدة الفنية والدعم العيني" } },
   { v:"rbf", t:{ en:"Results-based financing", fr:"Financement basé sur les résultats", ar:"التمويل القائم على النتائج" } },
   { v:"ppp", t:{ en:"Public-private partnerships", fr:"Partenariats public-privé", ar:"الشراكات بين القطاعين العام والخاص" } },
   { v:"rev", t:{ en:"Revolving funds or endowments", fr:"Fonds renouvelables ou dotations", ar:"الصناديق الدوّارة أو الأوقاف التمويلية" } },
   { v:"blend", t:{ en:"Blended finance structures", fr:"Montages de financement mixte", ar:"هياكل التمويل المختلط" } },
   { v:"guar", t:{ en:"Guarantees and risk-sharing instruments", fr:"Garanties et instruments de partage des risques", ar:"الضمانات وأدوات تقاسم المخاطر" } }
  ] },

{ id:"A17", group:"G5", tag:"FACT", type:"single",
  t:{ en:"Does the legal framework allow QI institutions to retain and reinvest their own revenues?",
      fr:"Le cadre juridique permet-il aux institutions de l'IQ de conserver et de réinvestir leurs recettes propres ?",
      ar:"هل يسمح الإطار القانوني لمؤسسات البنية التحتية للجودة بالاحتفاظ بإيراداتها الذاتية وإعادة استثمارها؟" },
  opts:[
   { v:"most", t:{ en:"Yes, for most QI institutions", fr:"Oui, pour la plupart des institutions", ar:"نعم، لمعظم المؤسسات" } },
   { v:"some", t:{ en:"Yes, for some specified institutions", fr:"Oui, pour certaines institutions désignées", ar:"نعم، لبعض المؤسسات المحددة" } },
   { v:"no", t:{ en:"No", fr:"Non", ar:"لا" } }
  ] },

{ id:"A18", group:"G5", tag:"PERCEPTION", type:"combo",
  t:{ en:"What is the single most urgent action needed to improve QI financing in your country, and who should lead it? You may add one further action.",
      fr:"Quelle est l'action la plus urgente pour améliorer le financement de l'IQ dans votre pays, et qui devrait la conduire ? Vous pouvez ajouter une seconde action.",
      ar:"ما الإجراء الأكثر إلحاحاً لتحسين تمويل البنية التحتية للجودة في بلدكم، ومن ينبغي أن يقوده؟ يمكنكم إضافة إجراء ثانٍ." },
  parts:[
   { key:"act1", type:"text", t:{ en:"Action 1", fr:"Action 1", ar:"الإجراء الأول" } },
   { key:"actor1", type:"single", t:{ en:"Lead actor for action 1", fr:"Acteur chef de file de l'action 1", ar:"الجهة القائدة للإجراء الأول" },
     opts:[
      { v:"parl", t:{ en:"Parliament", fr:"Parlement", ar:"البرلمان" } },
      { v:"mof", t:{ en:"Ministry of finance", fr:"Ministère des finances", ar:"وزارة المالية" } },
      { v:"moi", t:{ en:"Ministry of industry or trade", fr:"Ministère de l'industrie ou du commerce", ar:"وزارة الصناعة أو التجارة" } },
      { v:"qi", t:{ en:"QI institutions themselves", fr:"Les institutions de l'IQ elles-mêmes", ar:"مؤسسات البنية التحتية للجودة نفسها" } },
      { v:"cb", t:{ en:"Central bank or financial regulator", fr:"Banque centrale ou régulateur financier", ar:"البنك المركزي أو الجهة الرقابية المالية" } },
      { v:"ps", t:{ en:"Private sector", fr:"Secteur privé", ar:"القطاع الخاص" } },
      { v:"dp", t:{ en:"Development partners", fr:"Partenaires au développement", ar:"الشركاء الإنمائيون" } },
      { v:"reg", t:{ en:"Regional bodies (AU, RECs)", fr:"Organisations régionales (UA, CER)", ar:"الهيئات الإقليمية (الاتحاد الأفريقي، التجمعات الاقتصادية)" } }
     ] },
   { key:"act2", type:"text", optional:true, t:{ en:"Action 2 (optional)", fr:"Action 2 (facultative)", ar:"الإجراء الثاني (اختياري)" } },
   { key:"actor2", type:"single", optional:true, t:{ en:"Lead actor for action 2 (optional)", fr:"Acteur chef de file de l'action 2 (facultatif)", ar:"الجهة القائدة للإجراء الثاني (اختياري)" }, optsFrom:"actor1" }
  ] },

{ id:"A19", group:"G5", tag:"PERCEPTION", type:"rank", k:3,
  t:{ en:"Which value chains should QI investments prioritize in your country? Rank your top 3.",
      fr:"Quelles chaînes de valeur les investissements d'IQ devraient-ils privilégier dans votre pays ? Classez vos 3 premières.",
      ar:"ما سلاسل القيمة التي ينبغي أن تحظى بأولوية استثمارات البنية التحتية للجودة في بلدكم؟ رتّبوا أهم ثلاث سلاسل." },
  opts:[
   { v:"agri", t:{ en:"Agri-food and agro-processing", fr:"Agroalimentaire et transformation agricole", ar:"الأغذية الزراعية والتصنيع الزراعي" } },
   { v:"fish", t:{ en:"Fisheries and aquaculture", fr:"Pêche et aquaculture", ar:"مصايد الأسماك وتربية الأحياء المائية" } },
   { v:"pharma", t:{ en:"Pharmaceuticals and health products", fr:"Produits pharmaceutiques et de santé", ar:"المستحضرات الصيدلانية والمنتجات الصحية" } },
   { v:"tex", t:{ en:"Textiles, garments and leather", fr:"Textile, habillement et cuir", ar:"المنسوجات والملابس والجلود" } },
   { v:"cons", t:{ en:"Construction materials", fr:"Matériaux de construction", ar:"مواد البناء" } },
   { v:"energy", t:{ en:"Renewable energy and energy efficiency", fr:"Énergies renouvelables et efficacité énergétique", ar:"الطاقة المتجددة وكفاءة الطاقة" } },
   { v:"digital", t:{ en:"Digital and ICT services", fr:"Services numériques et TIC", ar:"الخدمات الرقمية وتكنولوجيا المعلومات" } },
   { v:"mining", t:{ en:"Mining and critical minerals", fr:"Mines et minéraux critiques", ar:"التعدين والمعادن الحرجة" } },
   { v:"mach", t:{ en:"Machinery, automotive and electronics", fr:"Machines, automobile et électronique", ar:"الآلات والسيارات والإلكترونيات" } }
  ] }
]
};
