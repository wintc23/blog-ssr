<template>
  <div class="page-post-list">
    <div class="page-post-header" v-if="tag">
      当前标签：<span class="tag-title">{{ tag.title }}</span>，
      共<span class="tag-count">{{ tag.postCount }}</span>篇文章
    </div>
    <div class="post-list">
      <article
        class="post ws"
        v-for="post of list"
        :key="post.id">
        <div class="post-abstract-main">
          <div class="post-abstract">
            <nuxt-link class="post-title" :to="`/article/${post.id}`">{{ post.title }}</nuxt-link>
            <div class="post-info-common">
              <span class="post-type" :title="`文章分类：${typeInfo[post.type].name}`" v-if="typeInfo[post.type]">
                {{ typeInfo[post.type].name }}
              </span>
              <span class="post-date">
                {{ $timeShow(post.timestamp) }}
              </span>
            </div>
            <div
              @click.stop="toArticle(post.id)"
              class="post-abstract-content"
              v-html="post.abstract">
            </div>

            <!-- <aside class="post-info-pc">
              <nuxt-link class="look-all" :to="`/article/${post.id}`">阅读全文</nuxt-link>
              <div class="placeholder"></div>
              <div class="read info-item">浏览(<span>{{ post.readTimes }}</span>)</div>
              <div class="like info-item">赞(<span>{{ post.likes }}</span>)</div>
              <div class="comment info-item">评论(<span>{{ post.commentTimes }}</span>)</div>
            </aside> -->
          </div>
          <div class="post-abstract-image" v-if="post.abstractImage">
            <img :src="post.abstractImage" :alt="post.title">
          </div>
        </div>
        <aside class="post-info">
          <nuxt-link class="look-all" :to="`/article/${post.id}`">阅读全文</nuxt-link>
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
          <div class="placeholder"></div>
          <div class="read info-item">浏览(<span>{{ post.readTimes }}</span>)</div>
          <div class="like info-item">赞(<span>{{ post.likes }}</span>)</div>
          <div class="comment info-item">评论(<span>{{ post.commentTimes }}</span>)</div>
        </aside>
      </article>
      <div class="pagination" v-if="totalPage > 1">
        <div class="page-list">
          <nuxt-link
            :class="{
              page: true,
              current: pageNo == page
            }"
            v-for="pageNo in totalPage"
            :key="pageNo"
            :to="`${path}?page=${pageNo}`">
            {{ pageNo }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/posts'

export default {
  watchQuery: true,
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let func = params.tagId ? api.getPostsByTag : api.getPosts
    return func({
      page: +(query.page || 1),
      tagId: params.tagId || undefined
    }).then(res => {
      if (res.status === 200) {
        let { list, total, page, perPage } = res.data
        if (total === 0) {
          redirect({ path: '/' })
          return
        }
        return { list, total, page, perPage }
      } else {
        error('404', '页面找不到了哦')
      }
    }).catch(e => {
      console.log(e)
      error('501', '服务器错误')
    })
  },
  head () {
    return {
      title: `${this.$site.title} - ${this.$site.slogon}`,
      meta: [
        { hid: 'keywords', name: 'keywords', content: `${this.$site.keywords}` },
        { hid: 'description', name: 'description', content: `${this.$site.description}` }
      ]
    }
  },
  fetch () {},
  computed: {
    totalPage () {
      return Math.ceil(this.total / this.perPage)
    },
    typeInfo () {
      return this.$store.getters['postType/typeInfo']
    },
    tag () {
      let list = this.$store.getters['site/tags'] || []
      return list.find(item => item.id == this.$route.params.tagId)
    },
    path () {
      return this.$route.path
    },
    currentUser () {
      return this.$store.getters['userInfo/info']
    }
  },
  mounted () {
    this.$bus.$emit('baidu-push')
  },
  methods: {
    toArticle (id) {
      this.$router.push(`/article/${id}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
.page-post-list
  .page-post-header
    background #fff
    padding 15px 20px
    margin-bottom 5px
    color #666
    .tag-title, .tag-count
      color rgba(64, 158, 255, 1)
  .post-list
    .post
      background #fff
      color #333
      &+.post
        margin 10px 0
      .post-abstract
        .post-title
          font-size 20px
          &:hover
            text-decoration underline
        .post-abstract-content
          color #777
        .post-info-common
          padding .5em 0 1em
          .post-type
            align-self center
            margin-right 20px
            color #FFA710
            font-weight bold
            border-radius 2px
            // padding 6px 10px
          .post-date
            color #888
      .post-abstract-image
        display flex
        align-items center
        justify-content center
        overflow hidden
        font-size 0
        img
          vertical-align middle
          width 100%
          height auto
          transition all .5s ease-out
      &:hover
        .post-abstract-image img
          width 110%
      .post-info
        display flex
        margin-top 1em
        font-size 14px
        .look-all, .edit
          text-decoration underline
        .edit
          margin-left 5px
        .placeholder
          flex auto
        .info-item
          span
            color #777
            text-decoration underline
          &+.info-item
            &::before
              content '·'
              margin 0 5px

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
  .page-post-list
    .post-list
      max-width 1000px
      margin 0 auto
      .post
        padding 30px 40px
        border-radius 4px
        .post-abstract-main
          display flex
          .post-abstract
            flex auto
            font-size 16px
            margin-right 10px
            .post-abstract-content
              pointer-events none
          .post-abstract-image
            align-self center
            width 30vw
            height 20vw
            max-height 200px
            max-width 300px
            flex-shrink 0
            box-shadow 0 0 10px 0 rgba(0, 0, 0, .1)
        &:hover
          // background #fafbfc
          .post-abstract-image
            box-shadow 0 0 10px 0 rgba(0, 0, 0, .15)

@media screen and (max-width: 600px)
  .page-post-list
    .post-list
      .post
        padding 20px
        .post-abstract-image
          img
            max-width 100%
</style>
