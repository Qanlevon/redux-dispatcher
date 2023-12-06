import synthesize from "./synthesize"
import dispatcherMiddleware from "./dispatcherMiddleware"
import createReducer, {reducers} from "./createReducer"
import injectEvent from "./enhancer/injectEvent"

export {
	dispatcherMiddleware,
	reducers,
	synthesize as createDispatcher,
	createReducer,
	injectEvent,
}
