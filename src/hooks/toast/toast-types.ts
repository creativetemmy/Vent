
import * as React from "react"

// Re-export ToastProps and ToastActionElement from toast component
import {
  type ToastProps,
  type ToastActionElement,
} from "@/components/ui/toast"

// Toast configuration constants
export const TOAST_LIMIT = 5
export const TOAST_REMOVE_DELAY = 1000

// Toast data structure
export type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Define action types as constants
export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

export type ActionType = typeof actionTypes

// Define actions
export type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: string
    }

// State interface
export interface State {
  toasts: ToasterToast[]
}

// Define the Toast context interface
export interface ToastContextType {
  toasts: ToasterToast[]
  toast: (props: Omit<ToasterToast, "id">) => string
  dismiss: (toastId?: string) => void
  update: (id: string, props: ToasterToast) => void
}
