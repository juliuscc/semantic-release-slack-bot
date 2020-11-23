const assert = require('assert')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const { getBaseConfig, getContext } = require('./testUtils')

process.env.SLACK_WEBHOOK = 'awebhook'

let postMessageStub
let fail

describe('test fail', () => {
  beforeEach(() => {
    postMessageStub = sinon.stub()
    fail = proxyquire('../lib/fail', {
      './postMessage': postMessageStub
    })
  })

  it('should handle defaults', async () => {
    const packageName = 'Internal Test'
    const expectedKeys = ['text', 'blocks', 'attachments']

    await fail(getBaseConfig(packageName), getContext())

    const result = postMessageStub.getCall(0).args[0]
    assert.deepStrictEqual(Object.keys(result), expectedKeys)
    assert.strictEqual(
      result.text,
      `An error occurred while trying to publish the new version of ${packageName}!`
    )
  })

  it('should handle onFailTemplate', async () => {
    const packageName = 'Internal Test'
    const text = 'Released!'
    const expectedResult = { text }
    const pluginConfig = getBaseConfig(packageName)

    pluginConfig.onFailTemplate = expectedResult

    await fail(pluginConfig, getContext())

    const actualResult = postMessageStub.getCall(0).args[0]
    assert.deepStrictEqual(actualResult, expectedResult)
  })

  it('should handle onFailFunction', async () => {
    const packageName = 'Internal Test'
    const text = 'Released!'
    const expectedResult = { text }
    const pluginConfig = getBaseConfig(packageName)
    const onFailFunction = (pluginConfig, context) => {
      return expectedResult
    }

    pluginConfig.onFailFunction = onFailFunction

    await fail(pluginConfig, getContext())

    const actualResult = postMessageStub.getCall(0).args[0]
    assert.deepStrictEqual(actualResult, expectedResult)
  })
})
