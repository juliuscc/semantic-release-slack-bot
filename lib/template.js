function template(input, variables) {
  switch (typeof input) {
    case 'string':
      return Object.keys(variables).reduce(
        (output, variable) =>
          variables[variable]
            ? output.split(`$${variable}`).join(variables[variable])
            : output,
        input
      )
    case 'object':
      if (Array.isArray(input)) {
        return input.map(value => template(value, variables))
      } else {
        return Object.entries(input).reduce(
          (out, [key, value]) => ({
            ...out,
            [key]: template(value, variables)
          }),
          {}
        )
      }
    default:
      return input
  }
}

module.exports = template
