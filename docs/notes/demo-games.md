# Notes — Candidate demo games (Phase 0, task 9)

- **Date:** 2026-10-22
- **Status:** Second pass. Licence claims from project pages and SourceForge metadata (read through a fetch tool that paraphrases), plus evidence read directly from downloaded files (inspected, never executed). Not legal advice.
- **Rule from ADR 0001:** the catalogue only hosts freely licensed games. A game whose licence cannot be shown in writing stays out.

## Candidates

| Game | Evidence | Verdict |
|---|---|---|
| **GAEM 0.15** (engine plus example game) by Victor Borrull | Source zip: `The GNU General Public License.txt` included; headers in 4 of 14 source files read "Copyright (C) 2005 Victor Borrull ... GNU General Public License ... either version 2 of the License, or (at your option) any later version" (GPLv2 or later). Binary zip has `GAEM.jar` (426,073 bytes), `GAEM.jad` and the same GPL text; manifest vendor is Victor Borrull and the info URL is `gaemu.sourceforge.net`. The project page says "The code is released under GPL License" | **Best candidate.** Named author, licence text and headers, jar and jad available. Gaps: 10 source files carry no header, and the artwork (`res/*.png`) has no separate licence line, so confirm the art falls under the same GPL. Test it in the emulator next |
| PacMan J2ME (`j2mw-pacman329`) | SourceForge metadata says GPLv2; `pacman.jar` (15,534 bytes) has no licence file, no source, no author; manifest vendor "Sun Microsystems" looks like a template | **Plausible, unproven.** Need an author name and a source link |
| Frozen MIDlet (CVS dump, 203 KB, downloaded by the owner and inspected without running anything) | The zip is a **CVS repository** (`,v` files, 112 files), **source only, no `.jar` or `.jad`**. Two games: **PacmanME** (author Mario Torre, handle `neugens`, 2006-2007) and **SecretOfMazda** (same author, Lima Software). PacmanME has `COPYING` (GPLv2) and a README; 6 of 10 source files carry a GPL header, 4 (the pathfinding helpers) carry **Apache 2.0** headers. The README says the library it depends on (LimaMobileLibrary) is Apache 2.0 and the rest is GPL, and admits "we know these are incompatible". SecretOfMazda: 5 of 7 source files carry GPL headers, 2 have none; no `COPYING` file inside; art sources are `.xcf` files with no licence line. The `CVSROOT/` folder (server config) was deliberately not read | **Not catalogue-ready.** Needs: building the jars from source (not done), the missing LimaMobileLibrary dependency, and a clarified licence (mixed GPL/Apache, headers missing in some files, art unlicensed). PacmanME is the closest; the author could be asked for a clear statement. Last touched in 2007 in this dump; the SourceForge page lists three licences (Apache 2.0, BSD, GPLv2) without saying which applies to which |
| `k4kur0` (Kakuro), bundled in the emulator's `init.zip` | Text inside the jar: "by ive&marcus", "This is **emailware**. Please send a short note to the author if you use it (address omitted on purpose). License Info and a manual is located at: http://wintermute.de/kakuro". Manifest info URL `wintermute.de/kakuro` | **Not cleared.** Emailware is a request, not a redistribution licence; the real terms are on a page not yet read. Keep out of the catalogue until read. Do not copy the email address into any tracked file |
| `Connect4`, bundled in `init.zip` | Manifest: name `TestabeApp`, vendor `zb3` (the `freej2me-web` author's handle). No licence text anywhere in the jar | **Unknown.** Probably a test app by the emulator's author; ask them or skip |
| jtReversi | No licence found | **Excluded** |

Not candidates: RunME, MGDK and MicroEmulator are tools, not games.

## What hosting a GPL game would mean

- Distributing a GPL jar means offering its source under the same licence. A hosted demo needs a visible licence line and a link to its source. This is a reading of the GPL, to confirm with a lawyer.
- A game's licence is separate from the platform's: the game is data the emulator runs, not code linked into the platform. It is the same legal question as ADR 0001 item 9, so confirm it there.
- Nothing needs to be hosted to **test**. Running a downloaded jar locally for development involves no redistribution.
- Do not repackage the emulator's two bundled games into Pixelito's catalogue on the assumption that the emulator's GPL covers them. It does not: they are other authors' works.

## Gaps

1. GAEM art licence and the 10 source files without a header.
2. No author contact was made for any candidate. A written permission from an author is also a valid route.
3. The catalogue will start tiny. The plan already says so.
4. Other sources not searched yet: GitHub topic `j2me`, itch.io, game-jam entries.

## Next

1. Run `GAEM.jar` (with its `.jad`) in the emulator as the second real-game test; local only, not redistributed. It is also a larger game (426 KB), so it gives a better load-time measurement than a 15 KB jar.
2. ~~Look at Frozen MIDlet's Files and Code tabs~~ Done 2026-10-22 from the owner's download (see the table); remaining: decide whether to build PacmanME from source.
3. Read the `wintermute.de/kakuro` terms if `k4kur0` is wanted.
