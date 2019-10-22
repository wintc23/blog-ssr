<template>
  <div class="tree-node-container">
    <node-content></node-content>
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
        let slot = this.$parent.tree.$scopedSlots.default
        let { nodeData, parentData, level } = this.$parent
        console.log(nodeData.body, parentData)
        return (slot ? slot({ parentData, data: nodeData, level }) : '<div>未定义插槽内容</div>')
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
      parentData: null
    }
  },
  created () {
    let parent = this.$parent
    if (parent.isTree) {
      this.level = 1
      this.parentData = {}
    } else {
      this.level = parent.level + 1
      this.parentData = parent.nodeData
    }
    while (parent && !parent.isTree) {
      parent = parent.$parent
    }
    this.tree = parent
  }
}
</script>

