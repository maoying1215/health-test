const app = getApp()

Page({
  data: {
    permissions: [
      { id: 'p1', icon: '📍', name: '位置信息', desc: '用于提供基于位置的健康建议', enabled: false },
      { id: 'p2', icon: '📸', name: '相册权限', desc: '用于上传头像和健康图片', enabled: true },
      { id: 'p3', icon: '📊', name: '数据分析', desc: '允许匿名分析以改善服务', enabled: true },
      { id: 'p4', icon: '🔔', name: '个性化推荐', desc: '根据您的健康数据推送内容', enabled: true }
    ]
  },

  onLoad: function() {
    this.loadSettings()
  },

  loadSettings: function() {
    const saved = wx.getStorageSync('privacySettings')
    if (saved) {
      const permissions = this.data.permissions.map(p => {
        const s = saved.find(s => s.id === p.id)
        return s ? { ...p, enabled: s.enabled } : p
      })
      this.setData({ permissions })
    }
  },

  saveSettings: function() {
    const toSave = this.data.permissions.map(p => ({ id: p.id, enabled: p.enabled }))
    wx.setStorageSync('privacySettings', toSave)
  },

  togglePermission: function(e) {
    const id = e.currentTarget.dataset.id
    const permissions = this.data.permissions.map(p =>
      p.id === id ? { ...p, enabled: e.detail.value } : p
    )
    this.setData({ permissions })
    this.saveSettings()
    wx.showToast({ title: '设置已保存', icon: 'success' })
  },

  exportData: function() {
    wx.showModal({
      title: '导出数据',
      content: '将您的健康数据导出为JSON文件，确认导出吗？',
      success: (res) => {
        if (res.confirm) {
          const data = {
            assessmentHistory: app.globalData.assessmentHistory || [],
            healthData: app.globalData.healthData || [],
            exportTime: new Date().toISOString()
          }
          wx.setClipboardData({
            data: JSON.stringify(data, null, 2),
            success: () => {
              wx.showToast({ title: '数据已复制到剪贴板', icon: 'success' })
            }
          })
        }
      }
    })
  },

  clearData: function() {
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '确定要清除所有健康数据吗？此操作不可恢复！',
      confirmColor: '#e74c3c',
      success: (res) => {
        if (res.confirm) {
          app.globalData.assessmentHistory = []
          app.globalData.healthData = []
          wx.removeStorageSync('goalList')
          wx.removeStorageSync('reminderList')
          wx.showToast({ title: '数据已清除', icon: 'success' })
        }
      }
    })
  },

  viewPolicy: function(e) {
    const type = e.currentTarget.dataset.type
    const title = type === 'privacy' ? '隐私政策' : '用户协议'
    wx.showModal({
      title,
      content: type === 'privacy'
        ? '我们严格保护您的个人健康数据，不会将您的数据出售给第三方。所有数据仅用于为您提供个性化的健康服务。'
        : '使用本应用即表示您同意我们的服务条款。请合理使用本应用，不得用于任何非法用途。',
      showCancel: false,
      confirmText: '我知道了'
    })
  }
})
