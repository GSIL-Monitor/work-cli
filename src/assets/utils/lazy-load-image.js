import { $, $$ } from './selector'
import optimizeImage from './optimize-image'

export default class LazyLoadImage {
  constructor (selector, options = {}) {
    const { root = null, optimize = true } = options
    this.selector = selector
    this.optimizeImage = optimize
    this.elements = $$(selector)
    this.root = root
    this.invoke()
  }
  refresh () {
    this.elements = $$(this.selector)
    this.destory()
    this.invoke()
  }
  invoke () {
    this.observer = new IntersectionObserver(
      (changes) => {
        changes.forEach((change) => {
          if (change.intersectionRatio <= 0) return
          const ele = change.target
          insertImage(ele, this.optimizeImage)
          this.observer.unobserve(ele)
        })
      },
      {
        root: typeof this.root === 'string' ? $(this.root) : this.root,
        threshold: [0.1],
        rootMargin: '200px 0px'
      }
    )
    this.elements.forEach((item) => {
      this.observer.observe(item)
    })
  }
  destory () {
    this.observer.disconnect()
    this.observer = null
  }
}
const cache = new WeakMap()
function insertImage (ele, optimize) {
  if (!ele || !ele.dataset.src) return
  if (cache.get(ele)) return
  cache.set(ele, 1)
  // if (ele.querySelector('img')) return
  ele.classList.add('loading-start')
  const image = document.createElement('img')
  image.src = optimize ? optimizeImage(ele.dataset.src) : ele.dataset.src
  image.onload = () => {
    cache.delete(ele)
    setTimeout(() => {
      ele.classList.remove('loading-start')
      ele.classList.add('loading-end')
    }, ele.dataset.time || 200)
  }
  ele.appendChild(image)
}
