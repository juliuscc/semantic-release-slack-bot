const url = require('url')

module.exports = repositoryUrl => {
  if (repositoryUrl.startsWith('git@')) {
    repositoryUrl = 'ssh://' + repositoryUrl
  }
  const parsedUrl = new url.URL(
    // without these replacements we will get a TypeError [ERR_INVALID_URL]
    repositoryUrl.replace(
      /\.([a-z])*:/i,
      rep => rep.substring(0, rep.length - 1) + '/'
    )
  )
  const path = parsedUrl.pathname
    .substring(1) // remove leading "/"
    .replace('.git', '') // remove .git
    .replace(':', '') // remove any colons from path (present in github for example)
  const hostname = parsedUrl.hostname
  const URL = `https://${parsedUrl.host}/${path}`
  return { path, URL, hostname }
}
