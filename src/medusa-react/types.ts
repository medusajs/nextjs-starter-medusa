import {
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query"

// Wrapper type for useQuery options
// Allows for customizing the query function return type
export type UseQueryOptionsWrapper<
  TData,
  TError,
  TQueryKey extends QueryKey = QueryKey
> = Omit<
  UseQueryOptions<TData, TError, TData, TQueryKey>,
  "queryKey" | "queryFn"
>

// Wrapper type for useMutation options
export type UseMutationOptionsWrapper<TData, TError, TVariables> =
  UseMutationOptions<TData, TError, TVariables, unknown>
