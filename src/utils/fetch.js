import SubmissionError from '../error/SubmissionError'
import AccessDeniedError from '../error/AccessDeniedError'
import ConflictError from '../error/ConflictError'
import { store } from '../store'
import BadRequestError from '../error/BadRequestError'
import app from '../app'
import NotFoundError from '../error/NotFoundError'

const MIME_TYPE = 'application/ld+json'

const queue = []

const updateProgressBarForRequest = (id) => {
  let i = 0
  while (i < queue.length) {
    if (queue[i].status === 'receive') {
      queue.splice(i, 1)
    } else {
      i++
    }
  }

  queue.push({ id, status: 'send' })

  if (!app.$Progress.get() || app.$Progress.get() === 0 || app.$Progress.get() === 100) {
    app.$Progress.start()
    app.$Progress.increase(15)
  } else {
    let newPercent = 0
    queue.forEach((request) => {
      newPercent += request.status === 'send' ? (15 / queue.length) : (85 / queue.length)
    })

    app.$Progress.set(newPercent)
  }
}

const updateProgressBarForResponse = (id) => {
  const req = queue.find(element => element.id === id)
  if (req) {
    req.status = 'receive'
  }

  let newPercent = 0
  queue.forEach((request) => {
    newPercent += request.status === 'send' ? (15 / queue.length) : (100 / queue.length)
  })

  if (app.$Progress.get() && app.$Progress.get() !== 100) {
    app.$Progress.set(newPercent)
  } else {
    app.$Progress.finish()
  }
}

export default function (id, options = {}) {
  if (typeof options.headers === 'undefined') Object.assign(options, { headers: new Headers() })

  if (options.headers.get('Accept') === null) options.headers.set('Accept', MIME_TYPE)

  if (options.body !== undefined && !(options.body instanceof FormData) && options.headers.get('Content-Type') === null) {
    options.headers.set('Content-Type', MIME_TYPE)
  }

  if (!options.headers.has('Authorization') &&
      store.getters.apiKey &&
      ((store.state.route.meta.hasOwnProperty('auth') && store.state.route.meta.auth === true) ||
          (options.hasOwnProperty('auth') && options.auth === true)
      )) {
    options.headers.set('Authorization', `Bearer ${store.getters.apiKey}`)
  }

  if (typeof options.query === 'object') {
    id += `?${serialize(options.query)}`
  }

  updateProgressBarForRequest(id)

  const url = new URL(id, app.$config.get('entryPoint'))
  const startTime = new Date()
  return fetch(url.toString(), options).then((response) => {
    const method = options.hasOwnProperty('method') ? options.method.toUpperCase() : 'GET'
    const consumedTime = (new Date()).getTime() - startTime.getTime()
    app.$ga.time('Api', id, consumedTime, app.$route.name)

    if (response.ok) {
      updateProgressBarForResponse(id)
      app.$ga.event('Api', `${method}: ${id}`, 'Success')
      return response
    }

    return response
      .json()
      .then((json) => {
        app.$Progress.fail()
        app.$ga.event('Api', `${method}: ${id}`, 'Failed', response.status)

        const error = json['hydra:description'] ? json['hydra:description'] : response.statusText

        if (response.status === 400 && !json.hasOwnProperty('hydra:description')) {
          throw new BadRequestError(response.statusText, json)
        }

        if (response.status === 403) {
          throw new AccessDeniedError(error)
        }

        if (response.status === 401 && id !== 'login_check' && store.getters.apiKey) {
          store.dispatch('logout')
          return
        }

        if (response.status === 409) {
          throw new ConflictError(error)
        }

        if (response.status === 404) {
          throw new NotFoundError(error)
        }

        if (!json.violations) throw Error(error)

        const errors = { _error: error }
        json.violations.map(violation => Object.assign(errors, { [violation.propertyPath]: violation.message }))

        throw new SubmissionError(errors)
      })
  })
}

const serialize = function (obj, prefix) {
  const str = []
  let p
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      const k = prefix ? `${prefix}[${p}]` : p
      const v = obj[p]
      str.push((v !== null && typeof v === 'object')
        ? serialize(v, k)
        : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    }
  }
  return str.join('&')
}
