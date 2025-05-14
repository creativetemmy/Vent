
import { actionTypes, TOAST_REMOVE_DELAY, Action } from "./toast-types"

// Counter for generating unique IDs
let count = 0

// Track toast timeouts
export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Generate unique ID for toasts
export function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

// Store dispatch function from context for use in standalone functions
let dispatchFunction: React.Dispatch<Action> | null = null

// Set the dispatch function (called by the provider)
export function setDispatch(dispatch: React.Dispatch<Action>) {
  dispatchFunction = dispatch
}

// Get the dispatch function
export function getDispatch(): React.Dispatch<Action> | null {
  return dispatchFunction
}

// Add toast to removal queue
export function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatchFunction?.({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}
