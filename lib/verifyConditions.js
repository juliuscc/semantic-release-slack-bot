const SemanticReleaseError = require('@semantic-release/error')

module.exports = (pluginConfig, context) => {
	const { logger } = context
	const { slackWebhook = process.env.SLACK_WEBHOOK } = pluginConfig

	if (!slackWebhook) {
		logger.log('SLACK_WEBHOOK has not been defined.')
		throw new SemanticReleaseError(
			'No Slack web-hook defined.',
			'ENOSLACKHOOK',
			`A Slack Webhook must be created and set in the \`SLACK_WEBHOOK\` environment variable on your CI environment.\n\n\nPlease make sure to create a Slack Webhook and to set it in the \`SLACK_WEBHOOK\` environment variable on your CI environment. Alternatively, provide \`slackWebhook\` as a configuration option.`
		)
	}

	if (
		!context.env.npm_package_name &&
		!context.env.SEMANTIC_RELEASE_PACKAGE
	) {
		logger.log(
			'npm package name and SEMANTIC_RELEASE_PACKAGE name are undefined'
		)
		throw new SemanticReleaseError(
			'No name for the package defined.',
			'ENOPACKAGENAME',
			`A name for the package must be created. Run through npm (npm run <semantic-release-script> to use npm package name or define \`SEMANTIC_RELEASE_PACKAGE\` in the environment`
		)
	}
}
