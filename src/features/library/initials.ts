/** Letters for a game's cartridge label: three words' first letters, or four of a lone word. */
export function initials(title: string): string {
  const words = title
    .split(/[\s-]+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)
  const [first] = words
  if (!first) return '?'
  const letters =
    words.length === 1
      ? first.slice(0, 4)
      : words
          .slice(0, 3)
          .map((word) => word[0] ?? '')
          .join('')
  return letters.toUpperCase()
}
