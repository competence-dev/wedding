# Руслан & Амалия — wedding invitation

Production implementation of the supplied HTML design, with Russian navigation, mobile menu, animated envelope, wedding program, dress code, live countdown, and Telegram RSVP.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

## Publish

```sh
npm run build
```

Upload **all contents of `dist/`** to any static website host. No backend, database, bot token, or environment variables are required. For hosts connected to your repository, use build command `npm run build` and output directory `dist`.

`npm run preview` serves the built site locally. Hash-based routes support refreshes and subdirectory hosting without server rewrite rules.

## RSVP

The form prepares a Russian message with the guest's name, attendance, overnight stay, evening transfer, drinks, and wishes. It opens `https://t.me/u_amaliya?text=…`. Guests must press Send in Telegram themselves. The site never reports delivery; it shows a copyable message as a fallback. Declined responses omit overnight stay, transfer, and drinks. No responses are stored by this site.

## Edit content

- Wedding date, venue, schedule, copy, contact details: `src/main.jsx`.
- RSVP recipient and message format: `src/rsvp.js`.
- Colors and typography: `tailwind.config.cjs`.
- General styles: `src/styles.css`.
- Photos and supplied background music: `public/`. The default track is “A Thousand Years” by Christina Perri (`public/audio/a-thousand-years.mp3`), played only after the guest enables music.
- To use your own licensed music, copy `.env.example` to `.env.local` and set `VITE_MUSIC_URL`, then rebuild.

Google Fonts requires an internet connection; serif fallback fonts are provided. Supplied reference images are bundled locally. The map button searches the venue described in the supplied design; confirm the venue pin and event details before sharing with guests.
