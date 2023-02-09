# semantic-release-slack-bot

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to get release notifications on [slack](https://slack.com) from a slack bot

[![npm](https://img.shields.io/npm/v/semantic-release-slack-bot.svg?style=flat-square)](https://www.npmjs.com/package/semantic-release-slack-bot)
[![npm](https://img.shields.io/npm/dm/semantic-release-slack-bot.svg?style=flat-square)](https://www.npmjs.com/package/semantic-release-slack-bot)
[![CircleCI branch](https://img.shields.io/circleci/project/github/juliuscc/semantic-release-slack-bot/master.svg?style=flat-square)](https://circleci.com/gh/juliuscc/semantic-release-slack-bot)
[![license](https://img.shields.io/github/license/juliuscc/semantic-release-slack-bot.svg?style=flat-square)](https://github.com/juliuscc/semantic-release-slack-bot/blob/master/LICENSE)
[![add to slack](https://img.shields.io/badge/Add%20to%20Slack-Semantic%20Release-%234A154B.svg?style=flat-square&logo=slack)](https://slack.com/oauth/authorize?client_id=605439709265.611687593109&scope=incoming-webhook)

| Step      | Description                                         |
| --------- | --------------------------------------------------- |
| `success` | Send a slack message to notify of a new release.    |
| `fail`    | Send a slack message to notify of a failed release. |

## Install

Add the plugin to your npm-project:

```bash
$ npm install semantic-release-slack-bot -D
```

## Requirements

As per the new release of semantic-release library version 20, the library is requiring the use of Node v18, which we need to comply as well to use keep the repo updated with it's latest feature. More information can be found [here](https://github.com/semantic-release/semantic-release/releases/tag/v20.0.0).

## Slack App/Webhook Usage

The corresponding slack app has to be installed in your slack workspace as well. Follow the instructions under [configuration](#configuration) for more information.

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
        "notifyOnFail": false,
        "slackWebhook": "https://my-webhook.com",
        "branchesConfig": [
          {
            "pattern": "lts/*",
            "notifyOnFail": true
          },
          {
            "pattern": "master1",
            "notifyOnSuccess": true,
            "notifyOnFail": true
          }
        ]
      }
    ]
  ]
}
```

With this example:

- Slack notification will always be sent using the "https://my-webhook.com" webhook url
- Slack notifications are sent on a failure release from branches matching "lts/\*"
- Slack notifications are sent on a failure or successful release from branch "master"
- Slack notifications are skipped on all other branches

#### Note

[The official documentation](https://api.slack.com/messaging/webhooks) says that a developer cannot
override the default name, channel or icon that are associated with the webhook, but some users of
this library reported that they were able to.

- use `slackName` (or `SLACK_NAME` env var) for overriding slack app name
- use `slackIcon` (or `SLACK_ICON` env var) for overriding slack app icon
- use `slackChannel` (or `SLACK_CHANNEL` env var) for overriding slack channel

**WARNING: This is not mentioned in the official documentation, so use at your own risk.**

## Slack Access Token/Channel Usage

This configuration can be used with a [**bot**](https://api.slack.com/authentication/token-types#bot) Slack Access token with minimum permissions of `chat:write`.

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
        "notifyOnFail": false,
        "slackToken": "token",
        "slackChannel": "#my-channel-name",
        "branchesConfig": [
          {
            "pattern": "lts/*",
            "notifyOnFail": true
          },
          {
            "pattern": "master1",
            "notifyOnSuccess": true,
            "notifyOnFail": true
          }
        ]
      }
    ]
  ]
}
```

With this example:

- Slack notification will always be sent to the channel "#my-channel-name"
- Slack notifications are sent on a failure release from branches matching "lts/\*"
- Slack notifications are sent on a failure or successful release from branch "master"
- Slack notifications are skipped on all other branches

## Screenshots

![Screenshot of success](images/screenshot-success.png)
![Screenshot of fail](images/screenshot-fail.png)

## Configuration

### Slack app installation

The plugin uses a slack webhook which you get by adding the slack app to your slack workspace. Register the app using the button below or [this link](https://slack.com/oauth/authorize?client_id=605439709265.611687593109&scope=incoming-webhook).

<a href="https://slack.com/oauth/authorize?client_id=605439709265.611687593109&scope=incoming-webhook"><img alt="Add to Slack" height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"></a>

For the security concerned, feel free to [create your own slack app](https://api.slack.com/apps) and create a webhook or inspect the server code that does this creation for you at [create-webhook.js](lambda/create-webhook.js). The only required permission for the webhook is to publish to a single channel.

### Slack Webhook

Installing the app will yield you with a webhook that the app uses to publish updates to your selected channel. The Slack webhook authentication link is **required and needs to be kept a secret**. It should be defined in the [environment variables](#environment-variables).

### Slack Access tokens

If you are creating your own slack app you can choose to use a bot access token and channel instead of the webhook with at least one of the following permission scopes.

1. `chat:write` with this permission scope the app/bot must be added to any channels before it can post to them
2. `chat:write.public` with this permission scope we can automatically post to any public channel for more information see [here](https://api.slack.com/authentication/basics#public)

### Environment variables

Options can be defined in the environment where you will run semantic release. This can be done by exporting it in bash or in the user interface of your CI provider.

Alternatively, you can pass the webhook as a configuration option or use an Access Token.

| Variable                   | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `SLACK_WEBHOOK`            | Slack webhook created when adding app to workspace.      |
| `SLACK_TOKEN`              | Slack bot Access token.                                  |
| `SLACK_CHANNEL`            | Slack channel name or id to send notifications to.       |
| `SLACK_ICON`               | Slack bot app icon.                                      |
| `SLACK_NAME`               | Slack bot app name.                                      |
| `SEMANTIC_RELEASE_PACKAGE` | Override or add package name instead of npm package name |

### Options

| Option                 | Description                                                                                                                                                                                                                                                                                       | Default                                                        |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------- |
| `notifyOnSuccess`      | Determines if a successful release should trigger a slack message to be sent. If `false` this plugin does nothing on success.                                                                                                                                                                     | false                                                          |
| `notifyOnFail`         | Determines if a failed release should trigger a slack message to be sent. If `false` this plugin does nothing on fail.                                                                                                                                                                            | false                                                          |
| `onSuccessFunction`    | Provides a function for the slack message object on success when `notifyOnSuccess` is `true`. See [function](#function).                                                                                                                                                                          | undefined                                                      |
| `onFailFunction`       | Provides a function for the slack message object on fail when `notifyOnFail` is `true`. See [function](#function).                                                                                                                                                                                | undefined                                                      |
| `onSuccessTemplate`    | Provides a template for the slack message object on success when `notifyOnSuccess` is `true`. See [templating](#templating).                                                                                                                                                                      | undefined                                                      |
| `onFailTemplate`       | Provides a template for the slack message object on fail when `notifyOnFail` is `true`. See [templating](#templating).                                                                                                                                                                            | undefined                                                      |
| `markdownReleaseNotes` | Pass release notes through markdown to slack formatter before rendering.                                                                                                                                                                                                                          | false                                                          |
| `slackWebhookEnVar`    | This decides what the environment variable for exporting the slack webhook value.                                                                                                                                                                                                                 | SLACK_WEBHOOK                                                  |
| `slackWebhook`         | Slack webhook created when adding app to workspace.                                                                                                                                                                                                                                               | value of the environment variable matching `slackWebhookEnVar` |
| `slackTokenEnVar`      | This decides what the environment variable for exporting the slack token value.                                                                                                                                                                                                                   | SLACK_TOKEN                                                    |
| `slackToken`           | Slack bot token.                                                                                                                                                                                                                                                                                  | value of the environment variable matching `slackTokenEnVar`   |
| `slackChannelEnVar`    | This decides what the environment variable for exporting the slack channel value.                                                                                                                                                                                                                 | SLACK_CHANNEL                                                  |
| `slackChannel`         | Slack channel name or id to send notifications to.                                                                                                                                                                                                                                                | value of the environment variable matching `slackChannelEnVar` |
| `slackIconEnVar`       | This decides what the environment variable for specifying the slack app icon with slack emoji. ex. `:smile:` or `smile` (without semicolons)                                                                                                                                                      | SLACK_ICON                                                     |
| `slackIcon`            | Slack app icon                                                                                                                                                                                                                                                                                    | value of the environment variable matching `slackIconEnVar`    |
| `slackNameEnVar`       | This decides what the environment variable for specifying the slack app name                                                                                                                                                                                                                      | SLACK_NAME                                                     |
| `slackName`            | Slack app name                                                                                                                                                                                                                                                                                    | value of the environment variable matching `slackNameEnVar`    |
| `packageName`          | Override or add package name instead of npm package name                                                                                                                                                                                                                                          | SEMANTIC_RELEASE_PACKAGE or npm package name                   |
| `unsafeMaxLength`      | Maximum character length for the release notes before truncation. If unsafeMaxLength is too high, messages can be dropped. [Read here](https://github.com/juliuscc/semantic-release-slack-bot/issues/26#issuecomment-569804359) for more information. Set to '0' to turn off truncation entirely. | 2900                                                           |
| `branchesConfig`       | Allow to specify a custom configuration for branches which match a given pattern. For every branches matching a branch config, the config will be merged with the one put at the root. A key "pattern" used to filter the branch using glob expression must be contained in every branchesConfig. | []                                                             |

### Function

If a function is provided with either the `onSuccessFunction` or `onFailFunction` options, it will be used for the respective slack message. The function should return an object that follows the [Slack API message structure](https://api.slack.com/docs/message-formatting). The function is passed two objects, `pluginConfig` and `context`, the same objects that are passed to [plugins](https://github.com/semantic-release/semantic-release/blob/master/docs/developer-guide/plugin.md#plugin-developer-guide).

**Note**: This only works with a [configuration file](https://semantic-release.gitbook.io/semantic-release/usage/configuration#configuration-file) that exports an object (see below for an example).

<details>

<summary> Example config (some parts omitted) </summary>

```js
const slackifyMarkdown = require('slackify-markdown')
const { chunkifyString } = require('semantic-release-slack-bot/lib/chunkifier')

const onSuccessFunction = (pluginConfig, context) => {
  const releaseNotes = slackifyMarkdown(context.nextRelease.notes)
  const text = `Updates to ${pluginConfig.packageName} has been released to *Stage!*`
  const headerBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text
    }
  }

  return {
    text,
    blocks: [
      headerBlock,
      ...chunkifyString(releaseNotes, 2900).map(chunk => {
        return {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: chunk
          }
        }
      })
    ]
  }
}

module.exports = {
  branches: ['master'],
  preset: 'eslint',
  plugins: [
    [
      'semantic-release-slack-bot',
      {
        notifyOnSuccess: true,
        onSuccessFunction,
        packageName: 'Testing Semantic Release'
      }
    ]
  ]
}
```

</details>

### Templating

If a template is provided via either the `onSuccessTemplate` or `onFailTemplate` options, it will be used for the respective slack message. The template should be an object that follows the [Slack API message structure](https://api.slack.com/docs/message-formatting). Strings within the template will have keywords replaced:

| Keyword                | Description                 | Example                                           | Template          |
| ---------------------- | --------------------------- | ------------------------------------------------- | ----------------- |
| `$package_name`        | The name of the package.    | semantic-release-test                             | Both              |
| `$npm_package_version` | The version of the release. | 1.0.93                                            | onSuccessTemplate |
| `$repo_path`           | The repository path.        | juliuscc/semantic-release-test                    | Both              |
| `$repo_url`            | The repository URL.         | https://github.com/juliuscc/semantic-release-test | Both              |
| `$release_notes`       | The notes of the release.   |                                                   | onSuccessTemplate |

A sample configuration with template can look like this

```json
"onSuccessTemplate": {
  "text": "A new version of $package_name with version $npm_package_version has been released at $repo_url!"
}
```

### Helper functions

There are two helper functions exported by the [`chunkifier`](lib/chunkifier.js) module.

`chunkifyArray` takes an array of strings and returns a new array based on `maxLength` and `delimiter`. `delimiter` is optional and defaults to newline.

`chunkifyString` takes a string and returns an array based on `maxLength` and `delimiter`. `delimiter` is optional and defaults to newline.

See respective implementation for more details.
