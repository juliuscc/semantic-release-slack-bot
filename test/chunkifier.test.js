const assert = require('assert')
const { delimiter } = require('path')
const { chunkifyArray, chunkifyString } = require('../lib/chunkifier')

const DEFAULT_DELIMITER = '\n'
const MAX_LENGTH = 30

describe('test chunkifyArray', () => {
  it('should not fail on empty messageLines', () => {
    const expected = []
    const actual = chunkifyArray(expected, MAX_LENGTH)
    assert.deepStrictEqual(actual, expected)
  })

  it('should return only one chunk if message is <= maxLength', () => {
    const expected = 'we shall rule the world'.split(delimiter)
    const actual = chunkifyArray(
      expected,
      (expected[0] + DEFAULT_DELIMITER).length
    )
    assert.deepStrictEqual(actual, expected)
  })

  it('should capture last chunk', () => {
    const messageLines = 'hello world\nhere we come\nto rule'.split(
      DEFAULT_DELIMITER
    )
    const expected = ['hello world\nhere we come', 'to rule']
    const actual = chunkifyArray(messageLines, MAX_LENGTH)
    assert.deepStrictEqual(actual, expected)
  })

  it('should trim trailing newlines', () => {
    const messageLines = 'hello world\n\nhere we come\n\nto rule\n\n'.split(
      DEFAULT_DELIMITER
    )
    const expected = ['hello world\n\nhere we come', 'to rule']
    const actual = chunkifyArray(messageLines, MAX_LENGTH)
    assert.deepStrictEqual(actual, expected)
  })

  it('should handle non-default delimiter', () => {
    const delimiter = ' '
    const messageLines = 'hello world\nhere we come\nto rule\n'.split(delimiter)
    const expected = ['hello world\nhere we come\nto', 'rule']
    const actual = chunkifyArray(messageLines, MAX_LENGTH, delimiter)
    assert.deepStrictEqual(actual, expected)
  })
})

describe('test chunkifyString', () => {
  it('should not fail on empty messageText', () => {
    const messageText = ''
    const expected = [messageText]
    const actual = chunkifyString(messageText, MAX_LENGTH)
    assert.deepStrictEqual(actual, expected)
  })

  it('should return only one chunk if message is <= maxLength', () => {
    const expected = 'we shall rule the world'
    const actual = chunkifyString(
      expected,
      (expected + DEFAULT_DELIMITER).length
    )
    assert.deepStrictEqual(actual, [expected])
  })

  it('should capture last chunk', () => {
    const messageText = 'hello world\nhere we come\nto rule'
    const expected = ['hello world\nhere we come', 'to rule']
    const actual = chunkifyString(messageText, MAX_LENGTH)
    assert.deepStrictEqual(actual, expected)
  })

  it('should trim trailing newlines', () => {
    const messageText = 'hello world\n\nhere we come\n\nto rule\n\n'
    const expected = ['hello world\n\nhere we come', 'to rule']
    const actual = chunkifyString(messageText, MAX_LENGTH)
    assert.deepStrictEqual(actual, expected)
  })

  it('should handle non-default delimiter', () => {
    const messageText = 'hello world\nhere we come\nto rule\n'
    const expected = ['hello world\nhere we come\nto', 'rule']
    const actual = chunkifyString(messageText, MAX_LENGTH, ' ')
    assert.deepStrictEqual(actual, expected)
  })
})
