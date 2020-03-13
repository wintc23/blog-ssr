<script>
import LoginCommon from '@/components/mixins/LoginCommon'
import { githubLogin } from '@/api/user'

export default {
  mixins: [LoginCommon],
  methods: {
    loginWithCode () {
      githubLogin(this.$route.query.code).then(this.loginCallback)
    }
  }
}
</script>
