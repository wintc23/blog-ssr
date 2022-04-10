<template>
  <div class="layout">
    <header
      ref='header'
      class="layout-header"
      :class="headerClass">
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
        <client-only>
          <site-search class="global-search"></site-search>
        </client-only>
      </div>
    </header>
    <main
      :class="{
        'layout-main': true,
        'hide-modules': !showModules
      }">
      <aside class="modules" v-show="showModules">
        <div class="module ws" v-if="adminInfo">
          <div class="module-title">{{ $site.title }}</div>
          <div class="module-content">
            <div class="userinfo">
              <img @click="clickAvatar" :src="adminInfo.avatar" :alt="adminInfo.username">
              <div class="username">{{ adminInfo.username }}</div>
              <div class="post-count">
                <template>
                  共<span class="count">{{ adminInfo.postCount }}</span>篇文章
                </template>
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
            <!-- <div class="site">
              <Icon type="ios-link-outline" />
              <nuxt-link class="content" to="/">wintc.top</nuxt-link>
            </div> -->
            <div class="github">
              <Icon type="logo-github" />
              <a target="_blank" class="content" :href="$site.githubHomePage">github</a>
            </div>
            <div class="city">
              <Icon type="md-pin" />
              <div class="content">{{ $site.location }}</div>
            </div>
            <div class="about-me">
              {{ adminInfo.aboutMe }}
            </div>
          </div>
        </div>
        <!-- <div class="module" v-if="topics.length">
          <div class="module-title">专题</div>
        </div> -->
        <client-only>
          <div class="module ws recommendation-module">
            <div class="module-title">
              {{ recommendationTitle }}
              <nuxt-link
                class="detail"
                v-click-stat="'recommendation.detail'"
                to="/recommendation">
                [了解详情]
              </nuxt-link>
            </div>
            <div class="module-content">
              <recommendation></recommendation>
            </div>
          </div>
        </client-only>
        <div class="module ws" v-if="topTen.length && !outlineShow">
          <div class="module-title">热门文章</div>
          <div class="module-content">
            <div class="post-list">
              <div
                class="post"
                v-for="post of topTen"
                :key="post.id">
                <nuxt-link class="post-link" :title="post.title" :to="`/article/${post.id}`">{{ post.title }}</nuxt-link>
                <span class="read-times" :title="`${post.readTimes}次浏览`">
                  <Icon class="icon" type="md-eye" />{{ post.readTimes }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="module ws" v-if="tags.length" v-show="!outlineShow">
          <div class="module-title">文章标签</div>
          <div class="module-content">
            <div class="tag-list">
              <Tag
                class="tag"
                v-for="(tag, idx) of tags"
                :color="tagTypeList[idx]"
                :title="`${tag.title}(${tag.postCount})`"
                :key="idx">
                <nuxt-link class="tag-content" :to="`/tag/${tag.id}`">
                  <span class="tag-title">{{ tag.title }}</span>
                  <span class="tag-post-count">({{ tag.postCount }})</span>
                </nuxt-link>
              </Tag>
              <div class="tag blank"></div>
            </div>
          </div>
        </div>
        
        <div class="module ws link-module" v-show="!outlineShow">
          <div class="module-title">
            友链
            <nuxt-link
              class="detail"
              v-click-stat="'friendLink.detail'"
              to="/link">
              [详情]
            </nuxt-link>
          </div>
          <div class="module-content">
            <div class="link-list">
              <template v-for="link of links">
                <div
                  class="link"
                  :key="link.id">
                  <a target="_blank" :href="link.link">{{ link.title }}</a>
                </div>
                <div class="blank" :key="`blank${link.id}`"></div>
              </template>
            </div>
          </div>
        </div>
        <client-only>
          <div
            :style="{
              top: `${ headerHeight + 5 }px`
            }"
            class="module ws outline-module"
            v-show="outlineShow">
            <div class="module-title">目录</div>
            <div class="module-content">
              <article-outline></article-outline>
            </div>
          </div>
        </client-only>
      </aside>
      <nuxt class="nuxt-container" />
    </main>
    <footer class="layout-footer">
      {{ $site.copyright }}
      <br>
      <a href="http://beian.miit.gov.cn" target="_blank" rel="nofollow">滇ICP备18002180号</a>
    </footer>
    <client-only>
      <Modal
        class="login-modal"
        transfer
        v-model="loginShow"
        title="登录"
        width="300px"
        footer-hide>
        <div slot='header' class="login-header">
          <h3>欢迎登录-请选择登录方式</h3>
        </div>
        <div class="login-container">
          <div class="login-content">
            <div class="login-qq" @click.stop="loginWithQQ">
              <img draggable="false" src="https://file.wintc.top/qq.jpg" alt="qq登录">
              <div class="title">QQ登录</div>
            </div>
            <div class="login-github" @click.stop="loginWithGithub">
              <Icon type="logo-github" class="github-icon"></Icon>
              <div class="title">github登录</div>
            </div>
          </div>
          <div class="login-footer"></div>
        </div>
      </Modal>
    </client-only>
    <client-only>
      <userinfo></userinfo>
    </client-only>
    <client-only>
      <div class="background"></div>
    </client-only>
  </div>
</template>

<script>
import { GITHUB_CLIENT_ID, QQ_CLIENT_ID, IS_DEV, RECOMMENDATION_TITLE } from '@/config'
import { TAG_LIST, random, clearToken } from '@/tool'
import uuidv4 from 'uuid/v4'
import Userinfo from '@/components/Userinfo'
import ArticleOutline from '@/components/ArticleOutline'
import SiteSearch from '@/components/SiteSearch'
import Recommendation from '@/components/recommendations/module'

export default {
  middleware: ['cookie'],
  components: {
    Userinfo,
    ArticleOutline,
    SiteSearch,
    Recommendation
  },
  data () {
    return {
      headerClass: '',
      oldScrollTop: 0,
      headerHeight: 0,
      loginShow: false,
      recommendationTitle: RECOMMENDATION_TITLE,
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
    showModules () {
      const hideList = ['message', 'message-id', 'about', 'recommendation']
      return !hideList.includes(this.$route.name)
    },
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    userId () {
      return this.currentUser.id
    },
    adminInfo () {
      return this.$store.getters['site/adminInfo']
    },
    tags () {
      let list = this.$store.getters['site/tags'] || []
      return list.filter(tag => !!tag.postCount).sort((a, b) => b.postCount - a.postCount)
    },
    topics () {
      let list = this.$store.getters['site/topics'] || []
      return list.filter(topic => !! topic.postCount)
    },
    topTen () {
      return this.$store.getters['site/topTen'] || []
    },
    links () {
      return this.$store.getters['site/links'] || []
    },
    tagTypeList () {
      let tagLength = TAG_LIST.length
      let list = []
      const randomIterator = random(this.tags.length, TAG_LIST.length)
      for (let ranIdx of randomIterator) {
        list.push(TAG_LIST[ranIdx])
      }
      return list
    },
    outlineShow () {
      const navList = this.$store.getters['outline/list']
      return navList && navList.length
    },
  },
  watch: {
    loginShow: {
      immediate: true,
      handler () {
        if (process.server) return
        this.removeLoginListener()
        this.loginShow && this.addLoginListener()
      }
    },
    userId: {
      immediate: true,
      handler () {
        if (process.server) return
        this.$socket.destroy()
        this.userId && this.$socket.init()
      }
    }
  },
  mounted () {
    document.addEventListener('scroll', this.handleScroll)
    this.$store.dispatch('postType/getType')
    this.$store.dispatch('userInfo/getUserInfo')
    // this.$store.dispatch('site/getAdminInfo'),
    this.$store.dispatch('site/getTagList'),
    this.$store.dispatch('site/getTopTen'),
    // this.$store.dispatch('site/getTopicList')
    this.$bus.$on('login-show', this.showLogin)
    this.$bus.$on('logout', this.logout)
    this.$bus.$on('code-highlight', this.highlightCode)
    this.$bus.$on('baidu-push', this.pushPage)
    this.$bus.$on('get-current-user', this.getCurrentUser)
    this.highlightCode()
  },
  beforeDestroy () {
    document.removeEventListener('scroll', this.handleScroll)
    this.$bus.$off('login-show', this.showLogin)
    this.$bus.$off('logout', this.logout)
    this.$bus.$off('code-highlight', this.highlightCode)
    this.$bus.$off('baidu-push', this.pushPage)
    this.$bus.$off('get-current-user', this.getCurrentUser)
    this.removeLoginListener()
  },
  methods: {
    handleScroll () {
      window.requestAnimationFrame(() => {
        let rect = this.$refs.header.getBoundingClientRect()
        let el = document.scrollingElement || document.documentElement
        let deltaY = el.scrollTop - this.oldScrollTop
        this.oldScrollTop = el.scrollTop
        if (el.scrollTop <= rect.height) {
          this.headerClass = ''
          this.headerHeight = 0
        } else if (deltaY > 0) {
          this.headerClass = 'hide'
          this.headerHeight = 0
        } else {
          this.headerHeight = rect.height
          this.headerClass = 'show'
        }
      })
    },
    highlightCode () {
      this.$nextTick(() => {
        Prism && Prism.highlightAll && Prism.highlightAll(true)
      })
    },
    showLogin () {
      this.loginShow = true
    },
    hideLogin () {
      this.loginShow = false
    },
    logout () {
      clearToken()
      this.$store.commit('userInfo/clearInfo')
    },
    getUserInfo () {
      return this.$store.dispatch('userInfo/getUserInfo', { force: true })
    },
    loginWithGithub () {
      let url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`
      this.openLoginWindow(url)
    },
    loginWithQQ () {
      let redirect = encodeURI(`${window.location.origin}/qqtoken`)
      let state = uuidv4()
      localStorage.setItem('qqState', state)
      let url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${QQ_CLIENT_ID}&redirect_uri=${redirect}&state=${state}`
      this.openLoginWindow(url)
    },
    openLoginWindow (url) {
      if (this.$isPC) {
        window.open(url, 'login', 'resizable=yes,scrollbars=yes,status=yes,height=600,width=800')
      } else {
        localStorage.setItem('loginRedirect', this.$route.fullPath)
        window.open(url, '_self')
      }
    },

    addLoginListener () {
      window.addEventListener('message', this.loginCallback)
    },

    removeLoginListener () {
      window.removeEventListener('message', this.loginCallback)
    },

    loginCallback ({ data: { state, type } }) {
      if (type !== 'login-state') return
      if (state) {
        this.hideLogin()
        let promise = this.getUserInfo()
        promise && promise.then(() => {
          this.$bus.$emit('click-avatar', this.currentUser.id)
          this.$Message.info('请设置邮箱，以便及时收到关于您的消息')
        })
      }
    },

    clickAvatar () {
      this.$bus.$emit('click-avatar', this.adminInfo.id)
    },
    pushPage () {
      let node = document.querySelector("script[baidu-seo]")
      node && node.parentNode.removeChild(node)

      //开发环境和管理员看到的特殊页面不推送
      if (this.currentUser.admin || IS_DEV) return
      node = document.createElement('script')
      node.setAttribute('baidu-seo', 1)
      var curProtocol = window.location.protocol.split(':')[0]
      if (curProtocol === 'https') {
        node.src = 'https://zz.bdstatic.com/linksubmit/push.js'
      }
      else {
        node.src = 'http://push.zhanzhang.baidu.com/push.js'
      }
      document.body.appendChild(node)
    },
    insertDrift () {
      // 
    },
    getCurrentUser (callback) {
      callback(this.currentUser)
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
    position fixed
    left 0
    right 0
    top 0
    z-index 2
    background-color #fafbfc
    box-shadow 0 0 8px 0 rgba(0, 0, 0, .1)
    padding-left calc(100vw - 100%)
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
          // color #FAFBFC
          font-weight 400
      .nav-list
        .nav
          font-weight bold
          // color #FAFBFC
          font-size 16px
  .layout-main
    flex auto
    .modules
      .module
        background #fff
        border-radius 2px
        &+.module
          margin-top 10px
        .module-title
          color #666
          padding 8px 15px
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
          cursor pointer
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
      .outline-module
        position sticky
        transition top .5s
      
      .post-list
        .post
          &+.post
            margin-top 10px
          .post-link
            color #333
            &:hover
              color #4791ff
              text-decoration underline
          .read-times
            color #999
            font-size 14px
            .icon
              height 14px
              width 14px
              font-size 18px
              display inline-flex
              align-items center
              justify-content center
              margin-right 5px
      .tag-list
        display flex
        flex-wrap wrap
        justify-content space-around
        .tag
          width 120px
          .tag-content
            display flex
            justify-content center
            .tag-post-count
              flex-shrink 0
              margin-left 2px
            .tag-title
              overflow hidden
      .link-module
        .module-title
          .detail
            float right
            font-size 14px
        .link-list
          display flex
          flex-wrap wrap
          .link
            flex-shrink 0
            padding 2px 8px
            border-radius 4px
            margin-bottom 5px
            font-size 14px
            cursor pointer
            background rgba(0, 0, 0, .05)
            &:hover
              background rgba(0, 0, 0, .1)
          .blank
            flex auto
            max-width 10px
      .recommendation-module
        .module-title
          .detail
            float right
            font-size 14px
            &:hover
              text-decoration underline
        .module-content
          .content
            color #333
            .text
              margin 5px 0 15px
              font-size 15px
              &:nth-child(2)
                font-size 14px
                color #FF2121
        img
          max-width 100%
          vertical-align middle
  .layout-footer
    flex-shrink 0
    text-align center
    font-size 14px
    padding 10px 0 20px

  .background
    // background url(https://file.wintc.top/amazing/sunset.jpeg)
    background url(https://file.wintc.top/lisa/background.jpg)
    position fixed
    left 0
    right 0
    bottom 0
    top 0
    z-index -1

.login-modal
  .login-header 
    user-select none
  .login-container
    .login-content
      text-align center
      display flex
      align-items center
      justify-content space-around
      padding 30px 10px
      .login-github, .login-qq
        width 120px
        padding 10px 0
        margin 0 10px
        text-align center
        user-select none
        cursor pointer
        &:hover
          background #f6f6f6
          box-shadow 0 0 5px 0 rgba(0, 0, 0, .2)
          border-radius 8px
          .title
            color rgba(64, 158, 255, 1)
        .title
          font-size 1rem
          padding 5px 0
      .login-qq
        font-size 0
        img
          width 56px
          height 56px
          border-radius 50%
        
      .login-github
        .github-icon
          width 56px
          height 56px
          font-size 64px
          display inline-flex
          align-items center
          justify-content center

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
        .global-search
          display none
    .layout-main
      .nuxt-container
        padding 5px
    .layout-footer
      // 

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
      max-width 1200px
      margin 0 auto
      padding 20px 10px
      width 100%
      display flex
      &.hide-modules
        max-width 960px
      .modules
        width 280px
        padding 10px 0
        flex-shrink 0
      .nuxt-container
        overflow hidden
        padding 10px
        flex auto
    .layout-footer
      //
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

html
  background #f4f4f4

.ws
  background #fff
  box-shadow 0 0 8px 0 rgba(0, 0, 0, .08)

.sub-page-header
  background #fff
  padding 15px 20px
  margin-bottom 5px
  color #666
  border-radius 2px

</style>

<style>
html {
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
  /* word-break: break-all; */
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
</style>
