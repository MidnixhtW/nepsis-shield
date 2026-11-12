# Nepsis Shield launch kit

Everything here is ready to copy and upload. Regenerate the images after UI changes with
`node scripts/generate-store-assets.mjs` (with a local build running on port 4173).

---

## Google Play listing

**App name** (30 characters max)
> Nepsis Shield: Orthodox Prayer

**Short description** (80 characters max)
> Orthodox prayer, Scripture, saints & fasts. Free, private, and works offline.

**Category:** Lifestyle · **Tags:** Prayer, Bible, Spirituality

**Privacy policy URL:** https://www.nepsisshield.com/privacy

**Full description** (4000 characters max)

> Nepsis Shield is a free Orthodox Christian companion for prayer, Scripture, the saints, and the fasts of the Church year: for students and parents, converts and lifelong Orthodox, and anyone who wants a steadier rule of prayer. If you serve in the military, police, fire, EMS, dispatch, corrections, or as a chaplain, it adds support for your work too.
>
> PRAY
> • Morning, evening, and night prayers in four lengths, including St. Seraphim of Sarov's short rule for shifts and deployments
> • Distraction-free full-screen prayer, one step at a time, with read-aloud
> • A list of names for health and for repose, prayed in your daily prayers and printable for church
> • The Jesus Prayer with a prayer-rope counter, a stillness timer, and evening prayers for sleep
>
> KEEP THE FASTS
> • Day-by-day journeys through Great Lent, Holy Week, Pascha to Pentecost, and the Apostles', Dormition, and Nativity fasts
> • A short traditional prayer and practice for each day, with the feasts and saints along the way
> • Reminders the evening before each fast begins
> • New Calendar and Old Calendar
>
> READ
> • The day's Epistle and Gospel, the Bible, and reading plans, set in a book typeface for calm reading
> • Today's saints and feasts
>
> FOR THOSE WHO SERVE
> • Choose your calling (military, police, fire, EMS, dispatch, corrections, chaplain) for role-specific prayers and resets, 24-hour time, and soldier saints marked on the calendar
>
> WHEN PRESSURE RISES
> • One tap to "Help": short guided steps for anxiety, temptation, anger, exhaustion, or dryness
> • A guided reset, Psalm 90 (91), and crisis line information
>
> YOUR RULE OF LIFE
> • A simple personal Rule of Vigilance built from what you need most
> • The hour of prayer shown beside the date
>
> PRIVATE BY DESIGN
> No account, no ads, and no tracking in the app. Your prayers, names, notes, and progress stay on your phone, with an optional encrypted backup.
>
> Nepsis Shield supports prayer and learning; it does not replace your priest, chaplain, or counselor.

**Privacy policy URL:** https://www.nepsisshield.com/privacy-policy (Terms: `/terms`, Cookie Policy: `/cookies`).

**Data safety answers (Android app)** — check these against the current build before submitting. Prayer groups and the fast count are optional features that send data to the app's server, so "None" is not accurate:
- Data collected (all optional, all for **App functionality**, encrypted in transit):
  - **Personal info → Name**: the first name a person chooses in a prayer group.
  - **App activity → Other user-generated content**: prayer requests and daily prayer marks in a group.
  - **Device or other IDs**: the random number made on the device for the fast count and for recognizing a person's own requests in a group.
- Data shared: **None.** (Group members see requests because the user chose to post them; Play does not count user-initiated sharing.)
- Users can delete their data: they remove their own requests in the app, a group's creator can close it, and everything expires on its own (requests 30 days, marks 3 days, unused groups 90 days, fast counts about 4 months).
- The server sees IP addresses only to rate-limit requests and keeps each count for about two minutes. If you count that as collection, add it under **Device or other IDs** for **Fraud prevention, security, and compliance**.
- The app stores everything else only on the device; encrypted backups are created only when the person chooses to.
- The app fetches public calendar and Bible text from orthocal.info, bible-api.com, and bolls.life; nothing the person wrote is sent.
- Permissions: notifications (only if you turn on reminders).
- The website's cookie-free visit counts (Vercel Web Analytics) are not part of the Android app.

**Graphics** (in `play-store/`)
- `feature-graphic.png` — 1024 × 500, required
- Phone screenshots, 1080 × 2160: `1-today-journey.png`, `2-full-screen-prayer.png`, `3-help-now.png`, `4-names.png`, `5-scripture.png`, `6-learn-by-heart.png`
- App icon: `public/icons/icon-512.png`

---

## Nativity Fast launch (begins November 15, New Calendar; November 28, Old Calendar)

Image: `nativity-fast-share.png` (1080 × 1080). Post a few days before the fast begins.

**Reddit** (r/OrthodoxChristianity — read the subreddit's self-promotion rules first, and ask the moderators if unsure)
> **Title:** I made a free Nativity Fast companion app (no account, works offline)
>
> I've been building Nepsis Shield, a free Orthodox prayer app, and just added day-by-day journeys for the fasting seasons. For the Nativity Fast, each day has a short theme, a traditional prayer, and one practice, with the feasts along the way (the Entrance of the Theotokos, St. Nicholas, the Sunday of the Forefathers). It follows the New or Old Calendar.
>
> There's also a list of names for health and repose that it prays with you and prints for church, St. Seraphim's short rule for busy days, and a "Help" button for hard moments. No account, no ads; everything stays on your phone.
>
> https://www.nepsisshield.com — I'd be grateful for corrections from anyone who knows the services better than I do.

**Facebook / Instagram**
> The Nativity Fast begins November 15. Forty days to prepare for the birth of Christ: a short prayer and practice each day, with the saints along the way. Free, no account, works offline. nepsisshield.com

**Parish bulletin**
> **A companion for the Nativity Fast.** Nepsis Shield is a free Orthodox prayer app with a day-by-day guide to the fast: a short prayer and practice for each day, the day's readings and saints, and a list for the names of the living and departed that you can print and bring to church. No account is needed, and nothing you enter leaves your phone. Visit nepsisshield.com on your phone, or ask for the QR code at the candle stand.

**Text message**
> I'm keeping the Nativity Fast with Nepsis Shield, a free Orthodox app with a short prayer and practice each day. No account needed: https://www.nepsisshield.com/today
