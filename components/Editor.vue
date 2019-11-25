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
import Vue from 'vue'
import { uploadFile } from '@/api/posts'
import TinyMCE from '@tinymce/tinymce-vue'
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/media'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/link'

// tinymce.PluginManager.add('link', function (editor, url) {
//   if (!editor.EditorLink) {
//     let Link = Vue.extend(EditorLink)
//     editor.EditorLink = new Link().$mount()
//     document.body.appendChild(editor.EditorLink.$el)
//   }

//   editor.ui.registry.addButton('link', {
//     icon: 'link',
//     tooltip: '链接',
//     onAction: () => {
//       editor.EditorLink.showLink((link) => {
//         editor.insertContent(link)
//       })
//     }
//   })
//   editor.on('click', function () {
//     var node = editor.selection.getNode();
//     if (node && editor.dom.hasClass(node, 'insert-link')) {
//       let { href: link, title, textContent: content } = node
//       editor.EditorLink.showLink((link) => {
//         node.outerHTML = link
//       }, { link, title, content })
//     }
//   })
// })

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
        body_class: 'post-body',
        content_style: ' body { max-width: 1100px; min-height: 100%; margin: 0 auto; padding: 40px !important; background: #fff } html { background: #eee; height: 100% }',
        // menubar: 'edit view insert format tool table',
        plugins: 'link lists image code table wordcount fullscreen media codesample advlist',
        toolbar: 'formatselect indent outdent bullist numlist link image media table code codesample fullscreen | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify',
        block_formats: 'H2=h2; H3=h3; H4=h4; P=p',
        menubar: false,
        file_picker_types: 'media',
        media_live_embeds: false,
        branding: false,
        autoresize_bottom_margin: 50,
        lists_indent_on_tab: true,
        valid_elements: '*[*]',
        convert_urls: false,
        codesample_languages: [
          {text: 'JavaScript', value: 'javascript'},
          {text: 'HTML/XML', value: 'markup'},
          {text: 'CSS', value: 'css'},
          {text: 'Bash', value: 'bash'},
          {text: 'Python', value: 'python'},
          {text: 'Ruby', value: 'ruby'},
          {text: 'C', value: 'c'},
          {text: 'C++', value: 'cpp'},
          {text: 'C#', value: 'csharp'},
          {text: 'PHP', value: 'php'},
          {text: 'Java', value: 'java'},
        ],
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
