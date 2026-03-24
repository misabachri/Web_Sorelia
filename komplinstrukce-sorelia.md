# Komplexní instrukce – Sorelia Web

Tento dokument je sloučením tří zdrojů: `codex.md`, `sorelia-context.md` a `standard.md`.
Obsahuje vše potřebné pro vývoj a design webu Sorelia na jednom místě.

---

## ČÁST 1 – Filozofie vývoje (Codex)

### Základní principy

**Single Responsibility** – pracuj na jedné věci, dokončit ji pořádně před tím, než přejdeš dál.

**Clarity First** – nic neimplementuj, dokud není záměr a omezení pochopen z alespoň 95 %.

**Quality Over Speed** – čisté, modulární, udržovatelné řešení před rychlým nebo hacky.

**Incremental Progress** – buduj v malých, ověřitelných krocích. Každý krok musí dávat smysl sám o sobě.

**Calm Systems Beat Clever Tricks** – vyhni se zbytečné komplexitě, abstrakci a over-engineeringu.

### Obecné standardy kódu

- Dodržuj existující strukturu projektu, pojmenování a konvence
- Nikdy nezavádět druhý způsob řešení stejného problému
- Nikdy neexponovat tajné klíče, API tokeny, credentials ani privátní URL
- Environment proměnné jsou povinné pro citlivé hodnoty
- Verify changes před označením úkolu jako hotový
- Aktualizuj dokumentaci po dokončení feature
- Používej pouze nejnovější stabilní verze závislostí
- Vyhni se deprecated nebo opuštěným balíčkům
- Preferuj méně závislostí před mnoha malými

### Frontend & framework pravidla

**React / JSX**
- Vždy escapuj uvozovky pomocí `&quot;`
- Komponenty musí být čitelné na první pohled
- Vyhni se hluboko zanořeným JSX strukturám

**TypeScript**
- Nikdy nepoužívej `any`
- Vždy definuj explicitní typy nebo rozhraní
- Preferuj strict typing

**Tailwind CSS**
- Používej správnou syntaxi dle verze (v4 vs v3)
- Ověř dokumentaci před implementací
- Preferuj sémantické skupiny utilit před dlouhými nečitelnými řetězci

### Workflow

**Plánování** – rozděl složité úkoly na malé kroky, vytvoř TODO listy, identifikuj neznámé před kódováním.

**Implementace** – studuj existující vzory, reusuj utility a komponenty, implementuj nejmenší funkční verzi.

**Review** – přečti řešení pohledem začátečníka, odstraň vše zbytečné, potvrď shodu s původním záměrem.

### Rozhodování

- Pokud si nejsi jistý, zastav a ujasni
- Pokud existuje více možností, vysvětli trade-offy
- Nikdy nehádej potichu – explicitní předpoklady jsou vždy lepší než skryté

### AI spolupráce

- Pokládej upřesňující otázky pouze tehdy, kdy je to nutné
- Preferuj solidní výchozí návrh před nekonečnými možnostmi
- Buď upřímný, pokud je něco špatný nápad
- Optimalizuj pro dlouhodobou použitelnost, ne krátkodobý dojem

### Červené vlajky (vyhni se za každou cenu)

- Over-engineering
- Předčasná abstrakce
- Copy-paste bez porozumění
- „Uklidíme to později"
- Módní nástroje bez reálného přínosu

### Pravidlo dokončení

Done is better than perfect. Pokud řešení splňuje požadavky, je hotové. Nepřepracovávej dokončené feature bez jasného důvodu.

---

## ČÁST 2 – Projekt Sorelia (Context & Design Brief)

### Přehled projektu

Jednostránkový web pro ortopedickou ambulanci **Sorelia**.

**Cíl:**
- přehledná vizitka ordinace
- jasná komunikace ordinační doby
- jednoduché objednání (primárně e-mail)

**Cílová skupina:** převážně starší pacienti – důraz na čitelnost, jednoduchost a orientaci.

### Design Direction

Design musí být minimalistický, ale ne nudný – klidný, vzdušný, profesionální, moderní bez trendových efektů.

**Principy:**
- dominantní white space
- typografie = hlavní vizuální prvek
- červená pouze jako akcent
- žádný vizuální chaos

### Barevná paleta

| Název | Hex |
|---|---|
| Dust Grey | `#DAD2D8` |
| Black | `#080705` |
| Charcoal Blue | `#40434E` |
| Mahogany Red | `#A8201A` |

**Použití:**
- 80–90 % neutrální barvy
- červená pouze pro CTA a důležité prvky
- žádné barevné sekce
- žádné gradienty

### Typografie

**Nadpisy** – IBM Plex Sans, weight 500–600, velké a dominantní

**Text** – Source Sans 3, vysoce čitelný, klidný

**Pravidla:**
- `clamp()` pro nadpisy
- `rem` pro text
- `line-height: 1.5–1.8`
- max šířka textu: ~65ch

### Layout

- `max-width: 1440px`
- content: 85–90 %
- velké vertikální spacingy (80–120px)
- žádné stíny
- `border-radius: 6–10px`
- žádné zarovnání do bloku

### Navigace

„Soft pill bar" – zaoblený container, jemné šedé pozadí, hodně paddingu, čisté rozložení.

**CTA:** kontrastní tlačítko (černá / červená) – text: „Objednat se" / „Napsat e-mail"

**Chování:** sticky, při scrollu lehce menší.

### Vizuální detail (inspirace logem)

- tenké horizontální linky (inspirace stopkou listu)
- drobný akcent (např. bod)
- žádné ilustrace
- cíl: propojit design s logem nenápadně

### Struktura stránky

1. Hero
2. Aktuality
3. Ordinační doba
4. Jak se objednat + formulář
5. Lékaři
6. FAQ
7. Kontakt
8. Patička

### Hero sekce

- název ordinace
- krátký text
- CTA (email)
- sekundárně telefon
- aktuality (max 2)

### Ordinační doba

**Koncept:** nahoře aktuální týden (velký), dole mini kalendář (navigace).

**Interakce:** klik na den → změní týden, zvýraznění „dnes".

**Ukázka:**
```
Po 1. 4. – 8:00–14:00
Út 2. 4. – 8:00–16:00
St 3. 4. – Zavřeno
```

### Objednání

Krátký popis (3 kroky) + jednoduchý formulář.

**Pole:** jméno, telefon (povinné), email, výběr lékaře, zpráva.

### Lékaři

- jednoduché karty
- fotka + jméno + specializace
- hover detail (desktop, velmi jemný)

### FAQ

Max 3 otázky:
- Jak se objednat?
- Přijímáte nové pacienty?
- Je potřeba doporučení?

### Kontakt

- Google Maps (iframe)
- telefon, email, adresa
- QR kód (uložení kontaktu)

### Floating CTA

- vpravo dole
- pouze ikonka (email)
- otevře mail klienta

### Visual Style

- žádné animace
- žádné stíny
- žádné gradienty
- pouze jemné hover efekty
- tenké linky
- žádné přeplácání

### Design prvky

- víceřádkové nadpisy, kontrast váhy
- jemné střídání zarovnání sekcí
- underline (červená při hover)

### Obsah

- krátké věty, žádná omáčka
- důležité informace nahoře
- snadno skenovatelné

### Implementace

- mobile-first
- přístupnost
- rychlost
- minimum JS

### Cíl webu

Web má působit: klidně, přesně, důvěryhodně, moderně bez efektů.

---

## ČÁST 3 – Webové standardy (Standard)

### Performance & Optimalizace

- Lighthouse score: min. 90+ (mobile)
- LCP < 2.5s
- CLS < 0.1
- INP < 200 ms

**Optimalizační pravidla:**
- Moderní formáty obrázků (AVIF/WebP)
- `font-display: swap`
- Minimalizovat render-blocking CSS/JS
- Preload klíčových assetů (fonty, hero obrázek)
- Lazy load všech obrázků pod foldem
- Optimalizovat velikosti assetů, vyhýbat se zbytečným knihovnám

### UX & Navigace

- Sticky header na desktopu
- Jasné CTA above the fold
- Max 5–7 položek v hlavní navigaci
- Mobilní navigace s hamburger menu (vpravo)
- Logo vždy vlevo
- Klikatelné plochy min. 44px
- Active state pro aktuální stránku/sekci
- Vizuální hierarchie musí přirozeně vést pozornost uživatele

### Layout

- Max width: 1440px
- Content width: 85–90 % obrazovky
- Jasné oddělení sekcí
- Konzistentní spacing systém (doporučen 8px grid)
- Vyvážený white space
- Nikdy nezarovnávat text do bloku (justify)
- Max šířka textu: ~70 % obrazovky

### Analytika & Cookies

- Zeptat se, zda implementovat analytiku
- Pokud ano: implementovat (GA4 / Plausible / jiné) s respektováním consent
- Cookie bar musí být implementován pokud je vyžadován
- Cookie bar musí odpovídat designu webu

### SEO základy

- Správná struktura H1–H6
- Meta title a description na každé stránce
- Canonical URL
- Open Graph meta tagy
- Interní prolinkování
- Alt text pro všechny obrázky

**Soubory:** `sitemap.xml`, `robots.txt`, `llms.txt`

### Bezpečnost

- CSP header definován
- Základní security headers
- Formuláře musí obsahovat honeypot ochranu
- Validace a sanitizace uživatelských vstupů

### Formuláře

- Honeypot pole (skryté)
- Povinná pole jasně označena
- Přístupné labely (ne jen placeholdery)
- Spam ochrana povinná

### Vizuální & typografická pravidla

- `rem` pro body text
- `clamp()` pro nadpisy
- Line height: 1.5–1.8 pro odstavce
- Silný kontrast (min. 4.5:1)
- Čitelné fonty s českou diakritikou
- Konzistentní styly tlačítek a UI komponent

### Obrázky

- Optimalizované formáty (JPG/PNG nebo AVIF)
- Lazy load obrázků pod foldem
- Hero obrázek NELAZY načítat
- Vždy alt text

### Pravidla obsahu

- Jasný, stručný a strukturovaný text
- Žádná omáčka
- Silné nadpisy s jasnou informací
- Logická hierarchie obsahu (nejdůležitější první)

### Konzistence

- Jednotný design systém (barvy, spacing, komponenty)
- Konzistentní border-radius
- Pouze jemné stíny
- Konzistentní styl ikon
- Konzistentní padding/margins napříč podobnými prvky

---

## Rychlý referenční přehled

| Oblast | Hodnota |
|---|---|
| Max šířka layoutu | 1440px |
| Content width | 85–90 % |
| Vertical spacing | 80–120px |
| Border-radius | 6–10px |
| Text max-width | ~65ch |
| Line-height | 1.5–1.8 |
| Kontrast | min. 4.5:1 |
| Clickable area | min. 44px |
| Lighthouse | 90+ mobile |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

| Barva | Hex | Použití |
|---|---|---|
| Dust Grey | `#DAD2D8` | Pozadí, neutrální plochy |
| Black | `#080705` | Text, CTA |
| Charcoal Blue | `#40434E` | Sekundární text |
| Mahogany Red | `#A8201A` | Akcenty, CTA |

| Font | Použití |
|---|---|
| IBM Plex Sans | Nadpisy (500–600) |
| Source Sans 3 | Tělo textu |
