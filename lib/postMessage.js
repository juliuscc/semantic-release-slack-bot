const fetch = require('node-fetch')
const SemanticReleaseError = require('@semantic-release/error')

module.exports = async (
  message,
  logger,
  { slackWebhook, slackToken, slackChannel, slackIcon, slackName }
) => {
  let response
  let bodyText
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${slackToken}`
        },
        body: JSON.stringify(message)
      })
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
    }
    bodyText = await response.text()
  } catch (e) {
    throw new SemanticReleaseError(e.message, 'SLACK CONNECTION FAILED')
  }

  if (!response.ok || bodyText !== 'ok') {
    logger.log('JSON message format invalid: ' + bodyText)
    throw new SemanticReleaseError(bodyText, 'INVALID SLACK COMMAND')
  }
}
