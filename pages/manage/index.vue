<template>
  <div class="article-manage-container">
    <div class="container">
      <div class="article-menu">
        <Button type="success" size="small" @click.stop="addPost">添加文章</Button>
        <Select @on-change="changeType" :value="+currentType" class="type-select" size="small">
          <Option v-for="type of typeList" :value="type.id" :key="type.id">{{ type.name }}</Option>
        </Select>
      </div>
      <div class="article-table" ref="container">
        <div class="table-container">
          <Table :height="tableHeight" border :columns="columns" :data="postList"></Table>
        </div>
      </div>
      <div class="pagination">
        <Page :total="totalCount" :page-size="perPage" @on-change='choosePage' show-elevator :current="currentPage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import { getPostsByType, deletePost, addPost } from '@/api/posts'

const PER_PAGE = 20

export default {
  watchQuery: ['page', 'type', 'refresh'],
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    let { type, page = 1} = query
    let data = {
      per_page: PER_PAGE,
      post_type: +type,
      page: +page
    }
    return getPostsByType(data).then(res => {
      if (res.status == 200) {
        let {
          list: postList,
          total: totalCount,
          page: currentPage,
        } = res.data
        return { postList, totalCount, currentPage }
      }
    })
  },
  data () {
    return {
      perPage: PER_PAGE,
      tableHeight: 0,
      columns: [{
        title: '标题',
        key: 'title'
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        align: 'center',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.editPost(params.index)
                }
              }
            }, '编辑'),
            h('Button', {
              props: {
                type: 'error',
                size: 'small',
              },
              on: {
                click: () => {
                  this.deletePost(params.index)
                }
              }
            }, '删除')
          ])
        }
      }]
    }
  },
  computed: {
    typeList () {
      return this.$store.getters['postType/manageList']
    },
    currentType () {
      if (this.$route.query.type) return this.$route.query.type
      let type = this.typeList.find(item => item.default)
      if (type) return type.id
      return ''
    }
  },
  created () {
    this.$store.dispatch('postType/getType')
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
    editPost (idx) {
      let post = this.postList[idx]
      this.$router.push({
        name: 'manage-article',
        query: { postId: post.id }
      })
    },
    deletePost (idx) {
      let post = this.postList[idx]
      this.$confirm(`确定删除文章《${post.title}》吗？`, () => {
        deletePost(post.id).then(res => {
          if (res.status == 200) {
            this.refreshPage({
              refresh: this.$route.query.refresh == 0 ? 1 : 0
            })
          }
        }).catch(error => {
          console.log(error)
          this.$Message.error('删除文章出错')
        })
      })
    },
    addPost () {
      addPost(this.currentType).then(res => {
        if (res.status == 200) {
          let { post_id } = res.data
          this.$router.push({
            name: 'manage-article',
            query: {
              postId: post_id
            }
          })
        }
      })
    },
    choosePage (page) {
      this.refreshPage({ page })
    },
    changeType (type) {
      this.refreshPage({ type, page: '1' })
    },
    refreshPage (queryData) {
      let query = Object.assign({}, this.$route.query, queryData)
      this.$router.push({
        name: 'manage',
        query
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.article-manage-container
  position relative
  background #C9C9C9
  .container
    position absolute
    top .5rem
    bottom .5rem
    left .5rem
    right .5rem
    background white
    border-radius 4px
    display flex
    flex-direction column
    .article-menu, .pagination
      flex-shrink 0
      padding .5rem
    .pagination
      text-align center
      border-top 1px solid #D2D2D2
    .article-menu
      border-bottom 1px solid #D2D2D2
      .type-select
        width 6rem
    .article-table
      flex auto
      padding .5rem
      overflow auto
      position relative
    .table-container
      position absolute
      left 0
      right 0
      bottom 0
      top 0
</style>

