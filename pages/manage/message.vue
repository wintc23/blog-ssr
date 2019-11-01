<template>
  <div class="message-manage-container">
    <div class="container">
      <div class="message-table" ref="container">
        <div class="table-container">
          <Table :height="tableHeight" stripe border :columns="columns" :data="messageList"></Table>
        </div>
      </div>
      <div class="pagination">
        <Page :total="messageTotal" :page-size="perPage" @on-change="getMessageList" show-elevator :current="currentPage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '@/api/messages' 

const PER_PAGE = 20

export default {

  data () {
    return {
      perPage: PER_PAGE,
      messageList: [],
      messageTotal: 0,
      currentPage: 1,
      tableHeight: 0,
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
          let message = this.messageList[params.index]
          let userId = message ? message.author_id : ''
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
                this.setMessageShow(params.row)
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
                this.deleteMessage(params.row)
              }
            }
          }, '删除')
          let buttonList = [deleteButton]
          if (this.messageList[params.index].hide) {
            buttonList.unshift(passButton)
          }
          return h('div', buttonList)
        }
      }]
    }
  },
  mounted () {
    this.getMessageList()
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
    getMessageList (page = 0) {
      page = page || this.currentPage
      api.getHideMessage({ page, per_page: PER_PAGE }).then(res => {
        if (res.status == 200) {
          this.messageList = res.data.list
          this.messageTotal = res.data.total
          this.currentPage = res.data.page
        }
      })
    },
    setMessageShow (message) {
      api.setMessageShow(message.id).then(res => {
        res.status == 200 && this.getMessageList()
      })
    },
    deleteMessage (message) {
      this.$confirm(`<div style="text-align: center; margin-bottom: 1rem">确定删除该评论吗？</div><div>${message.body}</div>`, () => {
        api.deleteMessage(message.id).then(res => {
          res.status == 200 && this.getMessageList()
        })
      })
    }
  },
}
</script>

<style lang="stylus" scoped>
.message-manage-container
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
  .message-table
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
