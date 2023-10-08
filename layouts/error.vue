<template>
  <div class="page-error">
    <div class="notice-container">
      <div class="notice-icon">
        <Icon type="ios-alert-outline" />
      </div>
      <div class="notice-text">抱歉，访问出错了~</div>
      <nuxt-link class="link" :to="`/?r=${Math.random()}`">
        <Button type="primary">返回首页</Button>
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.page-error
  display flex
  flex-direction column
  align-items center
  &::before, &::after
    content ''
  &::before
    flex-grow 2
  &::after
    flex-grow 5
  .notice-container
    text-align center
    color #666
    .notice-icon
      text-align center
      font-size 50px
    .notice-text
      font-size 18px
      margin-bottom 15px
</style>

