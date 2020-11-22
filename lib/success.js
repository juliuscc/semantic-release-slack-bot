/* eslint-disable camelcase */
const slackifyMarkdown = require('slackify-markdown')
const postMessage = require('./postMessage')
const template = require('./template')
const chunkify = require('./chunkifyText')
const getRepoInfo = require('./getRepoInfo')

const {
  chunkifyString,
  chunkifyBlocks,
  chunkifyArray
} = require('./chunkifier')

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

  const hasChunk = template => {
    for (let block of template.blocks) {
      if ('chunk' in block && block.chunk) {
        return true
      }
    }
    return false
  }

  let slackMessage = {}
  const chunkedMessages = []
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

    const templateKeys = Object.keys(pluginConfig.onSuccessTemplate)
    // if the only key is "text", we treat the input as a string
    if (templateKeys.length === 1 && templateKeys[0] === 'text') {
      // get the first line for the slack message "text" key
      const [firstLine, ...restLines] = templatedMessage['text'].split('\n')
      slackBaseText = firstLine
      // chunkify the rest of the message
      chunkedMessages = chunkifyArray(restLines, unsafeMaxLength)
    } else if ('blocks' in template && hasChunk(template)) {
      slackMessage = chunkifyBlocks(templatedMessage, unsafeMaxLength)
    }
  } else {
    slackBaseText = `A new version of \`${package_name}\` has been released!\nCurrent version is *#${
      nextRelease.version
    }*`

    if (releaseNotes !== '') {
      // chunkify release notes
      chunkedMessages = chunkifyString(releaseNotes, unsafeMaxLength)
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

  if (Object.entries(slackMessage).length === 0) {
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
  }
  logger.log(slackMessage)

  await postMessage(slackMessage, logger, slackWebhook)
}

template = {
  text: 'hello',
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'nosplitheader'
      }
    },
    {
      chunk: true,
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'hello world'
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'nosplitfooter'
      }
    }
  ]
}

const chunkifyBlock = block => {
  const chunks = block.text.text.split(' ')
  //delete block.chunk
  return chunks.map(text => ({
    ...block,
    text: {
      ...block.text,
      text
    }
  }))
}

const newArray = template.blocks.reduce((newInProgress, oldBlock) => {
  if (!oldBlock.chunk) return [...newInProgress, oldBlock]
  const splitBlocks = chunkifyBlock(oldBlock)
  return [...newInProgress, ...splitBlocks]
}, [])

console.log(newArray)

const hasChunk = template => {
  for (let block of template.blocks) {
    if ('chunk' in block && block.chunk) {
      console.log('ping')
      return true
    }
  }
  return false
}
console.log(hasChunk(template))
/*
const chunkifyBlock = (blocks) => {
  blocks.forEach((block, blockToSplitIndex) => {
    if ('chunk' in block && block.chunk === true) {
      delete block.chunk
      // chunkify block.text.text
      const chunks = block.text.text.split(' ')
      const blockToSplit = blocks[blockToSplitIndex]
      blocks.splice(blockToSplitIndex, 1, ...[...Array(chunks.length)].map(() => ({
        ...blockToSplit,
        text: {
          ...blockToSplit,
          text: chunk,
        }
      })))
    }
  })
}
*/

//chunkifyBlock(template.blocks)
//console.log(template.blocks)

/*
templateKeys = Object.keys(template)

const hasChunk = (template) => {
  for (let block of template.blocks) {
    if ('chunk' in block && block.chunk === true) {
      return true
    }
  }
  return false
}

if (templateKeys.length === 1 && templateKeys[0] === 'text') {
  console.log("success")
} else if ('blocks' in template && hasChunk(template)) {
  console.log("blocks found")
}
*/
