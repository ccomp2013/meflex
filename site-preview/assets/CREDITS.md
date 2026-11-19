# Credits for the website directions

## Photos
All nine photos came from Pexels on Nov 15, 2026 (details per photo in photos/photos.json).
How they were checked:
- **Pages:** each photo page was found through web search. Pexels' own pages refuse automated reading, so each photographer's name was taken from the search listing of that page.
- **Licence:** the Pexels License (free for commercial use, no attribution required) is site-wide, but it was not read on each page.
- **The images themselves:** each was looked at closely for brand, league or team marks and for children.
- **Before publishing:** check each page by hand. C-2 was replaced on Nov 15: figure skates were the wrong sport. The new photo is a hockey stick and pucks on ice, so the old photo's freestocks.org credit is no longer used.

| Slot | File | Source address | Photographer | Licence | Date fetched |
|---|---|---|---|---|---|
| A-1 | photos/a1-*.avif, .webp | https://www.pexels.com/photo/a-man-putting-on-ice-skates-while-sitting-on-the-wooden-bench-in-the-locker-room-6847593/ | Tima Miroshnichenko | Pexels License | 2026-11-15 |
| A-2 | photos/a2-*.avif, .webp | https://www.pexels.com/photo/metal-bar-with-net-on-the-ice-surface-6847387/ | Tima Miroshnichenko | Pexels License | 2026-11-15 |
| A-3 | photos/a3-*.avif, .webp | https://www.pexels.com/photo/man-with-facial-hair-using-a-laptop-9222424/ | Ron Lach | Pexels License | 2026-11-15 |
| B-1 | photos/b1-*.avif, .webp | https://www.pexels.com/photo/a-person-ice-skating-on-ice-rink-6468935/ | Tony Schnagl | Pexels License | 2026-11-15 |
| B-2 | photos/b2-*.avif, .webp | https://www.pexels.com/photo/hockey-players-entering-on-ice-rink-6468586/ | Tony Schnagl | Pexels License | 2026-11-15 |
| B-3 | photos/b3-*.avif, .webp | https://www.pexels.com/photo/woman-stretching-her-body-while-sitting-7888730/ | RDNE Stock project | Pexels License | 2026-11-15 |
| C-1 | photos/c1-*.avif, .webp | https://www.pexels.com/photo/photo-of-person-stretching-3758030/ | Alexy Almond | Pexels License | 2026-11-15 |
| C-2 | photos/c2-*.avif, .webp | https://www.pexels.com/photo/close-up-shot-of-a-hockey-puck-and-hockey-stick-6847470/ | Tima Miroshnichenko | Pexels License | 2026-11-15 |
| C-3 | photos/c3-*.avif, .webp | https://www.pexels.com/photo/a-cup-of-coffee-beside-a-laptop-8472496/ | Cup of Couple | Pexels License | 2026-11-15 |

## App pictures
The phone-frame screens (img/app-*.webp, img/app-*.avif) are MeFlex's own,
made by meflex/tools/site_assets.js from the built app on Nov 15, 2026. app-between-games-* was retaken from the live app (version cda5ddc6b18a, man guide) on Nov 17, 2026, so it shows the real stretch pictures.

## Fonts
Self-hosted from Google Fonts (fonts.gstatic.com), Latin subset, fetched Nov 15, 2026 (list in fonts/fonts.json).
All under the SIL Open Font License 1.1:
- Fraunces (Undercase Type) — direction A display
- Source Serif 4 (Adobe) — direction A text
- Big Shoulders Display (Patric King) — direction B display
- Barlow (Jeremy Tribby) — direction B text
- Instrument Serif (Instrument) — direction C display
- Hanken Grotesk (Hanken Design Co.) — direction C text

## Stretch pictures (Z1, Nov 17)
`img/low-lunge-*-400.webp` and `img/lib/*-400.webp` are MeFlex's own AI-generated stretch pictures, approved by Chris and
shipped in the app (`meflex-source` `app/figures/`), resized to 400 px. The page labels them "Pictures made with AI.".
The traced `lunge.svg` is no longer used on this page and was removed (the three directions keep their own copy in `directions/shared/`).

FF4 (Nov 18): 34 more `img/lib/*-400.webp` for the three hockey drafts (referee, goalie and adult-league pages), made the same way
from the live app's 640 px pictures (version cda5ddc6b18a), WebP quality 80. Where a woman picture differs from the written steps
(Front Leg Swings, Standing Groin Stretch, Lying Hamstring, Standing Forward Fold; `docs/reports/steps-vs-pictures.md` in meflex-source),
the page uses the man's.

**Nov 18 (four audiences):** `img/lib/` is regenerated from the live app pictures (0219f420a8d6: the man's new shorts, the woman's redraws), and holds 8 more for the Everyone page. All are MeFlex's own AI-generated stretch pictures.

**Nov 18, about 9:30 PM:** the 26 man pictures (`*-man-400.webp`) are made again from the live app's pictures (5d3319960b0b), so the ten from the man's longer-shorts batch 3 match the app. Each is the live 960 px picture scaled to 400 px; the woman's are unchanged.
