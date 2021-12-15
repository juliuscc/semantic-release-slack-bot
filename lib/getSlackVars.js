module.exports = config => {
  const {
    slackWebhookEnVar = 'SLACK_WEBHOOK',
    slackWebhook = process.env[slackWebhookEnVar],
    slackTokenEnVar = 'SLACK_TOKEN',
    slackToken = process.env[slackTokenEnVar],
    slackChannelEnVar = 'SLACK_CHANNEL',
    slackChannel = process.env[slackChannelEnVar]
  } = config
  return {
    slackWebhookEnVar,
    slackWebhook,
    slackChannelEnVar,
    slackChannel,
    slackTokenEnVar,
    slackToken
  }
}
