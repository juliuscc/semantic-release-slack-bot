const fetch = require('node-fetch')
const SemanticReleaseError = require('@semantic-release/error')

const slackHook = process.env.SLACK_WEBHOOK

async function postMessage(message, logger) {
	await fetch(slackHook, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	})
		.then(res => res.text())
		.then(text => {
			if (text !== 'ok') {
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
