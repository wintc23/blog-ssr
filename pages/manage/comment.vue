<template>
  <div class="comment-manage-container">
    <div class="container">
      <div class="comment-table" ref="container">
        <div class="table-container">
          <Table :height="tableHeight" stripe border :columns="columns" :data="commentList"></Table>
        </div>
      </div>
      <div class="pagination">
        <Page :total="commentTotal" :page-size="perPage" @on-change="getCommentList" show-elevator :current="currentPage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/comment'

const PER_PAGE = 20

export default {
  data () {
    return {
      tableHeight: 0,
      perPage: PER_PAGE,
      commentList: [],
      commentTotal: 0,
      currentPage: 1,
      columns:[
        {
          title: '评论文章',
          key: 'postTitle'
        },
        {
          title: '评论内容',
          key: 'body'
        },
        {
          width: 150,
          title: '用户',
          key: 'author',
          align: 'center',
          render: (h, { row: { authorId: userId } }) => {
            return h('avatar', {
              props: {
                userId
              },
              scopedSlots: {
                default: props => h('div', props.userinfo.username)
              }
            })
          }
        },
        {
          title: '链接',
          render: (h, { row: { id: commentId, postId: id } }) => {
            const to = {
              path: `/article/${id}`,
              query: { commentId }
            }
            const { href } = this.$router.resolve(to)
            return h('nuxt-link', {
              props: { to }
            }, href)
          }
        },
        {
          title: '评论时间',
          key: 'time',
          align: 'center',
          width: 150,
          render: (h, { row: { timestamp } }) => {
            return h('div', this.$formatTime(timestamp))
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 150,
          render: (h, { row }) => {
            let passButton = h('Button', {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.setCommentShow(row)
                }
              }
            }, '通过')

            let deleteButton = h('Button', {
              props: {
                type: 'error',
                size: 'small'
              },
              on: {
                click: () => {
                  this.deleteComment(row)
                }
              }
            }, '删除')
            let buttonList = [deleteButton]
            if (row.hide) {
              buttonList.unshift(passButton)
            }
            return h('div', buttonList)
          }
        }
      ]
    }
  },
  mounted () {
    this.getCommentList()
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
    getCommentList (page = 0) {
      page = page || this.currentPage
      api.getComments({ page, per_page: PER_PAGE }).then(res => {
        if (res.status == 200) {
          this.commentList = res.data.list
          this.commentTotal = res.data.total
          this.currentPage = res.data.page
        }
      })
    },
    setCommentShow (comment) {
      api.setCommentShow(comment.id).then(res => {
        res.status == 200 && this.getCommentList()
      })
    },
    deleteComment (comment) {
      this.$confirm(`<div style="text-align: center; margin-bottom: 1rem">确定删除该评论吗？</div><div>${comment.body}</div>`, () => {
        api.deleteComment(comment.id).then(res => {
          res.status == 200 && this.getCommentList()
        })
      })
    }
  },
}
</script>

<style lang="stylus" scoped>
.comment-manage-container
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
  .pagination
    flex-shrink 0
    margin .5rem
    border-top 1px solid #A9A9A9
    padding .5rem
    text-align center
  .comment-table
    flex auto
    overflow auto
    padding .5rem
    border-radius 4px
    position relative
    .table-container
      position absolute
      left 0
      right 0
      bottom 0
      top 0
</style>
