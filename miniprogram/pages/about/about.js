Page({
  data: {
    version: '1.0.0',
    features: [
      { icon: '📊', name: '健康评估', desc: '多维度评估您的健康状况' },
      { icon: '📈', name: '数据记录', desc: '追踪每日健康数据变化趋势' },
      { icon: '🎯', name: '目标管理', desc: '设定并追踪个人健康目标' },
      { icon: '⏰', name: '智能提醒', desc: '定时提醒，养成健康习惯' },
      { icon: '🏆', name: '成就系统', desc: '徽章激励，让健康更有趣' },
      { icon: '📋', name: '健康报告', desc: '定期生成个人健康分析报告' }
    ],
    versionInfo: [
      { label: '当前版本', value: 'v1.0.0' },
      { label: '更新日期', value: '2025-01-01' },
      { label: '开发团队', value: '健康助手团队' },
      { label: '适用平台', value: '微信小程序' }
    ]
  },

  onLoad: function() {},

  checkUpdate: function() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        wx.showModal({
          title: '发现新版本',
          content: '检测到新版本，是否立即更新？',
          success: (r) => {
            if (r.confirm) {
              updateManager.onUpdateReady(() => {
                updateManager.applyUpdate()
              })
            }
          }
        })
      } else {
        wx.showToast({ title: '已是最新版本', icon: 'success' })
      }
    })
  },

  rateApp: function() {
    wx.showModal({
      title: '感谢您的支持',
      content: '您的评分是我们持续改进的动力！由于小程序限制，请长按小程序码进入评价页面。',
      showCancel: false,
      confirmText: '好的'
    })
  },

  shareApp: function() {
    wx.showToast({ title: '点击右上角分享', icon: 'none' })
  },

  onShareAppMessage: function() {
    return {
      title: '推荐你使用「健康助手」，一起养成健康好习惯！',
      path: '/pages/index/index'
    }
  }
})
