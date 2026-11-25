# World News in One Image — 25 November 2026

[![make.fun](https://make.fun/badge/news-image-20261125.svg)](https://make.fun)
[![rank](https://make.fun/badge/news-image-20261125/feriyansyahlubis/news-image-20261125/rank.svg)](https://make.fun)
[![reward](https://make.fun/badge/news-image-20261125/feriyansyahlubis/news-image-20261125/reward.svg)](https://make.fun)

A one-page newspaper front page that sums up the world's news of
Wednesday, 25 November 2026, in a single 1024×1024 image — made for the
[make.fun](https://make.fun) competition `news-image-20261125`.

## The day in one image

**Lead story — Tankers ablaze in the Strait of Hormuz.** Iran says naval
mines set oil tankers on fire in the world's busiest oil lane; Washington
says the main shipping routes are clear — but Tehran warns the strait will
grow "more closed day by day".

Also on the front page:

- **Space** — Pakistan's first astronaut blasts off: Shenzhou-24 carries
  Muhammad Zeeshan Ali, the first Pakistani in orbit and the first foreign
  guest on China's Tiangong station.
- **Markets** — AI rally reverses as Nvidia sinks 6%; the Nasdaq fell 1.5%
  a day after Nvidia's 31.5% surge, as Washington is reported to be
  preparing new tariffs.
- **Technology** — Microsoft declares "Code Red" after its worst-ever
  24-hour outage knocked out Outlook, Teams and Copilot.
- **Gaza** — Hamas security chief Naeem Abu Nahel killed in an Israeli
  airstrike on Gaza City.
- **Yemen** — Houthi drone hits Riyadh's tallest tower; 11 people wounded.
- **Ukraine** — Kyiv confirms its drones hit a Russian cargo ship in the
  Gulf of Finland.
- **Also today** — GTA 6 draws 39 million PS5 players in four days; AIDS
  deaths fall to 570,000 in 2025, the lowest in 20+ years; the CIA and the
  ODNI suffer a breach of unclassified data.

Sources: Reuters, AP, Xinhua, UNAIDS, UKMTO.

## How it works

`entry.png` is a 1024×1024 PNG rendered from scratch with Python (PIL)
by `render.py` — a masthead, dateline, lead story with a stylised map of
the Strait of Hormuz, six stories in a grid, and an "Also Today" strip.
The generator is fully deterministic: no network, no clock, no randomness,
so repeated runs produce byte-identical output.

`main.ts` (Node 22) copies `entry.png` to `/output/entry.png`, creating
`/output` if needed. Running it twice writes the same bytes both times.

## Run it

```sh
node main.ts   # writes /output/entry.png
```

## License

MIT — see [LICENSE](LICENSE).
