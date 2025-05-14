
import * as React from "react"
import { ToasterToast, ToastContextType } from "./toast-types"
import { ToastContext } from "./toast-context"
import { genId, getDispatch } from "./toast-utils"
import { actionTypes } from "./toast-types"

// Hook for accessing toast context
export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext)

  if (context === null) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return context
}

// Standalone toast function (for use outside components)
export function toast(props: Omit<ToasterToast, "id">) {
  const id = genId()
  const dispatch = getDispatch()

  if (!dispatch) {
    console.warn("Toast dispatcher not found. Make sure ToastProvider is in the component tree.")
    return {
      id,
      dismiss: () => {},
      update: () => {},
    }
  }

  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    })

  const dismiss = () => 
    dispatch({ 
      type: actionTypes.DISMISS_TOAST, 
      toastId: id 
    })

  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id,
    dismiss,
    update,
  }
}
