<template>
  <div class="comment-input-container">
    <div class="avatar-mask">
    </div>
    <div class="avatar-large-circle"></div>
    <img
      v-if="userInfo.id"
      :src="userInfo.avatar" 
      alt="用户头像" 
      class="avatar-small-circle"
      @click.stop="clickAvatar()" />
    <div
      v-else 
      class="avatar-small-circle"
      @click.stop="clickAvatar()">
      <span>登录</span>
    </div>
    <Input 
      v-model="valueString" 
      :autosize="{
        minRows: rows,
        maxRows: 10
      }"
      :placeholder="placeholder" 
      type="textarea" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 4
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      valueString: ''
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  watch: {
    value () {
      this.valueString = this.value
    },
    valueString (newValue, oldValue) {
      this.$emit('input', this.valueString)
    }
  },
  created () {
    if (this.value) {
      this.valueString = this.value
    }
  },
  methods: {
    clickAvatar () {
      if (this.userInfo.id) {
        this.$bus.$emit('click-avatar', this.userInfo.id)
      } else {
        this.$bus.$emit('login-show')
      }
    }
  }
}
</script>

<style lang="stylus">
$height = 4rem

.comment-input-container
  position relative
  z-index 1
  .avatar-mask
    height 3rem
    position relative
    z-index 2
  .avatar-large-circle
    height 4rem
    width 4rem
    position absolute
    z-index 1
    border 1px solid #57a3f3
    border-radius 50%
    top 0
    left 2rem
    background white
  .avatar-small-circle
    height 3rem
    width 3rem
    border-radius 50%
    position absolute
    border 1px solid #57a3f3
    z-index 3
    left 2.5rem
    top .5rem
    display flex
    align-items center
    justify-content center
    cursor pointer
    background white
    user-select none
    overflow hidden
    &:hover
      color #3361d8
    &:active
      span
        position relative
        top 1px
        text-shadow 0 0 1px #3361d8
  .ivu-input
    border-color #57a3f3 !important
    padding .5rem
    padding-top 1.5rem
</style>
