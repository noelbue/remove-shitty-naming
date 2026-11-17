#!/bin/zsh
# End-to-end test: rsn renames a nested tree without any failed/skipped items.
# Run: npm test
set -e
RSN=${0:A:h:h}/cli/rsn
T=$(mktemp -d)
trap 'rm -rf $T' EXIT
cd $T && mkdir root && cd root

# several sibling folders on different depths — parents must be renamed last
P="01. Prüfung Projekt X"
A="$P/AIB_Anforderungen - Projekt X"; E="$A/Evaluation X"; V="$E/Tabelle_SOLL vs. Tools (X)"
W="$P/Vergleich_Anbieter (Projekt X)"
mkdir -p "00. Check-In (X)" "$V" "$W/Präsentationen X" ".git"
touch "00. Check-In (X)/Anforderungsliste (PRL) - X.md" "00. Check-In (X)/Pflichtenheft X.md" \
  "$V/Anbieter 1 (X).md" "$V/Anbieter 2 (X).md" "$V/Anbieter 3 (X).md" \
  "$A/AIB- Anforderungen - X.md" "$W/DIB- Anforderungen - X.md" \
  "$W/Vergleich- Anbieter (X).md" "$W/Überblick Ablösung X.md" "README.MD" ".DS_Store"
before=$(find . | wc -l)

out=$(NO_COLOR=1 zsh $RSN -y . 2>&1) || { print -r -- "$out"; print "✗ cli: rsn exited with an error"; exit 1 }
if print -r -- "$out" | grep -q "skip:"; then
  print -r -- "$out"; print "✗ cli: some items were skipped"; exit 1
fi

after=$(find . | wc -l)
[[ $before == $after ]] || { print "✗ cli: entry count changed ($before → $after)"; exit 1 }

bad=$(find . -not -path './.*' -name '*[^a-z0-9._/-]*' | grep -v '^\.$' || true)
[[ -z $bad ]] || { print -r -- "$bad"; print "✗ cli: unclean names left"; exit 1 }

[[ -e .git && -e .DS_Store ]] || { print "✗ cli: hidden files were touched"; exit 1 }
[[ $(NO_COLOR=1 zsh $RSN -y .) == *"already clean"* ]] || { print "✗ cli: second run not clean"; exit 1 }

print "✓ cli: nested tree renamed cleanly"
