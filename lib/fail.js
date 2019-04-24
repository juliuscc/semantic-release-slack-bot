const postMessage = require('./postMessage')

module.exports = (pluginConfig, context) => {
	const { logger, options, errors } = context
	const { npm_package_name } = context.env

	if (!pluginConfig.notifyOnFail) {
		logger.log('Notifying on fail skipped')
		return
	}

	logger.log('Sending slack notification on fail')

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

	if (options.repositoryUrl.indexOf('git@github.com') != -1) {
		const repoPath = options.repositoryUrl.split(':')[1].replace('.git', '')
		const repoURL = `https://github.com/${repoPath}`

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

	let slackMessage = {
		text: `${
			plural ? 'Errors' : 'An error'
		} occurred while trying to publish the new version of ${npm_package_name}!`,
		blocks: messageBlocks,
		attachments: [
			{
				color: '#ff0000',
				blocks: attachments
			}
		]
	}

	postMessage(slackMessage)
}
