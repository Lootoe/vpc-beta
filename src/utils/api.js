import { get } from '@/utils/request'
import { useRouter } from 'vue-router'

export const getImageInfo = () => {
  return new Promise((resolve, reject) => {
    const router = useRouter()
    const params = router.currentRoute.value.query
    get('patient/pc/imageInfo', params)
      .then((res) => {
        resolve(res.data.data)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
