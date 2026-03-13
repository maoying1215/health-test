Page({
  data: {
    masterEnabled: true,
    quietStart: '22:00',
    quietEnd: '08:00',
    healthNotifications: [
      { id: 'n1', icon: '💊', name: '服药提醒', desc: '按时提醒您服用药物', enabled: true },
      { id: 'n2', icon: '🚶', name: '运动提醒', desc: '提醒您完成每日运动目标', enabled: true },
      { id: 'n3', icon: '💧', name: '喝水提醒', desc: '定时提醒您补充水分', enabled: false },
      { id: 'n4', icon: '😴', name: '睡眠提醒', desc: '提醒您按时作息', enabled: true },
      { id: 'n5', icon: '🍎', name: '饮食提醒', desc: '提醒您按时规律饮食', enabled: false }
    ],
    systemNotifications: [
      { id: 's1', icon: '📊', name: '健康报告', desc: '每周生成健康报告时通知', enabled: true },
      { id: 's2', icon: '🏆', name: '成就解锁', desc: '获得新成就徽章时通知', enabled: true },
      { id: 's3', icon: '🎯', name: '目标完成', desc: '完成健康目标时通知', enabled: true },
      { id: 's4', icon: '📢', name: '系统公告', desc: '接收应用更新及公告', enabled: false }
    ]
  },

  onLoad: function() {
    this.loadSettings()
  },

  loadSettings: function() {
    const saved = wx.getStorageSync('notificationSettings')
    if (saved) {
      this.setData(saved)
    }
  },

  saveSettings: function() {
    const { masterEnabled, quietStart, quietEnd, healthNotifications, systemNotifications } = this.data
    wx.setStorageSync('notificationSettings', { masterEnabled, quietStart, quietEnd, healthNotifications, systemNotifications })
  },

  toggleMaster: function(e) {
    this.setData({ masterEnabled: e.detail.value })
    this.saveSettings()
    wx.showToast({ title: e.detail.value ? '通知已开启' : '通知已关闭', icon: 'none' })
  },

  toggleNotify: function(e) {
    const id = e.currentTarget.dataset.id
    const healthNotifications = this.data.healthNotifications.map(n =>
      n.id === id ? { ...n, enabled: e.detail.value } : n
    )
    this.setData({ healthNotifications })
    this.saveSettings()
  },

  toggleSystemNotify: function(e) {
    const id = e.currentTarget.dataset.id
    const systemNotifications = this.data.systemNotifications.map(n =>
      n.id === id ? { ...n, enabled: e.detail.value } : n
    )
    this.setData({ systemNotifications })
    this.saveSettings()
  },

  onQuietStartChange: function(e) {
    this.setData({ quietStart: e.detail.value })
    this.saveSettings()
  },

  onQuietEndChange: function(e) {
    this.setData({ quietEnd: e.detail.value })
    this.saveSettings()
  }
})
