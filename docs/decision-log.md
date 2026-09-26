# Regjistri i vendimeve

Ky dokument dallon udhëzimet dhe vendimet e kandidatit nga zgjedhjet e propozuara ose të implementuara me ndihmën e AI-së. Duhet rishikuar nga kandidati para dorëzimit.

## Vendime dhe udhëzime të kandidatit

| Data | Vendimi / udhëzimi | Ndikimi në implementim |
| --- | --- | --- |
| 2026-09-25 | Të përgatitet plani para implementimit dhe të krijohen pika të posaçme për rishikim, ndryshime dhe testim nga kandidati. | Puna u nda në tri pika kontrolli dhe ndalet për rishikim pas secilës fazë. |
| 2026-09-25 | U zgjodhën tri pika kontrolli dhe ndërfaqja në gjuhën shqipe. | UI-ja dhe dokumentimi shkruhen në shqip; dorëzimi bëhet me rishikime të ndërmjetme. |
| 2026-09-25 | Stack-u duhet të jetë Next.js me Tailwind CSS, jo Vite me CSS të zakonshëm. | Implementimi fillestar Vite u zëvendësua me Next.js App Router dhe Tailwind CSS. |
| 2026-09-25 | Të dhënat e produkteve duhet të vijnë nga një API publike, jo nga JSON lokal. | Katalogu ngarkohet nga një burim HTTP publik; shtresat e loading/error/empty kalojnë në të njëjtin shërbim. |
| 2026-09-25 | Në mobile, pas shtimit të produktit, të përdoret opsioni 1: shirit i fiksuar i shportës. | U shtua një shirit i poshtëm me numrin e artikujve, totalin dhe veprimin “Shiko porosinë”. |
| 2026-09-25 | Pika e dytë e kontrollit u miratua pas shtimit të shiritit mobile. | Implementimi funksional u konsiderua gati për dokumentim dhe verifikim përfundimtar. |

## Zgjedhje implementimi të propozuara nga AI

| Zgjedhja | Arsyeja | Statusi për rishikim nga kandidati |
| --- | --- | --- |
| DummyJSON si API publike e katalogut | Ofron emër, kategori, çmim, stok dhe imazh në një kontratë të vetme për prototip. | Konfirmuar nga kandidati më 2026-09-26. |
| USD si monedhë e katalogut publik | Vlerat e DummyJSON trajtohen si çmime USD dhe konvertohen menjëherë në centë. | Konfirmuar nga kandidati më 2026-09-26. |
| Produkti i fundit shënohet pa stok në adapter | E bën gjendjen e kërkuar “pa stok” të parashikueshme edhe nëse API-ja ndryshon. | Konfirmuar nga kandidati më 2026-09-26. |
| Një merchant i vetëm për prototipin | Mban draftin e porosisë në përputhje me supozimin e një merchant-i për porosi. | Konfirmuar nga kandidati më 2026-09-26. |

## Ndryshime të implementuara nga Codex

| Data | Ndryshimi | Arsyeja | Statusi për kandidatin |
| --- | --- | --- | --- |
| 2026-09-26 | Validim trim-aware për emrin e operatorit, me gabim inline të aksesueshëm. | Atributi HTML `required` pranonte një vlerë me vetëm hapësira, ndërsa sesioni ruante emër bosh pas `trim()`. | Për t’u rishikuar dhe testuar personalisht. |
| 2026-09-26 | Forma njëjës “1 artikull” në përmbledhjen e porosisë. | Korrigjonte tekstin “1 artikuj” dhe emrin e aksesueshëm të badge-it. | Për t’u rishikuar dhe testuar personalisht. |
| 2026-09-26 | Dy teste integrimi për emrin me hapësira dhe filtrin e kategorisë. | Mbulon regresionin e login-it dhe sjelljen e filtrimit nga këndvështrimi i përdoruesit. | Testet automatike kalojnë; testimi personal mbetet për kandidatin. |
