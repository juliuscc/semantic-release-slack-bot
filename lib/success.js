/* eslint-disable camelcase */
const postMessage = require('./postMessage')
const template = require('./template')

module.exports = async (pluginConfig, context) => {
	const { logger, nextRelease, options } = context

	let package_name = context.env.SEMANTIC_RELEASE_PACKAGE
	if (!package_name) package_name = context.env.npm_package_name

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

	// Override default success template
	if (pluginConfig.onSuccessTemplate) {
		console.log(nextRelease.version)
		slackMessage = template(pluginConfig.onSuccessTemplate, {
			package_name,
			npm_package_version: nextRelease.version,
			repo_path: repoPath,
			repo_url: repoURL,
			release_notes: nextRelease.notes
		})
	} else {
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

		slackMessage = {
			blocks: messageBlocks,
			text: `A new version of ${package_name} has been released!`
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
