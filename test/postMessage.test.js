const assert = require('assert')
const nock = require('nock')
const postMessage = require('../lib/postMessage')
const SemanticReleaseError = require('@semantic-release/error')

const slackWebhook = 'https://www.webhook.com'
const slackPostMessageDomain = 'https://slack.com'
const slackPostMessagePath = '/api/chat.postMessage'
const slackToken = 'token'
const slackChannel = 'channel'

async function postWebhook(url) {
  url = url || slackWebhook
  await postMessage('message', { log: () => undefined }, { slackWebhook: url })
}

async function postToken(token, channel) {
  token = token || slackToken
  channel = channel || slackChannel
  await postMessage(
    { text: 'message' },
    { log: () => undefined },
    { slackToken: token, slackChannel: channel }
  )
}

describe('test postMessage with webhook', () => {
  it('should pass if response is 200 "ok"', async () => {
    nock(slackWebhook)
      .post('/')
      .reply(200, 'ok')
    assert.ifError(await postWebhook())
  })

  it('should fail if response text is not "ok"', async () => {
    const response = 'not ok'
    nock(slackWebhook)
      .post('/')
      .reply(200, response)
    await assert.rejects(
      postWebhook(),
      new SemanticReleaseError(response, 'INVALID SLACK COMMAND')
    )
  })

  it('should fail if response status code is not 200', async () => {
    const response = 'error message'
    nock(slackWebhook)
      .post('/')
      .reply(500, response)
    await assert.rejects(
      postWebhook(),
      new SemanticReleaseError(response, 'INVALID SLACK COMMAND')
    )
  })

  it('should fail if incorrect url', async () => {
    const incorrectUrl = 'https://sekhfskdfdjksfkjdhfsd.com'
    await assert.rejects(postWebhook(incorrectUrl), {
      name: 'SemanticReleaseError',
      code: 'SLACK CONNECTION FAILED',
      details: undefined,
      message: /ENOTFOUND/,
      semanticRelease: true
    })
  })
})

describe('test postMessage with token/channel', () => {
  it('should pass if response is 200 "ok"', async () => {
    nock(slackPostMessageDomain)
      .post(slackPostMessagePath)
      .reply(200, JSON.stringify({ ok: true }))
    assert.ifError(await postToken())
  })

  it('should fail if response text is not "ok"', async () => {
    const response = JSON.stringify({ ok: false })
    nock(slackPostMessageDomain)
      .post(slackPostMessagePath)
      .reply(200, response)
    await assert.rejects(
      postToken(),
      new SemanticReleaseError(response, 'INVALID SLACK COMMAND')
    )
  })

  it('should fail if response status code is not 200', async () => {
    const response = 'error message'
    nock(slackPostMessageDomain)
      .post(slackPostMessagePath)
      .reply(500, response)
    await assert.rejects(
      postToken(),
      new SemanticReleaseError(response, 'INVALID SLACK COMMAND')
    )
  })
})
