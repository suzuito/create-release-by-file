jest.mock('@actions/core');
jest.mock('@actions/github');

const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

const postCreateRelease = require('./main').postCreateRelease;

describe('Release note', () => {
    let createRelease;

    beforeEach(() => {
        createRelease = jest.fn().mockReturnValueOnce({
            data: {
                id: 'releaseId',
                html_url: 'htmlUrl',
                upload_url: 'uploadUrl'
            }
        });

        context.repo = {
            owner: 'owner',
            repo: 'repo'
        };

        const github = {
            repos: {
                createRelease
            }
        };

        GitHub.mockImplementation(() => github);
    });
    it('', () => {
        postCreateRelease({
            tag_name: 'v0.0.1',
            body: 'Hello world!',
        })
        expect(createRelease).toHaveBeenCalledWith({
            tag_name: 'v0.0.1',
            body: 'Hello world!',
            owner: 'owner',
            repo: 'repo',
            name: undefined,
        });
        expect(core.setOutput).toHaveBeenNthCalledWith(1, 'id', 'releaseId');
        expect(core.setOutput).toHaveBeenNthCalledWith(2, 'html_url', 'htmlUrl');
        expect(core.setOutput).toHaveBeenNthCalledWith(3, 'upload_url', 'uploadUrl');
        expect(core.setFailed).toHaveBeenCalledTimes(0);
    });
});