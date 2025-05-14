
import * as React from "react"
import { ToastContextType, Action, State } from "./toast-types"
import { reducer } from "./toast-reducer"
import { genId, setDispatch } from "./toast-utils"
import { actionTypes } from "./toast-types"

// Create contexts
export const ToastContext = React.createContext<ToastContextType | null>(null)
export const DispatchContext = React.createContext<React.Dispatch<Action> | null>(null)

// Toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    toasts: [],
  })

  // Store dispatch in utils for standalone functions
  React.useEffect(() => {
    setDispatch(dispatch)
  }, [dispatch])

  const contextValue: ToastContextType = React.useMemo(
    () => ({
      toasts: state.toasts,
      toast: (props) => {
        const id = genId()
        
        dispatch({
          type: actionTypes.ADD_TOAST,
          toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open) => {
              if (!open) dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })
            },
          },
        })
        
        return id
      },
      dismiss: (toastId) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
      update: (id, props) => 
        dispatch({
          type: actionTypes.UPDATE_TOAST,
          toast: { ...props, id },
        }),
    }),
    [state.toasts, dispatch]
  )

  return (
    <DispatchContext.Provider value={dispatch}>
      <ToastContext.Provider value={contextValue}>
        {children}
      </ToastContext.Provider>
    </DispatchContext.Provider>
  )
}
