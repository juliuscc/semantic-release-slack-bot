const url = require('url')

module.exports = repositoryUrl => {
	const parsedUrl = new url.URL(
		// without these replacements we will get a TypeError [ERR_INVALID_URL]
		repositoryUrl.replace('.com:', '.com/').replace('.org:', '.org/')
	)
	const path = parsedUrl.pathname
		.substring(1) // remove leading "/"
		.replace('.git', '') // remove .git
		.replace(':', '') // remove any colons from path (present in github for example)
	const URL = `https://${parsedUrl.host}/${path}`
	return { path, URL }
}
