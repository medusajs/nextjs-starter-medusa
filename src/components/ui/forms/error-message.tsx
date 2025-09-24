type Props = {
  error?: string | null
  "data-testid"?: string
}

function ErrorMessage({ error, "data-testid": dataTestid }: Props) {
  if (!error) {
    return null
  }

  return (
    <div className="pt-2 text-destructive text-sm" data-testid={dataTestid}>
      <span>{error}</span>
    </div>
  )
}

export { ErrorMessage }
export type { Props as ErrorMessageProps }
