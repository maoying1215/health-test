Page({
  data: {
    messages: [],
    inputText: '',
    isTyping: false,
    showQuickQuestions: true,
    scrollToView: '',
    quickQuestions: [
      '我最近压力很大怎么办?',
      '如何改善睡眠质量?',
      '代谢综合征是什么?',
      '如何制定健康饮食计划?'
    ]
  },

  onLoad: function() {
    // 初始化欢迎消息
    this.addMessage('ai', '您好!我是您的AI健康助手,专注于心理-代谢健康管理。请问有什么可以帮助您的吗?')
  },

  onInput: function(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  sendMessage: function() {
    const text = this.data.inputText.trim()
    if (!text) return

    // 隐藏快捷问题
    this.setData({
      showQuickQuestions: false
    })

    // 添加用户消息
    this.addMessage('user', text)

    // 清空输入框
    this.setData({
      inputText: ''
    })

    // 模拟AI思考
    this.setData({
      isTyping: true
    })

    // 模拟AI回复
    setTimeout(() => {
      this.generateAIResponse(text)
    }, 1500)
  },

  sendQuickQuestion: function(e) {
    const question = e.currentTarget.dataset.question
    this.setData({
      inputText: question
    })
    this.sendMessage()
  },

  addMessage: function(type, content) {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    
    const messages = this.data.messages
    messages.push({
      id: messages.length,
      type: type,
      content: content,
      time: time
    })

    this.setData({
      messages: messages,
      scrollToView: `msg-${messages.length - 1}`
    })
  },

  generateAIResponse: function(userMessage) {
    // 这里是模拟的AI回复逻辑
    let response = ''
    
    if (userMessage.includes('压力') || userMessage.includes('焦虑')) {
      response = '我理解您目前的压力状况。基于您的描述,我建议:\n\n1. 每天进行10-15分钟的深呼吸练习\n2. 保持规律的作息时间\n3. 适当进行有氧运动,如快走、慢跑\n4. 如果压力持续严重,建议寻求专业心理咨询\n\n请问您想了解更多关于压力管理的具体方法吗?'
    } else if (userMessage.includes('睡眠')) {
      response = '良好的睡眠对身心健康至关重要。以下是一些改善睡眠的建议:\n\n1. 建立固定的睡眠时间\n2. 睡前1小时避免使用电子设备\n3. 保持卧室环境舒适、安静、黑暗\n4. 避免睡前饮用咖啡因饮料\n5. 可以尝试睡前冥想或轻度拉伸\n\n您目前的主要睡眠问题是什么呢?'
    } else if (userMessage.includes('代谢') || userMessage.includes('血糖') || userMessage.includes('血压')) {
      response = '代谢综合征是一组代谢异常的集合,包括:\n\n• 中心性肥胖\n• 高血压\n• 高血糖\n• 血脂异常\n\n建议您:\n1. 定期监测相关指标\n2. 保持健康饮食,控制热量摄入\n3. 每周至少150分钟中等强度运动\n4. 定期体检\n\n如需详细的个性化建议,建议上传您的体检报告。'
    } else if (userMessage.includes('饮食') || userMessage.includes('营养')) {
      response = '健康饮食计划的核心原则:\n\n1. 三餐规律,定时定量\n2. 增加蔬菜水果摄入\n3. 选择优质蛋白质来源\n4. 控制油盐糖摄入\n5. 保证充足水分\n\n建议:\n• 早餐:全谷物+蛋白质+水果\n• 午餐:七分饱,荤素搭配\n• 晚餐:清淡为主,五分饱\n\n您有特殊的饮食需求或限制吗?'
    } else {
      response = '感谢您的提问。作为AI健康助手,我可以为您提供:\n\n✓ 心理健康咨询与建议\n✓ 代谢健康风险评估\n✓ 生活方式改善指导\n✓ 健康数据解读\n\n请告诉我您具体想了解哪方面的内容,我会为您提供专业的建议。\n\n温馨提示:AI建议仅供参考,如有严重健康问题请及时就医。'
    }

    this.setData({
      isTyping: false
    })

    this.addMessage('ai', response)
  }
})