import canUseWebp from './can-use-webp'

const skipOrigin = [
  'qlogo.cn',
  'sinaimg.cn'
]
export default (img) => {
  if (!img) return ''
  let image = img
  let skipWebp = false
  skipOrigin.forEach((origin) => {
    if (img.indexOf(origin) >= 0) {
      skipWebp = true
    }
  })
  if (canUseWebp && !skipWebp) {
    const reg = /(\.png|\.jpg|\.jpeg)$/
    if (reg.test(image)) {
      image = image.replace(/\.png|\.jpg|\.jpeg/, '.webp')
    } else {
      image = `${image}.webp`
    }
  }
  image = image.replace(/^https?:/, '')
  return image
}
