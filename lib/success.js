/* eslint-disable camelcase */
const slackifyMarkdown = require('slackify-markdown')
const postMessage = require('./postMessage')
const template = require('./template')
const chunkify = require('./chunkifyText')
const getRepoInfo = require('./getRepoInfo')

// 2900 is the limit for a message block of type 'section'.
const MAX_LENGTH = 2900

module.exports = async (pluginConfig, context) => {
  const {
    logger,
    nextRelease,
    options,
    env: { SEMANTIC_RELEASE_PACKAGE, npm_package_name }
  } = context

  const {
    slackWebhookEnVar = 'SLACK_WEBHOOK',
    slackWebhook = process.env[slackWebhookEnVar],
    unsafeMaxLength = MAX_LENGTH,
    packageName
  } = pluginConfig

  const package_name =
    SEMANTIC_RELEASE_PACKAGE || packageName || npm_package_name

  if (!pluginConfig.notifyOnSuccess) {
    logger.log('Notifying on success skipped')
    return
  }

  logger.log('Sending slack notification on success')

  const repo = getRepoInfo(options.repositoryUrl)

  let releaseNotes = nextRelease.notes

  if (pluginConfig.markdownReleaseNotes) {
    // Creating slack format from the markdown notes.
    releaseNotes = slackifyMarkdown(releaseNotes)
  }

  let slackMessage = {}
  let chunkedMessages = []
  let slackBaseText = ''
  // Override default success message
  if (pluginConfig.onSuccessTemplate) {
    const templatedMessage = template(pluginConfig.onSuccessTemplate, {
      package_name,
      npm_package_version: nextRelease.version,
      repo_path: repo.path,
      repo_url: repo.URL,
      release_notes: releaseNotes
    })
    // get the first line for the slack message "text" key
    const [firstLine, ...restLines] = templatedMessage['text'].split('\n')
    slackBaseText = firstLine
    // chunkify the rest of the message
    chunkedMessages = chunkify(restLines, unsafeMaxLength)
  } else {
    slackBaseText = `A new version of \`${package_name}\` has been released!\nCurrent version is *#${
      nextRelease.version
    }*`

    if (releaseNotes !== '') {
      // chunkify release notes
      chunkedMessages = chunkify(releaseNotes, unsafeMaxLength)
    }

    if (repo.path) {
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
                  text: `:package: *<${repo.URL}|${repo.path}>:*   <${
                    repo.URL
                  }/releases/tag/${gitTag}|${gitTag}>`
                }
              ]
            }
          ]
        }
      ]
    }
  }

  const messageBlocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: slackBaseText
      }
    }
  ]

  chunkedMessages.forEach(chunk => {
    messageBlocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: chunk
      }
    })
  })

  slackMessage = {
    blocks: messageBlocks,
    text: slackBaseText
  }

  logger.log(slackMessage)

  await postMessage(slackMessage, logger, slackWebhook)
}
