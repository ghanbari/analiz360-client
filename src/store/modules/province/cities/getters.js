export const error = state => state.error
export const isLoading = state => state.isLoading
export const items = state => state.items
export const itemsForSelect = function (state) {
  const items = []
  state.items.forEach(item => items.push({ text: item.name, value: item['@id'] }))
  return items.sort((a, b) => a.text.localeCompare(b.text))
}
