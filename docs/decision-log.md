# Regjistri i vendimeve

Ky dokument dallon udhëzimet dhe vendimet e kandidatit nga zgjedhjet e propozuara ose të implementuara me ndihmën e AI-së. Regjistrohen vendimet që ndikuan produktin, verifikimin ose dokumentimin; kërkesat thjesht logjistike nuk trajtohen si vendime teknike. Duhet rishikuar nga kandidati para dorëzimit.

## Vendime dhe udhëzime të kandidatit

| Data | Vendimi / udhëzimi | Ndikimi në implementim |
| --- | --- | --- |
| 2026-09-25 | Të përgatitet plani para implementimit dhe të krijohen pika të posaçme për rishikim, ndryshime dhe testim nga kandidati. | Puna u nda në tri pika kontrolli dhe ndalet për rishikim pas secilës fazë. |
| 2026-09-25 | U zgjodhën tri pika kontrolli dhe ndërfaqja në gjuhën shqipe. | UI-ja dhe dokumentimi shkruhen në shqip; dorëzimi bëhet me rishikime të ndërmjetme. |
| 2026-09-25 | Stack-u duhet të jetë Next.js me Tailwind CSS, jo Vite me CSS të zakonshëm. | Implementimi fillestar Vite u zëvendësua me Next.js App Router dhe Tailwind CSS. |
| 2026-09-25 | Të dhënat e produkteve duhet të vijnë nga një API publike, jo nga JSON lokal. | Katalogu ngarkohet nga një burim HTTP publik; shtresat e loading/error/empty kalojnë në të njëjtin shërbim. |
| 2026-09-25 | Në mobile, pas shtimit të produktit, të përdoret opsioni 1: shiriti i fiksuar i shportës. | U shtua një shirit i poshtëm me numrin e artikujve, totalin dhe veprimin “Shiko porosinë”. |
| 2026-09-25 | Pika e dytë e kontrollit u miratua pas shtimit të shiritit mobile. | Implementimi funksional u konsiderua gati për dokumentim dhe verifikim përfundimtar. |
| 2026-09-26 | Para çdo ndryshimi për gabimin e instalimit, të shpjegohet fillimisht shkaku. | U diagnostikua mospërputhja mes Node.js 20.18.0 dhe pnpm 11.19.0 para ndryshimit të ambientit. |
| 2026-09-26 | Të zgjidhet gabimi i instalimit dhe projekti të përdorë versionet e synuara nga repository. | Ambienti u kalua në Node.js 24.11.1 dhe pnpm 11.19.0; `package.json` dhe README deklarojnë kufirin minimal Node.js 22.13.0. |
| 2026-09-26 | Të auditohet dorëzimi kundrejt çdo kërkese të Task 1, Task 2, dokumentimit dhe deklarimit të AI-së. | U kontrolluan burimi, testet, build-i, propozimi teknik, README-ja dhe gjendja e Git; boshllëqet e dorëzimit u raportuan veçmas nga funksionaliteti. |
| 2026-09-26 | Të përfundohen detyrat objektive që mund të kryhen nga Codex, pa plotësuar në emër të kandidatit deklarime personale të pakonfirmuara. | U korrigjuan kërkesat e Node.js, metadata ESM, `.gitignore`, emri i testit USD dhe regjistri i verifikimit; kontrollet automatike dhe struktura A4 u riverifikuan. |
| 2026-09-26 | Të implementohet plani për validimin e emrit, formën njëjës të artikullit dhe mbulimin e filtrit të kategorisë. | Codex shtoi gabimin inline të aksesueshëm, tekstin “1 artikull” dhe dy teste integrimi; suite-a u rrit në 13 teste. |
| 2026-09-26 | U konfirmuan DummyJSON, USD, produkti demonstrues pa stok dhe kufiri one-merchant-per-order. | Katër zgjedhjet e propozuara nga AI u shënuan si të miratuara nga kandidati. |
| 2026-09-26 | U konfirmua se aplikacioni u testua në Google Chrome dhe funksionoi siç pritej. | Konfirmimi u regjistrua në README dhe në regjistrin e verifikimit, pa shpikur version browser-i ose viewport-e. |
| 2026-09-26 | U konfirmua se print preview i propozimit teknik shfaq saktësisht dy faqe A4 pa clipping. | Kontrolli personal u shtua krahas verifikimit automatik të madhësisë dhe numrit të faqeve. |
| 2026-09-26 | README-ja të ketë udhëzime që mund t’i ndjekë një person jo teknik për ta nisur aplikacionin në kompjuterin e vet. | U shtuan hapa për Node.js, shkarkimin e projektit, pnpm, instalimin, nisjen, ndalimin dhe problemet më të zakonshme. |

## Zgjedhje implementimi të propozuara nga AI

| Zgjedhja | Arsyeja | Statusi për rishikim nga kandidati |
| --- | --- | --- |
| DummyJSON si API publike e katalogut | Ofron emër, kategori, çmim, stok dhe imazh në një kontratë të vetme për prototip. | Konfirmuar nga kandidati më 2026-09-26. |
| USD si monedhë e katalogut publik | Vlerat e DummyJSON trajtohen si çmime USD dhe konvertohen menjëherë në centë. | Konfirmuar nga kandidati më 2026-09-26. |
| Produkti i fundit shënohet pa stok në adapter | E bën gjendjen e kërkuar “pa stok” të parashikueshme edhe nëse API-ja ndryshon. | Konfirmuar nga kandidati më 2026-09-26. |
| Një merchant i vetëm për prototipin | Mban draftin e porosisë në përputhje me supozimin e një merchant-i për porosi. | Konfirmuar nga kandidati më 2026-09-26. |

## Ndryshime të implementuara me ndihmën e Codex

| Data | Ndryshimi | Arsyeja | Statusi i verifikimit |
| --- | --- | --- | --- |
| 2026-09-26 | Validim trim-aware për emrin e operatorit, me gabim inline të aksesueshëm. | Atributi HTML `required` pranonte një vlerë me vetëm hapësira, ndërsa sesioni ruante emër bosh pas `trim()`. | Testet automatike kalojnë; kandidati raportoi se aplikacioni funksionoi siç pritej në Google Chrome. |
| 2026-09-26 | Forma njëjës “1 artikull” në përmbledhjen e porosisë. | Korrigjonte tekstin “1 artikuj” dhe emrin e aksesueshëm të badge-it. | Testet automatike kalojnë; kandidati raportoi se aplikacioni funksionoi siç pritej në Google Chrome. |
| 2026-09-26 | Dy teste integrimi për emrin me hapësira dhe filtrin e kategorisë. | Mbulon regresionin e login-it dhe sjelljen e filtrimit nga këndvështrimi i përdoruesit. | 2 test files dhe 13/13 teste kalojnë. |

## Rishikimi i konceptit — 2026-09-28

- Përdoruesi kërkoi që biznesi të jetë në qendër, me vëmendje te portali i mikro-kredisë dhe paneli i operatorit.
- U konfirmuan dorëzimi si koncept UX me plan ekranesh, dyqani i vogël i pavarur si audiencë dhe aktiviteti i MarketOne si kufi i të dhënave të panelit.
- Codex përgatiti tetë skica statike me shpjegime, rrjedhën e propozuar të bankës, gjendjet e rikuperimit, prioritetet dhe kriteret e validimit në `marketone-merchant-revision.md` dhe `.html`.
- UI-ja e skicave dhe teksti mbetën në shqip, duke ndjekur materialet ekzistuese. Banka, kriteret, kushtet dhe juridiksioni nuk u supozuan si të konfirmuara.
- Ky dorëzim nuk ndryshon aplikacionin e katalogut dhe nuk implementon një shërbim kredie. Autorizimi për implementimin e planit u përdor për të përfunduar dokumentet pa pika të reja miratimi.
- Nuk pretendohet testim me tregtarë ose verifikim personal nga kandidati; skenarët e validimit mbeten propozime.

## Implementimi i hapësirës së biznesit — 2026-09-29

- Përdoruesi miratoi prototipin interaktiv, ruajtjen në të njëjtin browser, rrjedhat mbështetëse funksionale dhe ruajtjen e aplikacionit të vjetër në një rrugë të veçantë.
- Codex implementoi hapësirën merchant me Context/reducer, repository lokal të versionuar dhe domen të veçuar nga katalogu i vjetër. Nuk u shtuan varësi runtime.
- Dokumentet zgjidhen nga mostra të integruara; nuk lexohet filesystem-i i përdoruesit dhe nuk transmetohet aplikim në bankë. Kontrollet dhe përgjigjet bankare janë të emërtuara si simulime.
- Paketa fillestare ruan formën, dokumentet, raportin dhe autorizimin për versionin. Përgjigjja shtesë ruan vetëm dokumentin e ri, periudhën, bankën demo dhe referencën e aplikimit.
- Monedha paraqitet shprehimisht si USD; datat përdorin emërtim shqip edhe në browser-a me mbështetje të kufizuar për locale.
- Testet ekzistuese të porositjes u ruajtën. U shtuan teste të domenit, ruajtjes dhe rrjedhave UI; verifikimet e ekzekutuara dokumentohen veçmas.
- Nuk pretendohet testim personal nga kandidati, studim përdorshmërie me tregtarë, integrim bankar real ose gatishmëri prodhimi.
