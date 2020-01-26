const fs = require('fs');
const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

const c = require('./create_release');

async function checkLatestReleaseUpdated(releaseNote) {
    const { owner, repo } = context.repo;
    const github = new GitHub(process.env.GITHUB_TOKEN);
    const resp = await github.repos.getReleaseByTag({
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
    console.log(`Latest release note: ${resp.data.upload_url}`);
    return;
}

async function postCreateRelease(releaseNote) {
    const { owner, repo } = context.repo;
    const github = new GitHub(process.env.GITHUB_TOKEN);
    console.log('New release note\n============');
    console.log(releaseNote.body);
    console.log('============');
    console.log(`owner   :${owner}`);
    console.log(`repo    :${repo}`);
    console.log(`tag_name:${releaseNote.tag_name}`);
    const resp = await github.repos.createRelease({
        owner,
        repo,
        tag_name: releaseNote.tag_name,
        name: releaseNote.name,
        body: releaseNote.body,
    });
    core.setOutput('id', resp.data.id);
    core.setOutput('html_url', resp.data.html_url);
    core.setOutput('upload_url', resp.data.upload_url);
    console.log(`Done: ${resp.data.upload_url}`);
}

module.exports.postCreateRelease = postCreateRelease;

async function main() {
    let release_file_path = core.getInput('release_note', { required: false });
    if (!release_file_path) {
        release_file_path = 'RELEASE.md';
    }
    let prefix = core.getInput('prefix', { required: false });
    if (!prefix) {
        prefix = '# ';
    }
    let checkOnly = core.getInput('check_only', { required: false });
    if (!checkOnly) {
        checkOnly = 'false';
    }
    checkOnly = checkOnly === 'true';
    if (!fs.existsSync(release_file_path)) {
        console.log(`Release note '${release_file_path}' is not found`);
        process.exit(1)
    }
    const releaseNote = c.extractReleaseNote(
        fs.readFileSync(release_file_path, { encoding: 'utf8' }),
        prefix,
    );
    console.log('5');
    await checkLatestReleaseUpdated(releaseNote);
    if (!checkOnly) {
        await postCreateRelease(releaseNote);
    }
    console.log('10');
}

if (require.main === module) {
    main().catch(error => core.setFailed(error.message));
}