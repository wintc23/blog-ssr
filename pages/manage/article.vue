<template>
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
</template>

<script>
import { getPostsByType, uploadFile, savePost, getFileUploadToken } from '@/api/posts'
import Editor from '@/components/Editor'

export default {
  scrollToTop: true,
  components: {
    Editor
  },
  asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
    return {}
  },
  data () {
    return {
      postData: {
        id: '',
        title: '',
        body: '',
        bodyHtml: '',
        hide: false,
        abstract: '',
        abstractImage: '',
        typeId: ''
      },
      showSetting: false
    }
  },
  computed: {
    typeList () {
      return this.$store.getters['postType/manageList']
    },
    currentUser () {
      return this.$store.getters['userInfo/info'] || {}
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
    this.$store.dispatch('postType/getType')
  },
  methods: {
    getPost () {
      getPostsByType(this.$route.query.postId).then(res => {
        if (res.status == 200) {
          let attrList = ['title', 'hide', 'id', 'body', 'body_html', 'type_id', 'abstract', 'abstract_image']
          res.data.body = res.data.body || ''
          let { title, hide, id, body, body_html:bodyHtml, type_id: typeId, abstract, abstract_image: abstractImage } = res.data
          this.postData = { title, hide, id, body, bodyHtml, typeId, abstract, abstractImage }
        }
      })
    },
    imgAdd (pos, file) {
      uploadFile(file, (url) => {
        this.$refs.editor.$img2Url(pos, url)
      })
    },
    imgDel () {
      // 
    },
    changeString (value, render) {
      this.postData.bodyHtml = render
    },
    showPostSetting () {
      this.showSetting = true
      if (!this.postData.abstract) {
        this.postData.abstract = this.postData.body.slice(0, 500)
      }
      if (!this.postData.typeId) {
        let type = this.typeList.find(item => item.default)
        console.log(this.typeList)
        type && (this.postData.typeId = type.id)
      }
    },
    changeAbstractImage (event) {
      console.log(event)
      if (!event.target.files.length) return
      uploadFile(event.target.files[0], (url) => {
        this.postData.abstractImage = url
      })
    },
    clickAbstractImage () {
      console.log(this.$refs.abstractImageInput, this.$refs)
      this.$refs.abstractImageInput.click()
    },
    save () {
      let params = this.$underlineCase(this.postData)
      savePost(params).then(res => {
        if (res.status == 200) {
          this.$router.push({
            name: 'site-article',
            query: {
              postId: this.$route.query.postId
            }
          })
        }
      })
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
      width 100%
      height auto
</style>

