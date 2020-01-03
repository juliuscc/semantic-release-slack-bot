module.exports = (messageText, maxLength) => {
  if (messageText.length <= maxLength) return messageText

  const delimiter = '\n'
  // split the truncated message into the
  // first element and an array with the rest
  const [firstLine, ...restLines] = messageText
    .substring(0, maxLength)
    .split(delimiter)
  // if the array restLines is not empty, remove the last element
  const truncatedLines = [firstLine, ...restLines.slice(0, -1)]

  return `${truncatedLines.join(delimiter)}*[...]*`
}
