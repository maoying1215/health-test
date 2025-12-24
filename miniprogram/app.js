App({
  globalData: {
    userInfo: null,
    assessmentHistory: [],
    healthData: []
  },

  onLaunch: function () {
    console.log('小程序启动')
    this.loadLocalData()
  },

  loadLocalData: function() {
    try {
      const assessmentHistory = wx.getStorageSync('assessmentHistory')
      const healthData = wx.getStorageSync('healthData')
      const userInfo = wx.getStorageSync('userInfo')
      
      if (assessmentHistory) {
        this.globalData.assessmentHistory = assessmentHistory
      }
      if (healthData) {
        this.globalData.healthData = healthData
      }
      if (userInfo) {
        this.globalData.userInfo = userInfo
      }
    } catch (e) {
      console.error('加载本地数据失败', e)
    }
  },

  saveAssessmentResult: function(result) {
    this.globalData.assessmentHistory.unshift(result)
    wx.setStorageSync('assessmentHistory', this.globalData.assessmentHistory)
  },

  saveHealthData: function(data) {
    this.globalData.healthData.unshift(data)
    wx.setStorageSync('healthData', this.globalData.healthData)
  },

  saveUserInfo: function(userInfo) {
    this.globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
  }
})
