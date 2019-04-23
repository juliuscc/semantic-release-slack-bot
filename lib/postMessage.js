const fetch = require('node-fetch')
const SemanticReleaseError = require('@semantic-release/error')
// require('dotenv').config()

async function postMessage(message) {
	const slackHook = process.env.SLACK_WEBHOOK

	if (!slackHook) {
		throw new SemanticReleaseError(
			'No Slack web-hook defined.',
			'ENOSLACKHOOK',
			`A Slack Webhook must be created and set in the \`SLACK_WEBHOOK\` environment variable on your CI environment.\n\n\nPlease make sure to create a Slack Webhook and to set it in the \`SLACK_WEBHOOK\` environment variable on your CI environment.`
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
				logger.log('JSON message format invalid')
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
