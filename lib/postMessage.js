const fetch = require('node-fetch')
const SemanticReleaseError = require('@semantic-release/error')
// require('dotenv').config()

async function postMessage(message) {
	const slackHook = process.env.SLACK_WEBHOOK

	if (!slackHook) {
		throw new SemanticReleaseError(
			'Slack web-hook is not defined in environment. Define SLACK_WEBHOOK!'
		)
	}

	await fetch(slackHook, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	})
		.then(res => res.text())
		.then(text => {
			if (text != 'ok') {
				logger.log('Json message format invalid')
				throw new SemanticReleaseError(
					new Error().stdout,
					'INVALID SLACK COMMAND: ' + text
				)
			}
		})
		.catch(e => {
			throw new SemanticReleaseError(
				e.stdout,
				'SLACK CONNECTION FAILED: '
			)
		})
}

module.exports = postMessage
