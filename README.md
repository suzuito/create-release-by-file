![test](https://github.com/suzuito/create-release-by-file/workflows/test/badge.svg?branch=master&event=push)

# Create a Release by release note file action

This GitHub action creates release tag from release note file.

Release note must be formatted by following format.

- A release note of a version is composed by `version line` and `versoin content`
- Release notes must be written descending order.
- `version line` is a line including specified by `prefix` argument.

**Example of release note.**

```markdown
This is a release note.

# v0.0.3

- Third release

# v0.0.2

- Second release

# v0.0.1

- First release
```

Latest release has version line `v0.0.3` and version content `\n- Third release\n\n`

## Inputs

### `release_note`

**Option** A file path of release note. This path must be the relative file path from repository root directory. Default `"RELEASE.md"`.

### `prefix`

**Option** The prefix of version line. Default `"# "`.

### `check_only`

**Option** The flag whether release note is created or not in the GitHub action. If `check_only` is true, then release note is not created but just check whether release note is updated or not.

## Example usage

```yml
uses: suzuito/create-relese-by-file@master
with:
  release_note: ./docs/RELEASE.txt
  prefix: '* '
  check_only: false
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
