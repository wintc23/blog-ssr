<template>
  <div>
    <div class="error-container">
      <div class="notice">抱歉，访问出错了~</div>
      <nuxt-link class="link" :to="`/?r=${Math.random()}`">返回首页</nuxt-link>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.error-container
  text-align center
  padding-top 5vh
  font-size 18px
  .notice
    margin-bottom 15px
  .link
    text-decoration underline
</style>

