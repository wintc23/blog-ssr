<template>
  <div class="layout">
    <div ref='header' class="layout-header" :class="headerClass">
      <div class="layout-header-main">
        <h1 class="site-title">
          <nuxt-link to="/" class="title-content">木马.tc个人博客222</nuxt-link>
        </h1>
        <div class="nav-list">
          <nuxt-link
            class="nav"
            v-for="(nav, idx) of navList"
            :to="nav.path"
            :key="idx">
            {{ nav.title }}
          </nuxt-link>
        </div>
      </div>
    </div>
    <div class="layout-main">
      <div class="modules">
        <div class="module">
          个人信息
        </div>
        <div class="module">
          分类导航
        </div>
        <div class="module">
          热门文章
        </div>
        <div class="module">
          文章标签
        </div>
      </div>
      <nuxt class="nuxt-container" />
    </div>
    <!-- <div class="layout-footer">
      <div class="footer-container">
        <div class="get-in-touch">
          <img src="/img/contact.png" alt="">
          <div class="contact-info">
            <div class="contact-message">我的联系方式</div>
            <div class="contact-item">
              <span class="title">QQ</span>
              <span class="content">1401618872</span>
            </div>
            <div class="contact-item">
              <span class="title">邮箱</span>
              <span class="content">lushg-tcxg@qq.com</span>
            </div>
          </div>
        </div>
        <img class="wechat" src="/img/wechat.jpeg" alt="">
      </div>
    </div> -->
    <client-only>
      <Modal
        class="login-modal"
        transfer
        v-model="loginShow"
        title="登录"
        footer-hide>
        <div slot='header' class="login-header">
          <h3>github登录</h3>
        </div>
        <div class="login-container">
          <div class="login-content">
            <Icon type="logo-github" @click.stop="loginWithGithub" class="logo-github"></Icon>
          </div>
          <div class="login-footer"></div>
        </div>
      </Modal>
    </client-only>
  </div>
</template>

<script>
import { CLIENT_ID } from '@/config'

export default {
  middleware: ['cookie'],
  data () {
    return {
      headerClass: '',
      oldScrollTop: 0,
      headerHeight: 0,
      loginShow: false,
      iFrameShow: false
    }
  },
  computed: {
    navList () {
      let list = [
        {
          title: '首页',
          path: '/'
        },
        // {
        //   title: '分类',
        //   path: '/category'
        // },
        {
          title: '留言',
          path: '/message'
        },
        {
          title: '关于',
          path: '/about'
        }
      ]
      if (this.currentUser.admin) {
        list.push({
          title: '后台管理',
          path: '/manage'
        })
      }
      return list
    },
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    githubLoginUrl () {
      let scope = "user:email"
      return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}`
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll)
    this.$store.dispatch('postType/getType')
    this.$store.dispatch('userInfo/getUserInfo')
    this.$bus.$on('login-show', this.showLogin)
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.handleScroll)
    this.$bus.$off('login-show', this.showLogin)
  },
  methods: {
    handleScroll () {
      let rect = this.$refs.header.getBoundingClientRect()
      let el = document.documentElement
      let deltaY = el.scrollTop - this.oldScrollTop
      this.oldScrollTop = el.scrollTop
      if (el.scrollTop <= rect.height) {
        this.headerClass = ''
        this.headerHeight = 0
      } else if (deltaY > 0) {
        this.headerClass = 'hide'
      } else {
        this.headerHeight = rect.headerHeight
        this.headerClass = 'show'
      }
    },
    showLogin () {
      this.loginShow = true
    },
    hideLogin () {
      this.loginShow = false
    },
    getUserInfo () {
      this.$store.dispatch('userInfo/getUserInfo')
    },
    loginWithGithub () {
      let scope = "user:email"
      let loginWIndow = window.open(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}`, 'login', 'resizable=yes,scrollbars=yes,status=yes,height=600,width=800')
      window._loginCallback = (success) => {
        if (success) {
          this.$Message.success('登录成功')
          this.hideLogin()
          loginWIndow.close()
          this.getUserInfo()
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

@keyframes show-header {
  from {
    transform translateY(-100%)
    opacity .5
  }
  to {
    transform translateY(0)
    opacity 1
  }
}

@keyframes hide-header {
  from {
    transform translateY(0)
    opacity 1
  }
  to {
    transform translateY(-100%)
    opacity .5
  }
}

.layout
  display flex
  flex-direction column
  min-height 100vh
  .layout-header
    // background rgb(0, 135, 252)
    background #3361d8
    position fixed
    left 0
    right 0
    top 0
    z-index 2
    &.hide
      transform translateY(-100%)
      animation hide-header .5s
    &.show
      animation show-header .5s
    .layout-header-main
      flex-shrink 0
      padding 0 20px
      .site-title
        .title-content
          color #FAFBFC
          font-weight 400
      .nav-list
        .nav
          font-weight bold
          color #FAFBFC
          font-size 16px
  .layout-main
    flex auto
    .nuxt-container
      // overflow hidden
    .modules
      display none
  .layout-footer
    flex-shrink 0
    background #ECF5FD
    .footer-container
      .get-in-touch
        display flex
        color #333
        .contact-info
          text-align left
          margin-left 20px
          display flex
          flex-direction column
          .contact-message
            font-size 20px
            margin 20px 0
          .contact-item
            font-size 1rem
            display flex
            .title
              margin-right 20px
              width 2rem

.login-modal
  .login-header 
    user-select none
  .login-container
    .login-content
      text-align center
      font-size 10rem
      display flex
      align-items center
      justify-content center
      padding 0
      .logo-github
        padding 1rem
        cursor pointer
        border-radius 8px
        &:hover
          background #EEF0F0
        &:active
          background #DFDFDF
          transition all .3s

@media screen and (max-width: 600px)
  .layout
    padding-top 100px
    .layout-header
      .layout-header-main
        padding 20px
        .nav-list
          .nav
            color #FFBB21
            &+.nav
              margin-left 10px
      .nuxt-container
        padding 0
    .layout-footer
      .footer-container
        padding-bottom 50px
        text-align center
        .wechat
          width 80vw
          margin 10px 0
        .get-in-touch
          margin 20px 10vw
          margin-top 30px

@media screen and (min-width: 600px)
  .layout
    padding-top 4rem
    .layout-header
      .layout-header-main
        display flex
        align-items center
        justify-content space-around
        line-height 4rem
        max-width 1000px
        margin 0 auto
        .nav-list
          .nav
            &+.nav
              margin-left 15px
    .layout-main
      max-width 1100px
      margin 0 auto
      padding 20px 10px
      width 100%
      .modules
        float left
        width 240px
        margin-right 10px
        .module
          background #FAFBFC
          padding 20px
          &+.module
            margin-top 10px

      .nuxt-container
        overflow hidden
    .layout-footer
      .footer-container
        padding-bottom 100px
        max-width 1000px
        margin 0 auto
        padding 20px
        display flex
        justify-content space-between
        .wechat
          width 160px

</style>

<style lang="stylus">
h1 
  font-size 24px
h2
  font-size 20px
h3
  font-size 18px
h4, h5, h6
  font-size 16px
</style>

<style>
html {
  /* background: linear-gradient(0deg,#021048,#1e38a3); */
  background: linear-gradient(rgba(0, 135, 252, .3), rgba(0, 135, 252, .1));
  min-height: 100%;
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  word-break: break-all;
}

body {
  background: none;
  color: #333;
  font-size: 16px;
}


*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
