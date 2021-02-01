const SemanticReleaseError = require('@semantic-release/error')
const assert = require('assert')

const verifyConditions = require('../lib/verifyConditions')
const { getContext } = require('./testUtils')

describe('test verifyConditions', () => {
  beforeEach(() => {
    delete process.env.SLACK_WEBHOOK
  })

  describe('test slack webhooks options', () => {
    const fakeContext = { logger: { log: () => undefined }, env: {} }
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
