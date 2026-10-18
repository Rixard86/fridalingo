# fridalingo

En Duolingo-klon för veckans engelska glosor, med en vit tecknad gås som maskot.

- En karta i Candy Crush-stil där varje vecka är en egen värld med fyra banor: **Lär dig** (flerval och para ihop), **Stava** (skriva och lyssna), **Meningar** (fyll i de understrukna orden) och **Veckoprov** (skriv alla ord, som på provet).
- Banorna låses upp i ordning och ger 1–3 stjärnor beroende på antal fel.
- Kartan tar aldrig slut: efter senaste veckan fortsätter den med mixvärldar som blandar ord från alla veckor, och svåra ord kommer oftare.
- När en ny vecka läggs in hamnar dess värld direkt efter spelarens senast klarade bana. Klarade banor, nummer och stjärnor ändras aldrig, och en ny oändlig mixström startar efter den nya veckan.
- **Endless**: ord efter ord från alla veckor med 3 hjärtan, en timer som blir kortare och ett personligt rekord.
- **Topplista** för nivå, karta och Endless, 26 märken och 11 kombinerbara gåsgrejer (keps, solglasögon, hoodie, skateboard och mer).
- **Repetera** blandar ord från alla veckor, och de ord man svarat fel på kommer först.
- XP, nivåer, dagsmål, dagssvit, kombo-räknare, märken och gåskläder som låses upp med nivåer.
- Varje spelare skapar ett eget konto med eget användarnamn och lösenord. Framstegen sparas i en databas och följer med mellan enheter.

## Nya glosor varje vecka

1. Lägg veckans PDF i `glosor/`, t.ex. `glosor/Glosor v.44.pdf`.
2. Öppna Claude Code i projektet och skriv `/nya-glosor`.
3. Claude gör om PDF:en till en datafil, skriver exempelmeningar för de understrukna orden, visar listan för dig och pushar efter ditt OK. Vercel publicerar automatiskt.

Glosorna ligger i `src/data/glosor/vNN.json`.

## Publicera på Vercel (görs en gång)

1. Gå till [vercel.com/new](https://vercel.com/new), logga in med GitHub och importera repot `Rixard86/fridalingo`. Döp projektet till `fridalingo`.
2. Lägg till en databas: i projektet, gå till **Storage** → **Create Database** → **Upstash for Redis** (gratisplanen räcker) och koppla den till projektet. Då skapas `KV_REST_API_URL` och `KV_REST_API_TOKEN` automatiskt.
3. Under **Settings** → **Environment Variables**, lägg till `SESSION_SECRET` (typ Secret): en lång slumpsträng. Skapa en med `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
4. Gör en ny deploy (**Deployments** → **Redeploy**).

Nya spelare väljer **Ny spelare** och skapar ett konto med eget användarnamn och lösenord. Lösenorden sparas som scrypt-hashar, aldrig i klartext. Det finns ingen återställning av glömda lösenord: ta bort nyckeln `user:<användarnamn>` i Upstash-konsolen så kan kontot skapas igen (framstegen ligger kvar under `progress:<användarnamn>`).

## Utveckling

```bash
npm install
npm run dev
```

Skapa `.env.local` med `SESSION_SECRET` för lokal körning. Utan Redis-variablerna sparas konton och framsteg i minnet medan dev-servern kör.

`npm run check` kör lint, typkontroll och tester.
