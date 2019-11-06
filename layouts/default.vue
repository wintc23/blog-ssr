<template>
  <div class="layout">
    <header ref='header' class="layout-header" :class="headerClass">
      <div class="layout-header-main">
        <h1 class="site-title">
          <nuxt-link to="/" class="title-content">{{ $site.title }}</nuxt-link>
        </h1>
        <nav class="nav-list">
          <nuxt-link
            class="nav"
            v-for="(nav, idx) of navList"
            :to="nav.path"
            :key="idx">
            {{ nav.title }}
          </nuxt-link>
        </nav>
      </div>
    </header>
    <div class="layout-main">
      <aside class="modules">
        <div class="module" v-if="adminInfo">
          <div class="module-title">{{ $site.title }}</div>
          <div class="module-content">
            <div class="userinfo">
              <img :src="adminInfo.avatar" alt="木马啊">
              <div class="username">{{ adminInfo.username }}</div>
              <div class="post-count">
                共<span class="count">{{ adminInfo.postCount }}</span>篇文章
              </div>
            </div>
            <div class="stat">
              <div class="like">
                <div class="label">喜欢</div>
                {{ adminInfo.likeCount }}
              </div>
              <div class="comment">
                <div class="label">评论</div>
                {{ adminInfo.commentCount }}
              </div>
              <div class="message">
                <div class="label">留言</div>
                {{ adminInfo.messageCount }}
              </div>
            </div>
            <div class="site">
              <Icon type="ios-link-outline" />
              <nuxt-link class="content" to="/">wintc.top</nuxt-link>
            </div>
            <div class="github">
              <Icon type="logo-github" />
              <a target="_blank" class="content" href="https://github.com/Lushenggang">github</a>
            </div>
            <div class="city">
              <Icon type="md-pin" /> 
              <div class="content">云南·昆明</div>
            </div>
            <div class="about-me">
              {{ adminInfo.aboutMe }}
            </div>
          </div>
        </div>
        <!-- <div class="module" v-if="topics.length">
          <div class="module-title">专栏</div>
        </div>
        <div class="module" v-if="topTen.length">
          <div class="module-title">热门文章</div>
        </div> -->
        <!-- <div class="module" v-if="tags.length">
          <div class="module-title">文章标签</div>
          <div class="module-content">
            <Tag class="tag" v-for="tag of tags" :key="tag.id">
            </Tag>
          </div>
        </div> -->
      </aside>
      <nuxt class="nuxt-container" />
    </div>
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
    },
    adminInfo () {
      return this.$store.getters['site/adminInfo']
    },
    tags () {
      let list = this.$store.getters['site/tags'] || []
      return list.filter(tag => !!tag.postCount)
    },
    topics () {
      let list = this.$store.getters['site/topics'] || []
      return list.filter(topic => !! topic.postCount)
    },
    topTen () {
      return this.$store.getters['site/topTen'] || []
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll)
    this.$store.dispatch('postType/getType')
    this.$store.dispatch('userInfo/getUserInfo')
    // this.$store.dispatch('site/getAdminInfo'),
    // this.$store.dispatch('site/getTagList'),
    // this.$store.dispatch('site/getTopTen'),
    // this.$store.dispatch('site/getTopicList')
    this.$bus.$on('login-show', this.showLogin)
    this.$nextTick(() => {
      Prism && Prism.highlightAll && Prism.highlightAll(true)
    })
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
      // padding-left 10px
      // overflow hidden
    .modules
      // display none
      .module
        background #FAFBFC
        &+.module
          margin-top 10px
        .module-title
          color #666
          padding 10px 15px
          border-bottom 1px solid #eee
        .module-content
          padding 10px 15px 20px
      .userinfo
        overflow hidden
        padding 10px 0
        img
          float left
          width 50px
          height 50px
          border-radius 50%
          margin-right 10px
        .username
          overflow hidden
          color orange
        .post-count
          padding 5px 0
          overflow hidden
          .count
            color #3361d8
      .stat
        border-top 1px solid #ddd
        display flex
        display none
        .like, .comment, .message
          flex auto
          display flex
          align-items center
          justify-content center
          flex-direction column
      .city, .site, .github
        display flex
        align-items center
        font-size 20px
        padding 4px
        padding-left 20px
        .content
          font-size 16px
          margin-left 10px

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

@media screen and (max-width: 850px)
  .layout
    .layout-main
      .modules
        display none

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
    padding-left calc(100vw - 100%)
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
      .nuxt-container
        overflow hidden
        padding 0 10px
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
