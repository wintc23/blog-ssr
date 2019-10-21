<template>
  <div>
    <client-only>
      <slot v-if="userinfo" :userinfo="userinfo"></slot>
    </client-only>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  props: {
    userId: {
      type: Number,
      required: true
    }
  },
  computed: {
    userinfo () {
      return this.$store.state.user.info[this.userId] || null
    }
  },
  watch: {
    userId: {
      immediate: true,
      handler () {
        this.refreshInfo()
      }
    }
  },
  methods: {
    ...mapActions({
      getInfo: 'user/getInfo'
    }),
    refreshInfo () {
      process.client && this.userId && this.getInfo({ id: this.userId })
    }
  }
}
</script>
