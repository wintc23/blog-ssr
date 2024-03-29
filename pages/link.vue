<template>
  <div class="page-link-list">
    <div class="sub-page-header ws">
      友情链接
    </div>
    <client-only>
      <transition name="link">
        <div class="upload-link" v-show="showNotice">
          <div class="notice">
            <span
              class="submit-btn"
              @click.stop="createLink">
              提交链接</span>可在本站添加友链，同时期待您将本站链接添加到您的站点。本站友链将在首页侧边栏和本页展示。
          </div>
          <div class="info-label">本站信息
            <Tooltip :content="`一键复制本站信息（json格式）`" placement="top" transfer>
              <Icon
                v-click-copy="{
                  text: siteinfoJsonString,
                  notifyText: `已复制站点信息json文本`,
                }"
                type="md-copy"
                class="icon"
              />
            </Tooltip>
            <div class="placeholder"></div>
          </div>
          <div class="site-info">
            <div class="item" v-for="info of siteinfoList" :key="info.key">
              <div class="label">{{ info.name }}</div>
              <div class="content">{{ info.value }}</div>
            </div>
          </div>
        </div>
      </transition>
    </client-only>
    <div class="link-list">
      <div class="link"
        v-for="link of list"
        :key="link.id">
        <div class="logo">
          <img :src="link.logo" alt="" v-if="link.logo">
          <Icon class="icon" type="ios-link" />
        </div>
        <div class="menu-list" v-if="currentUser.admin || currentUser.id == link.authorId">
          <Icon
            @click.stop="editLink(link)"
            class="icon edit"
            title="编辑"
            type="md-color-wand" />
          <Icon
            @click.stop="deleteLink(link)"
            class="icon delete"
            v-if="currentUser.admin"
            title="删除"
            type="ios-trash" />
        </div>
        <div
          :class="{
            info: true,
            'no-motto': !link.motto
          }">
          <div class="href">
            <a class="title" :href="link.link" target="_blank">{{ link.title }}</a>
            <Tag
              class="tag"
              color="orange"
              v-if="link.hide"
              title="管理员验证后公开，当前仅自己和管理员可见">
              待验证
            </Tag>
          </div>
          <div class="motto" v-if="link.motto">{{ link.motto }}</div>
        </div>
      </div>
    </div>
    <client-only>
      <Modal
        :title="modalTitle"
        v-model="modalShow">
        <div class="link-edit-container">
          <div class="item">
            <div class="label">显示名称(必填)</div>
            <Input v-model="model.title" />
          </div>
          <div class="item">
            <div class="label">站点地址(必填)</div>
            <Input v-model="model.link" />
          </div>
          <div class="item">
            <div class="label">描述</div>
            <Input v-model="model.motto" />
          </div>
          <div class="item">
            <div class="label">显示logo{{ model.logo ? '（点击图片更换）'　: '' }}</div>
            <div class="logo-container">
              <div @click.stop="uploadLogo">
                <img :src="model.logo" alt="" v-if="model.logo">
                <Button type="success" size="small" v-else>点击上传</Button>
              </div>
            </div>
          </div>
          <div class="item" v-if="currentUser.admin">
            <div class="label">关联用户</div>
            <div class="author-container">
              <div class="exchange">
                <span class="title">搜索切换</span>
                <Select
                  v-if="modalShow"
                  v-model="model.authorId"
                  :remote-method="searchUsers"
                  remote
                  :loading="loading"
                  filterable>
                  <Option
                    v-for="user of userList"
                    :label="user.username"
                    :value="user.id"
                    :key="user.id">
                  </Option>
                </Select>
              </div>
              <div class="current">
                <span class="title">当前用户</span>
                <avatar class="avartar" :userId="model.authorId" v-if="model.authorId">
                  <template v-slot:default="{ userinfo }">
                    <img :src="userinfo.avatar" alt="">
                    <span class="username">{{ userinfo.username }}</span>
                  </template>
                </avatar>
              </div>
            </div>
          </div>
        </div>
        <div class="menu" slot="footer">
          <Button type="text" @click.stop="hideEdit">取消</Button>
          <Button type="primary" @click.stop="saveLink">保存</Button>
        </div>
      </Modal>
    </client-only>
  </div>
</template>

<script>
import * as api from '@/api/link'
import { searchUsers } from '@/api/user'
import avatar from '@/components/Avatar'

export default {
  watchQuery: true,
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return api.getLinkList().then(res => {
      if (res.status === 200) {
        let { list } = res.data
        return { list }
      } else {
        error('404', '页面弄丢了哦')
      }
    }).catch(e => {
      console.log(e)
      error('501', '服务器错误')
    })
  },
  head () {
    return {
      title: `${this.$site.title} - ${this.$site.slogon}`,
      meta: [
        { hid: 'keywords', name: 'keywords', content: `${this.$site.keywords}` },
        { hid: 'description', name: 'description', content: `${this.$site.description}` }
      ]
    }
  },
  components: {
    avatar
  },
  data () {
    return {
      model: {
        id: '',
        title: '',
        link: '',
        motto: '',
        logo: '',
        authorId: ''
      },
      modalShow: false,

      loading: false,
      userList: [],
      timer: 0,
      showNotice: false
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
  },
  computed: {
    modalTitle () {
      if (this.model.id) return `友链编辑`
      return `创建友链`
    },
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    siteinfoList () {
      return [
        {
          name: '名称',
          key: 'name',
          value: this.$site.title,
        },
        {
          name: '简介',
          key: 'slogon',
          value: this.$site.slogon,
        },
        {
          name: '地址',
          key: 'url',
          value: this.$site.url,
        },
        {
          name: '图标',
          key: 'icon',
          value: this.$site.icon,
        },
      ];
    },
    siteinfoJsonString () {
      const json = {};
      this.siteinfoList.forEach(({ key, value }) => {
        json[key] = value
      })
      
      console.log(JSON.stringify(json, null, 4), 'wtttt')
      return JSON.stringify(json, null, 4)
    }
  },
  mounted () {
    this.$bus.$emit('baidu-push')
    this.$nextTick(() => {
      this.showNotice = true
    })
  },
  methods: {
    showEdit () {
      this.modalShow = true
    },
    hideEdit () {
      this.modalShow = false
      this.clearModel()
    },
    clearModel () {
      for (let key in this.model) this.model[key] = ''
    },
    createLink () {
      if (!this.currentUser.id) {
        this.$bus.$emit('login-show')
        this.$Message.info('请先登录后再操作')
        return
      }
      this.clearModel()
      this.showEdit()
    },
    editLink (data) {
      for (let key in this.model) this.model[key] = data[key]
      this.showEdit()
    },
    saveLink () {
      api.saveLink(this.model).then(res => {
        if (res.status === 200) {
          this.refreshPage()
          this.hideEdit()
        }
      })
    },
    deleteLink (link) {
      this.$confirm(`确定删除友链“${link.title}”吗`, () => {
        api.deleteLink(link.id).then(res => {
          if (res.status == 200) {
            this.refreshPage()
          }
        })
      })
    },
    refreshPage () {
      this.$router.push({
        name: 'link',
        query: {
          refresh: this.$route.query.refresh ? undefined : 1
        }
      })
    },
    searchUsers (keyword) {
      if (!keyword) return
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.timer = 0
        this.loading = true
        searchUsers(keyword).then(res => {
          if (res.status == 200) {
            this.userList = res.data.list || []
          }
        }).finally(() => {
          this.loading = false
        })
      }, 200)
    },

    uploadLogo () {
      let input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.onchange = () => {
        let file = input.files[0]
        if (!file) return
        this.blobToImg(file).then(img => {
          this.resizeImage(img).then(newFile => {
            let reader = new FileReader()
            reader.addEventListener('load', () => {
              this.model.logo = reader.result
            })
            reader.readAsDataURL(newFile)
          })
        })
      }
      input.click()
    },

    blobToImg (blob) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.addEventListener('load', () => {
          let img = new Image()
          img.src = reader.result
          img.addEventListener('load', () => resolve(img))
        })
        reader.readAsDataURL(blob)
      })
    },

    resizeImage (img) {
      let canvas = document.createElement('canvas')
      canvas.width = 100
      canvas.height = 100
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      return new Promise((resolve, reject) => {
        canvas.toBlob(blob => resolve(blob))
      })
    }

  }
}
</script>

<style lang="stylus" scoped>
.page-link-list
  .upload-link
    background #fff
    padding 10px 15px 10px 20px
    margin-bottom 10px
    color #333
    position relative
    &::before
      content ''
      background #19be6b
      width 8px
      position absolute
      left 0
      top 0
      bottom 0
    .info-label
      display flex
      align-items center
      font-weight bold
      margin 10px 0 5px 0
      color #333
      .icon
        margin-left 4px
        font-size 18px
        color #666
        padding 4px
        display flex
        align-items center
        justify-content center
        cursor pointer
        border-radius 4px
        animation background .2s ease-out
        &:hover
          background rgba(0, 0, 0, .1)
        &:active
          background rgba(0, 0, 0, .15)
    .notice
      line-height 1.6
      .submit-btn
        color rgba(64, 158, 255, 1)
        text-decoration underline
        cursor pointer
        user-select none
    .site-info
      font-size 14px
      .item
        display flex
        .label
          color #333
          margin-right .5em
          line-height 1.6
          flex-shrink 0
          user-select none

        .content
          font-weight bold
          flex auto
          color #333
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
    .menu
      line-height 2.5
      border-top 1px solid #ddd

  .link-list
    background #fff
    .link
      padding 10px
      overflow hidden
      &+.link
        border-top 1px solid #ddd
      .logo
        float left
        margin-right 10px
        width 50px
        height 50px
        box-shadow 0 0 5px 0 rgba(0, 0, 0, .3)
        border-radius 50%
        overflow hidden
        img, .icon
          width 100%
          height 100%
          line-height 0
        .icon
          display flex
          align-items center
          justify-content center
          font-size 32px
      .info
        overflow hidden
        position relative
        z-index 2
        &.no-motto
          .href
            min-height 50px
            display flex
            align-items center
        .href
          font-size 16px
          .tag
            margin-left 4px
          a:hover
            text-decoration underline

        .motto
          font-size 13px
          // padding 10px 8px
          // background #eee
          margin 4px 0
      .menu-list
        float right
        font-size 24px
        .icon
          color #ff9900
          height 24px
          width 24px
          display inline-flex
          align-items center
          justify-content center
          padding-left 5px
          cursor pointer
          border-radius 4px
          &:hover
            background #eee
        .delete
          color #ed4014

.link-edit-container
  .item
    .label
      color #3361d8
      font-weight bold
    &+.item
      margin-top 15px
    .logo-container
      div
        display inline-block
    .author-container
      .current, .exchange
        display flex
        align-items center
        margin-top 10px
        .title
          margin-right 20px
      .avartar
        display flex
        align-items center
        img
          width 25px
          height 25px
          margin-right 5px
        .username
          font-weight bold
      
      .exchange
        display flex
        align-items center
        span
          flex-shrink 0
          
.link-enter-active, .link-leave-active
  transition all .8s ease .2s
.link-enter, .link-leave-to
  opacity 0
  transform translateY(-10%)
.link-enter-to, .link-leave
  opacity 1
  transform translateY(0)
</style>
