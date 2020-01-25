function extractReleaseNote(
    bodyReleaseNote,
    prefix,
) {
    prefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const body = bodyReleaseNote;
    const lines = body.split('\n');
    const r = `^${prefix}(.+)$`;
    const e = new RegExp(r);
    const ret = {
        owner: '',
        repo: '',
        tag_name: '',
        name: '',
        body: '',
        draft: false,
        prerelease: false,
    };
    let latest_messages = [];
    for (const l of lines) {
        const result = e.exec(l);
        if (result !== null) {
            if (ret.tag_name === '') {
                ret.tag_name = result[1]
                latest_messages.push(l);
            } else {
                break;
            }
        } else {
            if (ret.tag_name !== '') {
                latest_messages.push(l);
            }
        }
    }
    ret.body = latest_messages.join('\n');
    return ret;
}

module.exports.extractReleaseNote = extractReleaseNote;
