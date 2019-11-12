<template>
  <client-only>
    <div class="post-edit-container">
      <div class="header">
        <Input v-model="postData.title" placeholder="请输入文章标题"/>
        <Button 
          size="small"
          type="info" 
          class="button" 
          @click="showPostSetting">文章设置</Button>
        <Button 
          size="small"
          type="success" 
          class="button" 
          @click="save">保存</Button>
      </div>
      <div class="post-content">
        <editor
          ref="editor"
          v-model="postData.bodyHtml"
          class="editor">
        </editor>
      </div>
      <Modal
        title="文章设置"
        v-model="showSetting"
        width="60">
        <div class="post-setting">
          <div class="post-hide">
            <div class="title">是否隐藏</div>
            <Checkbox v-model="postData.hide">隐藏</Checkbox>
          </div>
          <div class="post-topic">
            <div class="title">专题</div>
            <Select v-model="postData.topicId">
              <Option
                v-for="topic of topicList"
                :value="topic.id"
                :key="topic.id">
                {{ topic.title }}
              </Option>
            </Select>
          </div>
          <div class="post-tags">
            <div class="title">标签</div>
            <div class="tag-container">
              <template v-for="tag of tagList">
                <Tag
                  class="tag"
                  @click.native.stop="setTag(tag.id)"
                  v-if="tag.title"
                  :color="postData.tags.includes(tag.id) ? 'primary' : 'blue'"
                  :key="tag.id">
                  {{ tag.title }}
                </Tag>
              </template>
            </div>
          </div>
          <div class="post-abstract">
            <div class="title">关键词</div>
            <Input :maxlength="64" v-model="postData.keywords" ></Input>
          </div>
          <div class="post-abstract">
            <div class="title">描述</div>
            <Input :maxlength="128" v-model="postData.description" type="textarea" autosize></Input>
          </div>
          <div class="post-abstract">
            <div class="title">摘要</div>
            <Input v-model="postData.abstract" type="textarea" autosize></Input>
          </div>
          <div class="post-type">
            <div class="title">文章分类</div>
            <Select v-model="postData.typeId">
              <Option v-for="type of typeList" :key="type.id" :value="type.id">{{ type.name }}</Option>
            </Select>
          </div>
          <div class="post-img">
            <div class="title">文章缩略图</div>
            <img
              v-if="postData.abstractImage"
              :src="postData.abstractImage"
              @click.stop="clickAbstractImage"
              alt="文章缩略图">
            <input
              v-show="!postData.abstractImage"
              type="file"
              accept="image/png,image/jpeg,image/gif"
              @change="changeAbstractImage"
              ref="abstractImageInput">
          </div>
        </div>
      </Modal>
    </div>
  </client-only>
</template>

<script>
import { getPost, uploadFile, savePost, getFileUploadToken } from '@/api/posts'

export default {
  scrollToTop: true,
  components: (() => {
    if (process.client) {
      return {
        Editor: require('@/components/Editor').default
      }
    }
    return {}
  })(),
  data () {
    return {
      postData: {
        id: '',
        title: '',
        bodyHtml: '',
        hide: false,
        abstract: '',
        abstractImage: '',
        typeId: '',
        tags: [],
        topicId: 0,
        keywords: '',
        description: ''
      },
      showSetting: false,
      timer: 0
    }
  },
  computed: {
    typeList () {
      return this.$store.getters['postType/manageList']
    },
    currentUser () {
      return this.$store.getters['userInfo/info'] || {}
    },
    tagList () {
      return this.$store.getters['topic/tags']
    },
    topicList () {
      return this.$store.getters['topic/topics']
    }
  },
  watch: {
    '$route.query.postId': {
      immediate: true,
      handler () {
        this.getPost()
      }
    }
  },
  created() {
    this.timer = setInterval(this.savePerMin, 60 * 1000)
  },
  mounted () {
    this.$store.dispatch('postType/getType')
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    getPost () {
      getPost(this.$route.query.postId).then(res => {
        if (res.status == 200) {
          this.postData = res.data
        }
      })
    },
    showPostSetting () {
      this.showSetting = true
      if (!this.postData.typeId) {
        let type = this.typeList.find(item => item.default)
        console.log(this.typeList)
        type && (this.postData.typeId = type.id)
      }
    },
    changeAbstractImage (event) {
      if (!event.target.files.length) return
      uploadFile(event.target.files[0], (url) => {
        this.postData.abstractImage = url
      })
    },
    clickAbstractImage () {
      this.$refs.abstractImageInput.click()
    },
    save () {
      savePost(this.postData).then(res => {
        if (res.status == 200) {
          this.$router.push(`/article/${this.$route.query.postId}`)
        }
      })
    },
    savePerMin () {
      savePost(this.postData)
    },
    setTag (tagId) {
      let index = this.postData.tags.indexOf(tagId)
      if (index !== -1) {
        this.postData.tags.splice(index, 1)
      } else {
        this.postData.tags.push(tagId)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.post-edit-container
  display flex
  flex-direction column
  .header
    flex-shrink 0
    display flex
    align-items center
    margin .5rem
    .button
      margin 4px
  .post-content
    margin .5rem
    flex auto
    position relative
    .editor
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      z-index 2

.post-setting
  .title
    line-height 1.5rem
    color #3361d8
    font-weight bold
  .post-img
    img
      width 300px
      height auto
</style>

