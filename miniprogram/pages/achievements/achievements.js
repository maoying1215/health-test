const app = getApp()

Page({
  data: {
    categories: [],
    unlockedCount: 0,
    totalCount: 0,
    progressPct: 0,
    showDetail: false,
    selectedBadge: {}
  },

  onLoad: function() {
    this.loadAchievements()
  },

  onShow: function() {
    this.loadAchievements()
  },

  loadAchievements: function() {
    const assessmentCount = (app.globalData.assessmentHistory || []).length
    const dataCount = (app.globalData.healthData || []).length

    const categories = [
      {
        name: '🌱 入门成就',
        badges: [
          { id: 'a1', icon: '🎉', name: '初次登录', desc: '完成首次登录', condition: '首次登录', unlocked: true },
          { id: 'a2', icon: '📋', name: '首次评估', desc: '完成第一次健康评估', condition: '完成1次评估', unlocked: assessmentCount >= 1 },
          { id: 'a3', icon: '📊', name: '数据达人', desc: '记录健康数据', condition: '记录1条数据', unlocked: dataCount >= 1 }
        ]
      },
      {
        name: '🔥 坚持成就',
        badges: [
          { id: 'b1', icon: '📅', name: '三天打卡', desc: '连续记录3天健康数据', condition: '连续打卡3天', unlocked: dataCount >= 3 },
          { id: 'b2', icon: '🗓️', name: '一周习惯', desc: '连续记录7天健康数据', condition: '连续打卡7天', unlocked: dataCount >= 7 },
          { id: 'b3', icon: '🏅', name: '月度坚持', desc: '连续记录30天健康数据', condition: '连续打卡30天', unlocked: dataCount >= 30 }
        ]
      },
      {
        name: '💪 进阶成就',
        badges: [
          { id: 'c1', icon: '🔬', name: '评估专家', desc: '完成5次健康评估', condition: '完成5次评估', unlocked: assessmentCount >= 5 },
          { id: 'c2', icon: '🌟', name: '健康达人', desc: '完成10次健康评估', condition: '完成10次评估', unlocked: assessmentCount >= 10 },
          { id: 'c3', icon: '🏆', name: '健康冠军', desc: '综合健康评分超过90分', condition: '健康评分≥90', unlocked: false }
        ]
      }
    ]

    let unlocked = 0, total = 0
    categories.forEach(cat => {
      cat.badges.forEach(b => {
        total++
        if (b.unlocked) unlocked++
      })
    })

    this.setData({
      categories,
      unlockedCount: unlocked,
      totalCount: total,
      progressPct: Math.round(unlocked / total * 100)
    })
  },

  showBadgeDetail: function(e) {
    const badge = e.currentTarget.dataset.badge
    this.setData({ showDetail: true, selectedBadge: badge })
  },

  hideDetail: function() {
    this.setData({ showDetail: false })
  },

  stopProp: function() {}
})
