<template>
  <div class="message-page">
    <div class="main-content">
      <!-- <div class="page-title">
        留言 - 共<span class="count">{{ total }}</span>条留言
      </div> -->
      <div class="add-msg">
        <CommentInput placeholder="有什么想对我说的，在这里给我留言吧" v-model="msg"></CommentInput>
        <Button class="msg-btn" type="success" size="small" @click.stop="addMessage(msg)">留言</Button>
      </div>
      <div class="msg-tree">
        <comment-tree @set-visibility="setVisibility" :list="list" @reply="addMessage"></comment-tree>
      </div>
      <div class="pagination" v-if="totalPage > 1">
        <div class="page-list">
          <nuxt-link
            :class="{
              page: true,
              current: pageNo == page
            }"
            v-for="pageNo in totalPage"
            :key="pageNo"
            :to="`message?page=${pageNo}`">
            {{ pageNo }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessages, addMessage, setMessageShow } from '@/api/messages'
import CommentInput from '@/components/CommentInput'
import CommentTree from '@/components/comment-tree'
import { singleClick } from '@/tool'

export default {
  watchQuery: ['page'],
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let { page = 1 } = query
    let data = { page: +page }
    return getMessages(data).then(res => {
      if (res.status == 200) {
        let { list, total, page, perPage }  = res.data
        return { list, total, page, perPage }
      } else {
        error({ statusCode: 404, message: '页面找不到了哦' })
      }
    }).catch(e => {
      error({ statusCode: 501, message: '服务器出错' })
    })
  },
  components: {
    CommentInput,
    CommentTree
  },
  data () {
    return {
      msg: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    totalPage () {
      return Math.ceil(this.total / this.perPage)
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
      return addMessage(params).then(res => {
        if (res.status == 200) {
          if (response) {
            this.list.push(res.data)
          } else {
            this.msg = ''
            let page = this.$route.query.page ? '' : `?page=1`
            this.$router.push(`/message${page}`)
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
.message-page
  .main-content
    .page-title
      padding 15px 5px
      margin-bottom 5px
      margin-bottom 40px
      font-size 18px
      font-weight bold
      border-bottom 4px solid #273A52
      .count
        color rgba(64, 158, 255, 1)
    .add-msg
      overflow hidden
      .msg-btn
        float right
        font-size 16px
        margin 10px
        width 4em
    .msg-tree
      border-radius 2px
    .pagination
      text-align center
      .page-list
        display inline-block
        text-align left
        .page
          display inline-block
          width 36px
          line-height 36px
          text-align center
          background #fff
          margin 8px
          color #333
          border-radius 4px
          font-weight bold
          &:hover
            background #ddd
          &.current
            background #fff
            color rgba(64, 158, 255, 1)

@media screen and (min-width: 600px)
  .message-page
    .main-content
      // padding-top 40px
      .add-msg
        padding-bottom 10px
      .msg-tree
        margin-bottom 40px

@media screen and (max-width: 600px)
  .message-page
    .main-content
      .add-msg
        // padding 10px 10px 5px
      .msg-tree
        margin-bottom 20px
</style>

