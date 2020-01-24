const fs = require('fs');
const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

function extractReleaseNote(filePathReleaseNote) {
    const body = fs.readFileSync(filePathReleaseNote, {encoding: 'utf8'});
    const lines = body.split('\n');
    const e = /^# (.+)$/;
    let latest_version = '';
    let latest_messages = [];
    for (const l of lines) {
        const result = e.exec(l);
        if (result !== null) {
            if (latest_version === '') {
                latest_version = result[1]
                latest_messages.push(l);
            } else {
                break;
            }
        } else {
            if (latest_version !== '') {
                latest_messages.push(l);
            }
        }
    }
    return [latest_version, latest_messages.join('\n')];
}

try {
    const release_file_path = core.getInput('release_file_path', { required: false });
    const tmp = extractReleaseNote(release_file_path);
    const latest_version = tmp[0];
    const latest_message = tmp[1];
    const { owner, repo } = context.repo;
    const github = new GitHub(process.env.GITHUB_TOKEN);
    const resp = github.repos.createRelease({
        owner,
        repo,
        tag_name: latest_version,
        name: latest_version,
        body: latest_message,
    });
    core.setOutput('id', resp.data.id);
    core.setOutput('html_url', resp.data.html_url);
    core.setOutput('upload_url', resp.data.upload_url);
} catch (error) {
    core.setFailed(error.message);
}