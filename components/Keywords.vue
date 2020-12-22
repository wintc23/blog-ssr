<template>
  <div class="tag-item-container" @click.stop="focusInput">
    <Tag
      v-for="(word, idx) of wordList"
      :key="idx"
      :name="word"
      :style="{
        order: idx * 10
      }"
      closable
      @on-close="deleteTag(idx)">{{ word }}</Tag>
    <div
      class="tag-more"
      :style="{
        order: newTagOrder * 10
      }"
      @keydown="checkKeyDown">
      <div
        @click.stop=""
        class="input"
        :contenteditable="true"
        ref="input"
        @input="setValue">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      keywords: '',
      wordList: [],
      newTagOrder: (this.value ? this.value.length : 0) - 0.5
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.syncValue()
      }
    },
    showEditText: {
      immediate: true,
      handler () {
        if (this.$refs.input && this.$refs.input.innerText != this.showEditText) {
          this.$refs.input.innerText = this.showEditText
          this.focusInput()
        }
      }
    },
    wordList () {
      this.$emit('input', this.wordList.join(','))
    }
  },
  methods: {
    syncValue () {
      this.wordList = this.value ? this.value.split(',') : []
    },
    setValue (event) {
    },
    deleteTag (idx) {
      this.wordList.splice(idx, 1)
      idx < this.newTagOrder && this.newTagOrder--
    },
    focusInput () {
      this.$refs.input.focus()
      let range = window.getSelection()
      range.selectAllChildren(this.$refs.input)
      range.collapseToEnd()
    },
    checkKeyDown (event) {
      if (event.key == 'Enter') {
        event.preventDefault()
        if (this.$refs.input.innerText) {
          this.wordList.splice(Math.floor(++this.newTagOrder), 0, this.$refs.input.innerText)
          this.$refs.input.innerText = ''
          return
        }
      }
      if (!this.$refs.input.innerText) {
        if (event.key === "ArrowRight") {
          if (this.newTagOrder > this.wordList.length - 1) return
          event.preventDefault()
          this.newTagOrder++
        } else if (event.key === 'ArrowLeft') {
          if (this.newTagOrder < 0) return
          event.preventDefault()
          this.newTagOrder--
        } else if (event.key === 'Backspace') {
          this.newTagOrder > 0 && this.deleteTag(Math.floor(this.newTagOrder))
        } else if (event.key === 'Delete') {
          this.newTagOrder < this.wordList.length - 1 && this.deleteTag(Math.floor(this.newTagOrder + 1))
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.tag-item-container
  display flex
  padding 1px 8px
  align-items center
  flex-wrap wrap
  position relative
  .tag-more
    min-width 50px
    padding 5px
    .input
      &::after
        content ''
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        border 1px solid rgb(220, 222, 226)
        border-radius 4px
        pointer-events none
      &:focus
        outline none
        &::after
          box-shadow 0 0 0 2px rgba(45,140,240,.2)
          border-color #57a3f3
</style>
