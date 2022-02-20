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
import 'tinymce/plugins/paste'
import 'tinymce/plugins/code'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/media'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/codesample'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/link'

let watermarkApi
tinymce.PluginManager.add('watermark', function (editor) {
  editor.ui.registry.getAll().icons.watermark || editor.ui.registry.addIcon('watermark', '<svg width="18" height="18" t="1608472079996" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3175" width="200" height="200"><path d="M439.003429 758.710857c45.860571 57.270857 105.179429 86.820571 175.104 86.820572 44.982857 0 72.265143-14.628571 115.419428-53.467429l12.214857-11.264c37.449143-35.035429 53.394286-44.982857 77.604572-44.982857 62.902857 0 80.457143 12.434286 147.382857 96.036571l57.051428-45.714285-22.601142-27.648c-64.365714-76.288-99.913143-95.817143-181.833143-95.817143-44.982857 0-72.265143 14.701714-115.419429 53.540571l-12.141714 11.190857c-37.522286 35.108571-53.394286 44.982857-77.677714 44.982857-47.323429 0-85.796571-19.163429-118.052572-59.392l-57.051428 45.714286zM439.003429 935.716571c45.860571 57.270857 105.179429 86.820571 175.104 86.820572 44.982857 0 72.265143-14.628571 115.419428-53.540572l12.214857-11.190857c37.449143-35.035429 53.394286-44.982857 77.604572-44.982857 62.902857 0 80.457143 12.434286 147.382857 96.036572l57.051428-45.787429-22.601142-27.574857c-64.365714-76.288-99.913143-95.817143-181.833143-95.817143-44.982857 0-72.265143 14.628571-115.419429 53.540571l-12.141714 11.190858c-37.522286 35.035429-53.394286 44.982857-77.677714 44.982857-47.323429 0-85.796571-19.163429-118.052572-59.465143l-57.051428 45.787428z" p-id="3176"></path><path d="M1024 0v585.142857h-73.142857V450.048l-208.896-177.005714-218.331429 363.812571-226.377143-150.966857L73.142857 671.012571V950.857143h292.571429v73.142857H0V0h1024z m-73.142857 73.142857H73.142857v517.412572l214.747429-198.729143 212.48 141.604571 220.525714-367.616L950.857143 373.028571V73.142857zM292.571429 146.285714a73.142857 73.142857 0 1 1 0 146.285715 73.142857 73.142857 0 0 1 0-146.285715z" p-id="3177"></path></svg>')
  const options = {
    tooltip: '图片添加水印',
    icon: 'watermark',
    onAction: (api) => {
      api.setActive(!api.isActive());
    },
    onSetup (api) {
      watermarkApi = api
      api.setActive(true)
    }
  }
  editor.ui.registry.addToggleButton('watermark', options)
})

// import ImagePreview from './ImagePreview'

// tinymce.PluginManager.add('imagepreview', function (editor, url) {
//   if (!editor.ImagePreview) {
//     let Preview = Vue.extend(ImagePreview)
//     editor.ImagePreview = new Preview().$mount()
//     document.body.appendChild(editor.ImagePreview.$el)
//   }

//   editor.ui.registry.addButton('imagepreview', {
//     icon: 'image',
//     tooltip: '上传图片',
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
    },
    watermark: {
      type: String
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
        plugins: 'link lists image code table wordcount fullscreen media codesample advlist paste watermark',
        toolbar: 'formatselect indent outdent bullist numlist link image media table code codesample fullscreen | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify watermark',
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
        paste_data_images: true,
        images_upload_handler: (blobInfo, success, failure) => {
          function upload (blob) {
            uploadFile(blob, url => {
              success(url)
            }, () => {
              failure('上传失败，请重试')
            })
          }
          let blob = blobInfo.blob()
          if (watermarkApi && !watermarkApi.isActive()) return upload(blob)
          let reader = new FileReader()
          reader.onload = e => {
            let img = new Image()
            img.src = e.target.result
            img.onload = () => {
              let canvas = document.createElement('canvas')
              canvas.width = img.width
              canvas.height = img.height
              let ctx = canvas.getContext('2d')
              ctx.drawImage(img, 0, 0)
              let fontSize = Math.max(canvas.width / 60, 16)
              ctx.font = `${fontSize}px`
              ctx.fillStyle = '#FFC82C'
              ctx.textAlign = 'right'
              ctx.fillText(`${this.$site.title}`, canvas.width - 10, canvas.height - fontSize - 10, canvas.width - 20)
              ctx.fillText(this.watermark, canvas.width - 10, canvas.height - 10, canvas.width - 20)
              canvas.toBlob(upload)
            }
          }
          reader.readAsDataURL(blob)
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
