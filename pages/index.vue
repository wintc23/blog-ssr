<template>
  <div class="home-page">
    <div class="post-list">
      <nuxt-link
        class="post"
        v-for="post of list"
        :to="`/article/${post.id}`"
        :key="post.id">
        <div class="post-abstract">
          <h2 class="post-title">{{ post.title }}</h2>
          <div class="post-info-common">
            <span class="post-type" :title="`文章分类：${typeInfo[post.type].name}`" v-if="typeInfo[post.type]">
              {{ typeInfo[post.type].name }}
            </span>
            <span class="post-date">
              发布于：{{ $timeShow(post.timestamp) }}
            </span>
          </div>
          <div class="post-abstract-content" v-html="post.abstract"></div>
          <div class="post-info-pc">
            <div class="read info-item">浏览(<span>{{ post.read_times }}</span>)</div>
            <div class="like info-item">赞(<span>{{ post.likes }}</span>)</div>
            <div class="comment info-item">评论(<span>{{ post.comment_times }}</span>)</div>
          </div>
        </div>
        <div class="post-abstract-image" v-if="post.abstract_image">
          <img :src="post.abstract_image" alt="">
        </div>
        <div class="post-info-mobile">
          <div class="read info-item">浏览(<span>{{ post.read_times }}</span>)</div>
          <div class="like info-item">赞(<span>{{ post.likes }}</span>)</div>
          <div class="comment info-item">评论(<span>{{ post.comment_times }}</span>)</div>
        </div>
      </nuxt-link>
      <div class="pagination">
        <div class="last">
          <nuxt-link :to="`/?page=${page-1}`" v-if="page > 1">上一页</nuxt-link>
        </div>
        <div class="page-no">{{ page }} / {{ totalPage }}</div>
        <div class="next">
          <nuxt-link :to="`/?page=${page+1}`" v-if="page < totalPage">下一页</nuxt-link>
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
    return api.getPosts({
      page: +(query.page || 1)
    }).then(res => {
      if (res.status === 200) {
        let { list, total, page, perPage } = res.data
        return { list, total, page, perPage }
      } else {
        error('404', '页面找不到了哦')
      }
    }).catch(e => {
      error('501', '服务器错误')
    })
  },
  fetch () {},
  computed: {
    totalPage () {
      return Math.ceil(this.total / this.perPage)
    },
    typeInfo () {
      return this.$store.getters['postType/typeInfo']
    }
  }
}
</script>

<style lang="stylus" scoped>
.home-page
  .post-list
    margin 0 auto
    .post
      display block
      color #333
      background #FAFBFC
      &+.post
        margin 10px 0
      .post-abstract
        .post-title
          color #2d8cf0
        .post-abstract-content
          color #777
        .post-info-common
          .post-type
            align-self center
            margin-right 20px
            color #FFA710
            font-weight bold
            border-radius 2px
            // padding 6px 10px
          .post-date
            line-height 3
      .post-abstract-image
        display flex
        align-items center
        justify-content center
        overflow hidden
        box-shadow 0 0 1px 0 rgba(0, 0, 0, .05)
        img
          width 100%
          height 100%
      &:hover
        .post-abstract-image img
          width 110%
          height 110%
          transition all .5s ease-out
      .post-info-pc, .post-info-mobile
        display flex
        margin-top 1em
        .info-item
          span
            color #777
            text-decoration underline
          &+.info-item
            &::before
              content '·'
              margin 0 5px

    .pagination
      display flex
      justify-content space-between
      font-weight bold
      padding 20px 10px
      color #333
      font-size 18px
      .last, .next
        text-decoration underline
        width 4em
      .next
        text-align right

@media screen and (min-width: 600px)
  .home-page
    .post-list
      max-width 1000px
      margin 0 auto
      .post
        padding 30px 40px
        box-shadow 0 0 3px 0 rgba(0, 0, 0, .3)
        display flex
        .post-abstract
          flex auto
          font-size 16px
          margin-right 10px
        .post-abstract-image
          align-self center
          width 30vw
          height 20vw
          max-height 200px
          max-width 300px
          flex-shrink 0
        .post-info-mobile
          display none
        &:hover
          box-shadow 0 0 8px 0 rgba(0, 0, 0, .3)

@media screen and (max-width: 600px)
  .home-page
    .post-list
      .post
        padding 20px
        .post-abstract
          .post-info-pc
            display none
        
        .post-abstract-image
          img
            max-width 100%
</style>
