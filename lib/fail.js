/* eslint-disable camelcase */
const postMessage = require('./postMessage')
const template = require('./template')

module.exports = async (pluginConfig, context) => {
	const { logger, options, errors } = context
	const { npm_package_name } = context.env
	const { slackWebhook = process.env.SLACK_WEBHOOK } = pluginConfig

	let package_name = context.env.SEMANTIC_RELEASE_PACKAGE
	if (!package_name) package_name = context.env.npm_package_name

	if (!pluginConfig.notifyOnFail) {
		logger.log('Notifying on fail skipped')
		return
	}

	logger.log('Sending slack notification on fail')

	let slackMessage = {}
	const repoPath =
		options.repositoryUrl.indexOf('git@github.com') !== -1
			? options.repositoryUrl.split(':')[1].replace('.git', '')
			: undefined
	const repoURL = repoPath && `https://github.com/${repoPath}`

	// Override default fail template
	if (pluginConfig.onFailTemplate) {
		slackMessage = template(pluginConfig.onFailTemplate, {
			package_name,
			repo_path: repoPath,
			repo_url: repoURL
		})
	} else {
		const plural = errors.length > 1

		const messageSummaryLine = `${
			plural ? 'Errors' : 'An error'
		} occurred while trying to publish the new version of \`${npm_package_name}\`!`

		const divider = {
			type: 'divider'
		}

		let messageBlocks = [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: messageSummaryLine
				}
			}
		]

		if (repoPath) {
			const metadata = {
				type: 'context',
				elements: [
					{
						type: 'mrkdwn',
						text: `*<${repoURL}|${repoPath}>*`
					}
				]
			}

			messageBlocks.push(metadata)
		}

		// messageBlocks.push(divider)

		const attachments = [
			{
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `:no_entry:  *${plural ? 'Exceptions' : 'Exception'}*`
				}
			}
		]

		for (const error of errors) {
			if (attachments.length > 2) {
				attachments.push(divider)
			}
			attachments.push({
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `\`\`\`${error.stack}\`\`\``
				}
			})
		}

		slackMessage = {
			text: `${
				plural ? 'Errors' : 'An error'
			} occurred while trying to publish the new version of ${package_name}!`,
			blocks: messageBlocks,
			attachments: [
				{
					color: '#ff0000',
					blocks: attachments
				}
			]
		}
	}

	await postMessage(slackMessage, logger, slackWebhook)
}
