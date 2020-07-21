import { checkAdmin } from '@/api/user'

export default ({ redirect }) => {
  return checkAdmin().then(res => {
    if (res.status !== 200 || !res.data.admin) {
      redirect('/')
    }
  }).catch(() => {
    redirect('/')
  })
}
