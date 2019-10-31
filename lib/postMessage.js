const fetch = require('node-fetch')
const SemanticReleaseError = require('@semantic-release/error')

async function postMessage(message, logger, slackWebhook) {
	await fetch(slackWebhook, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	})
		.then(res => res.text())
		.then(text => {
			if (text !== 'ok') {
				logger.log('JSON message format invalid: ' + text)
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
