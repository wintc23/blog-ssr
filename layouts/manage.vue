<template>
  <nuxt/>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('userInfo/getUserInfo')
  }
}
</script>
