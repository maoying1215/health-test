const app = getApp()

Page({
  data: {
    reminderList: [],
    showModal: false,
    newReminder: {
      title: '',
      time: '08:00',
      repeatIndex: 0
    },
    repeatOptions: ['每天', '工作日', '周末', '仅一次'],
    suggestedReminders: [
      { id: 's1', icon: '💊', title: '服药提醒', desc: '每天定时提醒服药' },
      { id: 's2', icon: '🚶', title: '运动提醒', desc: '每天提醒坚持运动' },
      { id: 's3', icon: '💧', title: '喝水提醒', desc: '定时提醒补充水分' },
      { id: 's4', icon: '😴', title: '睡眠提醒', desc: '提醒按时作息' },
      { id: 's5', icon: '🍎', title: '饮食提醒', desc: '提醒按时规律饮食' }
    ]
  },

  onLoad: function() {
    this.loadReminders()
  },

  loadReminders: function() {
    const list = wx.getStorageSync('reminderList') || []
    this.setData({ reminderList: list })
  },

  saveReminders: function() {
    wx.setStorageSync('reminderList', this.data.reminderList)
  },

  showAddModal: function() {
    this.setData({ showModal: true, newReminder: { title: '', time: '08:00', repeatIndex: 0 } })
  },

  hideModal: function() {
    this.setData({ showModal: false })
  },

  stopProp: function() {},

  onTitleInput: function(e) {
    this.setData({ 'newReminder.title': e.detail.value })
  },

  onTimeChange: function(e) {
    this.setData({ 'newReminder.time': e.detail.value })
  },

  onRepeatChange: function(e) {
    this.setData({ 'newReminder.repeatIndex': e.detail.value })
  },

  confirmAdd: function() {
    const { title, time, repeatIndex } = this.data.newReminder
    if (!title.trim()) {
      wx.showToast({ title: '请输入提醒名称', icon: 'none' })
      return
    }
    const repeatTexts = ['每天', '工作日', '周末', '仅一次']
    const reminder = {
      id: Date.now(),
      icon: '⏰',
      title: title.trim(),
      time,
      repeatIndex,
      repeatText: repeatTexts[repeatIndex],
      enabled: true
    }
    const list = [...this.data.reminderList, reminder]
    this.setData({ reminderList: list, showModal: false })
    this.saveReminders()
    wx.showToast({ title: '添加成功', icon: 'success' })
  },

  toggleReminder: function(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.reminderList.map(item =>
      item.id === id ? { ...item, enabled: e.detail.value } : item
    )
    this.setData({ reminderList: list })
    this.saveReminders()
  },

  deleteReminder: function(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '确定删除此提醒吗?',
      success: (res) => {
        if (res.confirm) {
          const list = this.data.reminderList.filter(item => item.id !== id)
          this.setData({ reminderList: list })
          this.saveReminders()
        }
      }
    })
  },

  addSuggested: function(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showModal: true,
      newReminder: { title: item.title, time: '08:00', repeatIndex: 0 }
    })
  }
})
