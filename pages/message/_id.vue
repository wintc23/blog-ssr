<template>
  <div class="message-detail">
    <div class="msg-tree">
      <comment-tree
        ref="commentTree"
        @reply="addMessage"
        @set-visibility="setVisibility"
        :list="list"
        :current="msgId">
      </comment-tree>
    </div>
  </div>
</template>

<script>
import { getMessageDetail, addMessage, setMessageShow } from '@/api/messages'
import CommentTree from '@/components/comment-tree'
import { singleClick } from '@/tool'

export default {
  watchQuery: ['refresh'],
  components: {
    CommentTree
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return getMessageDetail(params.id).then(res => {
      if (res.status == 200) {
        let { list } = res.data
        return { list }
      } else {
        error({ statusCode: 404, message: '页面找不到了哦' })
      }
    }).catch(() => {
      error({ statusCode: 501, message: '服务器出错' })
    })
  },
  computed: {
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    msgId () {
      return this.$route.query.newId
    }
  },
  methods: {
    addMessage: singleClick(function (msg, response, callback) {
      if (!msg) {
        this.$Message.info('操作失败，留言不能为空')
        return
      }
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录后再操作')
        return
      }
      let params = {
        body: msg,
      }
      response && (params.responseId = response)
      addMessage(params).then(res => {
        if (res.status == 200) {
          if (response) {
            this.list.push(res.data)
          } else {
            let { refresh = 0 } = this.$route.query
            this.$router.push({
              path: this.$route.path,
              query: {
                refresh: ++refresh
              }
            })
          }
          callback && callback()
          this.$Message.success(`留言成功`)
        }
      }).catch(error => {
        this.$Message.error('网络请求失败')
      })
    }),
    setVisibility (msg, callback) {
      setMessageShow(msg.id).then(res => res.status === 200 && callback())
    }
  }
}
</script>

<style lang="stylus" scoped>
.message-detail
  .msg-tree
    border-radius 4px
    margin 0 10px
@media screen and (max-width: 600px)
  .message-detail
    .msg-tree
      margin 10px
</style>
