#!/bin/zsh
#
# Proves that each guard in adminControls.int.spec.ts actually fails on the defect
# it names. Run it after changing that file — a guard that has never failed is not
# evidence. Restores every file it touches.
# Prove each guard in adminControls.int.spec.ts actually fails on the defect it names.
# Applies one deliberate break at a time, runs the matching test, restores the file.
set -u
cd "$(dirname "$0")/../.."

BK=$(mktemp -d)
mkdir -p $BK

run_case () {
  local name="$1"; local file="$2"; local grep_pat="$3"
  cp "$file" "$BK/$(echo $file | tr '/' '_')"
  eval "$4"   # the break
  out=$(pnpm test:int -t "$grep_pat" 2>&1 | sed 's/\x1b\[[0-9;]*m//g')
  cp "$BK/$(echo $file | tr '/' '_')" "$file"
  if echo "$out" | grep -qE "[1-9][0-9]* failed"; then
    echo "PASS  $name -> guard went RED as required"
  else
    echo "FAIL  $name -> guard stayed GREEN. It does not detect this defect."
    echo "$out" | grep -E "Tests |Test Files" | head -3
  fi
}

echo "--- A(blocks): a block field nothing reads ---"
run_case "A-blocks" "src/blocks/IconList/Component.tsx" "every field name is read" \
  "perl -0pi -e 's/\{item\.text\}/{null}/' src/blocks/IconList/Component.tsx"

echo "--- B: an option value with no matching CSS rule ---"
run_case "B-options" "src/fields/blockFields.ts" "every vf-\* modifier class" \
  "perl -0pi -e \"s/\\{ label: 'Accent bar', value: 'accent-bar' \\}/{ label: 'Accent bar', value: 'accent-bar' }, { label: 'Tilt', value: 'tilt' }/\" src/fields/blockFields.ts"

echo "--- B2: a code-defined picker class with no matching CSS rule ---"
run_case "B2-picker" "src/fields/codeDefinedClasses.ts" "the CSS-class picker offers" \
  "perl -0pi -e \"s/^\\]/  { name: 'vf-home-nope', label: 'x' },\\n]/m\" src/fields/codeDefinedClasses.ts"

echo "--- F1: a brand asset hardcoded in a CSS rule instead of a token ---"
run_case "F1-hardcoded-asset" "src/app/(frontend)/globals.css" "bundled brand asset" \
  "perl -0pi -e \"s{background: var\\(--vf-shield-url\\) no-repeat center / contain;}{background: url('/assets/images/VERIFY Shield.png') no-repeat center / contain;}\" 'src/app/(frontend)/globals.css'"

echo "--- F2: a block that draws a placeholder but offers no upload ---"
run_case "F2-no-upload" "src/blocks/WhyVerify/config.ts" "image placeholder has an upload" \
  "perl -0pi -e \"s/      name: 'image',\\n      type: 'upload',\\n      relationTo: 'media',/      name: 'image',\\n      type: 'text',/\" src/blocks/WhyVerify/config.ts"

echo "--- E1: a call site that passes a named cacheLife profile (via its ALIAS) ---"
run_case "E1-profile-arg" "src/Styles/hooks/revalidateStyles.ts" "named cacheLife profile" \
  "perl -0pi -e \"s/revalidateTag\\('global_custom-styles'\\)/revalidateTag('global_custom-styles', 'max')/\" src/Styles/hooks/revalidateStyles.ts"

echo "--- E2: the wrapper itself regressing to a profile name ---"
run_case "E2-wrapper" "src/utilities/safeRevalidate.ts" "named cacheLife profile" \
  "perl -0pi -e \"s/revalidateTag\\(tag, \\{ expire: 0 \\}\\)/revalidateTag(tag, 'max')/\" src/utilities/safeRevalidate.ts"

echo "--- C: an Appearance select the component discards ---"
run_case "C-appearance" "src/blocks/GatewayCards/config.ts" "hardcoded appearance" \
  "perl -0pi -e 's/appearances: false//' src/blocks/GatewayCards/config.ts"

echo "--- D: a draft-collection query with no access control ---"
run_case "D-drafts" "src/app/(frontend)/specialists/profiles/[slug]/page.tsx" "access-controlled" \
  "perl -0pi -e 's/overrideAccess: false,//' 'src/app/(frontend)/specialists/profiles/[slug]/page.tsx'"

# NOTE: `hours` has TWO consumers (Footer + ContactDetails), so breaking only one
# leaves the field genuinely still read and the guard correctly stays green.
# Use a field with exactly one renderer.
echo "--- A(globals): an orphaned collection field ---"
run_case "A-globals" "src/blocks/MapEmbed/Component.tsx" "collections/Offices" \
  "perl -0pi -e 's/office\.hoursNote/office.REMOVED_FOR_TEST/g' src/blocks/MapEmbed/Component.tsx"
