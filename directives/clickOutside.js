function bind (el, binding, vNode) {
  el.__documentHandler = function (e) {
    if (el.contains(e.target)) return false
    binding.expression && binding.value(e)
  }
  document.addEventListener('click', el.__documentHandler)
}

function unbind (el, binding, vNode) {
  document.removeEventListener('click', el.__documentHandler)
  delete el.__documentHandler
}

export default {
  bind,
  unbind
}
