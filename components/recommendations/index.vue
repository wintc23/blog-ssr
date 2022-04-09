<template>
  <div class="recommendation-list">
    <div>开发中，开发中，开发中</div>
    <!-- <recommendation-aliyun class="recommendation ws"></recommendation-aliyun>
    <recommendation-lark class="recommendation ws"></recommendation-lark> -->
  </div>
</template>

<script>
import RecommendationAliyun from './aliyun';
import RecommendationLark from './lark';
export default {
  components: {
    RecommendationAliyun,
    RecommendationLark,
  },
  data () {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
.recommendation-list
  display flex
  .recommendation
    height 200px
    margin-top 10px;
    width 280px
    &.recommendation
      // 
</style>