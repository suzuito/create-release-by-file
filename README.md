# Create a Release by release note file action

## Inputs

### `release_note`

**Option** The file path of release note. Default `"RELEASE.md"`.

### `prefix`

**Option** The prefix of release line. Default `"# "`.

## Outputs

### `time`

The time we greeted you.

## Example usage

uses: actions/hello-world-javascript-action@v1
with:
  who-to-greet: 'Mona the Octocat'