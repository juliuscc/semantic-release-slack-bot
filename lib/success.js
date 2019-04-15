module.exports = (pluginConfig, context) => {
	const { logger, nextRelease } = context
	logger.log(context.nextRelease)
}
