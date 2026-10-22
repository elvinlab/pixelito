# Notes — Name check (Phase 0, task 10, first pass)

- **Date:** 2026-10-22
- **Status:** Partial. Web searches plus one registrar lookup by the owner (below). No trademark database was queried, so **nothing here shows the name is free to use**.
- **Candidates:** `Pixelito` / `pixelito.app` (current), `j2mePixelito` (owner's idea). Two or three alternatives are not proposed yet.

## What was found

| Check | Result | Strength of the evidence |
|---|---|---|
| Web search "Pixelito" with app, game or emulator terms | No product named Pixelito appeared. Nearby names: PixelBox (itch.io emulator frontend), PicPic (Pico-8 on iOS), Gamebyte (ROM launcher with a pixel-art look) | Weak: a general search engine, one pass, no exact-match guarantee. Absence of hits is not absence of a conflict |
| Registrar lookup of `pixelito.app` (owner, 2026-10-22, Porkbun, from a screenshot) | Listed as available with an add-to-cart button. First year $8.75 (sale, from $14.93), **renews at $14.93**. Not bought | Registrar availability only. It says nothing about an existing site or a trademark, and the availability should be re-checked at purchase time |
| Web search "j2mePixelito" or "J2ME Pixelito" | Nothing specific; only generic J2ME books, the MicroEmulator project and an article about porting J2ME games | Weak, same reason |
| Oracle third-party trademark guidelines | The search summary says third parties should not use Oracle marks or confusingly similar variants in a company, product or service name, and should use a descriptive tag line stating compatibility instead; no implied sponsorship; no imitation of logos or trade dress | Second-hand: a search summary, not the page. The direct fetch of `oracle.com/legal/trademarks/` returned **HTTP 403**, so the exact wording, the Domain Names section and anything Java- or J2ME-specific are **unread** |

## Alternatives proposed and searched (same weak method)

Brainstormed to avoid "J2ME" and "Java", evoke keypad phones, and read well in Spanish and English.

| Candidate | Idea | Web search result | Note |
|---|---|---|---|
| Candybar | The "candy bar" phone form factor | No phone product found. A Panic blog post shows "CandyBar" was the name of a Panic software app (and an Atari 2600 homebrew game made as a joke about it) | Prior use as a software name; also a very common English word, so hard to own and hard to search |
| Retrocel | "Cel" is a common short form of celular in Latin America | No match for the name | "Retro" is crowded; the Spanish short form may not read in English |
| Polifon | Polyphonic ringtones, a signature sound of that era | No match for the name | Short, distinctive, but the link to games is indirect |
| Tecladito | Keypad, with the same diminutive as Pixelito | No match for the name | Spanish-only feel; "teclado" suggests keyboards, not games |

Second round, "-fon" family (owner's preferred direction, 2026-10-22):

| Candidate | Web search result | Note |
|---|---|---|
| Pixefon | No match for the name. Similar names exist (Pix123, Pixely, Pixweeper, Pixicade) | Owner's idea. Closest neighbours are pixel-art games, not phones |
| Pixifon | No match. Close sound-alike: **Pixiphone**, a 1950s British toy glockenspiel (Wikipedia) | A trademark examiner may weigh the sound-alike; a toy is a different class, but check |
| Pixfono | No match | Reads as Spanish; harder to say in English |
| Bitfon | No match for the name. Unrelated "Bit" apps appear | "Bit" is generic; weaker link to pixels |

Same caveat: one general search each, no registrar, no trademark database. Names ending in "-fon" or "phone" may sit near telecom marks, so the telecommunications classes should be searched too, not only software and games.

Result: none showed a conflict in one general search, and that is weak evidence. They are ideas to run through the human checks below, not recommendations.

## Decision (2026-10-22)

After seeing the alternatives, the owner chose to **keep Pixelito**: "me gusta más". The alternatives researched (Candybar, Retrocel, Polifon, Tecladito, Pixefon, Pixifon, Pixfono, Bitfon) are kept in the tables above in case a check on Pixelito fails. If it does, Pixifon was the owner's favourite of the "-fon" family; its sound-alike risk is Pixiphone (a 1950s British toy glockenspiel), and telecom classes should be searched for any "-fon" name.

The checks below still apply, now for `Pixelito` only.

## Reading for the name

- **Keep "J2ME" and "Java" out of the product name and the domain**, and use them only in descriptive text ("play J2ME games in your browser"), which is the tag-line approach the guideline describes. This is a conservative reading of a summary, not legal advice. It leans against `j2mePixelito` as a brand name, while the owner's goal (standing out from "pixel" and "retro console" names, and being findable) can be met with SEO text and the tagline.
- Whether "J2ME" itself is an Oracle mark was **not verified**. Treat it as possibly covered.
- `Pixelito` still has the "crowded pixel names" weakness the owner raised. A general search was not enough to rank how crowded it is.

## Needs a human (I cannot do these from here)

1. ~~Check `pixelito.app` at a registrar~~ Done 2026-10-22 (see above). Buy it only after the trademark search, so a name change does not strand the domain.
2. Search trademark databases for `Pixelito` and close variants in the classes for software and games: EUIPO TMview, WIPO Global Brand Database, USPTO search, and Costa Rica's registry (Registro Nacional).
3. Read Oracle's trademark page in a normal browser, including the Domain Names section, and note anything about "Java" and "J2ME".
4. Decide whether to propose two or three alternatives; ask me and I will generate candidates and run the same web checks.

## Next

Owner does items 1 to 3 when at a computer; then record the decision in ADR 0001 (name row).
