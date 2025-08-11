import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToastVariant = "default" | "destructive"

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  onAction?: () => void
  variant?: ToastVariant
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

// Action types as const for type safety
export const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

const genId = () => {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

interface AddToastAction {
  type: typeof actionTypes.ADD_TOAST
  toast: ToasterToast
}

interface UpdateToastAction {
  type: typeof actionTypes.UPDATE_TOAST
  toast: Partial<ToasterToast>
}

interface DismissToastAction {
  type: typeof actionTypes.DISMISS_TOAST
  toastId?: ToasterToast['id']
}

interface RemoveToastAction {
  type: typeof actionTypes.REMOVE_TOAST
  toastId?: ToasterToast['id']
}

type Action = AddToastAction | UpdateToastAction | DismissToastAction | RemoveToastAction

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST: {
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
    }

    case actionTypes.UPDATE_TOAST: {
      const updateToastAction = action as UpdateToastAction;
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === updateToastAction.toast.id ? { ...t, ...updateToastAction.toast } : t
        ),
      }
    }

    case actionTypes.DISMISS_TOAST: {
      const dismissAction = action as DismissToastAction;
      const { toastId } = dismissAction;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: t.open === false ? t.open : false,
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST: {
      const removeAction = action as RemoveToastAction;
      if (removeAction.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== removeAction.toastId),
      }
    }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  const toast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open: boolean) => {
      if (!open) dismiss()
    },
  }
  
  dispatch({
    type: "ADD_TOAST",
    toast,
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
