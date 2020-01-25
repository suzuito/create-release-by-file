const fs = require('fs');
const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

const c = require('./create_release');

function checkLatestReleaseUpdated(releaseNote) {
    const { owner, repo } = context.repo;
    const github = new GitHub(process.env.GITHUB_TOKEN);
    const resp = github.repos.getReleaseByTag({
        owner,
        repo,
        tag: releaseNote.tag_name,
    });
    if (resp.status === 200) {
        throw new Error(`Already exists this tag_name '${releaseNote.tag_name}'`);
    }
    if (resp.status !== 404) {
        throw new Error(`Octkit request is failed: ${resp.status}, ${resp.data}`);
    }
}

function postCreateRelease(releaseNote) {
    try {
        const { owner, repo } = context.repo;
        const github = new GitHub(process.env.GITHUB_TOKEN);
        const resp = github.repos.createRelease({
            owner,
            repo,
            tag_name: releaseNote.tag_name,
            name: releaseNote.name,
            body: releaseNote.body,
        });
        core.setOutput('id', resp.data.id);
        core.setOutput('html_url', resp.data.html_url);
        core.setOutput('upload_url', resp.data.upload_url);
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports.postCreateRelease = postCreateRelease;

if (require.main === module) {
    const release_file_path = core.getInput('release_note', { required: false });
    const prefix = core.getInput('prefix', { required: false });
    const checkOnly = core.getInput('check_only', { required: false });
    if (!fs.existsSync(release_file_path)) {
        console.log(`Release not '${release_file_path}' is not found`);
        process.exit(1)
    }
    const releaseNote = c.extractReleaseNote(
        fs.readFileSync(release_file_path),
        prefix,
    );
    checkLatestReleaseUpdated(releaseNote);
    if (!checkOnly) {
        postCreateRelease(releaseNote);
    }
}