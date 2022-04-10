import { Message } from 'iview'

function bind(el, binding, vNode) {
  el.__clickCopyHandler = function (e) {
    e.stopPropagation()
    if (binding.expression && binding.value) {
      const { text, notifyText = '内容已复制到剪贴板' } = binding.value;
      const div = document.createElement('div');
      div.innerHTML = text
      div.style.position = 'fixed'
      div.style.left = '-9999px'
      div.style.whiteSpace = 'pre'
      document.body.appendChild(div)

      if (document.body.createTextRange) {
        const range = document.body.createTextRange()
        range.moveToElementText(div)
        range.select()
      } else if (window.getSelection) {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(div)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      document.execCommand('Copy', 'false', null)
      Message.success(notifyText)
      document.body.removeChild(div)
    }
  }
  el.addEventListener('click', el.__clickCopyHandler)
}

function unbind (el, binding, vNode) {
  el.removeEventListener('click', el.__clickCopyHandler)
  delete el.__clickCopyHandler
}

export default {
  bind,
  unbind,
}
