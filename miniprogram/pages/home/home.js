const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    userName: '用户',
    hasHealthData: false,
    
    // 心理评估数据
    phq9Score: 0,
    phq9Level: '未评估',
    gad7Score: 0,
    gad7Level: '未评估',
    overallScore: 0,
    
    // 建议列表
    todayAdvice: [],
    
    // 最后评估时间
    lastAssessmentDate: '',

    // 使用天数弹窗相关
    showDaysModal: false,
    useDays: 1,
    encourageText: '坚持健康管理，遇见更好的自己！'
  },

  onLoad: function() {
    this.loadUserData()
    this.loadHealthData()
    // 延迟显示弹窗，确保页面数据加载完成
    setTimeout(() => {
      this.checkAndShowModal()
    }, 300)
  },

  onShow: function() {
    this.loadHealthData()
  },

  loadUserData: function() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      this.setData({
        userName: userInfo.nickName || userInfo.name || '用户'
      })
    }
  },

  loadHealthData: function() {
    const assessmentHistory = app.globalData.assessmentHistory

    if (assessmentHistory && assessmentHistory.length > 0) {
      const latest = assessmentHistory[0]
      
      this.setData({
        hasHealthData: true,
        phq9Score: latest.phq9Score || 0,
        phq9Level: latest.phq9Level || '未评估',
        gad7Score: latest.gad7Score || 0,
        gad7Level: latest.gad7Level || '未评估',
        overallScore: latest.overallScore || 0,
        todayAdvice: latest.adviceList || [],
        lastAssessmentDate: latest.date || ''
      })
    } else {
      this.setData({
        hasHealthData: false,
        todayAdvice: [
          '欢迎使用心理-代谢健康管理系统',
          '建议先完成心理健康评估',
          '了解您当前的心理状态'
        ]
      })
    }
  },

  checkAndShowModal: function() {
    try {
      const daysData = this.calculateUseDays()
      
      this.setData({
        useDays: daysData.days,
        encourageText: daysData.text,
        showDaysModal: true
      })
    } catch (e) {
      console.error('显示弹窗失败:', e)
    }
  },

  calculateUseDays: function() {
    try {
      let firstUseDate = wx.getStorageSync('firstUseDate')
      
      if (!firstUseDate) {
        // 首次使用，记录当前日期
        firstUseDate = new Date().toDateString()
        wx.setStorageSync('firstUseDate', firstUseDate)
      }
      
      // 计算天数差
      const firstDate = new Date(firstUseDate)
      const today = new Date()
      
      // 重置时间部分，只比较日期
      firstDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      
      const diffTime = today.getTime() - firstDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 因为第一天算第1天
      
      // 根据天数生成鼓励文案
      const encourageText = this.getEncourageText(diffDays)
      
      return {
        days: diffDays,
        text: encourageText
      }
    } catch (e) {
      console.error('计算使用天数失败:', e)
      return {
        days: 1,
        text: '欢迎开始您的健康之旅！'
      }
    }
  },

  // 根据使用天数获取鼓励文案
  getEncourageText: function(days) {
    if (days === 1) {
      return '欢迎开始您的健康之旅！'
    } else if (days <= 3) {
      return '很高兴再次见到您，继续加油！'
    } else if (days <= 7) {
      return '坚持一周啦，您真棒！'
    } else if (days <= 14) {
      return '两周的坚持，习惯正在养成中！'
    } else if (days <= 30) {
      return '持续关注健康，您做得很好！'
    } else if (days <= 60) {
      return '一个月的陪伴，感谢您的信任！'
    } else if (days <= 100) {
      return '健康管理达人，继续保持！'
    } else {
      return '感谢您的长期陪伴，愿您永远健康！'
    }
  },

  // 关闭弹窗
  closeModal: function() {
    this.setData({
      showDaysModal: false
    })
  },

  // 阻止遮罩层触摸穿透
  preventTouchMove: function() {
    return false
  },

  goToAssessment: function(e) {
    const type = e.currentTarget.dataset.type
    // 通过全局变量传递参数（因为switchTab不支持传参）
    app.globalData.assessmentType = type
    wx.switchTab({
      url: '/pages/assessment/assessment',
      fail: function(err) {
        console.error('跳转失败:', err)
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        })
      }
    })
  },

  // 跳转到每日打卡页面
  goToDailyCheck: function() {
    wx.navigateTo({
      url: '/pages/daily-check/daily-check'
    })
  },

  goToAIChat: function() {
    wx.switchTab({
      url: '/pages/ai-chat/ai-chat'
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

  goToHealthData: function() {
    wx.navigateTo({
      url: '/pages/health-data/health-data'
    })
  },

  goToHealthKnowledge: function() {
    wx.navigateTo({
      url: '/pages/health-knowledge/health-knowledge'
    })
  },

  showComingSoon: function() {
    wx.showToast({
      title: '功能开发中...',
      icon: 'none'
    })
  }
})