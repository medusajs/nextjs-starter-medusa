export function timeAgo(date: Date) {
  const now = new Date()
  const diff = Math.abs(now.getTime() - date.getTime())
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`
  } else if (hours > 0) {
    return `${hours} h ago`
  } else if (minutes > 0) {
    return `${minutes} min ago`
  } else {
    return `${seconds} s ago`
  }
}
