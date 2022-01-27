const assert = require('assert')
const getRepoInfo = require('../lib/getRepoInfo')

const runAssert = (repoUrl, path, url, hostname) => {
  const actual = getRepoInfo(repoUrl)

  assert.equal(path, actual.path)
  assert.equal(url, actual.URL)
  assert.equal(hostname, actual.hostname)
}

describe('test getRepoInfo', () => {
  it('should work for github', () => {
    const repositoryUrl = 'ssh://git@github.com:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.com/hello/world'
    const expectedHostname = 'github.com'
    runAssert(repositoryUrl, expectedPath, expectedUrl, expectedHostname)
  })

  it('should work for bitbucket', () => {
    const repositoryUrl = 'ssh://hg@bitbucket.org/hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://bitbucket.org/hello/world'
    const expectedHostname = 'bitbucket.org'
    runAssert(repositoryUrl, expectedPath, expectedUrl, expectedHostname)
  })

  it('should work for gitlab', () => {
    const repositoryUrl = 'ssh://git@gitlab.com:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://gitlab.com/hello/world'
    const expectedHostname = 'gitlab.com'
    runAssert(repositoryUrl, expectedPath, expectedUrl, expectedHostname)
  })

  it('should work for repo url with https', () => {
    const repositoryUrl = 'https://github.com/hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.com/hello/world'
    const expectedHostname = 'github.com'
    runAssert(repositoryUrl, expectedPath, expectedUrl, expectedHostname)
  })

  it('should work for repo url with git@', () => {
    const repositoryUrl = 'git@github.com:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.com/hello/world'
    const expectedHostname = 'github.com'
    runAssert(repositoryUrl, expectedPath, expectedUrl, expectedHostname)
  })

  it('should work for repo url with other TLD', () => {
    const repositoryUrl = 'git@github.pl:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.pl/hello/world'
    const expectedHostname = 'github.pl'
    runAssert(repositoryUrl, expectedPath, expectedUrl, expectedHostname)
  })
})
