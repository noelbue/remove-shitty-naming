#!/bin/zsh
# Cut a release:  npm run release -- 1.2.3
#
# 1. checks: on main, clean tree, tests pass, CHANGELOG.md has a "## 1.2.3" section
# 2. bumps the version in cli/rsn and package.json
# 3. commits, tags v1.2.3, pushes
# 4. creates the GitHub release with rsn + install.sh attached
set -e
cd ${0:A:h:h}

v=$1
[[ $v == <->.<->.<-> ]] || { print "usage: npm run release -- <major.minor.patch>"; exit 1 }
[[ $(git branch --show-current) == main ]] || { print "✗ not on main"; exit 1 }
[[ -z $(git status --porcelain) ]] || { print "✗ working tree not clean"; exit 1 }
git fetch -q --tags
git rev-parse -q --verify "refs/tags/v$v" >/dev/null && { print "✗ tag v$v already exists"; exit 1 }

notes=$(awk -v v="## $v" '$0==v{f=1;next} /^## /{f=0} f' CHANGELOG.md | sed '/./,$!d')
[[ -n $notes ]] || { print "✗ add a '## $v' section to CHANGELOG.md first"; exit 1 }

npm test

sed -i '' "s/^VERSION=\".*\"/VERSION=\"$v\"/" cli/rsn
npm version "$v" --no-git-tag-version --allow-same-version >/dev/null
[[ $(zsh cli/rsn -V) == "rsn $v" ]] || { print "✗ version bump failed"; exit 1 }

git add cli/rsn package.json package-lock.json
git commit -q -m "Release v$v"
git tag -a "v$v" -m "v$v"
git push -q origin main "v$v"

gh release create "v$v" cli/rsn cli/install.sh --title "v$v" --notes "$notes"
print "✓ Released v$v"
