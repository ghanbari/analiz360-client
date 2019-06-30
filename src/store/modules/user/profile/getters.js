export const error = state => state.error
export const isLoading = state => state.isLoading
export const retrieved = state => state.retrieved
export const hasRole = state => (roles) => {
  if (!state.retrieved ||
      !state.retrieved.hasOwnProperty('roles') ||
      !state.retrieved.roles.length
  ) {
    return false
  }

  if (roles.constructor.name === 'Array') {
    let has = false
    roles.forEach((role) => {
      if (state.retrieved.roles.includes(role)) {
        has = true
      }
    })
    return has
  }
  return state.retrieved.roles.includes(roles)
}
