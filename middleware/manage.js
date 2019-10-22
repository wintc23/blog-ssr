import { checkAdmin } from '@/api/user'

export default ({ redirect }) => {
  checkAdmin().then(res => {
    if (res.status !== 200 || !res.data.admin) {
      redirect('/site')
    }
  }).catch(() => {
    redirect('/site')
  })
}