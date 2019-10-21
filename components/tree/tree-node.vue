<template>
  <div class="tree-node-container">
    <slot></slot>
    <div class="tree-node-children" v-if="nodeData.children && nodeData.children.length">
      <tree-node
        v-for="(child, idx) of nodeData.children"
        :nodeData="child"
        :key="idx">
      </tree-node>
    </div>
  </div>
</template>

<script>

export default {
  name: 'tree-node',
  props: {
    nodeData: {
      type: Object,
      required: true
    }
  },
  components: {
    'node-content': {
      render (h) {
        let parent = this.$parent
        let tree = parent.tree
        let data = parent.nodeData
        let level = parent.level
        let slot = tree.$scopedSlots.default
        return (slot ? slot({ data, level }) : '<div>未定义插槽内容</div>')
      }
    }
  },
  props: {
    nodeData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      tree: false,
      level: 0,
    }
  },
  created () {
    let parent = this.$parent
    this.level = parent.level + 1
    while (parent && !parent.isTree) {
      parent = parent.$parent
    }
    this.tree = parent
  }
}
</script>

