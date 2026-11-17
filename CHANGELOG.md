# Changelog

All notable changes to `rsn` and the web app. Versions follow [semver](https://semver.org).

## 1.0.1

- Fix: `rsn` could rename a folder before the files inside it, which made those renames fail with "No such file or directory". Paths are now sorted by depth explicitly.
- Installer downloads `rsn` from the latest GitHub release.

## 1.0.0

- Web app: live cleaning, copy button, light and dark mode.
- `rsn` CLI for macOS: preview, dry run, never overwrites, skips hidden files, handles decomposed umlauts and case-only renames.
