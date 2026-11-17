# remove-shitty-naming

**Live:** https://remove-shitty-naming.netlify.app/

Turns messy titles into clean, lowercase snake_case names. It comes in two forms:

- **[Web app](https://remove-shitty-naming.netlify.app/):** paste a title and copy the clean name. Live, and nothing is stored.
- **`rsn` CLI for macOS:** renames whole folders of files using the same rules.

```
Angebot: Eigenentwicklung vs. Standard-Software (Projekt Phoenix, v2).md
→ angebot_eigenentwicklung_vs_standard-software_projekt_phoenix_v2.md
```

## Rules

| Input                              | Output             |
| ---------------------------------- | ------------------ |
| Uppercase                          | lowercase          |
| `ä ö ü ß`                          | `ae oe ue ss`      |
| `é à ç …`                          | `e a c …`          |
| `&`                                | `and`              |
| Spaces, `:` `.` `( )` `–` and other symbols | `_`       |
| Hyphens inside words (`3rd-party`) | kept               |
| `_`, `-_`, ` - ` runs              | a single `_`       |
| Leading / trailing `_` or `-`      | removed            |

File extensions are kept and lowercased (`Report.PDF` → `report.pdf`).

---

## CLI: `rsn`

### Install

```sh
curl -fsSL https://remove-shitty-naming.netlify.app/install.sh | sh
```

This installs the latest [release](https://github.com/noelbue/remove-shitty-naming/releases) of `rsn` to `/usr/local/bin`, or to `~/.local/bin` if `/usr/local/bin` isn't writable. It's a single zsh script with no dependencies.

Run the same command again to update. Check your version with `rsn -V`.

To install it by hand, download `rsn` from the [latest release](https://github.com/noelbue/remove-shitty-naming/releases/latest) somewhere on your `PATH` and `chmod +x` it.

### Usage

```sh
rsn <path>          # preview, then ask before renaming
rsn -n <path>       # dry run: only show what would change
rsn -y <path>       # rename without asking
rsn -r <path>       # also rename the folder itself
rsn -s "Some Text"  # just print the cleaned text
rsn --help
```

Example:

```
$ rsn ~/Documents/project-notes
01_Planung/Entwürfe/
  Kick-off Notizen.md → kick-off_notizen.md
  Budget & Kosten (Entwurf).md → budget_and_kosten_entwurf.md
01_Planung/
  Entwürfe → entwuerfe
./
  Übersicht – Zeitplan Q3.md → uebersicht_zeitplan_q3.md
  01_Planung → 01_planung
  Präsentation Kunde - 12.03.2026.PDF → praesentation_kunde_12_03_2026.pdf

Rename 6 item(s)? [y/N] y
✓ Renamed 6 item(s).
```

### Safety

- Always shows a preview first and asks for confirmation, unless you pass `-y`.
- Never overwrites anything. If the target name already exists, that item is skipped.
- Hidden files and folders (`.git`, `.DS_Store`, …) are never touched or entered.
- Refuses to run on `/` or your home folder.
- Handles case-only renames (`README.MD` → `readme.md`) correctly on macOS.
- Handles decomposed umlauts in macOS file names (`lo¨sung` → `loesung`, not `losung`).

### Uninstall

```sh
rm "$(which rsn)"
```

---

## Development

```sh
npm install
npm run dev     # http://localhost:3000
npm test        # checks that web and CLI clean names identically
npm run build   # static export to ./out
```

| Path              | What                                          |
| ----------------- | --------------------------------------------- |
| `lib/slugify.ts`  | Cleaning rules used by the web app            |
| `cli/rsn`         | The CLI (zsh), with the same rules            |
| `cli/install.sh`  | Installer served at `/install.sh`             |
| `tests/cases.tsv` | Shared test cases: `input<TAB>expected`       |
| `tests/cli.sh`    | End-to-end test of `rsn` on a nested folder   |
| `scripts/release.sh` | Release script, see below                  |

The rules exist twice, in TypeScript and in zsh. If you change one, change the other and add a case to `tests/cases.tsv`.

### Releases

`rsn` is shipped through [GitHub releases](https://github.com/noelbue/remove-shitty-naming/releases), and the installer always fetches the latest one. Commits to `main` do not reach users until they're released.

1. Add a `## x.y.z` section with the changes to [`CHANGELOG.md`](CHANGELOG.md) and commit it.
2. Run `npm run release -- x.y.z`.

The script checks that you're on a clean `main`, runs the tests, bumps the version in `cli/rsn` and `package.json`, commits, tags `vx.y.z`, pushes, and creates the GitHub release with `rsn` and `install.sh` attached.

### Deployment

Netlify builds `main` automatically (see `netlify.toml`). `npm run build` copies `cli/install.sh` (and `cli/rsn`) into `public/`, so the installer is served at `/install.sh`.
