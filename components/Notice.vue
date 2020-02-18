<template>
  <Tooltip v-show="show" class="tip" placement="top" max-width="300px" content="您可以点击头像设置您的邮箱，以便及时收到关于您的回复。">
    <Icon class="icon" type="ios-alert-outline" />
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
  .icon
    color #FFA710
    display flex
    align-items center
    justify-content center
    height 1em
    font-size 20px
</style>
