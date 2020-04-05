const assert = require('assert')
const chunkify = require('../lib/chunkifyText')

const maxLength = 30

describe('test chunkifyText', () => {
  it('should not fail with empty message', () => {
    const text = ''
    const actual = chunkify(text, maxLength)
    assert.deepStrictEqual(actual, [text])
  })

  it('only one chunk when <= maxLength', () => {
    const text = 'hello world'
    const actual = chunkify(text, maxLength)
    assert.deepStrictEqual(actual, [text])
  })

  it('should capture last chunk', () => {
    const text = 'hello world\nhere we come\nto rule'
    const actual = chunkify(text, maxLength)
    const expected = ['hello world\nhere we come', 'to rule']
    assert.deepStrictEqual(actual, expected)
  })

  it('should trim trailing newlines', () => {
    const text = 'hello world\n\nhere we come\n\nto rule\n\n'
    const actual = chunkify(text, maxLength)
    const expected = ['hello world\n\nhere we come', 'to rule']
    assert.deepStrictEqual(actual, expected)
  })

  it('should handle array as input', () => {
    const text = 'hello world\n\nhere we come\n\nto rule\n\n'.split('\n')
    const actual = chunkify(text, maxLength)
    const expected = ['hello world\n\nhere we come', 'to rule']
    assert.deepStrictEqual(actual, expected)
  })
})
