<template>
  <div class="article-page">
    <div class="main-content">
      <div class="post-detail">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-info">
          <span class="post-date">
            {{ $timeShow(post.timestamp) }}
          </span>
          <span class="post-type" v-if="typeInfo[post.type]">
            {{ typeInfo[post.type].name }}
          </span>
          <span class="read info-item">
            <span>{{ post.read_times }}</span>次浏览
          </span>
        </div>
        <div class="post-body">
          <div v-html="post.body_html"></div>
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
            <div class="comment-title">评论(<span>{{ post.comment_times }}</span>)</div>
          </div>
          <tree
            :treeData="comments">
            <template v-slot:default="{ data, level }">
              {{ data.content }}
            </template>
          </tree>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/posts'
import CommentInput from '@/components/CommentInput'
import tree from '@/components/tree'

export default {
  components: {
    CommentInput,
    tree
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
        let comments = res.data.comments
        comments.sort((a, b) => a.timestamp - b.timestamp)
        let info = {}, list = []
        for (let comment of comments) {
          if (comment.response_id) {
            // 已经排序 response_id一定已经在info中
            if (!info[comment.response_id]) continue
            info[comment.response_id].push(comment)
            info[comment.id] = info[comment.response_id]
          } else {
            comment.children = []
            info[comment.id] = comment.children
            list.push(comment)
          }
          list.reverse()
        }
        return {
          post: res.data,
          comments: list
        }
      } else {
        error(404, '找不到该页面')
      }
    }).catch(e => {
      console.log(e)
      error(501, '服务器出错啦')
    })
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
    setComment (data) {
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录后再操作')
        return
      }
      console.log('hello', data.id)
      this.$set(data, 'commentEdit', true)
      if (!data.comment) {
        this.$set(data, 'comment', '')
      }
    },
    hideComment (data) {
      this.$delete(data, 'commentEdit')
    },
    addComment (comment, response) {
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
        post_id: this.post.id,
      }
      response && (params.response_id = response)
      addComment(params).then(res => {
        if (res.status == 200) {
          this.refreshPage()
          this.comment = ''
        }
      }).catch(error => {
        this.$Message.error('网络请求失败')
      })
    },
    checkReply (data) {
      if (this.$IsPC) return
      this.setComment(data)
    },
    clickLike () {
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录后再操作')
        return
      }
      let func = this.post.like ? api.cancelLikePost : api.likePost
      func(this.post.id).then(res => {
        res.status == 200 && this.refreshPage()
      })
    },
    refreshPage () {
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        return
      }
      let query = { ...this.$route.query }
      query.refresh = +query.refresh ? 0 : 1
      this.$router.push({
        name: this.$route.name,
        query
      })
    }
  }
}
</script>

<style lang="stylus">
@import 'static/css/github-markdown.css'
</style>

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
