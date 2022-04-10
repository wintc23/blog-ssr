<template>
  <div class="recommendation-list">
    <recommendation-card
      v-for="(recommendation, idx) of recommendations"
      :config="recommendation"
      :key="idx">
    </recommendation-card>
  </div>
</template>

<script>
import { SITE_RECOMMENDATION } from './data'
import RecommendationCard from './card'

export default {
  components: {
    RecommendationCard,
  },
  data () {
    return {
      recommendations: SITE_RECOMMENDATION.list,
    }
  }
}
</script>

<style lang="stylus" scoped>
.recommendation-list
  padding-bottom 300px
</style>