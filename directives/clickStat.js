import { getVisitorId } from '@/tool'
import { statEvents } from '@/api/stat'

function bind (el, binding, vNode) {
  el.__clickStatHandler = function (e) {
    const event = {
      visitorId: getVisitorId(),
      name: binding.value,
    }
    statEvents([event])
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
