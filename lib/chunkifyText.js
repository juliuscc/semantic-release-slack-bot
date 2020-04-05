module.exports = (messageText, maxLength) => {
  if (typeof messageText === 'string' && messageText.length <= maxLength) {
    return [messageText]
  }

  const delimiter = '\n'
  const messageLines = Array.isArray(messageText)
    ? messageText
    : messageText.split(delimiter)

  let message = ''
  let resultLines = []
  messageLines.forEach(line => {
    let chunk = line + delimiter
    if ((message + chunk).length > maxLength) {
      resultLines.push(message.trimEnd())
      message = chunk
    } else {
      message += chunk
    }
  })

  if (message.length > 0) {
    resultLines.push(message.trimEnd())
  }

  return resultLines
}
