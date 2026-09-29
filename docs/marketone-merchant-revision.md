# MarketOne — Biznesi në qendër

> **Përditësim — 29 shtator 2026:** koncepti më poshtë ruhet si referencë e rishikimit të 28 shtatorit. Tani është implementuar prototipi interaktiv; shihni [udhëzuesin funksional](merchant-demo-guide.md).
>
> Paneli, veprimet mbështetëse, formulari me hapa, ruajtja në këtë browser, mostrat e dokumenteve dhe banka e simuluar funksionojnë. Ruajtja në llogari të sigurt, dokumentet reale dhe transmetimi bankar mbeten kërkesa prodhimi. Pohimet historike për funksionalitetin ende të paimplementuar i referohen dorëzimit fillestar të konceptit, jo prototipit të tanishëm.
Koncept UX dhe plan ekranesh · 28 shtator 2026

**Një hapësirë pune ku tregtari kupton aktivitetin, zgjidh çështjet e ditës dhe kërkon financim për biznesin.**

Ky rishikim ndjek zgjedhjet e konfirmuara: dyqan i vogël i pavarur, panel i mbështetur fillimisht në aktivitetin e MarketOne dhe dorëzim si koncept UX me skica të shpjeguara.

Skicat janë statike. Kontrollet e vizatuara nuk kryejnë veprime. Të gjitha shumat, ngjarjet dhe referencat janë ilustruese; nuk është dërguar aplikim ose dokument në bankë.

## 01 — Nevoja e biznesit dhe drejtimi i ri

**Skenari:** pronarja e “Dyqanit të Lagjes” hyn në MarketOne, kontrollon porositë dhe pagesat e platformës, pastaj përgatit një kërkesë kredie për rimbushjen e stokut. Më vonë, banka kërkon një dokument shtesë; pronarja e gjen kërkesën në panel dhe vazhdon nga aty.

| Nevoja | Përgjigjja e konceptit | Arsyeja e prioritetit |
| --- | --- | --- |
| Çfarë kërkon vëmendjen time? | Listë e shkurtër detyrash me veprim të drejtpërdrejtë. | Operatori duhet të veprojë pa interpretuar disa grafikë. |
| Si po ecën aktiviteti? | Shitje, porosi për veprim dhe pagesa për t’u marrë, me burim e periudhë. | Ofron orientim pa pretenduar pamje të plotë financiare. |
| Si kërkoj financim? | Formular me hapa, paraplotësim dhe ruajtje drafti. | Ul punën e përsëritur dhe lejon ndërprerjen. |
| Çfarë po ndodh me aplikimin? | Status, historik dhe kërkesa konkrete nga banka. | Zvogëlon pasigurinë dhe nevojën për të kërkuar sqarime jashtë platformës. |

Në propozimin e mëparshëm, rrjedha kryesore ishte përgatitja e një porosie dhe kredia ishte shtyrë në fazën e dytë. Ky koncept vendos panelin e biznesit dhe aplikimin për mikro-kredi në prioritetin e parë.

**Termat:** biznesi është tregtari që i bashkohet rrjetit; operatori është personi i autorizuar që punon për të. Në skenar është pronarja. Për një punonjës, të drejtat për financimin caktohen veçmas. Banka është marrësi dhe vendimmarrësi i aplikimit.

**Navigimi i propozuar:** Përmbledhje · Shitje · Produkte · Pagesa · Financim · Profili i biznesit. Produktet shërbejnë për menaxhimin e biznesit brenda kësaj hapësire.

## 02 — Paneli pas hyrjes

### Ekrani A — Një ditë normale pune

```screen
MarketOne                         Dyqani i Lagjes
Përmbledhje / Shitje / Produkte / Pagesa / Financim / Profili

Mirë se erdhët në biznesin tuaj

[1] KËRKON VËMENDJEN TUAJ
2 porosi presin konfirmim
Kontrolloni disponueshmërinë dhe konfirmoni porositë.
[ Shiko porositë ]

[2] AKTIVITETI NË MARKETONE
Shitje · 7 ditët e fundit                 1 240 USD
Porosi për veprim · gjendja aktuale                2
Pagesa për t’u marrë · gjendja aktuale       380 USD
Përditësuar në 09:40 · Të dhëna ilustruese
[ Shiko shitjet ]              [ Shiko pagesat ]

[3] FINANCIMI I BIZNESIT
Po planifikoni të rimbushni stokun?
Përgatitni një kërkesë për shqyrtim nga banka.
[ Fillo aplikimin ]

[4] AKTIVITETI I FUNDIT
09:40 · Porosi e re për konfirmim
09:15 · Pagesë e kaluar te biznesi
Dje   · Profili i biznesit u përditësua
```

**1. Veprimi para statistikave.** Detyrat me afat më të afërt shfaqen të parat, pastaj detyrat që bllokojnë një proces, pastaj detyrat e tjera; brenda të njëjtit nivel, më e vjetra vjen e para. Shfaqen deri në tri detyra dhe lidhja “Shiko të gjitha”. Nuk shpiken afate ose urgjencë.

**2. Shifra me kuptim të kufizuar dhe të qartë.** Shitjet i referohen porosive të përfunduara në MarketOne, duke përjashtuar anulimet. Dy treguesit e tjerë janë gjendje aktuale, jo vlera të periudhës së shitjeve. Pagesat e pritshme nuk janë bilanci bankar ose fitimi. Shfaqen monedha, burimi dhe koha e përditësimit; çdo kartë hap aktivitetin përkatës. Prototipi aktual nuk i siguron këto të dhëna: në koncept përdoren shembuj të shënuar.

**3. Financimi përshtatet me situatën.** Pa aplikim: “Fillo aplikimin”; me draft: “Vazhdo aplikimin”; pas dorëzimit: “Shiko statusin”. Një kërkesë dokumenti nga banka shfaqet edhe te detyrat. Një ftesë e përgjithshme për kredi nuk zëvendëson detyrat operative.

**4. Histori e shkurtër.** Çdo ngjarje çon te detajet e saj. Për ndryshimet e aplikimit shfaqet qartë nëse ngjarja vjen nga MarketOne ose banka.

Në telefon ruhet rendi: detyrat → treguesit → financimi → aktiviteti. Navigimi kalon në një menu të emërtuar; nuk shtohet shirit porosie që mbulon veprimin e financimit.

### Ekrani B — Biznes i sapobashkuar

```screen
Dyqani i Lagjes
Le ta përgatisim biznesin tuaj

1. Plotëso profilin e biznesit          Për t’u bërë
   Emri, aktiviteti, adresa dhe personi i autorizuar
2. Konfiguro dyqanin                    Për t’u bërë
   Kontakti dhe të dhënat operative
3. Shto produktet                       Për t’u bërë
   Emri, çmimi dhe disponueshmëria

[ Plotëso profilin ]

Ende nuk ka aktivitet në MarketOne.
Shitjet dhe pagesat do të shfaqen këtu kur të ketë aktivitet.

Financimi i biznesit
Shihni çfarë nevojitet për të aplikuar.
[ Shiko kërkesat ]
```

Lista e konfigurimit ka një veprim kryesor dhe tregon përparimin real. Mungesa e historikut në MarketOne nuk interpretohet si refuzim ose papranueshmëri për kredi. Banka përcakton kriteret.

### Gjendjet që paneli duhet të shpjegojë

| Gjendja | Sjellja e propozuar |
| --- | --- |
| Asnjë detyrë | “Nuk keni veprime në pritje.” Financimi mbetet i arritshëm pa krijuar urgjencë. |
| Ngarkim | Vendmbajtës të emërtuar; nuk shfaqen zero të përkohshme. |
| Dështim i një burimi | Gabim dhe “Provo përsëri” vetëm te zona përkatëse; pjesët e tjera mbeten të përdorshme. |
| Të dhëna të vjetruara | Tregohet përditësimi i fundit dhe dështimi i rifreskimit. |
| Të dhëna jashtë platformës | Nuk supozohen fitimi, shpenzimet totale, stoku i kasës ose bilanci bankar. |
| Dokument i kërkuar nga banka | Emri i dokumentit, arsyeja dhe afati vetëm nëse banka e ka dhënë; veprimi hap kërkesën përkatëse. |

## 03 — Portali i mikro-kredisë

Hyrja “Financim” shpjegon bankën marrëse, hapat, dokumentet paraprake dhe mënyrën e përdorimit të të dhënave. Identiteti i bankës dhe kërkesat e saj duhet të konfirmohen përpara një integrimi real.

**Rrjedha:** Nevoja → Biznesi dhe aplikuesi → Financat dhe dokumentet → Rishikimi dhe autorizimi → Statusi.

Çdo hap ka “Kthehu” dhe “Ruaj dhe dil”. Të dhënat ruhen si draft në llogarinë e biznesit; mesazhi “U ruajt” shfaqet vetëm pas konfirmimit të ruajtjes. Në dështim: “Ndryshimet e fundit nuk u ruajtën — provo përsëri”, duke mbajtur formularin e hapur. Kjo është sjellje e propozuar, jo funksionalitet i implementuar në aplikacionin ekzistues.

### Ekrani C — Hapi 1: Nevoja për financim

```screen
Aplikimi për mikro-kredi                         Hapi 1 / 5

Për çfarë ju nevojitet financimi?
Shuma e kërkuar                                3 000 USD
Qëllimi                                  Rimbushje stoku
Periudha e preferuar                             12 muaj

Përshkruani nevojën
Blerje stoku për furnizimin e dyqanit gjatë muajit të ardhshëm.

Banka shqyrton kërkesën dhe përcakton kushtet.
Periudha e preferuar nuk është ofertë e miratuar.

Draft i ruajtur
[ Vazhdo te biznesi ]                 [ Ruaj dhe dil ]
```

Fillojmë me qëllimin e pronarit. Shuma duhet të jetë pozitive; kufijtë dhe monedha varen nga produkti i bankës. USD përdoret vetëm për vazhdimësi me demonstrimin ekzistues. Nuk paraqitet këst, normë interesi, kohë miratimi ose mundësi miratimi pa të dhëna të konfirmuara nga banka.

### Ekrani D — Hapi 2: Biznesi dhe aplikuesi

```screen
Aplikimi për mikro-kredi                         Hapi 2 / 5

Konfirmoni biznesin dhe aplikuesin
Emri i biznesit                         Dyqani i Lagjes
Aktiviteti                            Tregti me pakicë
Numri i regjistrimit                  Për t’u plotësuar
Adresa                                Nga profili · konfirmo
Personi që aplikon                    Pronarja
Email dhe telefon                     Nga profili · konfirmo

Të dhënat nga profili mund të korrigjohen.
Dokumenti i përfaqësimit kërkohet kur zbatohet.

[ Vazhdo te financat ] [ Kthehu ] [ Ruaj dhe dil ]
```

Paraplotësimi ul punën e përsëritur. Burimi i fushave është i dukshëm. Korrigjimet ruhen në aplikim; ndryshimi i profilit kërkon veprim të veçantë që të mos ndryshojë pa dashje të dhënat operative.

Identiteti i aplikuesit dhe regjistrimi i biznesit trajtohen veçmas. Deklarimi “jam i autorizuar” nuk e zëvendëson verifikimin e rolit dhe kërkesave të bankës. Numrat e regjistrimit dhe të dhënat personale nuk janë shpikur në këtë skicë.

### Ekrani E — Hapi 3: Financat dhe dokumentet

```screen
Aplikimi për mikro-kredi                         Hapi 3 / 5

Financat e deklaruara nga aplikuesja
Periudha                             Gusht 2026
Xhiro · të gjitha kanalet             8 000 USD
Shpenzime · e njëjta periudhë          6 000 USD
Detyrime kreditore ekzistuese         Nuk ka · e deklaruar

Aktiviteti në MarketOne
Raporti i platformës bashkëngjitet veçmas me burim,
monedhë dhe periudhë të shënuar.

Dokumente · listë ilustruese
Regjistrimi i biznesit                Gati për rishikim
Identiteti / përfaqësimi               Gati për rishikim
Dokumenti i qarkullimit               Mungon
[ Shto dokument ]

[ Vazhdo te përmbledhja ] [ Kthehu ] [ Ruaj dhe dil ]
```

Shifrat më të gjera deklarohen nga operatori; nuk paraqiten si të verifikuara nga MarketOne. Raporti i platformës nuk i shtohet automatikisht xhiros së deklaruar, sepse mund të jetë tashmë pjesë e saj. Nëse ka kredi ekzistuese, formulari mbledh detyrimin dhe pagesën periodike sipas kërkesave të bankës.

Lista përfundimtare e dokumenteve përcaktohet nga banka. Për çdo dokument shpjegohen arsyeja, periudha, formatet dhe madhësia maksimale përpara ngarkimit. Në telefon ofrohet zgjedhja nga pajisja dhe fotografimi kur formati pranohet.

Ngarkimi ka gjendje të veçanta: **zgjedhur → duke u ngarkuar → në kontroll → gati**. Zgjedhja e skedarit nuk është ruajtje e konfirmuar. Një dështim lejon riprovim ose zëvendësim pa humbur formularin. Skedarët refuzohen me arsye të kuptueshme nëse nuk kalojnë kontrollet.

Mund të rishikohet një draft me mungesa të shënuara; dorëzimi bllokohet derisa fushat dhe dokumentet e detyrueshme të jenë të vlefshme.

### Ekrani F — Hapi 4: Rishikimi dhe autorizimi

Skenari vazhdon pasi dokumenti që mungonte është shtuar dhe ka kaluar kontrollin.

```screen
Aplikimi për mikro-kredi                         Hapi 4 / 5

Kontrolloni përpara dërgimit
Biznesi                       Dyqani i Lagjes       [ Ndrysho ]
Kërkesa                       3 000 USD / stok      [ Ndrysho ]
Periudha e preferuar          12 muaj               [ Ndrysho ]
Financat                      Gusht 2026            [ Ndrysho ]
Dokumentet                    3 dokumente gati      [ Shiko ]

Marrësi: banka partnere e emërtuar në produktin e financimit
Identiteti i bankës mbetet për t’u konfirmuar në këtë koncept.

Çfarë do të marrë banka?
• Të dhënat e biznesit dhe të përfaqësuesit
• Kërkesën dhe financat e deklaruara
• Raportin e MarketOne për periudhën e treguar
• Dokumentet e listuara më sipër

[ ] Autorizoj MarketOne t’ia dërgojë bankës së emërtuar
    këtë aplikim dhe të dhënat e listuara për shqyrtim.

[ Dërgo aplikimin në bankë ] [ Kthehu ] [ Ruaj dhe dil ]
```

Autorizimi nuk parazgjidhet. Marrësi dhe inventari i të dhënave duhet të jenë konkretë në implementimin real; nëse banka nuk është konfiguruar, dorëzimi nuk aktivizohet. Para dërgimit shfaqen informacioni i privatësisë dhe mënyra e kontaktit për pyetje mbi të dhënat.

Kthimi te një hap ruan draftin. Nëse ndryshon paketa pas autorizimit, kërkohet autorizim i ri për versionin përfundimtar. Aplikuesi dërgon një kërkesë për shqyrtim; kjo nuk është pranim kontrate kredie.

### Ekrani G — Hapi 5: Gjurmimi

```screen
Aplikimi MO-DEMO-024                             Hapi 5 / 5

Banka e ka marrë aplikimin
Kërkesa: 3 000 USD për rimbushje stoku
Marrësi: banka partnere · skenar ilustrues
Përditësimi i fundit: 28 shtator 2026, 10:05

Historiku
10:00 · MarketOne ruajti aplikimin për dërgim
10:05 · Banka konfirmoi marrjen

Hapi i radhës
Banka do ta shqyrtojë aplikimin.
Nuk kërkohet veprim nga ju në këtë moment.
Koha e përgjigjes nuk është konfirmuar.

[ Shiko aplikimin e dërguar ] [ Kthehu te paneli ]
```

Referenca e MarketOne shfaqet që në regjistrimin e dërgimit. Referenca e bankës shtohet vetëm kur merret. “Banka e ka marrë” kërkon konfirmim nga banka; një klikim i suksesshëm në UI nuk mjafton.

Paketa e dorëzuar mbetet e lexueshme si version historik. Dokumentet shtesë lidhen me të njëjtin aplikim; nuk e ndryshojnë në heshtje versionin e dërguar.

### Ekrani H — Banka kërkon informacion

```screen
Aplikimi MO-DEMO-024
Kërkohet informacion shtesë

Mesazh nga banka
Ju lutemi dërgoni dokumentin e qarkullimit për periudhën
e kërkuar në mesazhin e bankës.

Dokumenti i kërkuar             Ende pa dokument
[ Shto dokument ]

Para përgjigjes: kontrolloni skedarin dhe marrësin.
[ Dërgo përgjigjen te banka ]
[ Kthehu te paneli ]
```

Në produkt, mesazhi përfshin periudhën dhe afatin e saktë nëse banka i ka dhënë. Përgjigjja ka rishikimin dhe autorizimin e vet për dokumentin e ri. Statusi mbetet “Kërkohet informacion” derisa banka të konfirmojë marrjen e përgjigjes. Dështimi i dërgimit nuk fshin dokumentin e ruajtur.

## 04 — Gjendjet e aplikimit dhe rikuperimi

| Gjendja | Çfarë kupton operatori | Veprimi |
| --- | --- | --- |
| Draft | Kërkesa është e papërfunduar dhe nuk është dërguar. | Vazhdo ose fshi draftin me konfirmim. |
| Duke u dërguar | MarketOne e ka regjistruar kërkesën; pritet konfirmim nga banka. | Shiko detajet; mos nis një aplikim të dytë. |
| Marrja nuk është konfirmuar | Ka problem komunikimi; rezultati mund të jetë ende i panjohur. | Kontrollo statusin; riprovimi përdor të njëjtën referencë. |
| Marrë nga banka | Banka ka konfirmuar marrjen. | Shiko aplikimin dhe historikun. |
| Në shqyrtim | Banka ka raportuar fillimin e shqyrtimit. | Shiko statusin; nuk premtohet afat. |
| Kërkohet informacion | Banka ka kërkuar të dhëna të tjera. | Plotëso kërkesën konkrete. |
| Miratuar | Banka ka komunikuar një vendim pozitiv dhe kushtet përkatëse. | Shiko vendimin dhe hapat e konfirmuar nga banka. |
| Refuzuar | Banka ka komunikuar vendim negativ. | Shiko arsyen, nëse është dhënë, dhe kontaktin e bankës. |

**Miratimi nuk është disbursim.** Shuma e kërkuar nuk paraqitet si shumë e miratuar. Nënshkrimi i kontratës, pranimi i kushteve dhe lëvrimi i fondeve mbeten jashtë këtij koncepti. Nëse banka nuk jep arsye refuzimi, MarketOne nuk sajon një të tillë.

**Ndërprerje sesioni:** pas hyrjes së sigurt, operatori rifillon draftin e fundit të konfirmuar. Dokumentet financiare nuk ruhen në localStorage. Mesazhet e gabimit nuk përmbajnë të dhëna të një biznesi tjetër.

**Aksesueshmëri:** etiketat mbeten të dukshme; gabimet lidhen me fushën dhe mblidhen në një përmbledhje të fokusueshme; njoftimet e ruajtjes dhe statusit lexohen nga teknologjitë ndihmëse. Statusi ka tekst dhe nuk dallohet vetëm nga ngjyra. Navigimi me tastierë dhe zmadhimi nuk pengojnë veprimin kryesor.

## 05 — Si transmetohet kërkesa te banka

```flow
OPERATORI
Rishikon paketën dhe autorizon ndarjen
        ↓
MARKETONE · SERVERI
Verifikon sesionin, biznesin, lejet, fushat dhe dokumentet
Ruan versionin e aplikimit dhe provën e autorizimit
Regjistron punën e dërgimit me referencë të qëndrueshme
        ↓ lidhje e enkriptuar dhe e autentikuar
BANKA · NDËRFAQJA E DAKORDËSUAR
Konfirmon marrjen → vlerëson → kërkon sqarime / vendos
        ↓ përditësime të autentikuara
MARKETONE · HISTORIKU DHE PANELI
Shfaq statusin e raportuar dhe veprimin e ardhshëm
```

Ky është **dizajn i propozuar për prodhim**, jo provë e një integrimi ose sigurie të implementuar.

| Pjesa e paketës | Përmbajtja dhe burimi |
| --- | --- |
| Identifikimi | Referenca, versioni, koha e dorëzimit dhe banka marrëse. |
| Biznesi dhe aplikuesi | Të dhënat e konfirmuara të biznesit, identiteti dhe autorizimi i përfaqësuesit. |
| Kërkesa | Shuma, monedha, qëllimi dhe periudha e preferuar. |
| Financat e deklaruara | Shifrat, periudha dhe shënimi që janë dhënë nga aplikuesi. |
| Aktiviteti i MarketOne | Raporti i autorizuar me burim, periudhë dhe monedhë; dallohet nga deklarimet. |
| Dokumentet | Inventari i dokumenteve të kontrolluara dhe transferimi ose referencat e mbrojtura sipas kontratës me bankën. |
| Autorizimi | Kush autorizoi, kur, për cilin marrës dhe për cilin version të paketës. |

**Kontrollet e nevojshme:**

- Serveri verifikon lidhjen e përdoruesit me biznesin në çdo lexim, ndryshim dhe dërgim. Stafi pa leje financimi dhe bizneset e tjera nuk marrin akses.
- Transmetimi bëhet nga serveri përmes ndërfaqes së autentikuar të bankës. Kredencialet nuk vendosen në browser; kërkohet enkriptim gjatë transmetimit dhe në ruajtje.
- Dokumentet ruhen privatisht, me kontroll formati, madhësie dhe përmbajtjeje të dëmshme. Aksesi është i kufizuar; nuk përdoren lidhje publike.
- Dërgimi përdor një identifikues të qëndrueshëm kundër dublikimit. Në timeout kontrollohet statusi para ridërgimit; banka duhet të mbështesë deduplikim ose pajtim të referencës.
- Përditësimet e bankës autentikohen dhe lidhen me aplikimin përkatës. Ngjarjet e dyfishta ose të ardhura jashtë radhe nuk duhet ta kthejnë statusin prapa. Pa webhook, përdoret kontroll statusi nga serveri sipas kontratës.
- Historiku regjistron aktorin, veprimin, kohën, referencën dhe ndryshimin e statusit. Përmbajtja e dokumenteve, sekretet dhe të dhënat e panevojshme personale nuk shkruhen në log.
- Njoftimet jashtë portalit thonë se ka përditësim dhe e drejtojnë operatorin te hyrja e sigurt; nuk përmbajnë dokumente ose hollësi financiare.
- Afatet e ruajtjes, fshirja, baza për përpunimin e të dhënave dhe teksti i autorizimit përcaktohen me bankën përpara prodhimit. Kutia e autorizimit nuk paraqitet si provë e përmbushjes së çdo detyrimi ligjor.

**Ndërfaqet minimale të ardhshme:** lexim i përmbledhjes së biznesit; krijim/përditësim/rifillim drafti; ngarkim dhe status kontrolli dokumenti; dorëzim i versionit të autorizuar; lexim i statusit/historikut; përgjigje ndaj kërkesës së bankës. Adapter-i bankar ka përgjegjësi të ndara për dërgimin, konfirmimin dhe sinkronizimin e statusit. Emrat e endpoint-eve dhe kontrata përfundimtare nuk shpiken para zgjedhjes së bankës.

## 06 — Prioritetet dhe kufijtë

| Prioriteti | Çfarë përfshihet | Pse |
| --- | --- | --- |
| P0 · Kuptim dhe veprim | Paneli me detyra, aktivitet, burim të dhënash dhe gjendje bosh/gabimi. | E bën hyrjen në platformë të dobishme çdo ditë. |
| P0 · Kërkesë e plotë | Profil i ripërdorshëm, draft, formular me hapa, dokumente dhe rishikim. | Ndihmon operatorin ta përfundojë aplikimin. |
| P0 · Besim në proces | Banka marrëse, autorizimi, konfirmimi i marrjes, statusi dhe përgjigjet. | Operatori kupton ku janë të dhënat dhe kush duhet të veprojë. |
| P1 · Përmirësim pas validimit | Filtra më të hollësishëm, raporte të eksportueshme dhe kujtesa të konfigurueshme. | Vlerësohen pasi të provohet rrjedha bazë. |
| Jashtë versionit të parë | Scoring, vendime automatike kredie, krahasim bankash, lidhje me kasën/ERP, analitikë e avancuar. | Kërkojnë të dhëna dhe integrime që ky koncept nuk i supozon. |

Ky dorëzim përmban skica dhe specifikim sjelljeje. Nuk shton autentikim real, backend financiar, ruajtje draftesh, ngarkim dokumentesh ose lidhje bankare në aplikacionin ekzistues. Hapat e nënshkrimit, disbursimit dhe shlyerjes janë jashtë skenarit.

## 07 — Si vlerësohet koncepti

Këto janë skenarë të planifikuar për validim, jo rezultate të testimit me përdorues.

| Detyra | Kriteri i suksesit |
| --- | --- |
| Hyr në panel dhe gjej veprimin e radhës. | Operatori gjen detyrën prioritare dhe shpjegon pse ka përparësi. |
| Shpjego shifrat e panelit. | Dallon aktivitetin e MarketOne nga i gjithë biznesi dhe pagesat e pritshme nga fitimi/bilanci. |
| Hyr si biznes i ri. | Gjen hapin e konfigurimit dhe informacionin për financim pa interpretuar mungesën e historikut si refuzim. |
| Plotëso, ndërprit dhe rifillo aplikimin. | Rikthehet te drafti i ruajtur pa ripërsëritur të dhënat e konfirmuara. |
| Jep informacion financiar. | Kupton burimin dhe periudhën e deklarimeve dhe shmang numërimin e dyfishtë të shitjeve. |
| Rishiko dërgimin. | Identifikon bankën, të dhënat që ndahen dhe rolin vendimmarrës të bankës; autorizimi nuk është i parazgjedhur. |
| Ngarko një skedar të papranueshëm ose ndërprit ngarkimin. | Sheh arsyen dhe rikuperon pa humbur formularin. |
| Simulo timeout pas dërgimit. | Nuk shfaqet marrje e rreme ose aplikim i dytë; ruhet e njëjta referencë. |
| Përgjigju një kërkese dokumenti. | E gjen nga paneli, rishikon dokumentin e ri dhe kupton nëse banka e ka marrë. |
| Lexo miratimin/refuzimin. | Nuk e ngatërron miratimin me fonde të marra; nuk sheh arsye ose afate të sajuara. |
| Përdor telefon, tastierë dhe zmadhim. | Rendi i leximit është i qartë dhe çdo fushë/gabim/veprim është i arritshëm. |

Për implementimin e ardhshëm, testet e integrimit duhet të provojnë izolimin mes bizneseve, lejet e stafit, refuzimin e dokumenteve të pasigurta, deduplikimin e dërgimit dhe mospranimin e përditësimeve bankare të paautentikuara. Demonstrimi duhet të përdorë dokumente sintetike dhe një bankë të simuluar.

## 08 — Supozimet dhe vendimet përpara prodhimit

- Audienca është një dyqan i vogël i pavarur; skenari përdor pronaren si operatore.
- UI-ja dhe dokumentimi mbeten në shqip, në përputhje me materialet ekzistuese.
- MarketOne shfaq aktivitetin e vet. Nuk supozohet integrim me bankën, kontabilitetin ose kasën për të lexuar gjithë biznesin.
- Një bankë partnere përdoret në skenar. Emri, produkti, juridiksioni, monedha, kufijtë dhe dokumentet duhet të konfirmohen; dërgimi real varet nga këto.
- USD dhe periudha 12 muaj janë vetëm ilustrime. Nuk janë ofertë financiare.
- Gjendjet e këtij koncepti duhet të lidhen me statuset reale të bankës; nuk nxirren nga pritja ose nga supozimi i MarketOne.
- Asnjë test përdoruesish, kontroll sigurie në prodhim ose integrim bankar nuk pretendohet si i kryer.

## 09 — Çfarë u dorëzua

Dokumenti i lexueshëm HTML dhe burimi Markdown përmbajnë tetë skica ekranesh, shpjegimet e vendimeve, gjendjet e gabimit, rrjedhën e bankës dhe kriteret e validimit. Lidhjet e përmbajtjes në HTML shërbejnë për navigim; kontrollet brenda skicave janë ilustrime.

Prototipi i katalogut dhe propozimi teknik i mëparshëm mbeten materiale historike të drejtimit fillestar. Ky koncept është referenca e re për prioritetet e produktit dhe për dy rrjedhat e kërkuara.

**Përdorimi i AI-së:** Codex inspektoi materialet ekzistuese dhe përgatiti tekstin, skicat dhe paketimin. Zgjedhjet për llojin e dorëzimit, tregtarin e vogël dhe aktivitetin e MarketOne u konfirmuan nga përdoruesi. Nuk pretendohet validim personal ose testim me tregtarë në emër të kandidatit.
