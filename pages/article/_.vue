<template>
  <div class="article-page">
    <div class="main-content">
      <article class="post-detail">
        {{ JSON.stringify(post) }}
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
        <div class="post-like" @click.stop="clickLike">
          <span
            class="like-container"
            :title="!currentUser.id ? '需要登录才能点赞' : (post.like ? '您赞了该文章' : '赞一下')">
            <span>{{ post.like ? '已赞' : '赞' }}</span>
            <span class="like-num" v-if="post.likes">{{ post.likes }}</span>
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
      title: `${this.post.title} - 木马tc个人博客`,
      meta: [
        { hid: 'keywords', name: 'keywords', content: `${this.post.keywords || ''}` },
        { hid: 'description', name: 'description', content: `${this.post.description || ''}${this.$site.description}` }
      ]
    }
  },
  data () {
    return {
      comment: ''
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
        .like-container
          background #06B038
          color #fff
          font-weight bold
          font-size 18px
          border-radius 4px
          display inline-block
          width 8em
          line-height 2.5
          user-select none
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
        .comment-tree
          .comment-root
            .avatar
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
          .reply-comment
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
              .comment-time
                color #6B6B6B
            .comment-content
              margin-left 30px
            .text
              background #ECF5FD
              padding 5px
              border-radius 4px
          .comment-content
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
            .comment-reply
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
              .comment-button
                margin 4px
                float right
            &:hover
              .comment-reply .reply-icon
                opacity 1

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
          margin 60px 0
          .like-container
            cursor pointer

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
