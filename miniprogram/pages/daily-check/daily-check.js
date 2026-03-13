Page({
  data: {
    // 当前日期信息
    currentDate: '',
    weekDay: '',
    fullDate: '',
    
    // 打卡记录
    checkedItems: [],
    
    // 显示选择弹窗
    showSelectModal: false,
    
    // 可选的打卡项目（原始数据）
    checkOptions: [
      { id: 'questionnaire', name: '问卷评估', icon: '📋', category: '评估任务' },
      { id: 'ai-chat', name: 'AI聊天', icon: '🤖', category: '评估任务' },
      { id: 'cloud-breath', name: '云雾呼吸', icon: '☁️', category: '放松活动' },
      { id: 'hourglass-focus', name: '沙漏专注', icon: '⏳', category: '放松活动' },
      { id: 'mindfulness', name: '正念冥想', icon: '🧘', category: '放松活动' },
      { id: 'rain-meditation', name: '雨滴冥想', icon: '🌧️', category: '放松活动' }
    ],
    
    // 分类后的选项（用于渲染）
    taskOptions: [],
    activityOptions: [],
    
    // 临时选中的项目ID列表
    tempSelected: [],
    
    // 鼓励语列表
    encourageWords: [
      '太棒了！每一次坚持都是对自己的投资 💪',
      '你做得很好！持续的努力终将带来改变 ✨',
      '为自己的坚持点赞！健康生活从今天开始 🌟',
      '真厉害！小小的坚持，大大的进步 🎉',
      '你的努力值得被看见！继续加油 💖',
      '每天进步一点点，未来的你会感谢现在的自己 🌈',
      '坚持就是胜利！你已经在变得更好了 🏆',
      '今天的付出是明天的收获，为你鼓掌 👏'
    ],
    
    // 连续打卡天数
    streakDays: 0,
    
    // 今日已打卡次数
    todayCheckCount: 0
  },

  onLoad: function() {
    this.initDate()
    this.loadTodayRecords()
    this.calculateStreak()
  },

  onShow: function() {
    this.loadTodayRecords()
  },

  // 初始化日期显示
  initDate: function() {
    const now = new Date()
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    const year = now.getFullYear()
    const month = (now.getMonth() + 1).toString().padStart(2, '0')
    const day = now.getDate().toString().padStart(2, '0')
    
    this.setData({
      currentDate: `${month}月${day}日`,
      weekDay: weekDays[now.getDay()],
      fullDate: `${year}-${month}-${day}`
    })
  },

  loadTodayRecords: function() {
    try {
      const records = wx.getStorageSync('dailyCheckRecords') || {}
      const todayRecords = records[this.data.fullDate] || []
      
      this.setData({
        checkedItems: todayRecords,
        todayCheckCount: todayRecords.length
      })
    } catch (e) {
      console.error('加载打卡记录失败:', e)
    }
  },

  // 计算连续打卡天数
  calculateStreak: function() {
    try {
      const records = wx.getStorageSync('dailyCheckRecords') || {}
      let streak = 0
      const today = new Date()
      
      // 从今天开始往前检查
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(today.getDate() - i)
        const dateStr = this.formatDate(checkDate)
        
        if (records[dateStr] && records[dateStr].length > 0) {
          streak++
        } else if (i > 0) {
          // 如果不是今天且没有记录，中断连续
          break
        }
      }
      
      this.setData({ streakDays: streak })
    } catch (e) {
      console.error('计算连续打卡失败:', e)
    }
  },

  // 格式化日期
  formatDate: function(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  // 更新选项列表状态
  updateOptionsState: function() {
    const { checkOptions, checkedItems, tempSelected } = this.data
    const checkedIds = checkedItems.map(function(item) {
      return item.id
    })
    
    const taskOptions = []
    const activityOptions = []
    
    checkOptions.forEach(function(option) {
      const newOption = {
        id: option.id,
        name: option.name,
        icon: option.icon,
        category: option.category,
        isSelected: tempSelected.indexOf(option.id) > -1,
        isChecked: checkedIds.indexOf(option.id) > -1
      }
      
      if (option.category === '评估任务') {
        taskOptions.push(newOption)
      } else {
        activityOptions.push(newOption)
      }
    })
    
    this.setData({
      taskOptions: taskOptions,
      activityOptions: activityOptions
    })
  },

  // 打开选择弹窗
  openSelectModal: function() {
    this.setData({
      showSelectModal: true,
      tempSelected: []
    })
    this.updateOptionsState()
  },

  // 关闭选择弹窗
  closeSelectModal: function() {
    this.setData({
      showSelectModal: false,
      tempSelected: []
    })
  },

  // 切换选项选中状态
  toggleOption: function(e) {
    const itemId = e.currentTarget.dataset.id
    const tempSelected = this.data.tempSelected.slice()
    const checkedIds = this.data.checkedItems.map(function(item) {
      return item.id
    })
    
    // 检查是否已经打卡过
    if (checkedIds.indexOf(itemId) > -1) {
      wx.showToast({
        title: '今日已打卡该项目',
        icon: 'none'
      })
      return
    }
    
    const index = tempSelected.indexOf(itemId)
    if (index > -1) {
      tempSelected.splice(index, 1)
    } else {
      tempSelected.push(itemId)
    }
    
    this.setData({ tempSelected: tempSelected })
    this.updateOptionsState()
  },

  // 确认选择
  confirmSelect: function() {
    const that = this
    const { tempSelected, checkOptions, checkedItems, fullDate } = this.data
    
    if (tempSelected.length === 0) {
      wx.showToast({
        title: '请至少选择一项',
        icon: 'none'
      })
      return
    }
    
    // 获取选中的项目详情
    const newItems = []
    tempSelected.forEach(function(id) {
      const option = checkOptions.find(function(opt) {
        return opt.id === id
      })
      if (option) {
        newItems.push({
          id: option.id,
          name: option.name,
          icon: option.icon,
          time: that.getCurrentTime(),
          encourage: that.getRandomEncourage()
        })
      }
    })
    
    // 合并到已打卡列表
    const updatedItems = checkedItems.concat(newItems)
    
    // 保存到本地存储
    this.saveRecords(fullDate, updatedItems)
    
    this.setData({
      checkedItems: updatedItems,
      todayCheckCount: updatedItems.length,
      showSelectModal: false,
      tempSelected: []
    })
    
    // 重新计算连续打卡
    this.calculateStreak()
    
    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    })
  },

  // 获取当前时间
  getCurrentTime: function() {
    const now = new Date()
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0')
  },

  // 获取随机鼓励语
  getRandomEncourage: function() {
    const { encourageWords } = this.data
    const randomIndex = Math.floor(Math.random() * encourageWords.length)
    return encourageWords[randomIndex]
  },

  // 保存打卡记录
  saveRecords: function(date, items) {
    try {
      const records = wx.getStorageSync('dailyCheckRecords') || {}
      records[date] = items
      wx.setStorageSync('dailyCheckRecords', records)
    } catch (e) {
      console.error('保存打卡记录失败:', e)
    }
  },

  // 删除打卡记录
  deleteCheckItem: function(e) {
    const that = this
    const itemId = e.currentTarget.dataset.id
    const { checkedItems, fullDate } = this.data
    
    wx.showModal({
      title: '提示',
      content: '确定要删除这条打卡记录吗？',
      success: function(res) {
        if (res.confirm) {
          const updatedItems = checkedItems.filter(function(item) {
            return item.id !== itemId
          })
          that.saveRecords(fullDate, updatedItems)
          
          that.setData({
            checkedItems: updatedItems,
            todayCheckCount: updatedItems.length
          })
          
          that.calculateStreak()
          
          wx.showToast({
            title: '已删除',
            icon: 'success'
          })
        }
      }
    })
  },

  // 阻止触摸穿透
  preventTouchMove: function() {
    return false
  },

  // 查看历史记录
  viewHistory: function() {
    wx.showToast({
      title: '历史记录功能开发中',
      icon: 'none'
    })
  }
})