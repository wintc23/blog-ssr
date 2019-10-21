<template>
  <div class="tree-container">
    <tree-node
      v-for="(nodeData, idx) of treeData"
      :nodeData="nodeData"
      :key="idx">
    </tree-node>
  </div>
</template>

<script>
import treeNode from './tree-node'

export default {
  components: {
    treeNode
  },
  props: {
    treeData: {
      type: Array,
      requied: true
    }
  },
  data () {
    return {
      isTree: true,
      level: 0
    }
  }
}
</script>

