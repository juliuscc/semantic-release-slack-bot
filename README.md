# semantic-release-slack-bot

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to get release notifications on [slack](https://slack.com/) from a slack bot

| Step    | Description                                         |
| ------- | --------------------------------------------------- |
| success | Send a slack message to notify of a new release.    |
| fail    | Send a slack message to notify of a failed release. |

[![npm](https://img.shields.io/npm/v/semantic-release-slack-bot.svg?style=flat-square)](https://www.npmjs.com/package/semantic-release-slack-bot)
[![npm](https://img.shields.io/npm/dm/semantic-release-slack-bot.svg?style=flat-square)](https://www.npmjs.com/package/semantic-release-slack-bot)
[![license](https://img.shields.io/github/license/juliuscc/semantic-release-slack-bot.svg?style=flat-square)](https://github.com/juliuscc/semantic-release-slack-bot/blob/master/LICENSE)

## Install

```bash
$ npm install semantic-release-slack-bot -D
```

## Usage

The plugin can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
	"plugins": [
		"@semantic-release/commit-analyzer",
		"@semantic-release/release-notes-generator",
		[
			"semantic-release-slack-bot",
			{
				"notifyOnSuccess": false,
				"notifyOnFail": true
			}
		]
	]
}
```

With this example:

-   Slack notifications are skipped on a succesfull release
-   Slack notifications are sent on a failed release

## Configuration

### Slack app installation

The plugin uses a slack webhook which you get by adding the slack app [semantic-releaser](). Click [here]() to install the app.

### Slack app authentication

The Slack authentication configuration is **required** and can be set via [environment variables](#environment-variables).

TODO: Write _how_ like in [https://github.com/semantic-release/apm#atom-authentication](https://github.com/semantic-release/apm#atom-authentication)

### Environment variables

| Variable      | Description                                         |
| ------------- | --------------------------------------------------- |
| SLACK_WEBHOOK | Slack webhook created when adding app to workspace. |

### Options

| Option          | Description                                                                                                                   | Default |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------- |
| notifyOnSuccess | Determines if a succesfull release should trigger a slack message to be sent. If `false` this plugin does nothing on success. | false   |
| notifyOnFail    | Determines if a failed release should trigger a slack message to be sent. If `false` this plugin does nothing on fail.        | false   |
