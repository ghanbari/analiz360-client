import localforage from 'localforage'

export default {
  setItem (key, value, ttl) {
    key = `storage:${key}`
    const expireAt = new Date((new Date()).getTime() + (ttl * 1000))
    return localforage.setItem(key, { value, expireAt })
      .then(() => localforage.getItem(key))
      .then(res => res)
      .catch(err => err)
  },

  getItem (key, resolve, reject) {
    key = `storage:${key}`
    const res = (info) => {
      const now = (new Date()).getTime()
      if (!info || info.expireAt.getTime() < now) {
        return reject()
      }
      return resolve(info.value)
    }

    const rej = () => reject()

    return localforage.getItem(key)
      .then(res)
      .catch(rej)
  },

  removeItem (key, resolve, reject) {
    key = `storage:${key}`
    const p = localforage.removeItem(key)
    if (typeof (resolve) === typeof (Function)) {
      p.then(resolve)
    }

    if (typeof (reject) === typeof (Function)) {
      p.catch(reject)
    }
  },

  removeItems (keyRegex, resolve, reject) {
    const that = this
    const p = localforage.keys().then((keys) => {
      keys.forEach((key) => {
        if (keyRegex.test(key)) {
          that.removeItem(key, resolve, reject)
        }
      })
    })

    if (typeof (reject) === typeof (Function)) {
      p.catch(reject)
    }
  }
}
