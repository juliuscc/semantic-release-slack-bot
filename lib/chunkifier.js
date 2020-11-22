const chunkifyArray = (messageLines, maxLength, delimiter) => {
  delimiter = delimiter || '\n'

  let message = ''
  const resultLines = []
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

const chunkifyString = (messageText, maxLength, delimiter) => {
  if (messageText.length <= maxLength) return [messageText]
  delimiter = delimiter || '\n'
  const messageLines = messageText.split(delimiter)
  return chunkifyArray(messageLines, maxLength, delimiter)
}

const chunkifyBlock = (block, maxLength) => {
  const chunks = chunkifyString(block.text.text, maxLength)

  // delete the chunk key, because it's not a valid
  // slack payload key
  delete block.chunk
  return chunks.map(text => ({
    ...block,
    text: {
      ...block.text,
      text
    }
  }))
}

const chunkifyBlocks = (template, maxLength) => {
  return template.blocks.reduce((newInProgress, oldBlock) => {
    if (!oldBlock.chunk) return [...newInProgress, oldBlock]

    const splitBlocks = chunkifyBlock(oldBlock, maxLength)
    return [...newInProgress, ...splitBlocks]
  }, [])
}

module.exports = {
  chunkifyArray,
  chunkifyString,
  chunkifyBlocks
}
