<template>
  <div class="comment-list">
    <div
      class="comment"
      v-for="comment of rootList"
      :key="comment.id">
      <avatar class="avatar" :class="currentUser.admin ? 'admin' : ''" :userId="comment.authorId">
        <template v-slot:default="{ userinfo }">
          <img :src="userinfo.avatar" alt="用户头像">
        </template>
      </avatar>
      <div class="comment-content">
        <avatar class="userinfo" :userId="comment.authorId">
          <template v-slot:default="{ userinfo }">
            <div class="username">
              {{ userinfo.username }}
              <notice class="notice" :userId="userinfo.id"></notice>
            </div>
            <div class="comment-body" @click.stop="checkReply(comment)">
              <span class="text">{{ comment.body }}</span>
              <Tag
                class="tag"
                color="orange"
                v-if="comment.hide"
                title="管理员审核后公开，当前仅自己和管理员可见">
                待审核
              </Tag>
              <span class="time">{{ $timeShow(comment.timestamp) }}</span>
            </div>
            <div class="reply-container">
              <span class="reply-info">
                <template v-if="comment.children && comment.children.length">
                  共{{ comment.children.length }}条回复，
                  <span class="fold-btn" @click="setExpand(comment.id)">{{ expandMap[comment.id] ? '折叠' : '查看' }}</span>
                </template>
              </span>
              <span class="reply-btn" @click.stop="replyComment(comment)">回复</span>
              <template v-if="comment.replyEdit">
                <Input :ref="`reply${comment.id}`" :placeholder="`回复 ${userinfo.username} `" v-model="comment.reply" type="textarea" :autosize="{minRows: 2,maxRows: 6}"/>
                <Button class="btn" size="small" type="warning" @click.stop="replyCancel(comment)">取消</Button>
                <Button class="btn" size="small" type="primary" @click.stop="replyConfirm(comment)">确定</Button>
              </template>
            </div>
          </template>
        </avatar>
        <div
          :ref="`children${comment.id}`"
          class="comment-children"
          v-if="comment.children && comment.children.length && expandMap[comment.id]">
          <div
            class="child-comment"
            :ref="`child${child.id}`"
            v-for="(child, idx) of comment.children"
            :key="idx">
            <avatar class="child-avatar" :class="currentUser.admin ? 'admin' : ''" :userId="child.authorId">
              <template v-slot:default="{ userinfo }">
                <img :src="userinfo.avatar" alt="用户头像">
              </template>
            </avatar>
            <div class="child-comment-content">
              <avatar class="child-userinfo" :class="currentUser.admin ? 'admin' : ''" :userId="child.authorId">
                <template v-slot:default="{ userinfo }">
                  <div class="child-username">
                    {{ userinfo.username }}
                    <notice class="notice" :userId="userinfo.id"></notice>
                  </div>
                  <div class="child-comment-body" @click.stop="checkReply(child)">
                    <span class="reply-tips" v-if="child.responseId !== comment.id">
                      回复
                      <avatar class="reply-username" :userId="info[child.responseId].authorId">
                        <template v-slot:default="{ userinfo: replyUserinfo }">{{ replyUserinfo.username }}</template>
                      </avatar>
                    </span>
                    <span class="text">{{ child.body }}</span>
                    <Tag
                      class="tag"
                      color="orange"
                      v-if="child.hide"
                      title="管理员审核后公开，当前仅自己和管理员可见">
                      待审核
                    </Tag>
                    <span class="time">{{ $timeShow(child.timestamp) }}</span>
                  </div>
                  <div class="reply-container">
                    <span class="reply-btn" @click.stop="replyComment(child)">回复</span>
                    <template v-if="child.replyEdit">
                      <Input :ref="`reply${child.id}`" :placeholder="`回复 ${userinfo.username} `" v-model="child.reply" type="textarea" :autosize="{minRows: 2,maxRows: 6}"/>
                      <Button class="btn" size="small" type="warning" @click.stop="replyCancel(child)">取消</Button>
                      <Button class="btn" size="small" type="primary" @click.stop="replyConfirm(child)">确定</Button>
                    </template>
                  </div>
                </template>
              </avatar>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from '@/components/Avatar'
import notice from '@/components/Notice'

export default {
  components: {
    avatar,
    notice
  },
  props: {
    list: {
      type: Array,
      requied: true
    }
  },
  data () {
    return {
      replyText: '',
      expandMap: {}
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
  methods: {
    replyComment (comment) {
      this.$set(comment, 'replyEdit', true)
      if (!comment.reply) {
        this.$set(comment, 'reply', '')
      }
      this.$nextTick(() => {
        let refs = this.$refs[`reply${comment.id}`]
        refs && refs[0] && refs[0].focus()
      })
    },
    replyCancel (comment) {
      this.$set(comment, 'replyEdit', false)
    },
    replyConfirm (comment) {
      this.$emit('reply', comment.reply, comment.id, () => {
        this.$set(comment, 'reply', '')
        this.$set(comment, 'replyEdit', false)
        if (!this.expandMap[comment.id]) this.setExpand(comment.id)
        this.$nextTick(() => {
          let node = null
          if (!comment.responseId) {
            let children = this.$refs[`children${comment.id}`]
            if (children && children[0]) {
              node = children[0].lastChild
            }
          } else {
            let child =  this.$refs[`child${comment.id}`]
            if (child && child[0]) {
              node = child[0].parentNode.lastChild
            }
          }
          console.log(node)
          node && node.scrollIntoView({ behavior: 'smooth' })
        })
      })
    },
    checkReply (comment) {
      if (!this.$isPC) this.replyComment(comment)
    },
    setExpand (id) {
      this.$set(this.expandMap, id, !this.expandMap[id])
    }
  }
}
</script>

<style lang="stylus" scoped>


.comment, .child-comment
  &+.comment, &+.child-comment
    border-top 1px solid #ddd
  .avatar, .child-avatar
    float left
    img
      border-radius 50%
  .comment-content, .child-comment-content
    overflow hidden
    .userinfo, .child-userinfo
      .comment-body, .child-comment-body
        font-size 14px
        line-height 1.6
        .time
          word-break keep-all
          white-space pre
          font-size 14px
          color #888

.username, .child-username, .reply-username
  color #888
  font-size 14px
  line-height 1.5

.username, .child-username
  display flex
  align-items center
  .notice
    margin-left 5px

.reply-tips
  .reply-username
    margin 0 4px
    display inline
    &::after
      content ':'
      color #333
      margin-left 2px


.comment-children
  background rgba(0, 0, 0, .05)
  border-radius 2px

.reply-container
  .reply-info
    color #888
    margin-right 10px
  .reply-btn, .fold-btn
    user-select none
    cursor pointer
    color rgb(64, 158, 254)
    text-decoration underline

@media screen and (min-width: 600px)
  .comment
    padding 15px 0
    .avatar
      margin-right 10px
      img
        width 40px
  .child-comment
    padding 10px
    .child-avatar
      margin-right 10px
      img
        width 30px
  .reply-container
    overflow hidden
    margin 10px 0
    .btn
      float right
      margin-top 10px
      font-size 13px
      &+.btn
        margin-right 10px

@media screen and (max-width: 600px)
  .comment
    padding 5px 0
    .avatar
      margin-right 5px
      img
        width 10vw
  .child-comment
    padding 5px
    .child-avatar
      margin-right 4px
      img
        width 6vw
  .reply-container
    overflow hidden
    margin 5px 0
    font-size 13px
    .btn
      float right
      margin-top 5px
      &+.btn
        margin-right 10px

</style>
