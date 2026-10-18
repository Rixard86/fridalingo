# fridalingo

En Duolingo-klon för veckans engelska glosor, med en vit tecknad gås som maskot.

- Varje vecka får tre lektioner: **Lär dig** (flerval och para ihop), **Stava** (skriva och lyssna) och **Meningar** (fyll i de understrukna orden i en mening).
- **Repetera** blandar ord från alla veckor, och de ord man svarat fel på kommer först.
- XP, nivåer, dagsmål, dagssvit, kombo-räknare, märken och gåskläder som låses upp med nivåer.
- Framstegen sparas i en databas och följer med mellan enheter.

## Nya glosor varje vecka

1. Lägg veckans PDF i `glosor/`, t.ex. `glosor/Glosor v.44.pdf`.
2. Öppna Claude Code i projektet och skriv `/nya-glosor`.
3. Claude gör om PDF:en till en datafil, skriver exempelmeningar för de understrukna orden, visar listan för dig och pushar efter ditt OK. Vercel publicerar automatiskt.

Glosorna ligger i `src/data/glosor/vNN.json`.

## Publicera på Vercel (görs en gång)

1. Gå till [vercel.com/new](https://vercel.com/new), logga in med GitHub och importera repot `Rixard86/fridalingo`. Döp projektet till `fridalingo`.
2. Lägg till en databas: i projektet, gå till **Storage** → **Create Database** → **Upstash for Redis** (gratisplanen räcker) och koppla den till projektet. Då skapas `KV_REST_API_URL` och `KV_REST_API_TOKEN` automatiskt.
3. Under **Settings** → **Environment Variables**, lägg till:
   - `FAMILY_PASSWORD`: lösenordet för att logga in i appen.
   - `SESSION_SECRET`: en lång slumpsträng. Skapa en med `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`.
4. Gör en ny deploy (**Deployments** → **Redeploy**).

Den som loggar in skriver sitt namn och familjelösenordet. Varje namn får egna framsteg, så syskon kan också spela.

## Utveckling

```bash
npm install
npm run dev
```

Skapa `.env.local` med `FAMILY_PASSWORD` och `SESSION_SECRET` för lokal körning. Utan Redis-variablerna sparas framstegen i minnet medan dev-servern kör.

`npm run check` kör lint, typkontroll och tester.
