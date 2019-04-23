const postMessage = require('./postMessage')

module.exports = (pluginConfig, context) => {
	if (!pluginConfig.notifyOnFail) {
		return
	}

	const { options } = context
	const { npm_package_name } = context.env

	const messageSummaryLine = `Errors occurred while trying to publish the new version of \`${npm_package_name}\`!`

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

	messageBlocks.push(divider)

	const attachments = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: ':no_entry:  *Exceptions*'
			}
		}
	]

	const { errors } = context
	for (const error of errors) {
		attachments.push(divider)
		attachments.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `\`\`\`${error.stack}\`\`\``
			}
		})
	}

	let slackMessage = {
		text: messageSummaryLine,
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
