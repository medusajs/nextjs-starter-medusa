import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react"
import { useSearchBox, UseSearchBoxProps } from "react-instantsearch-hooks-web"

export type ControlledSearchBoxProps = React.ComponentProps<"div"> & {
  inputRef: RefObject<HTMLInputElement>
  isSearchStalled: boolean
  onChange(event: ChangeEvent): void
  onReset(event: FormEvent): void
  onSubmit?(event: FormEvent): void
  placeholder?: string
  value: string
}

type SearchBoxProps = {
  children: (state: {
    value: string
    inputRef: RefObject<HTMLInputElement>
    isSearchStalled: boolean
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
    onReset: () => void
    placeholder: string
  }) => React.ReactNode
  placeholder?: string
} & UseSearchBoxProps

const SearchBoxWrapper = ({
  children,
  placeholder = "Search products...",
  ...rest
}: SearchBoxProps) => {
  const { query, refine, isSearchStalled } = useSearchBox(rest)
  const [value, setValue] = useState(query)
  const inputRef = useRef<HTMLInputElement>(null)

  const onReset = () => {
    setValue("")
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
  }

  useEffect(() => {
    if (query !== value) {
      refine(value)
    }
    // We don't want to track when the InstantSearch query changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  useEffect(() => {
    // We bypass the state update if the input is focused to avoid concurrent
    // updates when typing.
    if (document.activeElement !== inputRef.current && query !== value) {
      setValue(query)
    }
    // We don't want to track when the React state value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const state = {
    value,
    inputRef,
    isSearchStalled,
    onChange,
    onReset,
    placeholder,
  }

  return children(state) as React.ReactElement
}

export default SearchBoxWrapper
