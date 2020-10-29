<template>
  <div class="topic-manage-container">
    <div class="topic-container">
      <div class="label">
        专题
        <Button size="small" type="success" @click.stop="addTopic">+添加</Button>
      </div>
      <div class="topic-list-container" ref="container">
        <div class="topic-table">
          <Table :height="tableHeight" :columns="columns" :data="topicList">
            <template v-slot:title="{ row, index }">
              <Input @on-blur="updateTopic(topicList[index])" class="input" v-model="topicList[index].title" />
            </template>
            <template v-slot:menu="{ index }">
              <Button type="error" size="small" @click="deleteTopic(topicList[index])">删除</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <div class="tag-container">
      <div class="label">
        标签
        <Button size="small" type="success" @click.stop="addTag">+添加</Button>
      </div>
      <div class="tag-list-container">
        <div class="tag-table">
          <Table :height="tableHeight" :columns="columns" :data="tagList">
            <template v-slot:title="{ row, index }">
              <Input @on-blur="updateTag(tagList[index])" class="input" v-model="tagList[index].title" />
            </template>
            <template v-slot:menu="{ index }">
              <Button type="error" size="small" @click="deleteTag(tagList[index])">删除</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as tagApi from '@/api/tag'
import * as topicApi from '@/api/topic'

export default {
  data () {
    return {
      tableHeight: 0,
      columns: [
        {
          title: '名称',
          slot: 'title'
        },
        {
          title: '相关文章',
          key: 'postCount',
          width: 100
        },
        {
          title: '操作',
          slot: 'menu',
          width: 100
        }
      ]
    }
  },
  computed: {
    tagList () {
      let list = this.$store.getters['topic/tags']
      return JSON.parse(JSON.stringify(list))
    },
    topicList () {
      let list = this.$store.getters['topic/topics']
      return JSON.parse(JSON.stringify(list))
    }
  },
  mounted () {
    this.calTableHeight()
    window.addEventListener('resize', this.calTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calTableHeight)
  },
  methods: {
    calTableHeight () {
      if (!this.$refs.container) return
      let rect = this.$refs.container.getBoundingClientRect()
      this.tableHeight = rect.height
    },
    getTagList() {
      this.$store.dispatch('topic/getTagList', { force: true })
    },
    getTopicList() {
      this.$store.dispatch('topic/getTopicList', { force: true })
    },
    addTopic () {
      topicApi.addTopic({ title: '' }).then(res => {
        res.status === 200 && this.getTopicList()
      })
    },
    deleteTopic (topic) {
      this.$confirm(`确定删除专题${topic.title}吗？`, () => {
        topicApi.deleteTopic(topic.id).then(res => {
          res.status === 200 && this.getTopicList()
        })
      })
    },
    updateTopic (topic) {
      let params = {
        id: topic.id,
        title: topic.title
      }
      topicApi.updateTopic(params).then(res => {
        res.status === 200 && this.getTopicList()
      })
    },
    addTag () {
      tagApi.addTag({ title: '' }).then(res => {
        res.status === 200 && this.getTagList()
      })
    },
    deleteTag (tag) {
      this.$confirm(`确定删除标签${tag.title}吗？`, () => {
        tagApi.deleteTag(tag.id).then(res => {
          res.status === 200 && this.getTagList()
        })
      })
    },
    updateTag (tag) {
      let params = {
        id: tag.id,
        title: tag.title
      }
      tagApi.updateTag(params).then(res => {
        res.status === 200 && this.getTagList()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.topic-manage-container
  padding .5rem
  display flex
  overflow hidden
  .topic-container, .tag-container
    width 50%
    margin 0 .5rem
    background #fff
    box-shadow 0 0 10px 0 rgba(0, 0, 0, .4)
    display flex
    flex-direction column
    overflow hidden
    .label
      flex-shrink 0
      display flex
      align-items center
      padding 5px 10px
      justify-content space-between
    .tag-list-container, .topic-list-container
      flex auto
      position relative
      .topic-table
        position absolute
        left 0
        right 0
        bottom 0
        top 0
</style>
