<template>
  <div class="message-page">
    <div class="main-content">
      <div class="add-msg">
        <CommentInput placeholder="有什么想对我说的，在这里给我留言吧" v-model="msg"></CommentInput>
        <Button class="msg-btn" type="success" size="small" @click.stop="addMessage(msg)">确定</Button>
      </div>
      <div class="msg-tree">
        <comment-tree :list="list" @reply="addMessage"></comment-tree>
      </div>
      <div class="pagination">
        <div class="last">
          <nuxt-link :to="`/message?page=${page-1}`" v-if="page > 1">上一页</nuxt-link>
        </div>
        <div class="page-no">{{ page }} / {{ totalPage }}</div>
        <div class="next">
          <nuxt-link :to="`/message?page=${page+1}`" v-if="page < totalPage">下一页</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessages, addMessage } from '@/api/messages'
import CommentInput from '@/components/CommentInput'
import CommentTree from '@/components/CommentTree'

export default {
  watchQuery: ['page', 'refresh'],
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let { page = 1 } = query
    let data = {
      page: +page
    }
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
    addMessage (msg, response, callback) {
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
            this.msg = ''
            let page = this.$route.query.page ? '' : `?page=1`
            this.$router.push(`/message${page}`)
          }
          callback && callback()
          let text = this.currentUser.email ? '留言回复将会通过邮件通知您' : '点击头像设置邮箱，以便及时收到回复'
          this.$Message.success(`留言成功，${text}`)
        }
      }).catch(error => {
        this.$Message.error('网络请求失败')
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.message-page
  .main-content
    .add-msg
      overflow hidden
      border-bottom 1px solid #888
      .msg-btn
        float right
        margin 10px
    .msg-tree
      background #fff
      border-radius 4px
    .pagination
      display flex
      justify-content space-between
      font-weight bold
      padding 20px 10px
      color #333
      font-size 14px
      .last, .next
        text-decoration underline
        width 4em
      .next
        text-align right

@media screen and (min-width: 600px)
  .message-page
    .main-content
      padding-top 40px
      .add-msg
        padding-bottom 20px
      .msg-tree
        margin 40px 0
        padding 20px

@media screen and (max-width: 600px)
  .message-page
    .main-content
      .add-msg
        // padding 10px 10px 5px
      .msg-tree
        margin 20px 0
        padding 20px 10px
        background #fff
</style>

