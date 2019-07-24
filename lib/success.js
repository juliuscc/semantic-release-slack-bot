/* eslint-disable camelcase */
const slackifyMarkdown = require('slackify-markdown')
const postMessage = require('./postMessage')
const template = require('./template')

// Max lenght of message to the slack api is 3000 characters. Make sure we are below that.
const MAX_LENGTH = 2900

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

	// Override default success message
	if (pluginConfig.onSuccessTemplate) {
		// Creating slack format from the markdown notes.
		let releaseNotes = nextRelease.notes
		if (pluginConfig.markdownReleaseNotes)
			releaseNotes = slackifyMarkdown(releaseNotes)

		slackMessage = template(pluginConfig.onSuccessTemplate, {
			package_name,
			npm_package_version: nextRelease.version,
			repo_path: repoPath,
			repo_url: repoURL,
			release_notes: releaseNotes
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
			// truncate long messages
			let messageText =
				nextRelease.notes.length > MAX_LENGTH
					? nextRelease.notes.substring(0, MAX_LENGTH) + '*[...]*'
					: nextRelease.notes

			if (pluginConfig.markdownReleaseNotes)
				messageText = slackifyMarkdown(nextRelease.notes)

			messageBlocks.push({
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `${messageText}`
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

	logger.log(slackMessage)

	await postMessage(slackMessage, logger)
}
