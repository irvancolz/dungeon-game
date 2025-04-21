// store.js
export function createStore(initialState = {}) {
  let state = { ...initialState };
  const listeners = new Set();

  function getState() {
    return { ...state }; // return a copy
  }

  function setState(partialState) {
    const nextState =
      typeof partialState === "function"
        ? partialState(state)
        : { ...state, ...partialState };

    const hasChanged = JSON.stringify(state) !== JSON.stringify(nextState);

    if (hasChanged) {
      state = nextState;
      listeners.forEach((listener) => listener(state));
    }
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener); // unsubscribe
  }

  return {
    getState,
    setState,
    subscribe,
  };
}
