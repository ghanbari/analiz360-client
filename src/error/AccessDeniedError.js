export default class AccessDeniedError extends Error {
  constructor (message) {
    super('Access Denied.')
    this.error = message
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    return this
  }
}
