const fetch = require('node-fetch')
const SemanticReleaseError = require('@semantic-release/error')

module.exports = async (
  message,
  logger,
  { slackWebhook, slackToken, slackChannel, slackIcon, slackName }
) => {
  let response
  let bodyText
  let isSuccess
  try {
    if (slackIcon) {
      const hasSemicolons = slackIcon.startsWith(':') && slackIcon.endsWith(':')
      message['icon_emoji'] = hasSemicolons ? slackIcon : `:${slackIcon}:`
    }

    if (slackName) {
      message.username = slackName
    }

    if (slackToken && slackChannel) {
      message.channel = slackChannel
      response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${slackToken}`
        },
        body: JSON.stringify(message)
      })
      bodyText = await response.text()
      isSuccess = response.ok && JSON.parse(bodyText).ok
    } else {
      if (slackChannel) {
        message.channel = slackChannel
      }
      response = await fetch(slackWebhook, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      })
      bodyText = await response.text()
      isSuccess = response.ok && bodyText === 'ok'
    }
  } catch (e) {
    throw new SemanticReleaseError(e.message, 'SLACK CONNECTION FAILED')
  }

  if (!isSuccess) {
    logger.log('JSON message format invalid: ' + bodyText)
    throw new SemanticReleaseError(bodyText, 'INVALID SLACK COMMAND')
  }
}
