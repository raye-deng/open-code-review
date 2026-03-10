#!/bin/bash
# Run this after publishing the redirect package:
# npm deprecate ai-code-validator "This package has been renamed to open-code-review. Install open-code-review instead."
echo "To deprecate the old package, run:"
echo "  npm deprecate ai-code-validator \"This package has been renamed to open-code-review. Install open-code-review instead.\""
echo ""
echo "To publish the redirect package:"
echo "  cd packages/deprecated-redirect"
echo "  npm publish"
