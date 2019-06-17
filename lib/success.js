/* eslint-disable camelcase */
const postMessage = require('./postMessage')

module.exports = async (pluginConfig, context) => {
	const { logger, nextRelease, options } = context

	let package_name = context.env.SEMANTIC_RELEASE_PACKAGE
	if (!package_name) package_name = context.env.npm_package_name

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
				text: `A new version of \`${package_name}\` has been released!\nCurrent version is *#${
					nextRelease.version
				}*`
			}
		}
	]

	if (nextRelease.notes !== '') {
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
		text: `A new version of ${package_name} has been released!`
	}

	if (options.repositoryUrl.indexOf('git@github.com') !== -1) {
		const repoPath = options.repositoryUrl.split(':')[1].replace('.git', '')
		const repoURL = `https://github.com/${repoPath}`
		const gitTag = nextRelease.gitTag

		slackMessage.attachments = [
			{
				color: '#2cbe4e',
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

	await postMessage(slackMessage, logger)
}
