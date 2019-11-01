module.exports = (messageText, maxLength) => {
	const delimiter = '\n'
	if (messageText.length > maxLength) {
		messageText = messageText.substring(0, maxLength).split(delimiter)
		// if no newlines, we don't remove anything, we keep the truncated message as is
		if (messageText.length > 1) {
			// remove all text after the last newline in the truncated message
			// this avoids truncating in the middle of markdown
			messageText.splice(-1, 1)
		}
		messageText = messageText.join(delimiter) + '*[...]*'
	}
	return messageText
}
