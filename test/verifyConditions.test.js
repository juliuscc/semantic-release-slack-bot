const SemanticReleaseError = require('@semantic-release/error')
const assert = require('assert')

const verifyConditions = require('../lib/verifyConditions')
const { getContext } = require('./testUtils')

describe('test verifyConditions', () => {
  beforeEach(() => {
    delete process.env.SLACK_WEBHOOK
    delete process.env.SLACK_TOKEN
    delete process.env.SLACK_CHANNEL
    delete process.env.CUSTOM_VAR
    delete process.env.CUSTOM_WEBHOOK
  })

  describe('test slack webhooks options', () => {
    const fakeContext = {
      ...getContext(),
      logger: { log: () => undefined },
      env: {}
    }
    const defaultPluginConfig = { packageName: 'test' }
    const getMissingWebhookError = slackWebhookEnVar => {
      return `A Slack Webhook must be created and set in the \`${slackWebhookEnVar}\` environment variable on your CI environment.\n\n\nPlease make sure to create a Slack Webhook and to set it in the \`${slackWebhookEnVar}\` environment variable on your CI environment. Alternatively, provide \`slackWebhook\` as a configuration option.`
    }

    it('should throw if neither slackWebhook and environment variable SLACK_WEBHOOK are set', () => {
      assert.throws(
        () => verifyConditions(defaultPluginConfig, fakeContext),
        new SemanticReleaseError(
          'No Slack web-hook defined.',
          'ENOSLACKHOOK',
          getMissingWebhookError('SLACK_WEBHOOK')
        )
      )
    })

    it('should throw if slackWebhook is not set and slackWebhookEnVar give an empty environment variable', () => {
      assert.throws(
        () =>
          verifyConditions(
            { ...defaultPluginConfig, slackWebhookEnVar: 'CUSTOM_WEBHOOK' },
            fakeContext
          ),
        new SemanticReleaseError(
          'No Slack web-hook defined.',
          'ENOSLACKHOOK',
          getMissingWebhookError('CUSTOM_WEBHOOK')
        )
      )
    })

    it('should not throw if slackWebhook is provided', () => {
      verifyConditions(
        { ...defaultPluginConfig, slackWebhook: 'MY SLACK WEBHOOK' },
        fakeContext
      )
    })

    it('should not throw if SLACK_WEBHOOK is set', () => {
      process.env.SLACK_WEBHOOK = 'MY SLACK WEBHOOK'
      verifyConditions(defaultPluginConfig, fakeContext)
    })

    it('should not throw if slackWebhookEnVar give an environment variable', () => {
      process.env.CUSTOM_WEBHOOK = 'MY SLACK WEBHOOK'
      verifyConditions(
        { ...defaultPluginConfig, slackWebhookEnVar: 'CUSTOM_WEBHOOK' },
        fakeContext
      )
    })
  })

  describe('test slack token and channel options', () => {
    const fakeContext = {
      ...getContext(),
      logger: { log: () => undefined },
      env: {}
    }
    const defaultPluginConfig = { packageName: 'test' }
    const getMissingTokenError = slackTokenEnVar => {
      return `A Slack Token must be created and set in the \`${slackTokenEnVar}\` environment variable on your CI environment.\n\n\nPlease make sure to create a Slack Token and to set it in the \`${slackTokenEnVar}\` environment variable on your CI environment. Alternatively, provide \`slackToken\` as a configuration option.`
    }
    const getMissingChannelError = slackChannelEnVar => {
      return `A Slack Channel must be created and set in the \`${slackChannelEnVar}\` environment variable on your CI environment.\n\n\nPlease make sure to set a Slack Channel in the \`${slackChannelEnVar}\` environment variable on your CI environment. Alternatively, provide \`slackChannel\` as a configuration option.`
    }

    it('should throw if neither slackChannel and environment variable SLACK_CHANNEL are set but slackToken is', () => {
      assert.throws(
        () =>
          verifyConditions(
            { ...defaultPluginConfig, slackToken: 'some token' },
            fakeContext
          ),
        new SemanticReleaseError(
          'No Slack channel defined.',
          'ENOSLACKCHANNEL',
          getMissingChannelError('SLACK_CHANNEL')
        )
      )
    })

    it('should throw if slackToken is set, slackChannel is not set and slackChannelEnVar give an empty environment variable', () => {
      assert.throws(
        () =>
          verifyConditions(
            {
              ...defaultPluginConfig,
              slackToken: 'some token',
              slackChannelEnVar: 'CUSTOM_CHANNEL'
            },
            fakeContext
          ),
        new SemanticReleaseError(
          'No Slack channel defined.',
          'ENOSLACKCHANNEL',
          getMissingChannelError('CUSTOM_CHANNEL')
        )
      )
    })

    it('should not throw if slackToken and slackChannel is provided', () => {
      verifyConditions(
        {
          ...defaultPluginConfig,
          slackToken: 'MY SLACK TOKEN',
          slackChannel: 'MY SLACK CHANNEL'
        },
        fakeContext
      )
    })

    it('should not throw if SLACK_TOKEN and SLACK_CHANNEL is set', () => {
      process.env.SLACK_TOKEN = 'MY SLACK TOKEN'
      process.env.SLACK_CHANNEL = 'MY SLACK CHANNEL'
      verifyConditions(defaultPluginConfig, fakeContext)
    })

    it('should not throw if slackTokenEnVar and slackChannelEnVar give an environment variable', () => {
      process.env.CUSTOM_VAR = 'some var'
      verifyConditions(
        {
          ...defaultPluginConfig,
          slackTokenEnVar: 'CUSTOM_VAR',
          slackChannelEnVar: 'CUSTOM_VAR'
        },
        fakeContext
      )
    })
  })

  describe('test branchesConfig options', () => {
    const fakeContext = getContext()
    const defaultPluginConfig = {
      packageName: 'test',
      slackWebhook: 'MY SLACK WEBHOOK'
    }

    it('should throw if branchesConfig is not an array', () => {
      assert.throws(
        () =>
          verifyConditions(
            { ...defaultPluginConfig, branchesConfig: {} },
            fakeContext
          ),
        new SemanticReleaseError(
          'branchesConfig is not an array.',
          'EINVALIDBRANCHCONFIG',
          `Provided branches configuration is not an array. Ensure "branchesConfig" is properly set in your configuration option.`
        )
      )
    })

    it('should throw if branchesConfig do not contain a pattern', () => {
      assert.throws(
        () =>
          verifyConditions(
            {
              ...defaultPluginConfig,
              branchesConfig: [{ pattern: 'master' }, {}]
            },
            fakeContext
          ),
        new SemanticReleaseError(
          'pattern is not defined in branchesConfig.',
          'ENOPATTERN',
          `A pattern for the branch configuration must be added. Ensure "branchesConfig" is properly set in your configuration option.`
        )
      )
    })

    it('should not throw if branchesConfig is not provided', () => {
      verifyConditions(defaultPluginConfig, fakeContext)
    })

    it('should not throw if branchesConfig is properly set', () => {
      verifyConditions(
        {
          ...defaultPluginConfig,
          branchesConfig: [{ pattern: 'master' }, { pattern: 'lts/*' }]
        },
        fakeContext
      )
    })
  })
})
