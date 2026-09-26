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
