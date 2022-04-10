<template>
  <div :class="['recommendation-card', 'ws', config.direction || '']">
    <template v-if="config.img">
      <div class="img-container">
        <img :src="config.img" :alt="config.img">
      </div>
      <div class="divider"></div>
    </template>
    <div class="text-container">
      <div class="header">
        <div class="title">{{ config.title }}</div>
        <div class="description">{{ config.description }}</div>
      </div>
      <div class="content">
        <div class="introduce">
          <div
            class="introduce-item"
            v-for="(item, idx) of config.introduce"
            :key="idx">
            {{ item }}
          </div>
        </div>
        <a class="link" :href="config.href" target="_blank">
          <Button class="link-btn" type="primary">{{ config.linkText }}</Button>
        </a>
      </div>
      <div class="footer" v-if="config.more">
        <div class="more-list">
          <a
            v-for="(item, idx) of config.more"
            target="_blank"
            :href="item.href"
            class="more-item"
            :key="idx">
            {{ item.title }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      required: true,
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.recommendation-card
  display flex
  background #fff
  border-radius 2px
  overflow hidden
  &+.recommendation-card
    margin-top 10px
  &.rtl
    .img-container
      order 3
    .divider
      order 2
    .text-container
      order 1
  .img-container
    width 40%
    flex-shrink 0
    max-width 300px
    img
      width 100%
      vertical-align middle
  .divider
    border-left 1px solid #EEF0F0
  .text-container
    flex auto
    display flex
    flex-direction column
    .header
      padding var(--padding)
      display flex
      align-items center
      border-bottom 1px solid #e8eaec
      .title
        color #333
        font-weight bold
        font-size var(--title-fz)
      .description
        color #666
        margin-left 1em
        font-size var(--des-fz)
    .content
      padding var(--padding)
      flex auto
      font-size var(--content-fz)
      .introduce
        .introduce-item
          background #ECF5FD
          border-radius 4px
          padding var(--introduce-item-padding) 10px
          max-width 300px
          &+.introduce-item
            margin-top var(--introduce-item-margin)
      .link
        margin-top 1em
        display inline-block
        .link-btn
          min-width 100px
          font-size var(--link-btn-fz)
    .footer
      padding 10px var(--padding)
      flex-shrink 0
      .more-list
        display flex
        &::before
          content ''
          width 4px
          background #19be6b
          margin-right 10px
        .more-item
          color #666
          margin-right 10px
          position relative
          overflow hidden
          display flex
          align-items center
          transition all .2s ease-in-out
          &::before
            content ''
            border 2px solid currentColor
            border-radius 50%
            margin 0 4px
          &::after
            position absolute
            content ''
            height 2px
            transition all .2s ease-in-out
            left 0
            bottom 0
            right 0
            transform translateX(-100%)
            background currentColor
          &:hover
            color #4791ff
            &::after
              transform translateX(0)

@media screen and (min-width: 600px)
  .recommendation-card
    --padding 20px
    --title-fz 18px
    --des-fz 14px
    --content-fz 16px
    --introduce-item-padding 10px
    --introduce-item-margin 10px
    --link-btn-fz 14px

@media screen and (max-width: 600px)
  .recommendation-card
    --padding 8px
    --title-fz 14px
    --des-fz 12px
    --content-fz 14px
    --introduce-item-padding 4px
    --introduce-item-margin 5px
    --link-btn-fz 14px
</style>