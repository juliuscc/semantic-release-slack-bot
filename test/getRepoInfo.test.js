const assert = require('assert')
const getRepoInfo = require('../lib/getRepoInfo')

const runAssert = (repoUrl, path, url) => {
  const actual = getRepoInfo(repoUrl)

  assert.equal(path, actual.path)
  assert.equal(url, actual.URL)
}

describe('test getRepoInfo', () => {
  it('should work for github', () => {
    const repositoryUrl = 'ssh://git@github.com:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.com/hello/world'
    runAssert(repositoryUrl, expectedPath, expectedUrl)
  })

  it('should work for bitbucket', () => {
    const repositoryUrl = 'ssh://hg@bitbucket.org/hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://bitbucket.org/hello/world'
    runAssert(repositoryUrl, expectedPath, expectedUrl)
  })

  it('should work for gitlab', () => {
    const repositoryUrl = 'ssh://git@gitlab.com:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://gitlab.com/hello/world'
    runAssert(repositoryUrl, expectedPath, expectedUrl)
  })

  it('should work for repo url with https', () => {
    const repositoryUrl = 'https://github.com/hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.com/hello/world'
    runAssert(repositoryUrl, expectedPath, expectedUrl)
  })

  it('should work for repo url with git@', () => {
    const repositoryUrl = 'git@github.com:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.com/hello/world'
    runAssert(repositoryUrl, expectedPath, expectedUrl)
  })

  it('should work for repo url with other TLD', () => {
    const repositoryUrl = 'git@github.pl:hello/world.git'
    const expectedPath = 'hello/world'
    const expectedUrl = 'https://github.pl/hello/world'
    runAssert(repositoryUrl, expectedPath, expectedUrl)
  })
})
