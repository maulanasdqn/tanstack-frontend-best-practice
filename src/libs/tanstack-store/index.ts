import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'

export type TStoreConfig<TState> = {
  initialState: TState
}

export function createStore<TState>(config: TStoreConfig<TState>) {
  return new Store<TState>(config.initialState)
}

export { Store, useStore }
