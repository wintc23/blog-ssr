<template>
  <div class="article-page">
    <div class="main-content">
      <article class="post-detail">
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
        </div>
        <div class="post-body">
          <div v-html="post.bodyHtml"></div>
        </div>
        <div class="post-like">
          <span @click.stop="clickLike" class="like" :title="post.like ? '您赞了该文章' : '赞一下'">
            <Icon :type="post.like ? 'md-heart' : 'md-heart-outline'" />
            <span class="like-num" v-if="post.likes">{{ post.likes }}</span>
          </span>
          <span class="reward">
            <span @click.stop="reward=true">¥ 赞赏</span>
          </span>
        </div>
        <div class="related-posts">
          <nuxt-link class="last" v-if="post.before" :to="`/article/${post.before.id}` + (type ? `/${type}` : '')">
            上一篇：{{ post.before.title }}
          </nuxt-link>
          <nuxt-link class="next" v-if="post.after" :to="`/article/${post.after.id}` + (type ? `/${type}` : '')">
            下一篇：{{ post.after.title }}
          </nuxt-link>
        </div>
        <client-only>
          <div class="comment-container">
            <div class="add-comment">
              <CommentInput placeholder="既然来了，就说几句吧" v-model="comment"></CommentInput>
              <Button class="comment-button" type="success" size="small" @click.stop="addComment(comment)">确定</Button>
            </div>
            <div class="comment-title">评论(<span>{{ post.commentTimes }}</span>)</div>
          </div>
          <comment-tree @reply="addComment" :list="post.comments"></comment-tree>
        </client-only>
      </article>
    </div>
    <client-only>
      <Modal v-model="reward" footer-hide :width="350">
        <div class="reward-title" slot="header">
          如果本文对您有帮助，您可以赞赏给我的女朋~,~
        </div>
        <div class="reward-content">
          <img src="http://file.wintc.top/reward.png" alt="陈小鱼的赞赏码">
        </div>
      </Modal>
    </client-only>
  </div>
</template>

<script>
import * as api from '@/api/posts'
import { addComment } from '@/api/comment'
import CommentInput from '@/components/CommentInput'
import tree from '@/components/tree'
import CommentTree from '@/components/CommentTree'

export default {
  components: {
    CommentInput,
    tree,
    CommentTree
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
      title: `${this.post.title} - 木马小站`,
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
    }
  },
  mounted () {
    this.$bus.$emit('code-highlight')
    this.$bus.$emit('baidu-push')
  },
  methods: {
    addComment (comment, response, callback) {
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

      addComment(params).then(res => {
        if (res.status == 200) {
          this.comment = ''
          Object.assign(this.post, res.data)
          callback && callback()
          let text = this.currentUser.email ? '评论回复将会通过邮件通知您' : '点击头像设置邮箱，以便及时收到回复'
          this.$Message.success(`评论成功，${text}`)
        }
      }).catch(error => {
        this.$Message.error('网络请求失败')
      })
    },
    clickLike () {
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.article-page
  .main-content
    color #333
    background #fff
    .post-detail
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
      .comment-container
        margin 20px 0
        padding 10px
        border-top 1px solid #ddd
        .add-comment
          overflow hidden
          .comment-button
            margin 4px
            float right
        .comment-title
          margin-bottom 10px
          font-size 18px
          span
            color #888

.reward-title, .reward-content
  text-align center
.reward-title
  line-height 1.4
  color #666
  font-size 12px

.reward-content
  margin-bottom 20px
  img
    width 300px
    max-width 80vw
    height auto

@media screen and (min-width: 600px)
  .article-page
    .main-content
      box-shadow 0 0 5px 0 rgba(0, 0, 0, .3)
      max-width 1000px
      margin 0 auto
      padding 40px
      .post-detail
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
      padding 20px 10px
      .post-detail
        .post-info
          margin 10px 0
          margin-left 10px
        .post-like
          margin 20px 0
</style>
