---
name: nya-glosor
description: Lägg in veckans nya glosor i Fridalingo från en PDF i glosor-mappen. Använd när användaren säger att en ny glosvecka har lagts till, ber om att lägga in nya glosor eller skriver /nya-glosor.
---

# Lägg in nya glosor

Läraren skickar en PDF varje vecka (`glosor/Glosor v.NN.pdf`) med 12 engelska ord och svensk översättning. Några ord är understrukna: de ska användas i en mening.

## Steg

1. Hitta PDF:er i `glosor/` som saknar en motsvarande `src/data/glosor/vNN.json`. Läs varje sådan PDF **visuellt** (Read-verktyget). Understrykningar syns bara i bilden, inte i texten.
2. Skapa `src/data/glosor/vNN.json` i samma format som de befintliga veckorna:
   - `en` och `sv` är listor. Det första värdet visas, resten godkänns också. Dela upp `a/b` i två alternativ (`"Kofta/tröja"` → `["Kofta", "Tröja"]`).
   - Kolumnrubrikerna kan vara omkastade (v.41 hade "Svenska | Engelska" fast vänsterspalten var engelska). Avgör språket från orden, inte rubriken.
   - Behåll lärarens svar. Rätta bara uppenbara stavfel (t.ex. "Bommullsklänning" → "Bomullsklänning") och berätta för användaren vilka du rättade.
   - Förklaringar inom parentes, som "Gammal (Jag är 10 år gammal)", hör inte till svaret.
   - Varje understruket ord får `"sentence": { "en": "...", "sv": "..." }`. Den engelska meningen har exakt en lucka `___` där ordet ska stå. Skriv enkla meningar som passar en 10-åring, och en svensk översättning.
3. Registrera veckan i `src/data/weeks.ts`: lägg till en import och lägg den i `RAW_WEEKS`.
4. Kör `npm run check` och `npm run build`. Allt måste vara grönt. Testerna kontrollerar bland annat att varje json-fil är registrerad och att varje mening har exakt en lucka.
5. Visa användaren ordlistan (engelska – svenska, understrukna markerade, meningarna) och be om ett OK.
6. Efter OK: committa (`Lägg till glosor v.NN`) och pusha till `main`. Vercel publicerar den nya veckan automatiskt inom någon minut.
