module.exports = (pluginConfig, context) => {
	if (!pluginConfig.notifyOnSuccess) {
		return
	}

	const { logger, nextRelease } = context
	logger.log(context.nextRelease)
}
