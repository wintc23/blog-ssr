<template>
  <div class="page-recommendation">
    <div class="sub-page-header ws">{{ pageTitle }}</div>
    <recommendations></recommendations>
  </div>
</template>

<script>
import recommendations from '@/components/recommendations/index'
import { RECOMMENDATION_TITLE } from '@/config'
  
export default {
  components: {
    recommendations,
  },
  data () {
    return {
      pageTitle: RECOMMENDATION_TITLE,
    }
  }
}
</script>


