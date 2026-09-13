# Medora — research Mediately și oportunitatea din România

**12 septembrie 2026 · Research public + prototip interactiv**

**Recomandare:** pornește cu un catalog gratuit și un radar personalizat de discontinuități, retrageri și modificări. Monetizarea poate veni din monitorizare, colaborare și integrarea în fluxul clinic. O simplă bază de medicamente sau un chat AI ar intra direct în oferta existentă Mediately.

[Pagina publică de pornire](index.html) · [Dashboard Medora](medora.html) · [Inventarul instrumentelor](instrumente-mediately.csv)

## 1. Ce am verificat și limitele inventarului

Am inspectat site-ul românesc, catalogul public de instrumente, pagina unei fișe de medicament, FAQ-ul indexat, listările iOS/Android, oferta PRO, paginile pharma, licențierea datelor și sursele ANMDMR/EMA. Unele pagini au refuzat accesul instrumentului web; pagina principală și instrumentele au fost verificate și în browser.

Inventarul acoperă **funcțiile publice identificate**, nu un audit al fiecărui ecran din aplicațiile instalate sau al funcțiilor accesibile exclusiv după plată. „Confirmat” înseamnă prezent în produsul web ori declarat explicit într-o sursă oficială. „Neconfirmat” nu înseamnă „inexistent”. Nu am cumpărat PRO și nu am creat conturi.

Sursele diferă uneori: aplicația este promovată în 14 țări, oferta API în 13; paginile comerciale prezintă totaluri diferite de instrumente și utilizatori. Nu le-am transformat într-o singură cifră presupus exactă. [Mediately România](https://mediately.co/ro/) · [Data licensing](https://mediately.co/ro/data-licensing)

## 2. Inventar funcțional Mediately

### A. Catalog și informații despre medicamente

| Funcție | Ce oferă | Acces / confirmare |
|---|---|---|
| Catalog local | Medicamente înregistrate în România | Bază gratuită declarată |
| Căutare | Acces rapid la produse și informații medicamentoase | Web + aplicație |
| Identitate produs | Substanță activă, compoziție, formă, clasă | Confirmat |
| RCP structurat | Indicații, doze, contraindicații, reacții adverse, interacțiuni, supradozaj | Confirmat |
| RCP original | Document PDF integral | Internet necesar pentru PDF, conform listării Android |
| Clasificare ATC | Navigare farmacologică | Confirmat |
| Medicamente similare | Produse asociate clasificării | Confirmat; nu echivalează automat cu substituție |
| Ambalaje și prețuri | Informații pentru prezentări | Confirmat; nu reprezintă stoc live |
| Compensare | Informații despre rambursare | Confirmat |

Sursa pentru acest grup: [Google Play — descrierea oficială](https://play.google.com/store/apps/details?hl=ro&id=com.mediately.drugs.ro).

| Funcție locală suplimentară | Ce am găsit | Dovadă |
|---|---|---|
| Regim de eliberare | Exemplu PRF | Fișa publică Forxiga |
| Condiții de compensare | Dependență de diagnostic și tip de rețetă | Fișa publică Forxiga |
| Continuarea prescrierii de medicul de familie | Trimitere la protocolul terapeutic | Fișa publică Forxiga |
| Protocoale terapeutice | Secțiune asociată medicamentului | Fișa publică Forxiga |
| Instrumente relevante pentru produs | Legături către algoritmi și scoruri | Fișa publică Forxiga |
| Adăugare în lista de interacțiuni | Acțiune directă din fișă | Fișa publică Forxiga |

Acestea sunt observate pe un exemplu; nu presupun aceeași acoperire pentru fiecare produs. [Fișa Forxiga](https://mediately.co/ro/drugs/4olDRgSSKo84CFGuLceffljjSfV/forxiga-10-mg-compr-film)

### B. Funcții avansate / PRO

| Funcție | Ce oferă | Observație |
|---|---|---|
| Verificarea interacțiunilor | Evaluarea combinațiilor de medicamente | PRO |
| Rezolvarea interacțiunilor | Sugestii de alternative cu mai puține interacțiuni | PRO |
| Introducere din fotografie | Captură de imagine pentru verificarea tratamentului | Declarată în oferta Business PRO |
| Interacțiuni extinse | Alimente, plante și suplimente | Declarate |
| Restricții rezumate | Funcție renală/hepatică, sarcină, alăptare | PRO |
| Scurtături pentru dozare | Copii, vârstnici, afectare renală/hepatică, administrare | PRO |
| Acces offline | Informații medicamentoase | Nu presupune AI offline |
| Bază de interacțiuni licențiată | Medbase / INXBASE | Furnizor declarat |

Sursa: [Business PRO România](https://info.mediately.co/ro/business-pro). Faptul că există un motor licențiat contează: nomenclatorul singur nu poate reproduce verificarea interacțiunilor.

| AI și servicii | Ce oferă | Observație |
|---|---|---|
| AI Mode / Elly | Întrebări conversaționale despre medicamente, bazate pe documente locale | Deja există |
| Căutare prin întrebare | Indicație, condiții speciale, clasă | Declarată în aplicație |
| AI cu acces extins | Răspunsuri nelimitate promovate în PRO | Limitele comerciale trebuie reverificate în cont |
| AI gratuit limitat | Cotă zilnică menționată de dezvoltator | Numărul exact nu este confirmat |
| Asistență prioritară | Inclusă în prezentarea PRO | Declarată pe pagina RO |

Surse: [Mediately RO](https://mediately.co/ro/), [PRO sponsorship](https://pharma.mediately.co/pro-sponsorship), [răspunsul dezvoltatorului în Google Play](https://play.google.com/store/apps/details?id=com.mediately.drugs.ro). **AI, interacțiuni și alternative nu sunt gaps.**

### C. Instrumente, educație și personalizare

| Funcție | Ce oferă | Confirmare |
|---|---|---|
| Calculatoare clinice | Parametri, estimări și scoruri | Catalog web inspectat |
| Calculatoare de dozare | Instrumente pentru anumite medicamente | Catalog web inspectat |
| Algoritmi și criterii | Diagnostic, stadializare, management | Catalog web inspectat |
| Organizare instrumente | Specialitate, indicație, dozare, noutăți | Controale vizibile în catalog |
| Colecții tematice | De exemplu dermatită atopică și cancer pulmonar | Catalog web inspectat |
| ICD-10 | Clasificarea bolilor | Web + ofertă gratuită |
| Cursuri și conținut | Cazuri clinice, video, articole | Pagina Cursuri |
| Personalizare după specialitate | Conținut adaptat profilului | Declarată la înscriere |
| Educație acreditată | EMC/CME în anumite piețe și programe | B2B declară acreditare în 7 țări |
| Favorite | Listă de medicamente favorite | Documentată în FAQ |
| Cont și administrare | Înregistrare, resetare parolă, specialitate, ștergere cont | Documentate în FAQ |

Surse: [Instrumente RO](https://mediately.co/ro/tools), [Cursuri RO](https://mediately.co/ro/cme), [FAQ](https://mediately.co/ro/docs/faq), [Soluții B2B](https://pharma.mediately.co/solutions).

**105 intrări distincte** identificate în catalogul public RO, inclusiv colecții și instrumente care includ mai multe scoruri. Lista cu nume scurte și linkuri se află în [CSV-ul anexat](instrumente-mediately.csv). Acest număr nu reprezintă 105 algoritmi validați de noi și nici totalul global. Acreditarea trebuie verificată pe curs; nu toate articolele sau videoclipurile oferă credite EMC în România.

### D. Platforme, distribuție și abonamente

| Componentă | Ce oferă / ce am verificat |
|---|---|
| Web | Căutare, fișe, instrumente, interacțiuni, AI și cursuri, cu acces diferit după cont/plan |
| iOS | Listare oficială pentru iPhone și iPad; la verificare cere iOS/iPadOS 18 |
| Android | Aplicație oficială, reclame și achiziții în aplicație |
| Gratuit + PRO | Model freemium; nomenclatorul ANMDMR nu este singura alternativă gratuită, Mediately are și el bază gratuită |
| Lunar / anual | Abonamente și variante de ofertă în magazine |
| Preț observat iOS RO | 29,99 lei/lună; 299,99 lei/an, alături de alte SKU-uri anuale și lunare |
| Trial | EULA descrie probă de 7 zile; condițiile și reînnoirea trebuie citite la checkout |
| Localizare | 14 țări în prezentarea aplicației; date și limbă locale |

Prețurile sunt cele afișate în listarea App Store, nu o ofertă verificată la checkout și nici prețul garantat pe Android/web. [App Store România](https://apps.apple.com/ro/app/mediately-lista-medicamentelor/id1210316461) · [Google Play](https://play.google.com/store/apps/details?hl=ro&id=com.mediately.drugs.ro) · [EULA RO](https://mediately.co/ro/docs/eula)

Țările listate pentru aplicație: Bulgaria, Cehia, Germania, Spania, Franța, Grecia, Croația, Ungaria, Italia, Polonia, România, Serbia, Slovenia, Slovacia. [Prezentarea RO](https://mediately.co/ro/)

### E. Parteneriate și venituri B2B

| Produs / serviciu | Ofertă publică |
|---|---|
| Publicitate | Bannere în ecranul principal, căutare și instrumente; pop-up-uri; conținut sponsorizat |
| Targetare | După țară și specialitate; audiență profesională verificată, conform Mediately |
| Sponsorizarea instrumentelor | Integrarea brandului în instrumente clinice |
| Educație sponsorizată | Campanii educaționale și conținut interactiv |
| Mediately Insights | Măsurarea audienței și rezultatelor campaniilor; dashboard în timp real |
| Raportare și consultanță de campanie | Rapoarte, exemple de rezultate, ofertă la cerere |

Surse: [Mediately pharma](https://pharma.mediately.co/), [Soluții](https://pharma.mediately.co/solutions), [pagina de informare B2B](https://info.mediately.co/en/). Cifrele de audiență și rezultatele campaniilor sunt afirmații comerciale ale companiei, nu măsurători independente.

| Extensie B2B / portofoliu | Ofertă publică |
|---|---|
| Business PRO | Licențe pentru clinici, farmacii și organizații |
| Sponsorizarea PRO | Partenerul alege piața și volumul; primește coduri de acces pentru medici |
| Data licensing / API | Date structurate: RCP, compensare, restricții, aprobări EMA și registre naționale |
| Acoperire API | 13 țări listate; Germania nu apare în acea listă |
| Digital Doctor | Sondaj recurent despre comportamentul medicilor, AI, prescriere și relația cu pharma |
| RheumaHelper | Aplicație separată, gratuită, de reumatologie: criterii și scoruri; declară 30+ instrumente, 6 limbi, prezență în 120+ țări |

Surse: [Business PRO](https://info.mediately.co/ro/business-pro), [PRO sponsorship](https://pharma.mediately.co/pro-sponsorship), [API](https://mediately.co/ro/data-licensing), [Digital Doctor](https://pharma.mediately.co/digital-doctor), [RheumaHelper](https://pharma.mediately.co/rheumahelper).

RheumaHelper include criterii pentru Still, sindrom antifosfolipidic, spondiloartrite, fibromialgie, gută, polimialgie, artrită psoriazică/reumatoidă, Sjögren, lupus și scleroză sistemică; scoruri ASDAS, BASDAI, BVAS, CDAI/SDAI, DAPSA, DAS28, PASI, SELENA-SLEDAI și indice de leziuni vasculitice. Este un produs distinct, nu confirmarea disponibilității acelorași module în Mediately RO. [RheumaHelper](https://pharma.mediately.co/rheumahelper)

## 3. Rolul nomenclatorului gratuit ANMDMR

Observația ta este corectă: medicul poate căuta gratuit denumire comercială, DCI, formă, ATC, CIM și deținător APP. Fișa include concentrație, prescripție, ambalaj, autorizație și legături către RCP/prospect. Există și export Excel. Pagina verificată afișa actualizarea din 01.09.2026. [Nomenclator ANMDMR](https://nomenclator.anm.ro/medicamente?page=1625)

**Implicație de produs:** accesul la aceleași rânduri nu justifică singur un abonament. Valoarea de testat este timpul economisit: căutare bună pe mobil, normalizare, legarea surselor, istoricul schimbărilor și notificări relevante. Catalogul poate fi gratuit; monitorizarea avansată și colaborarea pot fi plătite.

Accesul gratuit nu dovedește dreptul de redistribuire comercială, existența unui API public sau un SLA. Acestea rămân verificări contractuale înainte de ingestia de producție. Nomenclatorul dovedește statutul de autorizare, nu disponibilitatea la raft.

## 4. Gapul propus: radarul de disponibilitate

**Verdict: ipoteză puternică pentru MVP, nu unicitate demonstrată.** Nu am găsit o funcție public documentată Mediately care să combine listă urmărită, schimbări de disponibilitate pe prezentare, istoric și alerte proactive personalizate. Cercetarea publică nu exclude existența unor funcții în cont, aplicație sau piețe individuale.

Datele de pornire există: ANMDMR publică notificări ale deținătorilor APP despre întreruperi temporare sau permanente ale comercializării. Nu trebuie inventată o „predicție AI” când evenimentul a fost deja notificat. [Notificări ANMDMR](https://www.anm.ro/medicamente-de-uz-uman/autorizare-medicamente/notificari-discontinuitate-medicamente/)

Pentru întrebări privind lipsa unui medicament există și canalul oficial lipsamedicament@anm.ro. Acesta oferă un traseu de informare, nu o integrare automată de stoc. [ANMDMR — lipsa unui medicament](https://www.anm.ro/medicamente-de-uz-uman/informeaza-despre-lipsa-unui-medicament/)

### Evenimente care trebuie păstrate distincte

| Eveniment | Ce poate afirma produsul | Ce nu poate deduce |
|---|---|---|
| Discontinuitate temporară | Întrerupere notificată, cu interval dacă există | Lipsă în toate farmaciile |
| Discontinuitate permanentă | Încetarea comercializării notificată | Retragere pentru siguranță |
| Retragere / blocare de lot | Loturile și măsura exactă din document | Retragerea întregului brand |
| Suspendare / retragere APP | Statutul și decizia oficială | Un sinonim pentru lipsă de stoc |
| Reluarea comercializării | Revenire anunțată în documentul sursă | Disponibilitate imediată locală |
| Semnalare de la farmacie | Observație locală cu dată | Confirmare națională |
| Estimare de deficit | Predicție cu probabilitate și model validat | Certitudine sau notificare oficială |

Distincțiile sunt susținute de existența fluxurilor separate de discontinuitate, comunicări și măsuri asupra unor loturi. [ANMDMR — comunicate](https://www.anm.ro/agentie/comunicate-de-presa/) · [EMA — medicine shortage communications](https://www.ema.europa.eu/en/human-regulatory-overview/post-authorisation/medicine-shortages-availability-issues/medicine-shortage-communications-msc)

### Flux recomandat

1. Medicul urmărește o prezentare sau toate produsele unei DCI.
2. Serviciul citește versiunea nouă a sursei și păstrează documentul original.
3. Identifică produsul după cod național, DCI, concentrație, formă și ambalaj; potrivirile incerte merg la verificare.
4. Creează sau actualizează evenimentul. Separă data publicării de data intrării în vigoare.
5. Deduplică schimbările; trimite doar noutatea relevantă, cu link și ora ultimei verificări.
6. Medicul vede comparația administrativă a prezentărilor. Substituția terapeutică necesită alt nivel de validare.
7. O revenire ori corecție generează actualizare. Dispariția dintr-un fișier nu înseamnă automat „rezolvat”.

Avantajul greu de copiat ar fi istoricul curat, potrivirile corecte între surse și integrarea în activitatea medicului. Un email cu un PDF public este ușor de reprodus.

## 5. Gaps prioritizate

Evaluare de produs, nu fapte dovedite despre absența funcțiilor concurentului. P0 = prima versiune; P1 = după validare; P2 = investiție ulterioară.

| Oportunitate | Situație față de Mediately | Beneficiu | Prioritate / dependență |
|---|---|---|---|
| Radar personalizat de discontinuități și reveniri | Neconfirmat public | Medicul află înainte să repete o prescripție problematică | P0; ingestie și verificare editorială |
| Istoric cu sursă și versiuni | Neconfirmat ca flux complet | Explică exact ce s-a schimbat | P0; arhivare și comparație |
| Alerte de siguranță pe lot / produs urmărit | Flux personalizat neconfirmat | Reduce căutarea manuală a comunicărilor | P0/P1; mapare corectă, surse separate |
| Comparație administrativă: DCI, concentrație, formă, ambalaj, statut | Alternative există deja; combinația propusă rămâne de verificat | Reduce navigarea între prezentări | P0; nu recomanda substituție automată |
| Schimbări de RCP și protocoale, afișate ca diferențe | RCP/protocoale există; monitorizare neconfirmată | Medicul vede doar modificările | P1; versiuni și revizie clinică |
| Schimbări de compensare și reguli de prescriere | Informația curentă există; alerte/diff neconfirmate | Util în medicina de familie | P1; surse CNAS/MS și condiții detaliate |
| Stoc local cu data ultimei confirmări | Stoc live neconfirmat | Evită drumurile fără rezultat | P2; parteneriate cu farmacii/distribuitori |
| Formularul clinicii și liste partajate | Business PRO există; funcția specifică neconfirmată | Echipa urmărește aceleași produse | P1; roluri și audit |
| API de evenimente și webhooks | API de date există deja | Alerte direct în software-ul cabinetului | P1; diferențiere prin evenimente, nu prin eticheta API |
| Identificarea aceleiași substanțe în alte țări | Localizare existentă; flux transfrontalier neconfirmat | Sprijin pentru profesioniști și pacienți mobili | P2; identificatori, limbi și reguli locale |
| Experiență simplă fără presiune AI | Preferință de UX, nu funcție absentă | Căutare rapidă și încredere | P0; test cu utilizatori |

Idei de evitat ca poziționare principală: „avem AI”, „avem interacțiuni”, „avem calculatoare”, „avem API”, „avem aplicație mobilă”. Mediately oferă deja aceste categorii. Un preț mai mic este tactică, nu avantaj defensibil.

## 6. România → Europa → global

### Prima nișă și MVP

Ipoteză inițială: medici de familie și farmaciști care întâlnesc repetat probleme de disponibilitate în tratamente cronice. Verific-o prin 10–15 interviuri despre cazuri reale recente, nu prin întrebarea generală „ați folosi o astfel de aplicație?”.

**MVP:** catalog căutabil, fișă cu documente oficiale, urmărire pe produs/DCI, radar cu istoric, rezumat de alerte și comparație administrativă. Web responsive/PWA înaintea a două aplicații native separate. Mockul de față este HTML responsive; nu este încă PWA instalabilă.

**Ulterior:** aplicații iOS/Android pentru push și acces offline, extindere de conținut clinic, echipe și integrare. Un motor propriu de interacțiuni și recomandări terapeutice cere un efort distinct de licențiere, validare și întreținere.

### Model comercial de testat

| Plan propus | Ce ar conține | Ipoteză comercială |
|---|---|---|
| Gratuit | Catalog, RCP, căutare, radar public și un set mic de urmărit | Achiziție și încredere |
| Individual | Urmărire extinsă, filtre, istoric, alerte configurabile | Disponibilitatea de plată trebuie testată |
| Clinică / farmacie | Liste comune, roluri, audit și formulare interne | Abonament organizațional |
| Integrare | API de evenimente, webhooks, monitorizarea unui formular | Contract B2B |

Nu am estimat veniturile și nu propun un preț definitiv fără interviuri și costuri ale surselor. Mediately are deja venituri din PRO, pharma și licențiere; competiția doar pe prețul abonamentului ar ignora acest model.

### Parteneriate utile pentru tine

- Asociații profesionale și medici editori: validarea utilității și distribuție.
- Farmacii/distribuitori: disponibilitate locală, dacă există flux contractual de date.
- Furnizori de software pentru cabinete: distribuție în momentul prescrierii.
- Clinici și rețele: pilot cu formular comun, alerte și audit.
- Furnizori de conținut clinic: interacțiuni și calculatoare licențiate, dacă extinzi scopul.
- Pharma: eventual educație și finanțare etichetată; păstrează clasamentul și alertele independente de sponsorizare.

Acestea sunt categorii de parteneri propuse. Nu există parteneriate încheiate prin acest research.

### Extindere

Construiește un nucleu cu DCI, concentrație, unități, formă, cale, ambalaj și identificatori locali; atașează separat autorizarea, compensarea și disponibilitatea fiecărei țări. Alege următoarea piață după calitatea surselor, accesul contractual și distribuție, nu numai după mărimea populației.

EMA oferă cataloage publice și trimiteri către registre naționale. ESMP nu trebuie tratat ca un API public complet de stoc pentru Europa; accesul operațional este destinat autorităților și deținătorilor APP. [Informații publice EMA](https://www.ema.europa.eu/en/human-regulatory-overview/post-authorisation/medicine-shortages-availability-issues/public-information-medicine-shortages) · [ESMP](https://www.ema.europa.eu/en/human-regulatory-overview/post-authorisation/medicine-shortages-availability-issues/european-shortages-monitoring-platform)

### Praguri propuse pentru continuarea investiției

- Înainte de pilot: toate alertele au document, dată, tip și prezentare identificabilă; potrivirile ambigue sunt oprite pentru revizie.
- Pilot: măsoară utilizarea repetată, timpul până la găsirea informației și câte alerte duc la o verificare utilă.
- Monetizare: cere un angajament comercial real de la utilizatori sau organizații, nu doar feedback pozitiv.
- Extindere: adaugă o singură piață și verifică aceeași calitate de mapare înainte să scalezi.

## 7. Ce livrează mockul

**Medora** este un nume de lucru; disponibilitatea mărcii și domeniului nu a fost verificată. Identitate proprie: verde închis, crem, accente vegetale, navigare laterală pe desktop și bară inferioară pe telefon. Accentul cade pe activitatea medicului și radarul de schimbări.

Funcționează local: căutarea fără diacritice, căutarea după DCI/ATC, filtre de alerte, fișe și istoric, adăugarea/eliminarea din lista urmărită, persistență în browser, comparația a două prezentări, preferințe de alerte cu previzualizare și calculator IMC.

Sunt simulate: cele 8 produse comerciale, cele 3 evenimente și datele lor. Nu există sincronizare ANMDMR, cont real, motor AI, calcul de interacțiuni, stoc live, email sau push. Documentele oficiale se deschid prin linkurile sursă. Comparația nu stabilește echivalență terapeutică.

### Tur de test de două minute

1. Apasă „amoxicilină” în căutarea sugerată; apar două prezentări.
2. Selectează ambele și apasă „Compară selecția”.
3. Deschide o fișă și urmărește produsul; verifică „Lista mea”.
4. Intră în „Radar alerte”, filtrează „Permanente” sau activează „Doar lista mea”.
5. Configurează tipurile și frecvența alertelor; vezi previzualizarea locală.
6. În „Instrumente”, calculează IMC pentru 70 kg și 175 cm: 22,9 kg/m².

Fișierul medora.html funcționează și deschis direct din browser. Pentru linkul intern de research, păstrează fișierele livrate în același folder. Persistența locală depinde de setările browserului; varianta servită prin localhost oferă un comportament mai previzibil.

## 8. Întrebări rămase înainte de dezvoltarea produsului real

- Oferă Mediately în conturi PRO sau în aplicații alerte de discontinuitate care nu sunt documentate public?
- Ce surse pot fi reutilizate comercial, în ce format și cu ce actualizare?
- Care este acoperirea reală a notificărilor de reluare și a datelor pe ambalaj?
- Cât de des se întâlnește problema în nișa inițială și cine plătește pentru rezolvare?
- Ce module clinice merită licențiate și cine își asumă revizia medicală?
- Pentru funcțiile terapeutice viitoare: ce încadrare și obligații rezultă din scopul medical declarat? Acest research nu este o evaluare de conformitate.

**Direcție recomandată:** „Află ce s-a schimbat la medicamentele pe care le prescrii.” Catalogul aduce utilizatorul; monitorizarea relevantă și datele verificabile îl pot face să revină.
