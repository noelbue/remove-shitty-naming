#!/bin/sh
# Installs rsn (remove shitty naming) on macOS.
#   curl -fsSL https://remove-shitty-naming.netlify.app/install.sh | sh
set -e

BASE_URL="${RSN_BASE_URL:-https://remove-shitty-naming.netlify.app}"

if [ "$(uname)" != "Darwin" ]; then
  echo "rsn is made for macOS." >&2
  exit 1
fi

if [ -w /usr/local/bin ]; then
  DIR=/usr/local/bin
else
  DIR="$HOME/.local/bin"
  mkdir -p "$DIR"
fi

curl -fsSL "$BASE_URL/rsn" -o "$DIR/rsn"
chmod +x "$DIR/rsn"
echo "✓ Installed rsn to $DIR/rsn"

case ":$PATH:" in
  *":$DIR:"*) ;;
  *)
    echo ""
    echo "  $DIR is not on your PATH yet. Add it with:"
    echo "    echo 'export PATH=\"$DIR:\$PATH\"' >> ~/.zshrc && source ~/.zshrc"
    ;;
esac

echo ""
echo "Try it:  rsn --help"
