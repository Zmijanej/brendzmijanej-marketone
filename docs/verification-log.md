# Regjistri i verifikimit

Përditësimi i fundit: 2026-09-29

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

## Rishikimi UX — 2026-09-28

- U krijuan `docs/marketone-merchant-revision.md` dhe `.html`: 9 seksione, 8 skica ekranesh dhe 1 rrjedhë e transmetimit te banka.
- Kontrolli i strukturës HTML konfirmoi `lang="sq"`, lidhje të brendshme pa destinacione të munguara, zero skripte dhe zero burime të jashtme. Dokumenti hapet lokalisht pa server ose lidhje interneti.
- U inspektuan vizualisht kopertina dhe skica e panelit në Chrome headless. Matjet në viewport desktop 1440 × 1100 dhe mobile 390 × 844 nuk treguan overflow horizontal; në mobile `innerWidth` dhe `scrollWidth` ishin të dy 390.
- `git diff --check` kaloi. U shfaq vetëm paralajmërimi i Git për normalizimin LF/CRLF.
- Nuk u ndryshua kodi i aplikacionit, paketat ose konfigurimi. Kontrollet typecheck/lint/test/build të aplikacionit nuk u riekzekutuan për këtë ndryshim dokumentimi; rezultatet e 2026-09-26 më sipër mbeten historike.
- Nuk u testuan shërbime bankare, ruajtje formularësh, autentikim, kontrolle sigurie në prodhim ose përdorshmëri me tregtarë. Këto janë kërkesa dhe skenarë të propozuar në koncept. Printimi ka stile të posaçme; faqosja e një eksporti PDF nuk u verifikua.

## Prototipi interaktiv i biznesit — 2026-09-29

| Kontrolli | Rezultati | Evidenca |
| --- | --- | --- |
| TypeScript | Kalon | `tsc --noEmit`, pa gabime. |
| ESLint | Kalon | `pnpm.cmd lint`, zero gabime/paralajmërime. Pas bllokimit të leximit të dosjes ekzistuese .gstack në sandbox, kontrolli u përsërit me lejen e nevojshme. |
| Testet | Kalojnë | 4 skedarë, 47/47 teste: 13 ekzistuese dhe 34 të reja. Pas korrigjimit final të inicializimit, u përsëritën edhe 6/6 testet e ndërfaqes me sukses. |
| Production build | Kalon | `pnpm.cmd build`: compile, TypeScript dhe 11/11 faqe statike. Fonti ekzistues Manrope kërkoi qasje në rrjet; build-i i përsëritur me leje përfundoi me sukses. |
| Chrome / Playwright | Kalon | 29 kontrolle mbi serverin lokal `next start`, pa gabime JavaScript të faqes. |
| Diff | Kalon | `git diff --check`; vetëm njoftime LF/CRLF. |

### Rrjedhat e verifikuara

- Paneli në desktop 1440 px, tablet 768 px dhe mobile 390 px; konfirmimi i detyrës dhe browser back. Menuja mobile hapet dhe mbyllet me Escape.
- Drafti ruhet dhe rikthehet pas refresh; testet e ndërfaqes mbulojnë edhe logout, dështimin e ruajtjes, të dhënat e dëmtuara dhe konfigurimin e një biznesi të ri.
- Formulari, dokumentet mostër, dështimi/riprovimi i formatit, rishikimi dhe çaktivizimi i autorizimit pas ndryshimit të të dhënave.
- Timeout-i, refresh-i dhe marrja e konfirmuar përdorin të njëjtën referencë. Kërkesa për dokument shtesë shfaqet në panel dhe përgjigjja ka autorizim të veçantë.
- Miratimi dhe refuzimi i simuluar; versioni historik mbetet i lexueshëm dhe nuk ndryshon pas redaktimit të profilit. Paketa shtesë kufizohet te dokumenti i ri, periudha, banka dhe referenca fillestare.
- Rrugët e operacioneve në desktop/mobile pa overflow horizontal. Kontroll shtesë reflow në 720 CSS px, ekuivalent i hapësirës në 200% në ekran 1440 px; nuk u krye zoom native i browser-it.
- Zero input-e skedarësh realë dhe zero kërkesa të jashtme nga rrugët merchant. Katalogu i vjetër te /legacy-demo u testua me DummyJSON të zëvendësuar me fixture, duke ruajtur login-in dhe porositjen.
- U inspektuan screenshot-et e panelit desktop/mobile dhe rishikimit të aplikimit.

### Kufijtë e evidencës

Këto janë kontrolle lokale të një prototipi me të dhëna fiktive, jo provë deployment-i ose integrimi bankar. Nuk u krye dërgim real kredie, autentikim real, ngarkim dokumentesh private, audit sigurie prodhimi ose studim me tregtarë. Build-i prodhues mbetet një prototip me ruajtje në browser. Rezultatet më të vjetra sipër ruhen si histori.

## Menuja mobile — 2026-09-29

- U implementua opsioni 2: header kompakt sticky dhe drawer modal me lartësinë e viewport-it, sfond të errësuar, buton mbylljeje të përhershëm dhe navigim që scroll-on veçmas.
- Hapja bllokon scroll-in e faqes. Mbyllja rikthen pozicionin dhe fokusin; funksionojnë butoni, sfondi, Escape, destinacioni i zgjedhur dhe browser back. Kalimi në desktop mbyll modalin dhe çliron faqen.
- Chrome/Playwright: 12/12 kontrolle kaluan në 390 × 844, 844 × 390, 320 × 568 dhe desktop 1280 × 900. U kontrolluan Tab/Shift+Tab, wheel dhe touch në sfond, lëvizja në drawer, rikthimi i scroll-it dhe preferenca reduced-motion. Pa gabime JavaScript të faqes. Screenshot-et mobile dhe landscape u inspektuan vizualisht.
- 6/6 testet ekzistuese të ndërfaqes merchant kaluan. Lint pa paralajmërime, TypeScript dhe production build me 11/11 faqe statike kaluan. `git diff --check` kaloi.
- Verifikimi i prekjes përdori emulimin e Chrome; nuk përfshin testim në pajisje fizike ose Safari iOS.
