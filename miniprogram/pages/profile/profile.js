const app = getApp()

Page({
  data: {
    userName: '健康用户',
    assessmentCount: 0,
    dataRecordCount: 0,
    continuousDays: 0,
    userGender: '',
    userAge: '',
    userEducation: ''
  },

  onLoad: function() {
    this.loadUserInfo()
    this.loadStats()
  },

  onShow: function() {
    this.loadUserInfo()
    this.loadStats()
  },

  loadUserInfo: function() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userName: userInfo.nickName || userInfo.name || '健康用户',
        userGender: userInfo.gender || '',
        userAge: userInfo.age || '',
        userEducation: userInfo.education || ''
      })
    }
  },

  loadStats: function() {
    const assessmentHistory = app.globalData.assessmentHistory
    const healthData = app.globalData.healthData

    this.setData({
      assessmentCount: assessmentHistory.length,
      dataRecordCount: healthData.length,
      continuousDays: this.calculateContinuousDays()
    })
  },

  calculateContinuousDays: function() {
    const healthData = app.globalData.healthData
    if (healthData.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let continuousDays = 0
    let checkDate = new Date(today)

    for (let i = 0; i < healthData.length; i++) {
      const recordDate = new Date(healthData[i].timestamp)
      recordDate.setHours(0, 0, 0, 0)

      if (recordDate.getTime() === checkDate.getTime()) {
        continuousDays++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (recordDate.getTime() < checkDate.getTime()) {
        break
      }
    }

    return continuousDays
  },

  editProfile: function() {
    wx.navigateTo({
      url: '/pages/user-info/user-info'
    })
  },

  goToPage: function(e) {
    const page = e.currentTarget.dataset.page
    const pageMap = {
      reminder:      '/pages/reminder/reminder',
      report:        '/pages/report/report',
      goal:          '/pages/goal/goal',
      achievements:  '/pages/achievements/achievements',
      privacy:       '/pages/privacy/privacy',
      notification:  '/pages/notification/notification',
      help:          '/pages/help/help',
      about:         '/pages/about/about'
    }
    const url = pageMap[page]
    if (url) {
      wx.navigateTo({ url })
    } else {
      wx.showToast({ title: '页面不存在', icon: 'none' })
    }
  },

  logout: function() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗?',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync()
          app.globalData.userInfo = null
          app.globalData.assessmentHistory = []
          app.globalData.healthData = []

          wx.showToast({
            title: '已退出',
            icon: 'success'
          })

          this.setData({
            userName: '健康用户',
            assessmentCount: 0,
            dataRecordCount: 0,
            continuousDays: 0,
            userGender: '',
            userAge: '',
            userEducation: ''
          })
        }
      }
    })
  }
})
