<template>
  <div class="about-page">
    <div class="about-me ws post-body">
      <div class="content" v-html="aboutMe.bodyHtml">
      </div>
    </div>
  </div>
</template>

<script>
import { getAboutMe } from '@/api/posts'

export default {
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return getAboutMe().then(res => {
      if (res.status == 200) {
        return {
          aboutMe: res.data
        }
      } else {
        error({ statusCode: 404, message: '页面找不到了哦' })
      }
    }).catch(e => {
      error({ statusCode: 501, message: '服务器出错啦' })
    })
  },
  mounted() {
    this.$bus.$emit('baidu-push')
  }
}
</script>

<style lang="stylus" scoped>

.about-me
  color #333
  background #fff
  border-radius 2px
  .content
    padding 2rem
    font-size 1rem
    line-height 1.6

@media screen and (max-width: 600px)
  .about-me
    .content
      padding 0 1rem
</style>
