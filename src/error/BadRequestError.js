export default class BadRequestError extends Error {
  constructor (statusText, response) {
    super('Bad Request.')
    this.statusText = statusText
    this.response = response
    Error.captureStackTrace(this, this.constructor)
    this.name = this.constructor.name
    return this
  }
}
