<template>
  <client-only>
    <nuxt/>
  </client-only>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('userInfo/getUserInfo')
    this.$store.dispatch('topic/getTagList')
    this.$store.dispatch('topic/getTopicList')
  }
}
</script>
