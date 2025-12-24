Page({
  data: {
    progress: 0,
    loadingText: '正在加载...'
  },

  onLoad: function() {
    this.startLoading()
  },

  startLoading: function() {
    const loadingSteps = [
      { progress: 30, text: '正在加载资源...', delay: 300 },
      { progress: 60, text: '正在初始化...', delay: 600 },
      { progress: 90, text: '即将完成...', delay: 900 },
      { progress: 100, text: '加载完成', delay: 1200 }
    ]

    loadingSteps.forEach(step => {
      setTimeout(() => {
        this.setData({
          progress: step.progress,
          loadingText: step.text
        })

        // 加载完成后跳转到首页（使用 switchTab 跳转到 tabBar 页面）
        if (step.progress === 100) {
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/home'
            })
          }, 500)
        }
      }, step.delay)
    })
  }
})