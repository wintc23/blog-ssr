<template>
  <div class="comment-manage-container">
    <div class="container">
      <div class="comment-table">
        <Table stripe border :columns="columns" :data="commentList"></Table>
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
      perPage: PER_PAGE,
      commentList: [],
      commentTotal: 0,
      currentPage: 1,
      columns:[{
        title: '评论内容',
        key: 'body'
      },
      {
        width: 150,
        title: '用户',
        key: 'author',
        align: 'center',
        render: (h, params) => {
          let comment = this.commentList[params.index]
          let userId = comment ? comment.author_id : ''
          return h('avatar', {
            props: {
              userId: params.row.author_id
            },
            scopedSlots: {
              default: props => h('div', props.userinfo.username)
            }
          })
        }
      },
      {
        title: '评论时间',
        key: 'time',
        align: 'center',
        width: 150,
        render: (h, params) => {
          return h('div', this.$formatTime(params.row.timestamp))
        }
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 150,
        render: (h, params) => {
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
                this.setCommentShow(params.row)
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
                this.deleteComment(params.row)
              }
            }
          }, '删除')
          let buttonList = [deleteButton]
          if (this.commentList[params.index].hide) {
            buttonList.unshift(passButton)
          }
          return h('div', buttonList)
        }
      }]
    }
  },
  mounted () {
    this.getCommentList()
  },
  methods: {
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
</style>
