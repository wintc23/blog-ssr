<template>
  <Tooltip v-show="show" class="tip" placement="top" max-width="300px" content="您可以点击头像设置您的邮箱，以便及时收到关于您的回复。">
    <span class="container">
      <Icon class="icon" type="ios-alert-outline" />
      <span class="content">请设置邮箱</span>
    </span>
  </Tooltip>
</template>

<script>
export default {
  props: {
    userId: {
      required: true
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    show () {
      if (!this.currentUser.id) return false
      if (this.currentUser.email) return false
      return this.currentUser.id === this.userId
    }
  }
}
</script>

<style lang="stylus" scoped>
.tip
  display flex
  align-items center
  height 1em
  .container
    display inline-flex
    align-items center
    color #FFA710
    align-items flex-end
    .icon
      display flex
      align-items center
      justify-content center
      height 1em
      font-size 20px
    .content
      font-size 12px
</style>
