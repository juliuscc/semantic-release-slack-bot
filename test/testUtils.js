const getBaseConfig = packageName => {
  return {
    notifyOnSuccess: true,
    notifyOnFail: true,
    markdownReleaseNotes: true,
    packageName
  }
}

const getContext = (branchName = 'master') => {
  const version = '1.0.0'
  return {
    logger: console,
    nextRelease: {
      version,
      gitTag: `v${version}`,
      notes: 'hello'
    },
    options: {
      repositoryUrl:
        'git+https://github.com/juliuscc/semantic-release-slack-bot.git'
    },
    env: {
      npm_package_name: 'internal test'
    },
    errors: ['Something went horribly wrong'],
    branch: {
      name: branchName
    }
  }
}

module.exports = {
  getBaseConfig,
  getContext
}
