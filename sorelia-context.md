# Sorelia – Web Context & Design Brief

## Project Overview
Jednostránkový web pro ortopedickou ambulanci **Sorelia**.

Cíl:
- přehledná vizitka ordinace
- jasná komunikace ordinační doby
- jednoduché objednání (primárně e-mail)

Cílová skupina:
- převážně starší pacienti
- důraz na čitelnost, jednoduchost a orientaci

---

## Design Direction

Design musí být:
- minimalistický, ale ne nudný
- klidný, vzdušný, profesionální
- moderní bez trendových efektů

### Principy:
- dominantní white space
- typografie = hlavní vizuální prvek
- červená pouze jako akcent
- žádný vizuální chaos

---

## Color Palette

- Dust Grey: #DAD2D8
- Black: #080705
- Charcoal Blue: #40434E
- Mahogany Red: #A8201A

### Použití:
- 80–90 % neutrální barvy
- červená pouze pro CTA a důležité prvky
- žádné barevné sekce
- žádné gradienty

---

## Typography

### Nadpisy
- IBM Plex Sans
- weight: 500–600
- velké, dominantní

### Text
- Source Sans 3
- vysoce čitelný
- klidný

### Pravidla
- clamp() pro nadpisy
- rem pro text
- line-height: 1.5–1.8
- max šířka textu: ~65ch

---

## Layout

- max-width: 1440px
- content: 85–90 %
- velké vertikální spacingy (80–120px)
- žádné stíny
- border-radius: 6–10px
- žádné zarovnání do bloku

---

## Navigation (Designový prvek)

Navigace jako „soft pill bar“:

- zaoblený container (pill)
- jemné šedé pozadí
- hodně paddingu
- čisté rozložení

CTA:
- kontrastní tlačítko (černá / červená)
- text: „Objednat se“ / „Napsat e-mail“

Chování:
- sticky
- při scrollu lehce menší

---

## Vizuální detail (inspirace logem)

Místo dekorací použít jemné reference:

- tenké horizontální linky (inspirace stopkou listu)
- drobný akcent (např. bod)
- žádné ilustrace

Cíl:
- propojit design s logem nenápadně

---

## Struktura stránky

1. Hero
2. Aktuality
3. Ordinační doba
4. Jak se objednat + formulář
5. Lékaři
6. FAQ
7. Kontakt
8. Patička

---

## Hero

- název ordinace
- krátký text
- CTA (email)
- sekundárně telefon
- aktuality (max 2)

---

## Ordinační doba (hlavní prvek)

### Koncept:
- nahoře aktuální týden (velký)
- dole mini kalendář (navigace)

### Interakce:
- klik na den → změní týden
- zvýraznění „dnes“

### Ukázka:
Po 1. 4. – 8:00–14:00  
Út 2. 4. – 8:00–16:00  
St 3. 4. – Zavřeno  

---

## Objednání

- krátký popis (3 kroky)
- jednoduchý formulář

### Pole:
- jméno
- telefon (povinné)
- email
- výběr lékaře
- zpráva

---

## Lékaři

- jednoduché karty
- fotka + jméno + specializace
- hover detail (desktop, velmi jemný)

---

## FAQ

max 3 otázky:
- Jak se objednat?
- Přijímáte nové pacienty?
- Je potřeba doporučení?

---

## Kontakt

- Google Maps (iframe)
- telefon
- email
- adresa
- QR kód (uložení kontaktu)

---

## Floating CTA

- vpravo dole
- pouze ikonka (email)
- otevře mail klienta

---

## Visual Style

- žádné animace
- žádné stíny
- žádné gradienty
- pouze jemné hover efekty
- tenké linky
- žádné přeplácání

---

## Design prvky

### Typografie
- víceřádkové nadpisy
- kontrast váhy

### Layout
- jemné střídání zarovnání sekcí

### Akcenty
- underline (červená při hover)

---

## Obsah

- krátké věty
- žádná omáčka
- důležité informace nahoře
- snadno skenovatelné

---

## Implementace

- mobile-first
- přístupnost
- rychlost
- minimum JS

---

## Cíl

Web má působit:
- klidně
- přesně
- důvěryhodně
- moderně bez efektů
