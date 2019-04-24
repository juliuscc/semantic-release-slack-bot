const postMessage = require('./postMessage')

module.exports = async (pluginConfig, context) => {
	const { logger, nextRelease, options } = context
	const { npm_package_name } = context.env

	if (!pluginConfig.notifyOnSuccess) {
		logger.log('Notifying on success skipped')
		return
	}

	logger.log('Sending slack notification on success')

	let messageBlocks = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `A new version of \`${npm_package_name}\` has been released!\nCurrent version is *#${
					nextRelease.version
				}*`
			}
		}
	]

	if (nextRelease.notes != '') {
		messageBlocks.push({
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*Notes*: ${nextRelease.notes}`
			}
		})
	}

	let slackMessage = {
		blocks: messageBlocks,
		text: `A new version of ${npm_package_name} has been released!`
	}

	if (options.repositoryUrl.indexOf('git@github.com') != -1) {
		const repoPath = options.repositoryUrl.split(':')[1].replace('.git', '')
		const repoURL = `https://github.com/${repoPath}`
		const gitTag = nextRelease.gitTag

		const metadata = {
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: `*<${repoURL}|${repoPath}>:*   <${repoURL}/releases/tag/${gitTag}|${gitTag}>`
				}
			]
		}

		slackMessage.attachments = [
			{
				color: '#03bd09',
				blocks: [
					{
						type: 'context',
						elements: [
							{
								type: 'mrkdwn',
								text: `:package: *<${repoURL}|${repoPath}>:*   <${repoURL}/releases/tag/${gitTag}|${gitTag}>`
							}
						]
					}
				]
			}
		]
	}

	await postMessage(slackMessage)
}
