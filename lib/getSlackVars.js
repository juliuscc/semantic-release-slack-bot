module.exports = config => {
  const {
    slackWebhookEnVar = 'SLACK_WEBHOOK',
    slackWebhook = process.env[slackWebhookEnVar],
    slackTokenEnVar = 'SLACK_TOKEN',
    slackToken = process.env[slackTokenEnVar],
    slackChannelEnVar = 'SLACK_CHANNEL',
    slackChannel = process.env[slackChannelEnVar],
    slackIconEnVar = 'SLACK_ICON',
    slackIcon = process.env[slackIconEnVar],
    slackNameEnVar = 'SLACK_NAME',
    slackName = process.env[slackNameEnVar]
  } = config
  return {
    slackWebhookEnVar,
    slackWebhook,
    slackChannelEnVar,
    slackChannel,
    slackTokenEnVar,
    slackToken,
    slackIconEnVar,
    slackIcon,
    slackNameEnVar,
    slackName
  }
}
