<template>
  <div class="message-page-container">
    <div class="message-page">
      <div class="msg">
        <img src="http://file.wintc.top/paopaobing.jpg" alt="">
      </div>
      <div class="msg-area">
        <div class="add-msg">
          <CommentInput placeholder="有什么想对我说的，在这里给我留言吧" v-model="msg"></CommentInput>
          <Button class="msg-button" type="success" size="small" @click.stop="addMessage(msg)">确定</Button>
          <!-- <Button class="msg-button" type="text">取消</Button> -->
        </div>
        <div class="msgs">
          <simple-tree
            :expand="false"
            class="msg-tree"
            :node-class="'tree-node-container'"
            :treeData="msgTree"
            :max-indent="16">
            <template v-slot:default="{ parentData, data, level }">
              <div class="msg-root" v-if="level == 1">
                <avatar class="img" :userId="data.author_id">
                  <template v-slot:default="{ userinfo }">
                    <img :src="userinfo.avatar" alt="用户头像">
                  </template>
                </avatar>
                <div class="text">
                  <div class="title">
                    <avatar class="name" :userId="data.author_id">
                      <template v-slot:default="{ userinfo }">
                        <span>{{ userinfo.username }}</span>
                      </template>
                    </avatar>
                    <div class="date">{{ $formatTime(data.timestamp) }}</div>
                  </div>
                  <div class="msg-content">
                    <p>
                      <span v-if="data.hide" class="check-waiting" title="当前仅自己可见，需管理员审核后才会公开">(待审核)</span>
                      {{ data.body }}
                    </p>
                    <div class="msg-reply">
                      <template v-if="data.msgEdit">
                        <Input class="reply-input" placeholder="说点啥呢．．．" type="textarea" autosize v-model="data.msg"/>
                        <Button class="msg-button" size="small" type="success" @click.stop="addMessage(data.msg, data.id)">确定</Button>
                        <Button class="msg-button" size="small" type="text" @click.stop="hideMessage(data)">取消</Button>
                      </template>
                      <span class="reply-icon" @click.stop="setMessage(data)" v-else>
                        <Icon type="ios-paper-plane" class="icon" />
                        <span>回复</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="reply-msg" v-else>
                <div class="title">
                  <avatar class="author" :userId="data.author_id">
                    <template v-slot:default="{ userinfo }">
                      <img :src="userinfo.avatar" alt="用户头像">
                      <span class="author-name">{{ userinfo.username }}</span>
                    </template>
                  </avatar>
                  <span class="reply-title">回复</span>
                  <avatar class="response-author" :userId="parentData.author_id">
                    <template v-slot:default="{ userinfo }">
                      <img :src="userinfo.avatar" alt="用户头像">
                      <span class="response-author-name">{{ userinfo.username }}</span>
                    </template>
                  </avatar>
                  <span class="msg-time">{{ $formatTime(data.timestamp) }}</span>
                </div>
                <div class="msg-content">
                <p class="text"><span v-if="data.hide" class="check-waiting" title="当前仅自己可见，需管理员审核后才会公开">(待审核)</span>{{ data.body }}</p>
                <div class="msg-reply">
                  <template v-if="data.msgEdit">
                    <Input class="reply-input" placeholder="说点啥呢．．．" type="textarea" autosize v-model="data.msg"/>
                    <Button class="msg-button" size="small" type="success" @click.stop="addMessage(data.msg, data.id)">确定</Button>
                    <Button class="msg-button" size="small" type="text" @click.stop="hideMessage(data)">取消</Button>
                  </template>
                  <span class="reply-icon" @click.stop="setMessage(data)" v-else>
                    <Icon type="ios-paper-plane" class="icon" />
                    <span>回复</span>
                  </span>
                </div>
                </div>
              </div>
            </template>
          </simple-tree>
        </div>
      </div>
      <div class="pagination">
        <Page :total="totalCount" @on-change='choosePage' show-elevator :current="currentPage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessages, addMessage } from '@/api/messages'
import CommentInput from '@/components/CommentInput'

const PER_PAGE = 10

export default {
  watchQuery: ['page', 'refresh'],
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let { page = 1 } = query
    let data = {
      page: +page,
      per_page: PER_PAGE
    }
    return getMessages(data).then(res => {
      if (res.status == 200) {
        let { list, total, page }  = res.data
        list.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1)
        let info = {}
        let msgList = []
        for (let msg of list) {
          if (msg.response_id) {
            if (!info[msg.response_id]) continue
            info[msg.response_id].push(msg)
            info[msg.id] = info[msg.response_id]
          } else {
            msg.children = []
            info[msg.id] = msg.children
            msgList.push(msg)
          }
        }
        msgList.sort((a, b) => a.timestamp < b.timestamp ? 1 : -1)
        return {
          msgTree: msgList,
          totalCount: total,
          currentPage: page }
      }
    }).catch(e => {
      error({ statusCode: 404, message: '页面找不到了哦' })
    })
  },
  components: {
    CommentInput
  },
  data () {
    return {
      msg: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters['userInfo/info']
    }
  },
  methods: {
    setMessage (data) {
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录后再操作')
        return
      }
      console.log('hello', data.id)
      this.$set(data, 'msgEdit', true)
      if (!data.msg) {
        this.$set(data, 'msg', '')
      }
    },
    hideMessage (data) {
      this.$delete(data, 'msgEdit')
    },
    addMessage (msg, response) {
      if (!msg) {
        this.$Message.info('操作失败，评论不能为空')
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
      response && (params.response_id = response)
      addMessage(params).then(res => {
        if (res.status == 200) {
          let query = { ...this.$route.query }
          query.refresh = +query.refresh ? 0 : 1
          !response && (query.page = 1)
          this.msg = ''
          this.$router.push({
            name: this.$route.name,
            query
          })
        }
      }).catch(error => {
        this.$Message.error('网络请求失败')
      })
    },
    choosePage (page) {
      if (page == this.currentPage) return
      let query = { page }
      this.$router.push({ name: 'site-message', query })
      this.$el.scrollIntoView({block: "start", inline: "nearest", behavior: 'smooth' })
    }
  },
}
</script>

<style lang="stylus" scoped>
.message-page-container
  padding 40px 0 100px 0 !important
  text-align center
  .message-page
    max-width 1000px
    margin 0 auto
    .msg
      img
        width 100%
        height 300px
  .pagination
    padding .5rem 0
  .msg-area
    .add-msg
      .msg-button
        margin 4px
        float right
    .msgs
      clear both
      .msg-tree >>>
        >.tree-node-container
          border-bottom 1px solid #e5e5e5
          padding 40px 0 30px
          .msg-root
            // border 1px solid red
            .img
              float left
              img
                width 50px
                height 50px
                border-radius 50%
            .text
              padding-left 70px
              line-height 22px
              color #333
              .title
                margin-bottom 10px
                .name, .date
                  display inline
                .date
                  float right
          .reply-msg
            padding-left 54px
            .title
              line-height 30px
              margin 4px 0
              .author, .response-author
                display inline
                img
                  width 30px
                  height 30px
                  border-radius 50%
                  vertical-align middle
                .author-name, .response-author-name
                  color #6B6B6B
                  font-weight bold
              .reply-title
                color #3361d8
              .msg-time
                color #6B6B6B
            .msg-content
              margin-left 30px
            .text
              background #ECF5FD
              padding 5px
              border-radius 4px
.msg-content
  background #ECF5FD
  padding 5px 10px
  border-radius 4px
  .check-waiting
    color white
    font-weight bold
    border-radius 4px
    padding 1px 2px
    background #06B038
    user-select none
    cursor pointer
  .msg-reply
    overflow hidden
    .reply-input
      margin 4px 0
    .reply-icon
      display flex
      align-items center
      cursor pointer
      user-select none
      color #3361d8
      width 3rem
      opacity 0
      transition all .2s
      .icon
        font-size 1rem
    .msg-button
      margin 4px
      float right
  &:hover
    .msg-reply .reply-icon
      opacity 1

@media screen and (max-width: 1200px)
  .message-page-container
    .message-page
      padding 0 10px

@media screen and (max-width: 768px)
  .message-page-container
    .message-page
      .msg-area
        .msgs
          .msg-tree >>>
            >.tree-node-container
              padding 10px 0
              .msg-root
                .img
                  img
                    height 30px
                    width 30px
                .text
                  padding-left 0
                  .title
                    line-height 30px
                    .name
                      margin-left 20px
              .reply-msg
                padding-left 0
                .msg-content
                  margin-left 0

</style>

