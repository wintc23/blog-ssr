<script>
import LoginCommon from '@/components/mixins/LoginCommon'
import { githubLogin } from '@/api/user'

export default {
  mixins: [LoginCommon],
  methods: {
    loginWithCode () {
      return githubLogin(this.$route.query.code)
    }
  }
}
</script>
