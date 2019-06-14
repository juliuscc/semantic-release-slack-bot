/* eslint-disable camelcase */
const postMessage = require('./postMessage')
const template = require('./template')

module.exports = async (pluginConfig, context) => {
	const { logger, nextRelease, options } = context
	const { npm_package_name } = context.env

	if (!pluginConfig.notifyOnSuccess) {
		logger.log('Notifying on success skipped')
		return
	}

	logger.log('Sending slack notification on success')

	let slackMessage = {}
	const repoPath =
		options.repositoryUrl.indexOf('git@github.com') !== -1
			? options.repositoryUrl.split(':')[1].replace('.git', '')
			: undefined
	const repoURL = repoPath && `https://github.com/${repoPath}`

	if (pluginConfig.onSuccess) {
		slackMessage = template(pluginConfig.onSuccess, {
			npm_package_name,
			npm_package_version: nextRelease.version,
			repo_path: repoPath,
			repo_URL: repoURL,
			release_notes: nextRelease.notes
		})
	} else {
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

		if (nextRelease.notes !== '') {
			messageBlocks.push({
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `*Notes*: ${nextRelease.notes}`
				}
			})
		}

		slackMessage = {
			blocks: messageBlocks,
			text: `A new version of ${npm_package_name} has been released!`
		}

		if (repoPath) {
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
	}

	await postMessage(slackMessage, logger)
}
