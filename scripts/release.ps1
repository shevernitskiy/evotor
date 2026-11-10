param(
  [Parameter(Mandatory=$true)][string]$version
)

bun run version $version
bun run build:npm $version
cd npm
npm publish --access public
cd ..
gh release create v$version --generate-notes
