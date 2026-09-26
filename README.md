# MarketOne — Paneli i Operatorit

Prototip responsiv për një operator marketi që hyn në një sesion të simuluar, shfleton një katalog publik, kërkon dhe filtron produkte, dhe ndërton një draft porosie brenda kufijve të stokut.

## Çfarë përfshin

- Hyrje dhe dalje të simuluar.
- Katalog nga API-ja publike [DummyJSON Products](https://dummyjson.com/docs/products), me loading, gabim/riprovim dhe katalog bosh.
- Kërkim sipas emrit, filtër kategorie dhe pastrim filtrash.
- Draft porosie me shtim, ndryshim sasie, heqje, total rreshti dhe total porosie.
- Kufizim sipas stokut dhe produkt i padisponueshëm.
- Layout desktop/mobile dhe shiriti mobile me numrin e artikujve, totalin dhe lidhjen te porosia.

Prototipi **nuk** kryen autentikim real, checkout, pagesë, rezervim stoku, ruajtje ose dërgim porosie. Nuk përmban eksperiencën Merchant; ajo trajtohet në [propozimin teknik](docs/propozimi-teknik.html).

## Si ta nisni në kompjuterin tuaj

Nuk nevojitet databazë, llogari ose API key. Nevojitet vetëm interneti dhe Node.js.

### 1. Instaloni Node.js

Shkarkoni dhe instaloni **Node.js 24 LTS** nga [nodejs.org](https://nodejs.org/). Pas instalimit, mbyllni dhe hapni përsëri terminalin.

Kontrolloni instalimin:

```bash
node --version
```

Duhet të shfaqet `v24` ose një version më i ri. Versioni minimal i mbështetur është `22.13.0`.

### 2. Merrni dhe hapni projektin

Shkarkoni repository-n me **Code → Download ZIP** dhe shpaketojeni, ose përdorni `git clone`. Pastaj hapni Terminal/PowerShell brenda dosjes së projektit, aty ku ndodhet `package.json`.

### 3. Instaloni pnpm dhe paketat

Kopjoni komandat më poshtë një nga një:

```bash
corepack enable
corepack install --global pnpm@11.19.0
pnpm install
```

Nëse komanda `corepack` nuk ekziston, përdorni këtë alternativë dhe pastaj ekzekutoni `pnpm install`:

```bash
npm install --global pnpm@11.19.0
```

### 4. Nisni aplikacionin

```bash
pnpm dev
```

Prisni derisa terminali të tregojë se serveri është gati, pastaj hapni [http://localhost:3000](http://localhost:3000) në Google Chrome, Edge, Firefox ose Safari.

Për ta ndalur aplikacionin, kthehuni te terminali dhe shtypni `Ctrl + C`.

### Probleme të zakonshme

- **Shfaqet `node:sqlite` ose një paralajmërim për Node.js:** po përdoret një version i vjetër. Instaloni Node.js 24 LTS, hapni terminal të ri dhe provoni përsëri.
- **Porta 3000 është e zënë:** niseni në një port tjetër me `pnpm exec next dev -p 3001`, pastaj hapni `http://localhost:3001`.
- **PowerShell nuk njeh `pnpm`:** mbyllni dhe hapni PowerShell pas instalimit. Në Windows mund të provoni edhe `pnpm.cmd install` dhe `pnpm.cmd dev`.
- **Produktet nuk shfaqen:** kontrolloni lidhjen me internetin, sepse katalogu ngarkohet nga DummyJSON.

## Kontrollet

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm start
```

`pnpm start` përdoret pas `pnpm build`. Testet përfshijnë validimin e emrit të operatorit, filtrimin sipas emrit dhe kategorisë, centët, stokun dhe totalet, si dhe rrjedhat login/logout, porosi, gabim/riprovim dhe katalog bosh.

Rezultatet e ekzekutuara dhe fushat që kandidati duhet të konfirmojë gjenden te [regjistri i verifikimit](docs/verification-log.md).

## Burimi i të dhënave dhe skenarët

`src/services/productService.ts` thërret:

```text
GET https://dummyjson.com/products?limit=12&select=id,title,category,price,stock,thumbnail
```

Përgjigjja përshtatet te tipi i brendshëm `Product`. Çmimi shumëzohet me 100 dhe rrumbullakohet menjëherë në centë USD; llogaritjet e shportës përdorin vetëm numra të plotë. Produkti i fundit nga përgjigjja shënohet pa stok që ky rast demonstrimi të jetë i qëndrueshëm edhe kur API-ja ndryshon.

Skenarët verifikohen nga zgjedhësi **“Skenar demonstrimi”**:

1. **Katalog normal** — kërkesë reale dhe listë produktesh.
2. **Gabim, pastaj riprovim** — kërkesa e parë përdor një endpoint të pavlefshëm; “Provo përsëri” përdor endpoint-in real.
3. **Katalog bosh** — kërkesa reale përfundon me sukses, por adapter-i kthen listë bosh.
4. **Pa rezultate** — në katalogun normal kërkoni një tekst që nuk ekziston; “Pastro filtrat” rikthen listën.

## Struktura dhe menaxhimi i gjendjes

- `src/app/` — App Router, metadata dhe tema Tailwind.
- `src/components/` — hyrja, dashboard-i, katalogu dhe përmbledhja e porosisë.
- `src/services/productService.ts` — kufiri me API-në dhe transformimi i DTO-së.
- `src/domain/` — funksione të pastra për filtrim, shportë dhe para.
- `src/hooks/useCatalog.ts` — cikli asinkron loading/success/error dhe retry.
- `src/types/domain.ts` — kontratat e domenit.

Gjendja mbahet lokalisht me React. Shporta ruan vetëm `productId → quantity`; artikujt, filtrat dhe totalet derivohen me `useMemo`, pa kopje që mund të dalin nga sinkronizimi. Nuk përdoret global store sepse prototipi ka një rrjedhë dhe një faqe.

## Supozime, kompromise dhe kufizime

- Monedha është USD, në përputhje me interpretimin e çmimeve të DummyJSON.
- Të 12 produktet trajtohen si katalog i një merchant-i demonstrues.
- Një porosi prodhimi përmban produkte nga vetëm një merchant; multi-merchant ndahet në porosi të veçanta.
- Emrat e produkteve mbeten siç vijnë nga API-ja, ndërsa UI-ja është në shqip.
- Katalogu varet nga disponueshmëria dhe kontrata e një shërbimi të jashtëm.
- Sesioni dhe shporta humbasin në refresh ose logout; ndryshimi i skenarit pastron shportën.
- Për një take-home të kufizuar në kohë u favorizuan funksionet e pastra, testet dhe rrjedha e plotë mbi persistence, caching të avancuar ose library të state management.

## Përdorimi i AI-së

U përdor **OpenAI Codex** për analizën e kërkesave, planin, scaffold-in, implementimin React/Next.js/Tailwind, testet, dokumentimin dhe ekzekutimin e kontrolleve të mundshme në ambient. Kandidati dha këto drejtime dhe vendime: plan para implementimit; tri pika rishikimi; UI në shqip; kalim nga Vite/CSS në Next.js/Tailwind; përdorim të një API-je publike; dhe shirit të fiksuar mobile për feedback-un e shportës. Në iterimin e 2026-09-26, Codex implementoi edhe refuzimin e emrit me vetëm hapësira, formën njëjës “1 artikull” dhe testet e integrimit për validimin dhe filtrin e kategorisë. Ndarja e plotë gjendet te [regjistri i vendimeve](docs/decision-log.md).

Deklarimi i veprimeve personale të kandidatit:

- **Ndryshime/rishikime personale:** ndryshimet e kodit të dokumentuara në këtë repository u implementuan me Codex; nuk pretendohet autorësi personale e kandidatit për to.
- **Testim manual personal:** më 2026-09-26, kandidati e testoi aplikacionin në Google Chrome dhe konfirmoi se funksionon siç pritet. Versioni i browser-it dhe viewport-et nuk u regjistruan.
- **Vendime personale:** më 2026-09-26, kandidati konfirmoi përdorimin e DummyJSON, monedhën USD, produktin demonstrues pa stok dhe kufirin one-merchant-per-order. Udhëzimet dhe arsyetimet dokumentohen në `docs/decision-log.md`.

## Lidhjet e dorëzimit

- GitHub: (https://github.com/Zmijanej/brendzmijanej-marketone)
- Live: nuk është publikuar; shtoni URL-në vetëm pasi deployment të jetë kryer dhe verifikuar.

Asnjë push në GitHub ose deployment nuk pretendohet në këtë repository.
