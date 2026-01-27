import { useState, useTransition } from "react";

/**
 * Temporary shim for React 19's useActionState.
 * The starter uses this hook, but React 18 does not provide it.
 *
 * Implements a compatible subset:
 * - state
 * - action dispatcher
 * - pending boolean
 *
 * Safe to remove once the project upgrades to React 19.
 */
export function useActionStateShim<T>(
  action: (prevState: T, ...args: any[]) => Promise<T> | T,
  initialState: T
): [T, (...args: any[]) => void, boolean] {
  const [state, setState] = useState<T>(initialState);
  const [isPending, startTransition] = useTransition();

  const dispatch = (...args: any[]) => {
    startTransition(() => {
      Promise.resolve(action(state, ...args))
        .then(setState)
        .catch((err) => {
          // Non-fatal: keep behavior close to React's actionState
          console.error("useActionStateShim error:", err);
        });
    });
  };

  return [state, dispatch, isPending];
}
