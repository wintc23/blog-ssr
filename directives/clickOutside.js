function bind (el, binding, vNode) {
  el.__clickOutsideHandler = function (e) {
    if (el.contains(e.target)) return false
    binding.expression && binding.value(e)
  }
  document.addEventListener('click', el.__clickOutsideHandler)
}

function unbind (el, binding, vNode) {
  document.removeEventListener('click', el.__clickOutsideHandler)
  delete el.__clickOutsideHandler
}

export default {
  bind,
  unbind
}
