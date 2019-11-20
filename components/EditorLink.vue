<template>
  <div class="editor-link">
    <Modal
      :closable="false"
      :mask-closable="false"
      v-model="show"
      @on-ok="save"
      @on-cancel="cancel"
      title="插入链接">
      <div class="item">
        <div class="label">链接地址</div>
        <Input v-model="link"/>
      </div>
      <div class="item">
        <div class="label">显示文字</div>
        <Input v-model="content"/>
      </div>
      <div class="item">
        <div class="label">标题</div>
        <Input v-model="title"/>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data () {
    return {
      link: '',
      title: '',
      content: '',
      callback: null,
      show: false
    }
  },
  methods: {
    showLink (callback, data) {
      if (data) {
        this.link = data.link
        this.title = data.title
        this.content = data.content
      }
      this.show = true
      this.callback = callback
    },
    save () {
      if (!this.link || !this.content) {
        this.$Message.info('请填写链接和显示文字')
        return
      }
      this.show = false
      if (this.callback) {
        let link = `<a class="insert-link" target="_blank" href="${this.link}" title="${this.title}">${this.content}</a>`
        this.callback(link)
        this.callback = null
      }
    },
    cancel () {
      this.show = false
      this.callback = null
    }
  },
}
</script>
