import { Store } from '@tanstack/store'
import { useStore } from '@tanstack/react-store'

export type StoreConfig<TState> = {
  initialState: TState
}

export function createStore<TState>(config: StoreConfig<TState>) {
  return new Store<TState>(config.initialState)
}

export { Store, useStore }
