const assert = require('assert')
const getConfigToUse = require('../lib/getConfigToUse')
const { getContext } = require('./testUtils')

describe('test getConfigToUse', () => {
  it('should return the global config when no branchesConfig', () => {
    const context = getContext()
    const pluginConfig = {
      notifyOnSuccess: false,
      notifyOnFail: true
    }
    const expectedConfig = pluginConfig

    const actual = getConfigToUse(pluginConfig, context)
    assert.deepEqual(actual, expectedConfig)
  })

  it('should return the branch config merged with the global config when branchesConfig match the branch', () => {
    const context = getContext('lts/1.x')

    const pluginConfig = {
      slackWebhook: 'http://slack-webhook',
      branchesConfig: [
        {
          pattern: 'lts/*',
          notifyOnSuccess: false,
          notifyOnFail: true
        }
      ]
    }
    const expectedConfig = {
      slackWebhook: 'http://slack-webhook',
      notifyOnSuccess: false,
      notifyOnFail: true
    }

    const actual = getConfigToUse(pluginConfig, context)
    assert.deepEqual(actual, expectedConfig)
  })

  it('should return the global config when no branchesConfig match the branch name', () => {
    const context = getContext('beta')
    const pluginConfig = {
      notifyOnSuccess: false,
      notifyOnFail: false,
      branchesConfig: [
        {
          pattern: 'lts/*',
          notifyOnSuccess: true,
          notifyOnFail: true
        }
      ]
    }

    const expectedConfig = {
      notifyOnSuccess: false,
      notifyOnFail: false
    }

    const actual = getConfigToUse(pluginConfig, context)
    assert.deepEqual(actual, expectedConfig)
  })
})
