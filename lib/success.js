const postMessage = require('./postMessage')

module.exports = async (pluginConfig, context) => {
	if (!pluginConfig.notifyOnSuccess) {
		return
	}

	const { nextRelease, options } = context

	let messageBlocks = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `A new version has been released!\n Current version is *#${
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

	if (options.repositoryUrl.indexOf('git@github.com') != -1) {
		const repoPath = options.repositoryUrl.split(':')[1].replace('.git', '')
		const repoURL = `https://github.com/${repoPath}`
		const gitTag = nextRelease.gitTag

		// const divider = {
		// 	type: 'divider'
		// }
		const metadata = {
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: `*<${repoURL}|${repoPath}>:*   <${repoURL}/releases/tag/${gitTag}|${gitTag}>`
				}
			]
		}

		messageBlocks.push(metadata)
		// messageBlocks.push(divider)
	}

	let slackMessage = {
		blocks: messageBlocks,
		text: `A new version of ${npm_package_name} has been released!`
	}

	await postMessage(slackMessage)
}
