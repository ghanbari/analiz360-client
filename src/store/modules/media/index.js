import list from './list'
import create from './create'
import show from './show'
import del from './delete'

export default {
  namespaced: true,
  modules: {
    list,
    create,
    show,
    del
  }
}
