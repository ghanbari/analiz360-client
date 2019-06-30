export default class NotFoundError extends Error {
  constructor (message) {
    super(message)
    this.error = message
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    return this
  }
}
