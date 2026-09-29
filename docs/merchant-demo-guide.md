# MarketOne — Udhëzuesi i demonstrimit të biznesit

Përditësuar: 29 shtator 2026.

Ky është një prototip interaktiv në shqip për një dyqan të vogël. Hyrja, dokumentet dhe banka janë të simuluara. Përdorni vetëm të dhëna fiktive.

## Hapja dhe navigimi

Nisni projektin me komandat e README-së. Adresa bazë ju çon te `/overview`. Klikoni **Hyr në hapësirën e biznesit** për të hyrë si Ana Demo.

| Rruga | Funksioni |
| --- | --- |
| `/overview` | Detyrat, shitjet e MarketOne, pagesat e pritshme, financimi dhe aktiviteti. |
| `/sales` | Lista dhe detajet e porosive; konfirmim i porosive në pritje. |
| `/products` | Shtim dhe ndryshim i produkteve, çmimeve, stokut dhe disponueshmërisë. |
| `/payments` | Lista dhe detajet e pagesave të platformës; vetëm lexim. |
| `/business` | Profili i biznesit, kontakti dhe konfigurimi i dyqanit. |
| `/financing` | Hyrja në proces dhe përmbledhja e aplikimit aktual. |
| `/financing/application?step=1` | Formulari me hapa dhe, pas dërgimit, statusi. |
| `/legacy-demo` | Aplikacioni fillestar i katalogut dhe draftit të porosisë. |

## Skenari i plotë për rishikuesin

1. **Orientohuni në panel.** Biznesi fillestar ka dy porosi që kërkojnë konfirmim. Shitjet e përfunduara të shtatë ditëve të fundit janë 1 240 USD dhe pagesat në pritje janë 380 USD. Këto shifra janë vetëm aktivitet demonstrues në MarketOne.
2. **Zgjidhni një detyrë.** Hapni porosinë dhe klikoni **Konfirmo porosinë**. Kthehuni në panel: detyra largohet dhe aktiviteti përditësohet. Konfirmimi nuk shënon shitje të përfunduar dhe nuk krijon pagesë ose zbritje stoku.
3. **Filloni financimin.** Klikoni **Fillo aplikimin**, lexoni bankën fiktive marrëse dhe nisni formularin.
4. **Plotësoni nevojën.** Përdorni shumën 3 000 USD, 12 muaj dhe një përshkrim si “Rimbushje stoku për muajin e ardhshëm”. Nuk llogariten interes ose këste.
5. **Provoni ruajtjen.** Klikoni **Ruaj dhe dil**, prisni rikthimin në panel, rifreskoni faqen dhe hapni **Vazhdo aplikimin**. Mund të dilni nga sesioni dhe të hyni sërish në të njëjtin browser; drafti mbetet.
6. **Konfirmoni biznesin.** Të dhënat janë marrë nga profili. Korrigjimi në formular ndryshon aplikimin; ndryshimi i profilit bëhet veçmas te **Profili i biznesit**.
7. **Jepni financat.** Për shembull, xhiro 8 000 USD dhe shpenzime 6 000 USD për muajin e treguar. Raporti i MarketOne shfaqet veçmas dhe nuk i shtohet automatikisht xhiros.
8. **Zgjidhni dokumentet.** Për secilën kategori, zgjidhni PDF-në demonstruese dhe klikoni **Përdor mostrën**. Prisni gjendjen **Gati**. Nuk hapet një dialog skedarësh dhe nuk lexohet asnjë dokument nga pajisja.
9. **Rishikoni dhe autorizoni.** Kontrolloni përmbledhjen, bankën e simuluar, raportin dhe dokumentet. Kutia e autorizimit është fillimisht bosh. Nëse ndryshoni të dhënat, autorizimi duhet dhënë sërish.
10. **Dërgoni te simulatori.** Dërgimi krijon një version historik dhe referencë. Vetëm konfirmimi i simulatorit shfaq **Marrë nga banka demo**.
11. **Avanconi bankën.** Hapni **Skenar demonstrimi** në fund të faqes. Klikoni **Nis shqyrtimin**, pastaj **Kërko dokument shtesë**. Kërkesa shfaqet edhe si detyrë në panel.
12. **Përgjigjuni kërkesës.** Hapni detyrën, zgjidhni dokumentin shtesë, rishikoni marrësin dhe autorizoni përgjigjen. Paketa shtesë përmban dokumentin e ri, periudhën dhe referencën e aplikimit; nuk e ndryshon paketën fillestare.
13. **Shihni vendimin.** Pas marrjes së përgjigjes, përdorni **Simulo miratimin** ose **Simulo refuzimin**. Miratimi demonstrues nuk është disbursim. **Shiko aplikimin e dërguar** hap versionin historik.
14. **Provoni drejtimin tjetër.** Për një aplikim të ri ose vendimin alternativ, rivendosni skenarin nga kontrollet. Rivendosja kërkon konfirmim dhe zëvendëson të dhënat lokale të demonstrimit.

## Rikuperimi dhe gjendjet alternative

| Kontrolli | Çfarë demonstron |
| --- | --- |
| **Biznes i ri** | Lista e konfigurimit dhe gjendjet pa shitje, produkte ose pagesa. Financimi mbetet i arritshëm. |
| **Gabim i të dhënave të panelit** | Dështim i përmbledhjes me përditësimin e fundit; detyrat mbeten të përdorshme. **Provo përsëri** tregon ngarkim dhe rikthen të dhënat. |
| **Dështim i ruajtjes lokale** | Formulari mbetet në ekran me mesazh të qartë. **Ruaj dhe dil** nuk largohet duke pretenduar ruajtje të suksesshme. Çaktivizoni kontrollin dhe riprovoni. |
| **Format / madhësi / ndërprerje dokumenti** | Tentativa e radhës dështon me arsye. Kontrolli kthehet automatikisht në sukses, ndaj **Riprovo mostrën** rikuperon pa humbur formularin. |
| **Timeout gjatë dërgimit** | Marrja mbetet e pakonfirmuar. Rifreskoni dhe përdorni **Kontrollo marrjen**: e njëjta referencë rikuperohet pa aplikim të dytë. |
| **Nis shqyrtimin / kërko dokument / vendim** | Kontroll i veçantë për rishikuesin. Aktivizohen vetëm kalimet e vlefshme nga statusi aktual. |

## Çfarë ruhet dhe çfarë nuk ruhet

- `marketone.merchant-demo.v1` në localStorage ruan biznesin, aktivitetin, draftin, mostrat e dokumenteve, paketat dhe historikun e simuluar.
- `marketone.merchant-session.v1` në sessionStorage ruan vetëm hyrjen demonstruese. Dalja e heq sesionin; nuk fshin biznesin ose draftin.
- Nuk ruhen skedarë binarë, kredenciale bankare ose sekrete. Të gjitha të dhënat janë lokalisht të lexueshme nga browser-i; kjo nuk është ruajtje e sigurt për informacion financiar real.
- Ruajtja automatike bëhet pas 500 ms pa ndryshime. Kalimi përpara dhe **Ruaj dhe dil** presin konfirmimin e ruajtjes.
- Të dhënat e dëmtuara ose me version të pambështetur nuk mbishkruhen në heshtje: ndërfaqja ofron riprovim ose rivendosje të konfirmuar.
- Mbështetet një tab aktiv dhe një aplikim për skenar. Nuk ka sinkronizim mes pajisjeve ose bashkëpunim mes përdoruesve.

## Arkitektura e implementuar

`src/merchant/` ndan tipet, rregullat e domenit, repository-n lokal, provider-in e gjendjes dhe ekranet. Rrugët e merchant-it ndajnë të njëjtin layout. Funksionet për para, totalet, validimin, paketat dhe kalimet bankare janë të ndara nga React.

Gjendja e biznesit menaxhohet me Context dhe reducer. Adapter-i asinkron i ruajtjes jep një kufi të qartë për zëvendësim të ardhshëm; sot përdor vetëm browser-in. Gjendja e transmetimit është e dallueshme nga gjendja e shqyrtimit. Simulatori ruan referencat e marra për të shmangur dublikimin.

Prototipi i vjetër mbetet nën `/legacy-demo`, me testet, shportën dhe DummyJSON të tij. Rrugët e reja nuk importojnë ose thërrasin shërbimin e katalogut të vjetër.

## Kufiri i prodhimit

Hyrja nuk është autentikim dhe kontrolli i sesionit nuk është autorizim server-side. Nuk janë implementuar ruajtje private dokumentesh, skanim skedarësh, enkriptim bankar, verifikim identiteti, API banke ose vendimmarrje reale.

Paneli **Si do të transmetohej kërkesa në një shërbim real?** shpjegon arkitekturën e synuar. Integrimi i ardhshëm kërkon bankën dhe kontratën e saj, autentikim e izolim sipas biznesit, ruajtje private, politika të konfirmuara për të dhënat dhe teste sigurie/integrimi. Kontrata, disbursimi dhe shlyerja mbeten jashtë prototipit.
