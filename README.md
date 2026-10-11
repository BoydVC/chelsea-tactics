# Chelsea FC Tactics Board

Offline multi-screen Chelsea tactics / match-prep board for Christopher Boyd (Chelsea fan since childhood). Stamford Bridge blue chrome, interactive EXAMPLE formations, animated set-piece diagrams, a fictional season desk, and a local fan notepad — all labeled demo data, no invented live stats.

## Screens
1. **Matchday** — hero countdown to a labeled DEMO kickoff, Bridge vibe, prep checklist
2. **Formation** — SVG pitch, drag EXAMPLE XI dots, shapes 4-2-3-1 / 4-3-3 / 3-4-3, localStorage save
3. **Set Pieces** — canvas animations for 4 EXAMPLE corner / free-kick plays
4. **Season Desk** — fictional EXAMPLE matchweek table (not real fixtures)
5. **Fan Notes** — localStorage notepad + watch checklist

## Run
```bash
cd /workspace/tokenmax/chelsea-tactics
./run.sh          # build + serve http://127.0.0.1:4285/
./run.sh --shots  # also write screenshots/
```

- Offline single file: `dist/chelsea-tactics.html`
- Health: `http://127.0.0.1:4285/health`
- Bind: `127.0.0.1` only · port **4285**

## Sources / gaps
- **Public facts used:** club name Chelsea FC, home Stamford Bridge, club blue `#034694`, Premier League branding as generic text.
- **EXAMPLE only:** all XIs, opponent names, fixture weeks, set-piece outcomes, countdown target.
- **Not included:** live tables, odds, injuries, verified 2025/26 fixtures, player stats.
- No CDNs / analytics; system fonts + inline SVG / canvas.

## Build
`build.py` inlines `web/app.css` and `web/app.js` into `dist/chelsea-tactics.html` via `/*__CSS__*/` and `/*__APP__*/` placeholders.


---
## Repo notes
- **Built:** Oct 2026 (TokenMax build week; see SHORTLIST/ledger), by TokenMax (Boyd's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/chelsea-tactics` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
