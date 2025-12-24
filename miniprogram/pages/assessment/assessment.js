const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    selectedType: 'psychological',
    assessmentStarted: false,
    showResult: false,
    questions: [],
    currentIndex: 0,
    currentQuestion: {},
    selectedOption: -1,
    answers: [],
    progress: 0,
    totalScore: 0,
    scoreLevel: '',
    psychologicalDetails: {},
    metabolicDetails: {},
    adviceList: []
  },

  onLoad: function(options) {
    if (options.type) {
      this.setData({
        selectedType: options.type
      })
      this.startAssessment()
    }
  },

  selectType: function(e) {
    this.setData({
      selectedType: e.currentTarget.dataset.type
    })
  },

  startAssessment: function() {
    const questions = this.getQuestions(this.data.selectedType)
    this.setData({
      assessmentStarted: true,
      questions: questions,
      currentQuestion: questions[0],
      currentIndex: 0,
      answers: new Array(questions.length).fill(-1),
      progress: 0
    })
  },

  getQuestions: function(type) {
    const psychologicalQuestions = [
      {
        question: '您最近一周的情绪状态如何?',
        options: ['非常好,充满活力', '比较好,心情愉快', '一般,有时低落', '较差,经常焦虑或抑郁'],
        scores: [4, 3, 2, 1]
      },
      {
        question: '您最近的睡眠质量怎么样?',
        options: ['很好,睡眠充足', '还可以,偶尔失眠', '一般,经常入睡困难', '很差,严重失眠'],
        scores: [4, 3, 2, 1]
      },
      {
        question: '您感到压力大吗?',
        options: ['没有压力', '压力较小', '压力适中', '压力很大'],
        scores: [4, 3, 2, 1]
      },
      {
        question: '您对工作/学习的热情如何?',
        options: ['非常有热情', '比较有热情', '热情一般', '缺乏热情'],
        scores: [4, 3, 2, 1]
      },
      {
        question: '您与家人朋友的关系如何?',
        options: ['非常融洽', '比较和谐', '一般', '经常有矛盾'],
        scores: [4, 3, 2, 1]
      }
    ]

    const metabolicQuestions = [
      {
        question: '您的BMI指数(体重kg/身高m²)在什么范围?',
        options: ['18.5-24(正常)', '24-28(偏胖)', '小于18.5(偏瘦)', '大于28(肥胖)'],
        scores: [4, 2, 3, 1]
      },
      {
        question: '您平均每周运动几次?',
        options: ['4次以上', '2-3次', '1次', '几乎不运动'],
        scores: [4, 3, 2, 1]
      },
      {
        question: '您的饮食习惯如何?',
        options: ['规律健康,营养均衡', '比较规律', '不太规律', '很不规律,经常暴饮暴食'],
        scores: [4, 3, 2, 1]
      },
      {
        question: '您每天的饮水量大约是多少?',
        options: ['1500ml以上', '1000-1500ml', '500-1000ml', '少于500ml'],
        scores: [4, 3, 2, 1]
      },
      {
        question: '您是否有定期体检的习惯?',
        options: ['每年体检', '偶尔体检', '很少体检', '从不体检'],
        scores: [4, 3, 2, 1]
      }
    ]

    if (type === 'psychological') {
      return psychologicalQuestions
    } else if (type === 'metabolic') {
      return metabolicQuestions
    } else {
      return [...psychologicalQuestions, ...metabolicQuestions]
    }
  },

  selectOption: function(e) {
    const index = e.currentTarget.dataset.index
    const answers = this.data.answers
    answers[this.data.currentIndex] = index
    this.setData({
      selectedOption: index,
      answers: answers
    })
  },

  nextQuestion: function() {
    if (this.data.selectedOption === -1) {
      wx.showToast({
        title: '请选择一个选项',
        icon: 'none'
      })
      return
    }

    const currentIndex = this.data.currentIndex
    const questionsLength = this.data.questions.length

    if (currentIndex === questionsLength - 1) {
      this.calculateResult()
    } else {
      const nextIndex = currentIndex + 1
      const nextAnswer = this.data.answers[nextIndex]
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: this.data.questions[nextIndex],
        selectedOption: nextAnswer,
        progress: ((nextIndex + 1) / questionsLength) * 100
      })
    }
  },

  previousQuestion: function() {
    const prevIndex = this.data.currentIndex - 1
    const prevAnswer = this.data.answers[prevIndex]
    this.setData({
      currentIndex: prevIndex,
      currentQuestion: this.data.questions[prevIndex],
      selectedOption: prevAnswer,
      progress: ((prevIndex + 1) / this.data.questions.length) * 100
    })
  },

  calculateResult: function() {
    const { questions, answers } = this.data
    let totalScore = 0
    let maxScore = 0

    questions.forEach((q, i) => {
      const score = q.scores[answers[i]]
      totalScore += score
      maxScore += 4
    })

    const percentage = Math.round((totalScore / maxScore) * 100)
    const scoreLevel = util.getPsychologicalLevel(percentage)

    const psychologicalDetails = {
      emotion: percentage >= 75 ? '优秀' : percentage >= 50 ? '良好' : '需改善',
      stress: percentage >= 75 ? '低' : percentage >= 50 ? '中等' : '较高',
      sleep: percentage >= 75 ? '优质' : percentage >= 50 ? '良好' : '需改善'
    }

    const metabolicDetails = {
      bmi: '正常范围',
      exercise: percentage >= 75 ? '充足' : percentage >= 50 ? '适中' : '不足',
      diet: percentage >= 75 ? '健康' : percentage >= 50 ? '一般' : '需改善'
    }

    const adviceList = this.generateAdvice(percentage)

    this.setData({
      showResult: true,
      totalScore: percentage,
      scoreLevel: scoreLevel,
      psychologicalDetails: psychologicalDetails,
      metabolicDetails: metabolicDetails,
      adviceList: adviceList
    })

    this.saveResult(percentage)
  },

  generateAdvice: function(score) {
    const advice = []
    
    if (score < 60) {
      advice.push('建议增加运动频次,每周至少3-5次,每次30分钟以上')
      advice.push('改善饮食结构,增加蔬菜水果摄入,减少高糖高脂食物')
      advice.push('调整作息时间,保证每天7-8小时睡眠')
      advice.push('学习压力管理技巧,如深呼吸、冥想等')
      advice.push('定期进行健康检查,监测各项健康指标')
    } else if (score < 80) {
      advice.push('保持现有的良好习惯,继续坚持规律运动')
      advice.push('进一步优化饮食结构,注意营养均衡')
      advice.push('保持良好的睡眠习惯,避免熬夜')
      advice.push('适当进行放松活动,缓解工作压力')
    } else {
      advice.push('您的健康状况很好,请继续保持')
      advice.push('可以尝试更多样化的运动方式')
      advice.push('分享您的健康经验,帮助他人改善健康')
    }

    return advice
  },

  saveResult: function(score) {
    const result = {
      type: this.data.selectedType,
      psychologicalScore: score,
      timestamp: Date.now(),
      date: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }
    app.saveAssessmentResult(result)
  },

  viewHistory: function() {
    wx.switchTab({
      url: '/pages/health-data/health-data'
    })
  },

  restart: function() {
    this.setData({
      assessmentStarted: false,
      showResult: false,
      currentIndex: 0,
      selectedOption: -1,
      answers: [],
      progress: 0
    })
  }
})
