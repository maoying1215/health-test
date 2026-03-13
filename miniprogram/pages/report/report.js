const app = getApp()

Page({
  data: {
    reportDate: '',
    healthScore: 0,
    scoreDesc: '',
    dimensions: [],
    recentRecords: [],
    adviceList: []
  },

  onLoad: function() {
    this.generateReport()
  },

  onShow: function() {
    this.generateReport()
  },

  generateReport: function() {
    const now = new Date()
    const dateStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日`

    const assessmentHistory = app.globalData.assessmentHistory || []
    const healthData = app.globalData.healthData || []

    // 综合打分（示例逻辑）
    let score = 60
    if (assessmentHistory.length > 0) score += 10
    if (healthData.length >= 3) score += 10
    if (healthData.length >= 7) score += 10
    score = Math.min(score, 100)

    let scoreDesc = '继续努力，保持健康好习惯！'
    if (score >= 80) scoreDesc = '非常棒！您的健康状况良好 🎉'
    else if (score >= 70) scoreDesc = '不错！继续保持健康习惯 👍'

    const dimensions = [
      { icon: '🏃', name: '运动情况', score: Math.min(60 + healthData.length * 5, 100), color: '#94b088', comment: healthData.length > 5 ? '坚持运动，状态良好' : '建议增加运动频率' },
      { icon: '😴', name: '睡眠质量', score: 72, color: '#a0d6e4', comment: '睡眠时长基本达标，注意规律作息' },
      { icon: '🍎', name: '饮食习惯', score: 68, color: '#f7c873', comment: '饮食较为均衡，可适量减少油脂摄入' },
      { icon: '🧠', name: '心理健康', score: 80, color: '#b8a0d6', comment: '心态积极，继续保持' },
    ]

    const recentRecords = healthData.slice(0, 7).map(item => {
      const d = new Date(item.timestamp)
      return {
        date: `${d.getMonth()+1}/${d.getDate()}`,
        tags: [item.type || '健康记录']
      }
    })

    const adviceList = [
      { icon: '💧', text: '每天保证饮水1500-2000ml，促进新陈代谢' },
      { icon: '🏃', text: '建议每周进行至少3次有氧运动，每次30分钟以上' },
      { icon: '😴', text: '保持规律作息，每天保证7-8小时高质量睡眠' },
      { icon: '🥗', text: '均衡饮食，多摄入蔬菜水果，减少高糖高脂食物' },
      { icon: '🧘', text: '适当减压，保持良好心态，可尝试冥想或瑜伽' }
    ]

    this.setData({ reportDate: dateStr, healthScore: score, scoreDesc, dimensions, recentRecords, adviceList })
  },

  shareReport: function() {
    wx.showToast({ title: '分享功能开发中', icon: 'none' })
  }
})
