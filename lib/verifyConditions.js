const SemanticReleaseError = require('@semantic-release/error')

module.exports = (pluginConfig, context) => {
	const { logger } = context

	const slackHook = process.env.SLACK_WEBHOOK

	if (!slackHook) {
		logger.log('SLACK_WEBHOOK has not been defined.')
		throw new SemanticReleaseError(
			'No Slack web-hook defined.',
			'ENOSLACKHOOK',
			`A Slack Webhook must be created and set in the \`SLACK_WEBHOOK\` environment variable on your CI environment.\n\n\nPlease make sure to create a Slack Webhook and to set it in the \`SLACK_WEBHOOK\` environment variable on your CI environment.`
		)
	}
}
