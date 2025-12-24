const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userName: '',
    hasHealthData: false,
    psychologicalScore: 0,
    psychologicalLevel: '',
    bmi: 0,
    bmiLevel: '',
    bloodSugar: 0,
    bloodSugarLevel: '',
    todayAdvice: []
  },

  onLoad: function() {
    this.loadUserData()
    this.loadHealthData()
  },

  onShow: function() {
    this.loadHealthData()
  },

  loadUserData: function() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userName: userInfo.nickName || userInfo.name
      })
    }
  },

  loadHealthData: function() {
    const assessmentHistory = app.globalData.assessmentHistory
    const healthData = app.globalData.healthData

    if (assessmentHistory.length > 0) {
      const latest = assessmentHistory[0]
      this.setData({
        hasHealthData: true,
        psychologicalScore: latest.psychologicalScore || 0,
        psychologicalLevel: util.getPsychologicalLevel(latest.psychologicalScore || 0)
      })

      // 生成今日建议
      const advice = util.generateHealthAdvice(latest)
      const todayAdvice = [
        ...advice.psychological.slice(0, 1),
        ...advice.metabolic.slice(0, 1),
        ...advice.lifestyle.slice(0, 1)
      ]
      this.setData({ todayAdvice })
    }

    if (healthData.length > 0) {
      const latest = healthData[0]
      const bmi = util.calculateBMI(latest.weight, latest.height)
      this.setData({
        bmi: bmi,
        bmiLevel: util.getBMILevel(parseFloat(bmi)),
        bloodSugar: latest.bloodSugar || 0,
        bloodSugarLevel: latest.bloodSugar > 6.1 ? '偏高' : '正常'
      })
    }
  },

  goToAssessment: function(e) {
    const type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `/pages/assessment/assessment?type=${type}`
    })
  },

  goToHealthData: function() {
    wx.switchTab({
      url: '/pages/health-data/health-data'
    })
  },

  goToCommunity: function() {
    wx.switchTab({
      url: '/pages/community/community'
    })
  },

  goToProfile: function() {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  },

  showComingSoon: function() {
    wx.showToast({
      title: '功能开发中...',
      icon: 'none'
    })
  }
})
