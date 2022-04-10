import { statEvent } from '@/stat'

function bind (el, binding, vNode) {
  el.__clickStatHandler = function (e) {
    statEvent(...binding.value)
  }
  el.addEventListener('click', el.__clickStatHandler)
}

function unbind (el, binding, vNode) {
  el.removeEventListener('click', el.__clickStatHandler)
  delete el.__clickStatHandler
}

export default {
  bind,
  unbind
}
