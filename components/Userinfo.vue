<template>
  <div v-if="!!detail">
    <Drawer v-model="show" :width="$isPC ? 400 : 80">
      <template v-slot:header>
        <div class="header">
          <img :src="detail.avatar" alt="头像">
          {{ detail.username }}
        </div>
      </template>
      <template>
        <div class="email" v-if="showEmail">
          <div class="label">
            邮箱：{{ detail.email || '未设置' }}
          </div>
          <template v-if="emailSetting">
            <div class="email-setting">
              <Input ref="email" type="email" v-model="email"/>
            </div>
            <div class="email-setting-menu">
              <Button type="info" @click="saveEmail">保存</Button>
              <Button type="text" @click="hideEditing">取消</Button>
            </div>
          </template>
          <template v-else>
            <div class="notice">
              <div>
                <template v-if="!detail.email">您可以设置邮箱，以便及时收到关于您的消息。</template>
                别人回复您的评论或者留言时，本站将通过邮箱通知您。
              </div>
            </div>
            <div class="content">
              <Button @click="setEmail" type="info" v-if="detail.email">更改邮箱</Button>
              <Button @click="setEmail" type="success" v-else>设置邮箱</Button>
            </div>
          </template>
        </div>
        <div class="activities">
          <div class="label">相关动态</div>
          <div class="activity-list">
            <div
              class="activity"
              v-for="(activity, idx) of activityList"
              :key="idx">
              <div class="content">
                <span class="time-show">
                  {{ $timeShow(activity.timestamp) }}
                </span>
                <template v-if="activity.type == 1">
                  赞了文章
                </template>
                <template v-else-if="activity.type == 2">
                  发表了留言
                </template>
                <template v-else-if="activity.type == 3">
                  评论了文章
                </template>
                <nuxt-link v-if="activity.postId" :to="`/article/${activity.postId}`">{{ activity.postTitle }}</nuxt-link>
              </div>
              <div class="content-extra" v-if="activity.body">
                {{ activity.body }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script>
import { getUserDetail, setEmail } from '@/api/user'

export default {
  data () {
    return {
      show: true,
      detail: undefined,
      emailSetting: false,
      email: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.getters['userInfo/info']
    },
    activityList () {
      if (!this.detail) return []
      let { likes, messages, comments } = this.detail
      likes.forEach(l => l.type = 1)
      messages.forEach(m => m.type = 2)
      comments.forEach(c => c.type = 3)
      let list = [...likes, ...messages, ...comments]
      list.sort((a, b) => b.timestamp - a.timestamp)
      return list
    },
    showEmail () {
      if (this.currentUser.admin) return true
      return this.currentUser.id == this.detail.id
    }
  },
  created() {
    this.$bus.$on('click-avatar', this.getUserDetail)
  },
  beforeDestroy() {
    this.$bus.$off('click-avatar', this.getUserDetail)
  },
  methods: {
    getUserDetail (id) {
      this.emailSetting = false
      this.show = true
      if (this.detail && this.detail.id === id) return
      this.refreshUserDetail(id)
    },
    refreshUserDetail (id) {
      getUserDetail(id).then(res => {
        if (res.status === 200) {
          this.detail = res.data
          for (let key in this.detail) {
            this.$set(this.detail, key, this.detail[key])
          }
        } else {
          this.detail = undefined
        }
      })
    },
    setEmail () {
      this.emailSetting = true
      this.email = this.detail.email
      this.$nextTick(() => {
        this.$refs.email && this.$refs.email.focus()
      })
    },
    hideEditing () {
      this.emailSetting = false
    },
    saveEmail () {
      setEmail({
        userId: this.detail.id,
        email: this.email
      }).then(res => {
        if (res.status == 200) {
          this.hideEditing()
          this.refreshUserDetail(this.detail.id)
          this.$store.dispatch('userInfo/getUserInfo', { force: true })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.header
  display flex
  align-items center
  color #333
  img
    width 30px
    height 30px
    margin-right 10px
    border-radius 50%
.email, .activities
  .label
    font-size 18px
    color rgba(64, 158, 255, 1)
    border-bottom 1px solid rgba(64, 158, 255, .8)
    margin-bottom 10px
.email
  margin-bottom 20px
  .content
    margin 5px 0
  .notice
    font-size 15px
  .email-setting-menu
    margin 5px 0
.activities
  font-size 15px
  .activity
    padding 10px
    &+.activity
      border-top 1px solid #ccc
    .content
      .time-show
        color #FF8700
        font-weight bold
    .content-extra
      padding 4px
      border-radius 4px
      background #eee
      margin-top 4px
</style>
