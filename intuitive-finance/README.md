# Intuitive Finance

Statický web postavený v Astro. Zdroj článků je v Markdownu, matematické zápisy se při buildu vykreslí pomocí KaTeXu.

## Přidání dalšího článku

1. Zkopíruj `src/content/articles/_template.md`.
2. Kopii pojmenuj podle adresy článku, například `particle-filters.md`.
3. Uprav údaje mezi prvními dvěma řádky `---` a vlož text článku.
4. Pokud už je článek uvedený v `src/data/navigation.ts`, jeho prázdná stránka je klikací předem a po přidání souboru se automaticky naplní obsahem.
5. Úplně nové téma přidej jedním řádkem také do `src/data/navigation.ts`.

Povolené hodnoty `section`:

- `filtering`
- `other`
- `case-studies`

## Rovnice

Inline zápis:

```md
$x_t = \mu + \varepsilon_t$
```

Samostatná rovnice:

```md
$$
x_t = \mu + \varepsilon_t
$$
```

## Obrázky a soubory

Obrázek vlož do `public/images` a v článku použij:

```md
![Popis obrázku](/images/nazev.png)
```

Excel nebo jiný soubor ke stažení vlož do `public/downloads` a použij:

```md
[Download the Excel workbook](/downloads/model.xlsx)
```

Jeden soubor na Cloudflare Pages může mít maximálně 25 MiB. Pro větší soubory je potřeba samostatné objektové úložiště.

## Lokální kontrola

```bash
npm install
npm run dev
```

Produkční build:

```bash
npm run build
```

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `intuitive-finance`
- Project name: `intuitive-finance`
