import { checkAdmin } from '@/api/user'

export default ({ redirect }) => {
  return checkAdmin().then(({ status, info: { admin } }) => {
    if (status !== 200 || !admin) return Promise.reject()
  }).catch(() => {
    redirect('/')
  })
}
