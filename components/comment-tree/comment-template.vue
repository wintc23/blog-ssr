<template>
  <div :class="['comment', comment.responseId ? 'child' : 'root' ]">
    <avatar class="userinfo info-container" :userId="comment.authorId">
      <template v-slot:default="{ userinfo }">
        <img :src="userinfo.avatar" alt="用户头像">
        <div class="username">{{ userinfo.username }}</div>
        <avatar
          v-if="rootId && comment.responseId != rootId"
          class="response-username"
          :userId="responseUserId">
          <template v-slot:default="{ userinfo: user }">
            回复<span>{{ user.username }} </span>
          </template>
        </avatar>
      </template>
    </avatar>
    <div class="comment-content">
      <div class="comment-body">
        {{ comment.body }}
        <span class="hide" v-if="comment.hide">
          <span class="hide-notice">[待审核，审核后公开]</span>
          <Button
            v-if="currentUser.admin"
            @click.stop="setVisibility(comment)"
            class="set-pass"
            size="small"
            type="dashed">
            通过
          </Button>
        </span>
      </div>
      <div class="comment-notice">
        <span
          :class="{
            'reply-btn': true,
            'reply-editing': comment.replyEdit
          }"
          @click.stop="replyComment(comment)">
          回复
        </span>
        <span class="line"></span>
        <span class="time">{{ comment.timestamp | time }}</span>
      </div>
    </div>
    <div class="comment-reply" v-if="comment.replyEdit">
      <avatar class="userinfo" :userId="comment.authorId">
        <template v-slot:default="{ userinfo }">
          <Input
            :ref="`reply${comment.id}`"
            :placeholder="`回复 ${userinfo.username} `"
            v-model="comment.reply"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 6}"/>
        </template>
      </avatar>
      <Button class="btn" size="small" type="primary" @click.stop="replyConfirm(comment)">确定</Button>
      <Button class="btn" size="small" type="warning" @click.stop="replyCancel(comment)">取消</Button>
    </div>
  </div>
</template>

<script>
import avatar from '@/components/Avatar'

export default {
  components: {
    avatar
  },
  props: {
    comment: {
      required: true,
      type: Object
    },
    rootId: {
      type: Number
    },
    responseUserId: {
      type: Number
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
  },
  methods: {
    replyComment (comment) {
      this.$set(comment, 'replyEdit', true)
      if (!comment.reply) {
        this.$set(comment, 'reply', '')
      }
      this.$nextTick(() => {
        console.log(this.$refs, '~~~~~~~~')
        let ref = this.$refs[`reply${comment.id}`]
        ref && ref.focus()
      })
    },
    replyCancel (comment) {
      this.$set(comment, 'replyEdit', false)
    },
    replyConfirm (comment) {
      this.$parent.$emit('reply', comment.reply, comment.id, () => {
        this.$set(comment, 'reply', '')
        this.$set(comment, 'replyEdit', false)
      })
    },
    setVisibility (comment) {
      this.$parent.$emit('set-visibility', comment, () => {
        this.$set(comment, 'hide', false)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.comment
  word-break break-all
  .userinfo
    display flex
    flex-wrap wrap
    align-items center
    font-weight bold
    font-size 14px
    img
      border-radius 50%
    .username
      color #4791ff
      padding 0 4px
    .response-username
      color #aaa
      span
        color #4791ff
        padding 0 2px
  .comment-content
    .comment-body
      padding 4px 0
      .hide
        font-size 12px
        .hide-notice
          color #FF4949
        .set-pass
          padding 2px 10px
        // 
    .comment-notice
      font-size 14px
      line-height 2
      color #aaa
      display flex
      align-items center
      .reply-btn
        user-select none
        cursor pointer
        &:hover, &.reply-editing
          font-weight bold
          color #6B798C
      .line
        margin 0 4px
        border 2px solid #ccc
        border-radius 50%
  .comment-reply
    .btn
      margin 5px 5px 0 0

.root
  .comment-content, .comment-reply
    padding-left 40px
  .userinfo
    &.info-container
      height 36px
    img
      width 36px
      height 36px

.child
  padding-left 40px
  .comment-content, .comment-reply
    padding-left 30px
  .userinfo
    font-size 14px
    &.info-container
      height 28px
    img
      width 28px
      height 28px


</style>