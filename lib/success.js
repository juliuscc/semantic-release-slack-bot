/* eslint-disable camelcase */
const slackifyMarkdown = require('slackify-markdown')
const postMessage = require('./postMessage')
const template = require('./template')
const truncate = require('./truncate')

// Max lenght of message to the slack api is 3000 characters. Make sure we are below that.
const MAX_LENGTH = 2900

module.exports = async (pluginConfig, context) => {
	const {
		logger,
		nextRelease,
		options,
		env: { SEMANTIC_RELEASE_PACKAGE, npm_package_name }
	} = context
	const { slackWebhook = process.env.SLACK_WEBHOOK } = pluginConfig

	const package_name = SEMANTIC_RELEASE_PACKAGE || npm_package_name

	if (!pluginConfig.notifyOnSuccess) {
		logger.log('Notifying on success skipped')
		return
	}

	logger.log('Sending slack notification on success')

	const repoPath =
		options.repositoryUrl.indexOf('git@github.com') !== -1
			? options.repositoryUrl.split(':')[1].replace('.git', '')
			: undefined
	const repoURL = repoPath && `https://github.com/${repoPath}`

	let releaseNotes = nextRelease.notes

	if (pluginConfig.markdownReleaseNotes) {
		// Creating slack format from the markdown notes.
		releaseNotes = slackifyMarkdown(releaseNotes)
	}

	// truncate long messages
	releaseNotes = truncate(releaseNotes, MAX_LENGTH)

	let slackMessage = {}
	// Override default success message
	if (pluginConfig.onSuccessTemplate) {
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

		if (releaseNotes !== '') {
			messageBlocks.push({
				type: 'section',
				text: {
					type: 'mrkdwn',
					text: `${releaseNotes}`
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

	await postMessage(slackMessage, logger, slackWebhook)
}
