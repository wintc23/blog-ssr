<template>
  <outline-tree :treeData="navTree" class="tree" ref="tree">
    <template v-slot:default="{ data }">
      <div
        class="node-render-content"
        @click.stop="jumpToAnchor(data.el)">
        <span>{{ data.title }}</span>
      </div>
    </template>
  </outline-tree>
</template>

<script>
export default {
  computed: {
    navTree () {
      return this.$store.getters['outline/list']
    }
  },
  methods: {
    jumpToAnchor (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  },
}
</script>

<style lang="stylus">
.node-render-content
  span
    cursor pointer
    &:hover
      text-decoration underline
      color #4791ff
</style>