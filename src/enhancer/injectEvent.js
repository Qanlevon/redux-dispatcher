const injectEvent = action => {
	const event = {
		done: false,
		result: undefined,
		listener: undefined
	}

	const waitResult = (listener) => {
		if (typeof listener === "function") {
			event.listener = listener
			const unsubscribe = () => {
				event.listener = undefined
			}
			unsubscribe.remove = unsubscribe
			return unsubscribe
		}

		// should check event.done instead event.result
		// because we allow result to be dispatched as Falsy value
		if (event.done)
			return event.result

		return new Promise(resolve => {
			event.listener = resolve
		})
	}

	const dispatchResult = data => {
		if (event.listener) {
			return event.listener(data)
		}
		event.done = true
		event.result = data
	}

	Object.defineProperties(action, {
		waitResult: {
			value: waitResult,
			enumerable: false,
		},
		dispatchResult: {
			value: dispatchResult,
			enumerable: false
		},
	})

	return action
}

export default injectEvent
