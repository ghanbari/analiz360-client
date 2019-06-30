import list from './list'
import create from './create'
import update from './update'
import show from './show'
import profile from './profile'
import emailVerify from './emailVerify'
import updateProfile from './update-profile'

export default {
  namespaced: true,
  modules: {
    list,
    create,
    update,
    show,
    profile,
    emailVerify,
    'update-profile': updateProfile
  }
}
