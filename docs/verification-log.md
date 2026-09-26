# Regjistri i verifikimit

Përditësimi i fundit: 2026-09-26

## Kontrollet automatike

| Kontrolli | Rezultati | Shënim |
| --- | --- | --- |
| `pnpm typecheck` | Kalon | Ekzekutuar me Node.js 24.11.1 dhe pnpm 11.19.0. |
| `pnpm lint` | Kalon, 0 warnings | ESLint përfundoi pa gabime ose paralajmërime. |
| `pnpm build` | Kalon | Next.js 16.3.6: compile, TypeScript, page data dhe 3/3 static pages përfunduan me sukses. |
| `pnpm test` | Kalon | 2 test files dhe 13/13 teste kaluan; përfshin regresionet për emrin me vetëm hapësira dhe filtrin e kategorisë. |

## Kontrolli manual i kryer nga Codex

- Login i simuluar dhe logout.
- Katalogu publik me 12 produkte, kategori, çmime USD, sasi stoku dhe produkt pa stok.
- Layout desktop i katalogut dhe panelit të porosisë.
- Viewport mobile 390 × 844; `scrollWidth` 375 kundrejt `innerWidth` 390, pa horizontal overflow.
- Shtim produkti dhe shfaqja e shiritit mobile me count/total.
- Klikimi “Shiko porosinë” dhe scroll-i te artikulli, quantity controls dhe totali.
- Skenari “Gabim, pastaj riprovim” rikuperon katalogun.
- Gjendja e katalogut bosh dhe gjendja e veçantë pa rezultate.

## Propozimi teknik

- Dokumenti ka saktësisht dy seksione A4 me `height: 297mm` dhe print page breaks.
- Ka gjashtë tituj të numëruar që mbulojnë të gjashtë pyetjet.
- Përfshin supozimin one-merchant-per-order, snapshot-et historike, endpoint-et me role, auth/security dhe ndarjen MVP/faza 2.
- Eksporti automatik me Chrome headless më 2026-09-26 prodhoi saktësisht 2 faqe A4 (`594.96 × 841.92 pt`). Kandidati duhet të bëjë kontrollin final vizual në print preview para dorëzimit.

## Për t’u plotësuar nga kandidati

- Më 2026-09-26, kandidati raportoi se e testoi aplikacionin në Google Chrome dhe se aplikacioni funksionoi siç pritej. Versioni i browser-it, viewport-et dhe lista e skenarëve nuk u regjistruan.
- Më 2026-09-26, kandidati konfirmoi në print preview se propozimi shfaqet në saktësisht 2 faqe A4 pa përmbajtje të prerë.
