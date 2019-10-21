<template>
  <div class="editor-container">
    <tiny-mce
      class="editor"
      :init="options"
      v-model="content">
    </tiny-mce>
  </div>
</template>

<script>
import { uploadFile } from '@/api/posts'
import TinyMCE from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/media'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/codesample'

export default {
  components: {
    'tiny-mce': TinyMCE,
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      content: '',
      options: {
        language_url: `/tinymce/langs/zh_CN.js`,
        language: 'zh_CN',
        skin_url: `/tinymce/skins/ui/oxide`,
        content_css: '/css/github-markdown.css',
        body_class: 'markdown-body',
        content_style: ' body { max-width: 1100px; min-height: 100%; margin: 0 auto; background: #fff } html { background: #eee; height: 100% }',
        // menubar: 'edit view insert format tool table',
        plugins: 'link lists image code table wordcount fullscreen media codesample',
        toolbar: 'bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | undo redo | link unlink image media table code codesample | fullscreen',
        menubar: false,
        file_picker_types: 'media',
        media_live_embeds: false,
        branding: false,
        autoresize_bottom_margin: 50,
        valid_elements: '*[*]',
        codesample_content_css: '/css/prism.css',
        images_upload_handler: (blobInfo, success, failure) => {
          uploadFile(blobInfo.blob(), url => {
            success(url)
          }, () => {
            failure('上传失败，请重试')
          })
        },
        file_picker_callback: (cb, value, meta) => {
          let input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', 'video/*')
          input.onchange = () => {
            let file = input.files[0]
            uploadFile(file, url => {
              cb(path, { title: file.name })
            }, () => {
              this.$message.error('上传视频失败，请重试！')
            })
          }
          input.click()
        }
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler () {
        this.content = this.value
      }
    },
    content: {
      immediate: true,
      handler () {
        this.$emit('input', this.content)
      }
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
.editor-container
  position relative
  display flex
  flex-direction column
  >>>
    .tox.tox-tinymce
      flex auto
    .tox-edit-area
      justify-content center
      background #eee
    .tox-toolbar
      &::before, &::after
        content ''
        flex auto
</style>