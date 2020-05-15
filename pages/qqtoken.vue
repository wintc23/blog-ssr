<script>
import LoginCommon from '@/components/mixins/LoginCommon'
import { qqLogin } from '@/api/user'

export default {
  mixins: [LoginCommon],
  methods: {
    loginWithCode () {
      let { code, state } = this.$route.query
      // ??QQ要求验证，不过此处验证并非严谨
      let qqState = localStorage.getItem('qqState')
      localStorage.removeItem('qqState')
      if (qqState != state) {
        this.$Message.error('QQ登录状态异常，请重试')
        this.login(false)
        return
      }
      let redirect = encodeURI(`${window.location.origin}/qqtoken`)
      return qqLogin({ code, redirect })
    }
  }
}
</script>