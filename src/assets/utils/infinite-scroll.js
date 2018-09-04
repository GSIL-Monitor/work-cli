export default (element, callback) => {
  const io = new IntersectionObserver(((entries) => {
    console.log(entries)
    // 如果不可见，就返回
    if (entries[0].intersectionRatio <= 0) return
    callback()
  }), { rootMargin: '100px 0px' })

  // 开始观察
  io.observe(element)
  return io
}
