const assert = require('assert')
const template = require('../lib/template')

describe('test template', () => {
  it('should replace variable in string if present', () => {
    const world = 'underworld'
    const expected = `hello ${world}`
    const actual = template('hello $world', { world })
    assert.equal(expected, actual)
  })

  it('should not replace variable in string if not present', () => {
    const expected = 'hello $world'
    const actual = template('hello $world', { other: 'underworld' })
    assert.equal(expected, actual)
  })

  it('should return string as is with no matching variables', () => {
    const expected = 'hello world'
    const actual = template(expected, { other: 'underworld' })
    assert.equal(expected, actual)
  })

  it('should return string as is without any variables', () => {
    const expected = 'hello world'
    const actual = template(expected, {})
    assert.equal(expected, actual)
  })

  it('should replace multiple variables in string if present', () => {
    const world = 'underworld'
    const home = 'back'
    const expected = `hello ${world}, welcome ${home}`
    const actual = template('hello $world, welcome $home', {
      world,
      home
    })
    assert.equal(expected, actual)
  })

  it('should replace variable in list', () => {
    const expected = 'underworld'
    const actual = template(['$world'], { world: expected })
    assert.equal(expected, actual)
  })

  it('should replace multiple variables in list', () => {
    const expected = ['underworld', 'goodbye']
    const actual = template(['$world', '$hello'], {
      world: expected[0],
      hello: expected[1]
    })
    assert.deepEqual(expected, actual)
  })

  it('should replace variable in object', () => {
    const expected = { hello: 'underworld' }
    const actual = template({ hello: '$world' }, { world: expected.hello })
    assert.deepEqual(expected, actual)
  })

  it('should replace multiple variables in object', () => {
    const world = 'underworld'
    const home = 'back'
    const expected = { hello: `${world}, welcome ${home}` }
    const actual = template({ hello: '$world, welcome $home' }, { world, home })
    assert.deepEqual(expected, actual)
  })

  it('should replace variables only if present', () => {
    const world = 'underworld'
    const home = 'back'
    const noVariables = 'there are no variables here'
    const expected = {
      hello: `${world}, welcome ${home}`,
      dimension: `${noVariables}`
    }
    const actual = template(
      { hello: '$world, welcome $home', dimension: `${noVariables}` },
      { world, home }
    )
    assert.deepEqual(expected, actual)
  })

  it('should replace variables in all entries', () => {
    const world = 'underworld'
    const nothing = 'everything'
    const expected = {
      hello: `${world}`,
      own: `${nothing}`
    }
    const actual = template(
      { hello: '$world', own: '$nothing' },
      { world, nothing }
    )
    assert.deepEqual(expected, actual)
  })

  it('should return default if neither string or object', () => {
    const expected = 123
    const actual = template(expected)
    assert.equal(expected, actual)
  })

  it.only('PARTY', () => {
    const input = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'my $release_notes goes here'
          }
        }
      ],
      text: 'shalalala'
    }
    //const expected = 123
    const actual = template(input, { release_notes: 'dick' })
    console.log(actual)
    console.log(actual.blocks)
    //assert.equal(expected, actual)
  })
})
