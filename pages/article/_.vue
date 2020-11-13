<template>
  <div class="article-page">
    <div class="main-content">
      <article
        class="post-detail ws"
        v-outline="{
          callback: refreshNavTree,
          selectors: ['h1', 'h2', 'h3,h4']
        }">
        <h2 class="post-title">{{ post.title }}</h2>
        <div class="post-info">
          <span class="post-date">
            {{ $timeShow(post.timestamp) }}
          </span>
          <span class="post-type" v-if="typeInfo[post.typeId]">
            {{ typeInfo[post.typeId].name }}
          </span>
          <span class="read info-item">
            <span>{{ post.readTimes }}</span>次浏览
          </span>
          <client-only>
            <nuxt-link
              v-if="currentUser.admin"
              class="edit"
              :to="{
                name: 'manage-article',
                query: { postId: post.id }
              }">
              编辑
            </nuxt-link>
          </client-only>
        </div>
        <div class="post-body">
          <div v-html="post.bodyHtml"></div>
        </div>
        <div class="post-like">
          <Tooltip
            @click.native="like"
            class="like"
            placement="top"
            :content="post.like ? '您赞了该文章' : '赞一下'">
            <Icon :type="post.like ? 'md-heart' : 'md-heart-outline'" />
            <span class="like-num" v-if="post.likes">{{ post.likes }}</span>
          </Tooltip>
          <Tooltip
            @click.native="reward=true"
            class="reward"
            content="微信扫码赞赏这小子"
            placement="top">
            ¥赞赏
          </Tooltip>
        </div>
        <div class="related-posts">
          <div class="last" v-if="post.before">
            <nuxt-link  :to="post.before.id | postUrl(type)">上一篇：{{ post.before.title }}</nuxt-link>
          </div>
          <div class="next" v-if="post.after">
            <nuxt-link :to="post.after.id | postUrl(type)">下一篇：{{ post.after.title }}</nuxt-link>
          </div>
        </div>
      </article>
      <client-only>
        <div class="comment-container">
          <div class="comment-title">评论(<span>{{ post.commentTimes }}</span>)</div>
          <div class="add-comment">
            <CommentInput placeholder="既然来了，就说几句吧" v-model="comment"></CommentInput>
            <Button class="comment-button" type="success" size="small" @click.stop="addComment(comment)">评论</Button>
          </div>
        </div>
        <comment-tree
          @reply="addComment"
          @set-visibility="setVisibility"
          :list="post.comments"
          :current="commentId">
        </comment-tree>
      </client-only>
    </div>
    <client-only>
      <Modal :closable="false" v-model="reward" footer-hide transfer class="reward-modal">
        <img src="https://file.wintc.top/reward.png?v=1" alt="赞赏码">
      </Modal>
    </client-only>
  </div>
</template>

<script>
import * as api from '@/api/posts'
import { singleClick } from '@/tool'
import { addComment, setCommentShow } from '@/api/comment'
import CommentInput from '@/components/CommentInput'
import CommentTree from '@/components/comment-tree'

export default {
  components: {
    CommentInput,
    CommentTree
  },
  filters: {
    postUrl (id, type) {
      const postFix = type ? `/${type}` : ''
      return `/article/${id}${postFix}`
    }
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let path = params.pathMatch || ''
    if (!path) {
      error(501, '找不到该页面')
      return
    }
    let [id, type] = path.split('/')
    return api.getPost(id, type).then(res => {
      if (res.status === 200) {
        return { post: res.data }
      } else {
        error(404, '找不到该页面')
      }
    }).catch(e => {
      console.log(e)
      error(501, '服务器出错啦')
    })
  },
  head () {
    return {
      title: `${this.post.title} - 沐码小站`,
      meta: [
        { hid: 'keywords', name: 'keywords', content: `${this.post.keywords || ''}` },
        { hid: 'description', name: 'description', content: `${this.post.description || ''}${this.$site.description}` }
      ]
    }
  },
  data () {
    return {
      comment: '',
      reward: false
    }
  },
  computed: {
    typeInfo () {
      return this.$store.getters['postType/typeInfo']
    },
    type () {
      let path = this.$route.params.pathMatch
      if (path) {
        let [id, type] = path.split('/')
        return type || ''
      }
      return ''
    },
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    commentId () {
      return this.$route.query.commentId
    }
  },
  watch: {
    reward: {
      immediate: true,
      handler () {
        if (!this.reward) return
        this.$nextTick(() => {
          var event = new Event('touchstart')
          document.body.dispatchEvent(event)
        })
      }
    }
  },
  mounted () {
    this.$bus.$emit('code-highlight')
    this.$bus.$emit('baidu-push')
  },
  beforeDestroy() {
    this.refreshNavTree(null)
  },
  methods: {
    addComment: singleClick(function(comment, response, callback) {
      if (!comment) {
        this.$Message.info('操作失败，评论不能为空')
        return
      }
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录后再操作')
        return
      }
      let params = {
        body: comment,
        postId: this.post.id,
      }
      response && (params.responseId = response)
      this.$Loading.start()
      return addComment(params).then(res => {
        if (res.status == 200) {
          this.$Loading.finish()
          this.comment = ''
          Object.assign(this.post, res.data)
          callback && callback()
          this.$Message.success(`评论成功`)
        }
      }).catch(error => {
        console.log(error)
        this.$Loading.error()
        this.$Message.error('网络请求失败')
      })
    }),
    like () {
      console.log('click-like')
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录后再操作')
        return
      }
      let func = this.post.like ? api.cancelLikePost : api.likePost
      func(this.post.id).then(res => {
        if (res.status === 200) {
          Object.assign(this.post, res.data)
        }
      })
    },
    refreshNavTree (treeData) {
      this.$store.commit('outline/setNavList', treeData)
    },
    setVisibility (comment, callback) {
      setCommentShow(comment.id).then(res => res.status === 200 && callback())
    }
  }
}
</script>

<style lang="stylus" scoped>
.article-page
  .main-content
    color #333
    .post-detail
      background #fff
      .post-body
        >>>
          img
            height auto !important
      .post-title
        // 
      .post-info
        font-size 14px
        span+span
          margin-left 20px
        .post-type
          color #FF7F21
        .edit
          text-decoration underline
          margin-left 5px
      .post-like
        text-align center
        .like, .reward
          min-width 4em
          font-size 14px
          border-radius 4px
          display inline-block
          line-height 2
          user-select none
          cursor pointer
        .like
          background rgba(255, 32, 32, .2)
          color rgba(255, 32, 32, 1)
          border 1px solid rgba(255, 32, 32, .4)
          &:hover
            box-shadow 0 0 5px 0 rgba(255, 32, 32, .5)
        .reward
          margin-left 10px
          color #06B038
          border 1px solid currentColor
          transition all .25s ease-out
          &:hover
            background #06B038
            color #fff

      .related-posts
        .last, .next
          display block
          margin 5px 10px
          a:hover
            text-decoration underline
    .comment-container
      margin 20px 0
      .add-comment
        overflow hidden
        .comment-button
          margin 4px
          font-size 16px
          width 4em
          float right
      .comment-title
        margin-bottom 10px
        font-size 18px
        padding 15px 5px
        border-bottom 2px solid #ddd
        font-weight bold
        // span
        //   color rgba(64, 158, 255, 1)

.reward-modal
  img
    width 300px
    height 300px
    max-width 80vw
    max-height 80vw
    vertical-align middle
  >>>
    .ivu-modal-wrap
      display flex
      flex-direction column
      justify-content center
      align-items center
      z-index 99999 !important
      &::before, &::after
        content ''
      &::before
        flex-grow 1
      &::after
        flex-grow 3

    .ivu-modal
      width auto !important
      top 0
    .ivu-modal-header
      display none
    .ivu-modal-body
      padding 0


@media screen and (min-width: 600px)
  .article-page
    .main-content
      max-width 1000px
      margin 0 auto
      .post-detail
        padding 40px
        .post-title
          text-align center
        .post-info
          margin 30px 0
          text-align center
          color #666
        .post-like
          margin 40px 0

@media screen and (max-width: 600px)
  .article-page
    .main-content
      .post-detail
        padding 20px 10px
        .post-info
          margin 10px 0
          margin-left 10px
        .post-like
          margin 20px 0
</style>
