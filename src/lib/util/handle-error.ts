export const handleError = (error: Error) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error)
  }

  // TODO: user facing error message
}
