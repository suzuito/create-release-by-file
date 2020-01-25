const m = require('./create_release');

describe('Valid release note', () => {
    const body = `
# This is a release note!!!

## v0.0.2

- Fix bugs

## v0.0.1

- First release
`;
    it('Extract release note', () => {
        const real = m.extractReleaseNote(body, '## ');
        expect(real.tag_name).toBe('v0.0.2');
        expect(real.body).toBe('## v0.0.2\n\n- Fix bugs\n');
    });
    it('Cannot release note', () => {
        const real = m.extractReleaseNote(body, '* ');
        expect(real.tag_name).toBe('');
        expect(real.body).toBe('');
    });
});


describe('Invalid release note', () => {
    const invalidbody = 'Hello world';
    it('Extract release note', () => {
        const real = m.extractReleaseNote(invalidbody, '## ');
        expect(real.tag_name).toBe('');
        expect(real.body).toBe('');
    });
});