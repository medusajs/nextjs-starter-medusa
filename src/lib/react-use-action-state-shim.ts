import { useActionStateShim } from "./react-compat";

/**
 * Thin wrapper so components can import:
 *   import { useActionState } from "@lib/react-use-action-state-shim"
 *
 * This provides a React 19-style useActionState API on React 18.
 * Once the project is on React 19, this module and the shim can be removed
 * and imports can be switched back to:
 *
 *   import { useActionState } from "@lib/react-use-action-state-shim"
 */
export const useActionState = useActionStateShim;
