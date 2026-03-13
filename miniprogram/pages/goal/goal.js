Page({
  data: {
    goalList: [],
    showModal: false,
    newGoal: { title: '', target: '', unit: '' },
    suggestedGoals: [
      { id: 's1', icon: '🚶', title: '每天万步走', desc: '坚持30天每天步行10000步', target: 30, unit: '天' },
      { id: 's2', icon: '💧', title: '充足饮水', desc: '连续7天每天喝够8杯水', target: 7, unit: '天' },
      { id: 's3', icon: '🏃', title: '坚持运动', desc: '本月完成20次有氧锻炼', target: 20, unit: '次' },
      { id: 's4', icon: '😴', title: '规律睡眠', desc: '连续14天11点前入睡', target: 14, unit: '天' },
      { id: 's5', icon: '📖', title: '健康学习', desc: '阅读10篇健康知识文章', target: 10, unit: '篇' }
    ]
  },

  onLoad: function() {
    this.loadGoals()
  },

  loadGoals: function() {
    const list = wx.getStorageSync('goalList') || []
    this.setData({ goalList: list })
  },

  saveGoals: function() {
    wx.setStorageSync('goalList', this.data.goalList)
  },

  showAddModal: function() {
    this.setData({ showModal: true, newGoal: { title: '', target: '', unit: '' } })
  },

  hideModal: function() {
    this.setData({ showModal: false })
  },

  stopProp: function() {},

  onTitleInput: function(e) { this.setData({ 'newGoal.title': e.detail.value }) },
  onTargetInput: function(e) { this.setData({ 'newGoal.target': e.detail.value }) },
  onUnitInput: function(e) { this.setData({ 'newGoal.unit': e.detail.value }) },

  confirmAdd: function() {
    const { title, target, unit } = this.data.newGoal
    if (!title.trim()) { wx.showToast({ title: '请输入目标名称', icon: 'none' }); return }
    if (!target || isNaN(target) || Number(target) <= 0) { wx.showToast({ title: '请输入有效目标数值', icon: 'none' }); return }
    const icons = ['🎯', '💪', '🏃', '🌟', '✨']
    const goal = {
      id: Date.now(),
      icon: icons[Math.floor(Math.random() * icons.length)],
      title: title.trim(),
      desc: `目标：${target} ${unit || '次'}`,
      target: Number(target),
      current: 0,
      unit: unit || '次',
      pct: 0,
      completed: false
    }
    const list = [...this.data.goalList, goal]
    this.setData({ goalList: list, showModal: false })
    this.saveGoals()
    wx.showToast({ title: '目标已添加', icon: 'success' })
  },

  updateProgress: function(e) {
    const { id, delta } = e.currentTarget.dataset
    const list = this.data.goalList.map(item => {
      if (item.id === id) {
        const current = Math.max(0, Math.min(item.current + Number(delta), item.target))
        const pct = Math.round(current / item.target * 100)
        return { ...item, current, pct, completed: current >= item.target }
      }
      return item
    })
    this.setData({ goalList: list })
    this.saveGoals()
  },

  deleteGoal: function(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示', content: '确定删除此目标吗?',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.goalList.filter(item => item.id !== id)
          this.setData({ goalList: list })
          this.saveGoals()
        }
      }
    })
  },

  addSuggested: function(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showModal: true,
      newGoal: { title: item.title, target: String(item.target), unit: item.unit }
    })
  }
})
