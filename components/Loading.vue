<template>
  <div class="loader-container" v-show="loading">
    <div class="loader">
      <div class="outer"></div>
      <div class="middle"></div>
      <div class="inner"></div>
    </div>
  </div>
</template>


<script>
export default {
  data () {
    return {
      loading: false
    }
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style lang="stylus">
.loader {
  position: relative;
}

.outer,
.middle,
.inner {
  border: 3px solid transparent;
  border-top-color: #3cefff;
  border-right-color: #3cefff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
}

.outer {
  width: 3.5em;
  height: 3.5em;
  margin-left: -1.75em;
  margin-top: -1.75em;
  animation: spin 2s linear infinite;
}

.middle {
  width: 2.1em;
  height: 2.1em;
  margin-left: -1.05em;
  margin-top: -1.05em;
  animation: spin 1.75s linear reverse infinite;
}

.inner {
  width: 0.8em;
  height: 0.8em;
  margin-left: -0.4em;
  margin-top: -0.4em;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>

<style lang="stylus" scoped>
.loader-container
  pointer-events none
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  // background rgba(0, 0, 0, .3)
  z-index 99
  display flex
  align-items center
  justify-content center
</style>