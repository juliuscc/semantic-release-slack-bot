const chunkifyArray = (messageLines, maxLength, delimiter) => {
  delimiter = delimiter || '\n'

  let message = ''
  const resultLines = []
  messageLines.forEach(line => {
    // the next chunk is made up of the (next) line and the delimiter
    let nextChunk = line + delimiter
    // if the message plus the next chunk puts us over the maxLength limit...
    if ((message + nextChunk).length > maxLength) {
      // ...we add the message to the result array...
      resultLines.push(message.trimEnd())
      // ...and "reset" the message with the next chunk.
      message = nextChunk
    } else {
      // if not, we add the next chunk to the message
      message += nextChunk
    }
  })

  // handle the case where we have a trailing message
  if (message.length > 0) {
    resultLines.push(message.trimEnd())
  }

  return resultLines
}

const chunkifyString = (messageText, maxLength, delimiter) => {
  if (messageText.length <= maxLength) {
    return [messageText]
  }

  delimiter = delimiter || '\n'
  const messageLines = messageText.split(delimiter)

  return chunkifyArray(messageLines, maxLength, delimiter)
}

module.exports = {
  chunkifyArray,
  chunkifyString
}
