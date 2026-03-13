Page({
  data: {
    feedbackType: 'bug',
    feedbackText: '',
    contactInfo: '',
    feedbackTypes: [
      { label: '🐛 功能异常', value: 'bug' },
      { label: '💡 功能建议', value: 'feature' },
      { label: '🎨 界面优化', value: 'ui' },
      { label: '📖 内容问题', value: 'content' },
      { label: '💬 其他', value: 'other' }
    ],
    faqList: [
      {
        id: 'f1',
        question: '如何修改个人健康信息？',
        answer: '进入「个人中心」页面，点击右上角「编辑」按钮，即可修改您的姓名、年龄、性别等个人信息。',
        expanded: false
      },
      {
        id: 'f2',
        question: '健康数据保存在哪里？',
        answer: '您的健康数据目前保存在本地设备中。清除小程序缓存或卸载小程序会导致数据丢失，建议定期在隐私设置中导出数据备份。',
        expanded: false
      },
      {
        id: 'f3',
        question: '如何设置健康提醒？',
        answer: '进入「个人中心」→「健康提醒」，点击「添加提醒」即可设置提醒时间、内容和重复频率。',
        expanded: false
      },
      {
        id: 'f4',
        question: '健康评分是如何计算的？',
        answer: '健康评分综合考虑您的评估次数、数据记录频率、运动情况、睡眠质量和饮食习惯等多个维度，满分100分。',
        expanded: false
      },
      {
        id: 'f5',
        question: '如何解锁成就徽章？',
        answer: '坚持使用健康记录、完成健康评估、达成健康目标等行为都会解锁对应的成就徽章，在「成就徽章」页面可查看获得条件。',
        expanded: false
      }
    ]
  },

  toggleFaq: function(e) {
    const id = e.currentTarget.dataset.id
    const faqList = this.data.faqList.map(f =>
      f.id === id ? { ...f, expanded: !f.expanded } : f
    )
    this.setData({ faqList })
  },

  selectType: function(e) {
    this.setData({ feedbackType: e.currentTarget.dataset.value })
  },

  onFeedbackInput: function(e) {
    this.setData({ feedbackText: e.detail.value })
  },

  onContactInput: function(e) {
    this.setData({ contactInfo: e.detail.value })
  },

  submitFeedback: function() {
    if (!this.data.feedbackText.trim()) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' })
      return
    }
    // 实际项目中这里应调用后端接口
    wx.showLoading({ title: '提交中...' })
    setTimeout(() => {
      wx.hideLoading()
      wx.showModal({
        title: '感谢您的反馈',
        content: '我们已收到您的意见，将在1-3个工作日内处理，感谢您帮助我们改进！',
        showCancel: false,
        confirmText: '好的',
        success: () => {
          this.setData({ feedbackText: '', contactInfo: '' })
        }
      })
    }, 1000)
  },

  copyEmail: function() {
    wx.setClipboardData({
      data: 'support@health-app.com',
      success: () => {
        wx.showToast({ title: '邮箱已复制', icon: 'success' })
      }
    })
  }
})
