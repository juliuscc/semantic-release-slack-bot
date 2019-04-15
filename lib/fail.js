module.exports = (pluginConfig, context) => {
	const { errors } = context
	for (const error of errors) {
		const { name, message, code, details, pluginName } = error
		console.log({ name, message, code, details, pluginName })
		console.log(error.toString())
		console.log(error.stack)
		// context.logger.log({ name, code, details, semanticRelease, pluginName })
	}
}
