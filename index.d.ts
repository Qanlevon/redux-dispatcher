import {Reducer, Action, Middleware} from 'redux';

interface Syn<K extends string> {
  <S>(initialState: S, reducer: { [T: string]: Partial<S> | ((state: S, payload: any) => S) }): {
    [key in K]: Reducer<S>;
  };
}

/**
 * TakeableChannel is copied from redux-saga
 * it helps dispatcher compatible with redux-saga effects like takeLatest, put, ...
 */
interface TakeableChannel<T> {
  take(cb: (message: T) => void): void;
}

type ResultCallback<T = any> = (result?: T) => void;

declare class PromiseResult {
  /**
   * @deprecated: please use dispatchResult and waitResult instead
   */
  $result: any;

  waitResult: typeof waitResult;
  dispatchResult: ResultCallback;
}

interface UnsubscribeFunction {
  (): void;
  remove: () => void;
}

declare function waitResult<T = any>(): Promise<T>;
declare function waitResult(listener: ResultCallback): UnsubscribeFunction;

type DispatchFunction = (...args: any[]) => any;

type ActionWithPromise<D extends DispatchFunction> = (...args: Parameters<D>) => ReturnType<D> & PromiseResult;

type DispatchToAC = Record<string, DispatchFunction & any>;

export function createDispatcher<M extends DispatchToAC, K extends string>(
  key: K,
  mapDispatchToAC: M,
): {
  [D in keyof M]: ActionWithPromise<M[D]> & string & TakeableChannel<any> & Action<string>;
} &
  Syn<K>;

type MapActionToReducer<S> = { [T: string]: Partial<S> | ((state: S, payload: any) => S) };

export function createReducer<S>(
  initialState: S,
  reducer: MapActionToReducer<S> | ((context: any) => MapActionToReducer<S>),
): Reducer<S>;


type ContextualMiddleware = {
  withContext: (context: any) => Middleware;
};

export const dispatcherMiddleware: ContextualMiddleware & Middleware;


type PartialReducer<S, P> = (state: S, payload: P) => Partial<S>

type CaseFunc<S> = <D extends DispatchFunction>(
  dispatcher: D,
  reducer: PartialReducer<S, ReturnType<D>>,
) => CaseBuilder<S>;

type CaseArrayFunc<S> = <D extends DispatchFunction[]>(
  dispatchers: D,
  reducer: PartialReducer<S, ReturnType<D[number]>>
) => CaseBuilder<S>;

type CaseBuilder<S> = { case: CaseFunc<S> } & { case: CaseArrayFunc<S> }

