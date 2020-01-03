const fetch = require('node-fetch')
const SemanticReleaseError = require('@semantic-release/error')

module.exports = async (message, logger, slackWebhook) => {
  let response
  let bodyText
  try {
    response = await fetch(slackWebhook, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
    bodyText = await response.text()
  } catch (e) {
    throw new SemanticReleaseError(e.message, 'SLACK CONNECTION FAILED')
  }

  if (!response.ok || bodyText !== 'ok') {
    logger.log('JSON message format invalid: ' + bodyText)
    throw new SemanticReleaseError(bodyText, 'INVALID SLACK COMMAND')
  }
}
