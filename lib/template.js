function template(input, variables) {
	const type = typeof input
	if (type === 'string') {
		return Object.keys(variables).reduce(
			(output, variable) =>
				variables[variable]
					? output.replace(`$${variable}`, variables[variable])
					: output,
			input
		)
	} else if (type === 'object') {
		if (Array.isArray(input)) {
			const out = []
			for (const value of input) {
				out.push(template(value, variables))
			}
			return out
		} else {
			const out = {}
			for (let key of Object.keys(input)) {
				const value = input[key]
				out[key] = template(value, variables)
			}
			return out
		}
	} else {
		return input
	}
}

module.exports = template
