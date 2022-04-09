<template>
  <div class="recommendation-list">
    <div
      v-for="(item, idx) of recommendation.list"
      class="recommendation-item"
      :key="idx">
      <Tooltip :content="item.tip" :disabled="!item.tip" placement="bottom">
        <a
          class="recommendation-item-container"
          target="_blank"
          :href="item.href"
          >
          <div class="recommendation-item-inner">
            <div class="item-title">{{item.title}}</div>
            <div class="item-description">{{ item.description }}</div>
          </div>
        </a>
      </Tooltip>
    </div>
  </div>
</template>

<script>
import { SITE_RECOMMENDATION } from './data.js'

export default {
  data () {
    return {
      recommendation: SITE_RECOMMENDATION,
    }
  }
}
</script>

<style lang="stylus" scoped>
.recommendation-list
  display flex
  .recommendation-item
    cursor pointer
    width 0
    flex auto
    margin-right 10px
    >>>
      .ivu-tooltip, .ivu-tooltip-rel
        display block
    .recommendation-item-inner
      border-radius 2px
      background #fafbfc
      padding 4px
      border 1px solid rgba(64, 158, 255, .5)
      position relative
      transition all .1s ease-out
      top 0
    &:hover
      .recommendation-item-inner
        top -2px
        background rgba(64, 158, 255, .1)
    .item-title
      font-size 12px
      color #333
      font-weight bold
    .item-description
      font-size 12px
      color #666

</style>