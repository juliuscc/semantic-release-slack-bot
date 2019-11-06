const assert = require('assert')
const nock = require('nock')
const postMessage = require('../lib/postMessage')
const SemanticReleaseError = require('@semantic-release/error')

const slackWebhook = 'https://www.webhook.com'

async function post(url) {
	url = url || slackWebhook
	await postMessage('message', { log: () => undefined }, url)
}

describe('test postMessage', () => {
	it('should pass if response is 200 "ok"', async () => {
		nock(slackWebhook)
			.post('/')
			.reply(200, 'ok')
		assert.ifError(await post())
	})

	it('should fail if response text is not "ok"', async () => {
		const response = 'not ok'
		nock(slackWebhook)
			.post('/')
			.reply(200, response)
		await assert.rejects(
			post(),
			new SemanticReleaseError(response, 'INVALID SLACK COMMAND')
		)
	})

	it('should fail if response status code is not 200', async () => {
		const response = 'error message'
		nock(slackWebhook)
			.post('/')
			.reply(500, response)
		await assert.rejects(
			post(),
			new SemanticReleaseError(response, 'INVALID SLACK COMMAND')
		)
	})

	it('should fail if incorrect url', async () => {
		const incorrectUrl = 'https://sekhfskdfdjksfkjdhfsd.com'
		await assert.rejects(post(incorrectUrl), {
			name: 'SemanticReleaseError',
			code: 'SLACK CONNECTION FAILED',
			details: undefined,
			message: /ENOTFOUND/,
			semanticRelease: true
		})
	})
})
