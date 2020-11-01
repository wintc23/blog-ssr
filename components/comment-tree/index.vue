<template>
  <div class="comment-list">
    <div
      v-for="comment of rootList"
      class="comment-container ws"
      :key="comment.id">
      <comment
        :class="{
          'current-comment': comment.id == current
        }"
        :comment="comment">
      </comment>
      <div
        class="comment-children"
        v-if="comment.children && comment.children.length">
        <comment
          :class="{
            child: true,
            'current-comment': child.id == current
          }"
          v-for="child of comment.children"
          :comment="child"
          :rootId="comment.id"
          :responseUserId="info[child.responseId].authorId"
          :key="child.id">
        </comment>
      </div>
    </div>
  </div>
</template>

<script>
import comment from './comment-template'

export default {
  components: {
    comment
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    current: {
      type: String | Number
    }
  },
  computed: {
    rootList () {
      let list = [...this.list]
      list.sort((a, b) => a.timestamp - b.timestamp)
      let info = {}, results = []
      list.forEach(comment => {
        if (comment.responseId) {
          if (!info[comment.responseId]) return
          info[comment.responseId].push(comment)
          info[comment.id] = info[comment.responseId]
        } else {
          comment.children = []
          info[comment.id] = comment.children
          results.push(comment)
        }
      })
      // results.forEach(result => result.children.length && result.children.reverse())
      return results.reverse()
    },
    info () {
      return this.list.reduce((info, comment) => (info[comment.id] = comment, info), {})
    },
    currentUser () {
      return this.$store.getters['userInfo/info']
    }
  },
  watch: {
    current: {
      immediate: true,
      handler () {
        this.scrollIntoView()
      }
    }
  },
  methods: {
    scrollIntoView () {
      if (!this.current) return
      this.$nextTick(() => {
        if (!this.$el) return
        const selector = '.current-comment'
        window.requestAnimationFrame(() => {
          const node = this.$el.querySelector(selector)
          node && node.scrollIntoView && node.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          })
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.comment-container
  background #fff
  border-radius 4px
  padding 10px
  &+.comment-container
    margin-top 10px
  .comment-children
    margin-top 15px
    .child + .child
      margin-top 15px

.current-comment
  background #ECF5FD
</style>