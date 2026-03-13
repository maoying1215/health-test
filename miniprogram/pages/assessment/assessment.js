const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    selectedType: 'psychological', // psychological, physiological, lifestyle
    assessmentStarted: false,
    showResult: false,
    
    // 当前进度
    currentSection: 'phq9', // phq9, gad7, lifestyle
    currentIndex: 0,
    selectedOption: -1,
    
    // 答案存储
    phq9Answers: new Array(9).fill(-1),
    gad7Answers: new Array(7).fill(-1),
    lifestyleAnswers: {},
    
    // 生理指标数据
    physioData: {
      gender: '',
      age: '',
      height: '',
      weight: '',
      waistline: '',
      systolicBP: '',
      diastolicBP: '',
      fastingGlucose: '',
      ogttGlucose: '',
      triglycerides: '',
      hdlCholesterol: ''
    },
    
    // BMI计算相关
    calculatedBMI: '',
    bmiStatus: '',
    bmiStatusText: '',
    
    // 题目数据
    currentQuestion: {},
    
    // 结果数据
    phq9Score: 0,
    phq9Level: '',
    gad7Score: 0,
    gad7Level: '',
    overallScore: 0,
    adviceList: [],
    
    // 生理指标结果
    hasMetabolicSyndrome: false,
    metabolicCriteriaCount: 0,
    physioResults: {
      obesity: { abnormal: false, bmi: '', waistline: '' },
      hypertension: { abnormal: false },
      hyperglycemia: { abnormal: false },
      highTriglycerides: { abnormal: false },
      lowHDL: { abnormal: false }
    },
    
    // 进度
    progress: 0,
    totalQuestions: 0,
    answeredQuestions: 0
  },

  onLoad: function(options) {
    // 尝试加载已保存的答案
    this.loadSavedAnswers()
    
    // 优先从options获取，其次从globalData获取
    const type = options.type || app.globalData.assessmentType
    if (type) {
      this.setData({
        selectedType: type
      })
      // 清除全局变量，避免下次影响
      app.globalData.assessmentType = null
      
      if (options.auto === 'true') {
        this.startAssessment()
      }
    }
  },

  onShow: function() {
    // tabBar页面需要在onShow中也检查参数（因为可能不触发onLoad）
    const type = app.globalData.assessmentType
    if (type) {
      this.setData({
        selectedType: type
      })
      // 清除全局变量
      app.globalData.assessmentType = null
    }
  },

  onUnload: function() {
    // 页面卸载时自动保存进度
    if (this.data.assessmentStarted && !this.data.showResult) {
      this.saveProgress()
    }
  },

  selectType: function(e) {
    this.setData({
      selectedType: e.currentTarget.dataset.type
    })
  },

  startAssessment: function() {
    const type = this.data.selectedType
    let currentSection = 'phq9'
    let totalQuestions = 16 // PHQ-9(9) + GAD-7(7)
    
    if (type === 'physiological') {
      // 生理指标评估，尝试从用户信息中获取性别和年龄
      const userInfo = app.globalData.userInfo || {}
      let gender = ''
      let age = ''
      
      // 处理性别信息
      if (userInfo.gender) {
        // 可能存储的是"男"/"女"或"male"/"female"
        if (userInfo.gender === '男' || userInfo.gender === 'male') {
          gender = 'male'
        } else if (userInfo.gender === '女' || userInfo.gender === 'female') {
          gender = 'female'
        }
      }
      
      // 处理年龄信息
      if (userInfo.age) {
        age = String(userInfo.age)
      }
      
      this.setData({
        assessmentStarted: true,
        'physioData.gender': gender,
        'physioData.age': age
      })
      return
    } else if (type === 'lifestyle') {
      currentSection = 'lifestyle'
      totalQuestions = 8
    }

    this.setData({
      assessmentStarted: true,
      currentSection: currentSection,
      currentIndex: 0,
      totalQuestions: totalQuestions,
      currentQuestion: this.getQuestion(currentSection, 0)
    })
    
    this.updateProgress()
  },

  getQuestion: function(section, index) {
    const questions = {
      phq9: [
        { text: '做事时提不起劲或没有兴趣', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '感到心情低落、沮丧或绝望', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '入睡困难、睡不安稳或睡眠过多', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '感觉疲倦或没有活力', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '食欲不振或吃太多', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '觉得自己很糟，或觉得自己很失败，或让自己或家人失望', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '对事物专注有困难，例如阅读报纸或看电视时不能集中注意力', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '动作或说话速度缓慢到别人已经觉察？或正好相反，烦躁或坐立不安、动来动去的情况更胜于平常', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] },
        { text: '有不如死掉或用某种方式伤害自己的念头', type: 'radio', options: ['没有', '有几天', '一半以上时间', '几乎每天'] }
      ],
      gad7: [
        { text: '感觉紧张、焦虑或烦躁', type: 'radio', options: ['完全不会', '几天', '一半以上的日子', '几乎每天'] },
        { text: '不能停止或控制担忧', type: 'radio', options: ['完全不会', '几天', '一半以上的日子', '几乎每天'] },
        { text: '对各种各样的事情担忧过多', type: 'radio', options: ['完全不会', '几天', '一半以上的日子', '几乎每天'] },
        { text: '很难放松下来', type: 'radio', options: ['完全不会', '几天', '一半以上的日子', '几乎每天'] },
        { text: '由于不安而无法静坐', type: 'radio', options: ['完全不会', '几天', '一半以上的日子', '几乎每天'] },
        { text: '变得容易烦恼或急躁', type: 'radio', options: ['完全不会', '几天', '一半以上的日子', '几乎每天'] },
        { text: '害怕将有可怕的事发生', type: 'radio', options: ['完全不会', '几天', '一半以上的日子', '几乎每天'] }
      ],
      lifestyle: [
        { text: '您现在或以前是否饮酒？', type: 'radio', options: ['从来或几乎不饮酒', '少量饮酒', '中度饮酒', '重度饮酒', '已经戒酒'] },
        { text: '现在或以前是否吸烟？', type: 'radio', options: ['从来或几乎不抽烟', '偶尔抽烟', '经常抽烟', '已经戒烟'] },
        { text: '您觉得现在工作环境噪音大吗？', type: 'radio', options: ['没有影响', '不大', '一般', '很大', '非常大'] },
        { text: '近1个月，总的来说，您认为自己的睡眠质量', type: 'radio', options: ['很好', '较好', '较差', '很差'] },
        { text: '您每天三餐时间是否有规律？', type: 'radio', options: ['一直很有规律', '偶有不规律', '经常不规律', '从来不规律'] },
        { text: '您平常主要吃的菜品，含油量情况？', type: 'radio', options: ['含油量很少', '适量', '很多'] },
        { text: '您的饮食一般摄入盐的口味？', type: 'radio', options: ['清淡', '一般', '偏咸'] },
        { text: '您平均每周运动几次？(每次30分钟以上)', type: 'radio', options: ['4次以上', '2-3次', '1次', '几乎不运动'] }
      ]
    }
    
    return questions[section][index]
  },

  selectOption: function(e) {
    const index = e.currentTarget.dataset.index
    const section = this.data.currentSection
    
    this.setData({
      selectedOption: index
    })
    
    // 更新对应section的答案
    if (section === 'phq9') {
      const answers = this.data.phq9Answers
      answers[this.data.currentIndex] = index
      this.setData({ phq9Answers: answers })
    } else if (section === 'gad7') {
      const answers = this.data.gad7Answers
      answers[this.data.currentIndex] = index
      this.setData({ gad7Answers: answers })
    } else if (section === 'lifestyle') {
      const answers = this.data.lifestyleAnswers
      answers[this.data.currentIndex] = index
      this.setData({ lifestyleAnswers: answers })
    }
    
    // 自动保存进度
    this.saveProgress()
  },

  // 生理指标表单 - 选择性别
  selectGender: function(e) {
    const gender = e.currentTarget.dataset.gender
    this.setData({
      'physioData.gender': gender
    })
  },

  // 生理指标表单 - 输入变化
  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [`physioData.${field}`]: value
    })
    
    // 如果是身高或体重变化，计算BMI
    if (field === 'height' || field === 'weight') {
      this.calculateBMI()
    }
  },

  // 计算BMI
  calculateBMI: function() {
    const { height, weight } = this.data.physioData
    
    if (height && weight) {
      const heightM = parseFloat(height) / 100
      const weightKg = parseFloat(weight)
      const bmi = (weightKg / (heightM * heightM)).toFixed(1)
      
      let status = 'normal'
      let statusText = '正常'
      
      if (bmi < 18.5) {
        status = 'warning'
        statusText = '偏瘦'
      } else if (bmi >= 18.5 && bmi < 24) {
        status = 'normal'
        statusText = '正常'
      } else if (bmi >= 24 && bmi < 25) {
        status = 'warning'
        statusText = '偏重'
      } else if (bmi >= 25 && bmi < 28) {
        status = 'warning'
        statusText = '超重'
      } else if (bmi >= 28) {
        status = 'danger'
        statusText = '肥胖'
      }
      
      this.setData({
        calculatedBMI: bmi,
        bmiStatus: status,
        bmiStatusText: statusText
      })
    }
  },

  // 提交生理指标评估
  submitPhysiologicalData: function() {
    const { physioData } = this.data
    
    // 验证必填项
    if (!physioData.gender) {
      wx.showToast({ title: '请选择性别', icon: 'none' })
      return
    }
    if (!physioData.height || !physioData.weight) {
      wx.showToast({ title: '请填写身高和体重', icon: 'none' })
      return
    }
    if (!physioData.systolicBP || !physioData.diastolicBP) {
      wx.showToast({ title: '请填写血压数据', icon: 'none' })
      return
    }
    if (!physioData.fastingGlucose) {
      wx.showToast({ title: '请填写空腹血糖', icon: 'none' })
      return
    }
    if (!physioData.triglycerides) {
      wx.showToast({ title: '请填写甘油三酯', icon: 'none' })
      return
    }
    if (!physioData.hdlCholesterol) {
      wx.showToast({ title: '请填写高密度脂蛋白', icon: 'none' })
      return
    }
    
    // 计算代谢综合征
    this.calculatePhysiologicalResult()
  },

  // 计算生理指标结果
  calculatePhysiologicalResult: function() {
    const { physioData, calculatedBMI } = this.data
    const gender = physioData.gender
    
    let criteriaCount = 0
    const results = {
      obesity: { abnormal: false, bmi: calculatedBMI, waistline: physioData.waistline },
      hypertension: { abnormal: false },
      hyperglycemia: { abnormal: false },
      highTriglycerides: { abnormal: false },
      lowHDL: { abnormal: false }
    }
    
    // 1. 中心性肥胖判断
    // BMI ≥ 25 或 男性腰围 > 90cm / 女性腰围 > 85cm
    const bmi = parseFloat(calculatedBMI)
    const waistline = parseFloat(physioData.waistline) || 0
    
    if (bmi >= 25) {
      results.obesity.abnormal = true
      criteriaCount++
    } else if (gender === 'male' && waistline > 90) {
      results.obesity.abnormal = true
      criteriaCount++
    } else if (gender === 'female' && waistline > 85) {
      results.obesity.abnormal = true
      criteriaCount++
    }
    
    // 2. 高血压判断
    // 收缩压 > 130mmHg 和/或 舒张压 > 85mmHg
    const systolicBP = parseFloat(physioData.systolicBP)
    const diastolicBP = parseFloat(physioData.diastolicBP)
    
    if (systolicBP > 130 || diastolicBP > 85) {
      results.hypertension.abnormal = true
      criteriaCount++
    }
    
    // 3. 高血糖判断
    // 空腹血糖 ≥ 6.1mmol/L 或 OGTT后2小时血糖 ≥ 7.8mmol/L
    const fastingGlucose = parseFloat(physioData.fastingGlucose)
    const ogttGlucose = parseFloat(physioData.ogttGlucose) || 0
    
    if (fastingGlucose >= 6.1 || ogttGlucose >= 7.8) {
      results.hyperglycemia.abnormal = true
      criteriaCount++
    }
    
    // 4. 高甘油三酯判断
    // TG ≥ 1.7mmol/L
    const triglycerides = parseFloat(physioData.triglycerides)
    
    if (triglycerides >= 1.7) {
      results.highTriglycerides.abnormal = true
      criteriaCount++
    }
    
    // 5. 低高密度脂蛋白判断
    // HDL-C < 1.04mmol/L
    const hdlCholesterol = parseFloat(physioData.hdlCholesterol)
    
    if (hdlCholesterol < 1.04) {
      results.lowHDL.abnormal = true
      criteriaCount++
    }
    
    // 代谢综合征判断：符合3项及以上
    const hasMetabolicSyndrome = criteriaCount >= 3
    
    // 计算综合评分（满分100，每项异常扣20分）
    const overallScore = Math.max(0, 100 - criteriaCount * 20)
    
    // 生成建议
    const adviceList = this.generatePhysiologicalAdvice(results, hasMetabolicSyndrome)
    
    this.setData({
      showResult: true,
      hasMetabolicSyndrome: hasMetabolicSyndrome,
      metabolicCriteriaCount: criteriaCount,
      physioResults: results,
      overallScore: overallScore,
      adviceList: adviceList
    })
    
    this.savePhysiologicalResult()
  },

  // 生成生理指标建议
  generatePhysiologicalAdvice: function(results, hasMetabolicSyndrome) {
    const advice = []
    
    if (hasMetabolicSyndrome) {
      advice.push('您存在代谢综合征风险，建议尽快就医进行详细检查')
      advice.push('代谢综合征会增加心血管疾病和糖尿病风险，需要积极干预')
    }
    
    if (results.obesity.abnormal) {
      advice.push('建议控制体重，目标BMI维持在18.5-24之间')
      advice.push('可通过合理饮食和规律运动来减轻体重')
    }
    
    if (results.hypertension.abnormal) {
      advice.push('血压偏高，建议低盐饮食，每日盐摄入量控制在6g以内')
      advice.push('建议定期监测血压，必要时就医')
    }
    
    if (results.hyperglycemia.abnormal) {
      advice.push('血糖偏高，建议控制碳水化合物摄入，避免高糖食物')
      advice.push('建议定期检测血糖，必要时进行糖耐量试验')
    }
    
    if (results.highTriglycerides.abnormal) {
      advice.push('甘油三酯偏高，建议减少油腻食物和酒精摄入')
      advice.push('增加富含omega-3脂肪酸的食物，如深海鱼类')
    }
    
    if (results.lowHDL.abnormal) {
      advice.push('高密度脂蛋白偏低，建议增加有氧运动')
      advice.push('戒烟限酒，增加膳食纤维摄入')
    }
    
    if (advice.length === 0) {
      advice.push('您的代谢指标均在正常范围内，请继续保持健康的生活方式')
      advice.push('建议定期进行健康体检，每年至少一次')
    }
    
    return advice
  },

  // 保存生理指标评估结果
  savePhysiologicalResult: function() {
    const result = {
      type: 'physiological',
      physioData: this.data.physioData,
      physioResults: this.data.physioResults,
      hasMetabolicSyndrome: this.data.hasMetabolicSyndrome,
      metabolicCriteriaCount: this.data.metabolicCriteriaCount,
      overallScore: this.data.overallScore,
      adviceList: this.data.adviceList,
      timestamp: Date.now(),
      date: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }
    
    app.saveAssessmentResult(result)
  },

  nextQuestion: function() {
    if (this.data.selectedOption === -1) {
      wx.showToast({
        title: '请选择一个选项',
        icon: 'none'
      })
      return
    }

    const { currentSection, currentIndex } = this.data
    const sectionLength = this.getSectionLength(currentSection)
    
    // 当前section完成
    if (currentIndex === sectionLength - 1) {
      this.moveToNextSection()
    } else {
      // 继续当前section
      const nextIndex = currentIndex + 1
      const nextAnswer = this.getAnswer(currentSection, nextIndex)
      
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: this.getQuestion(currentSection, nextIndex),
        selectedOption: nextAnswer
      })
      
      this.updateProgress()
    }
  },

  previousQuestion: function() {
    const { currentSection, currentIndex } = this.data
    
    if (currentIndex === 0) {
      // 回到上一个section
      this.moveToPreviousSection()
    } else {
      const prevIndex = currentIndex - 1
      const prevAnswer = this.getAnswer(currentSection, prevIndex)
      
      this.setData({
        currentIndex: prevIndex,
        currentQuestion: this.getQuestion(currentSection, prevIndex),
        selectedOption: prevAnswer
      })
      
      this.updateProgress()
    }
  },

  moveToNextSection: function() {
    const type = this.data.selectedType
    const currentSection = this.data.currentSection
    
    if (type === 'psychological') {
      if (currentSection === 'phq9') {
        this.setData({
          currentSection: 'gad7',
          currentIndex: 0,
          currentQuestion: this.getQuestion('gad7', 0),
          selectedOption: this.data.gad7Answers[0]
        })
        this.updateProgress()
      } else {
        this.calculateResult()
      }
    } else {
      this.calculateResult()
    }
  },

  moveToPreviousSection: function() {
    const type = this.data.selectedType
    const currentSection = this.data.currentSection
    
    if (type === 'psychological' && currentSection === 'gad7') {
      const phq9Length = 9
      this.setData({
        currentSection: 'phq9',
        currentIndex: phq9Length - 1,
        currentQuestion: this.getQuestion('phq9', phq9Length - 1),
        selectedOption: this.data.phq9Answers[phq9Length - 1]
      })
      this.updateProgress()
    }
  },

  getSectionLength: function(section) {
    const lengths = { phq9: 9, gad7: 7, lifestyle: 8 }
    return lengths[section]
  },

  getAnswer: function(section, index) {
    if (section === 'phq9') return this.data.phq9Answers[index]
    if (section === 'gad7') return this.data.gad7Answers[index]
    if (section === 'lifestyle') return this.data.lifestyleAnswers[index] ?? -1
    return -1
  },

  updateProgress: function() {
    const { currentSection, currentIndex, selectedType } = this.data
    let answered = 0
    
    if (selectedType === 'psychological') {
      const phq9Filled = this.data.phq9Answers.filter(a => a !== -1).length
      const gad7Filled = this.data.gad7Answers.filter(a => a !== -1).length
      answered = phq9Filled + gad7Filled
    } else {
      answered = Object.keys(this.data.lifestyleAnswers).length
    }
    
    const progress = (answered / this.data.totalQuestions) * 100
    
    this.setData({
      progress: Math.round(progress),
      answeredQuestions: answered
    })
  },

  calculateResult: function() {
    const type = this.data.selectedType
    
    if (type === 'psychological') {
      this.calculatePsychologicalResult()
    } else if (type === 'lifestyle') {
      this.calculateLifestyleResult()
    }
  },

  calculatePsychologicalResult: function() {
    // 计算PHQ-9分数
    const phq9Score = this.data.phq9Answers.reduce((sum, val) => sum + val, 0)
    let phq9Level = ''
    if (phq9Score <= 4) phq9Level = '正常'
    else if (phq9Score <= 9) phq9Level = '抑郁倾向'
    else if (phq9Score <= 14) phq9Level = '轻度抑郁'
    else if (phq9Score <= 19) phq9Level = '中度抑郁'
    else phq9Level = '重度抑郁'
    
    // 计算GAD-7分数
    const gad7Score = this.data.gad7Answers.reduce((sum, val) => sum + val, 0)
    let gad7Level = ''
    if (gad7Score <= 4) gad7Level = '无明显焦虑'
    else if (gad7Score <= 9) gad7Level = '轻度焦虑'
    else if (gad7Score <= 14) gad7Level = '中度焦虑'
    else gad7Level = '重度焦虑'
    
    // 综合评分
    const overallScore = Math.round(((27 - phq9Score) / 27 + (21 - gad7Score) / 21) * 50)
    
    const adviceList = this.generatePsychologicalAdvice(phq9Score, gad7Score)
    
    this.setData({
      showResult: true,
      phq9Score,
      phq9Level,
      gad7Score,
      gad7Level,
      overallScore,
      adviceList
    })
    
    this.saveResult()
    this.clearSavedProgress()
  },

  calculateLifestyleResult: function() {
    const answers = this.data.lifestyleAnswers
    let score = 0
    let total = 0
    
    Object.values(answers).forEach(val => {
      // 反向计分某些题目
      score += val
      total += 4
    })
    
    const overallScore = Math.round((1 - score / total) * 100)
    const adviceList = this.generateLifestyleAdvice(answers)
    
    this.setData({
      showResult: true,
      overallScore,
      adviceList
    })
    
    this.saveResult()
    this.clearSavedProgress()
  },

  generatePsychologicalAdvice: function(phq9, gad7) {
    const advice = []
    
    // 根据PHQ-9分数给建议
    if (phq9 >= 15) {
      advice.push('您的抑郁症状较为严重，强烈建议寻求专业心理咨询或医疗帮助')
      advice.push('可以联系心理热线：12320或当地精神卫生中心')
    } else if (phq9 >= 10) {
      advice.push('建议关注情绪变化，考虑寻求专业心理咨询')
      advice.push('尝试每天进行30分钟有氧运动，如散步、慢跑')
    } else if (phq9 >= 5) {
      advice.push('注意调节情绪，保持规律作息')
      advice.push('与亲友多交流，寻求社会支持')
    }
    
    // 根据GAD-7分数给建议
    if (gad7 >= 15) {
      advice.push('您的焦虑症状较为严重，建议及时就医')
      advice.push('学习深呼吸和放松技巧，避免过度担忧')
    } else if (gad7 >= 10) {
      advice.push('建议学习正念冥想或渐进性肌肉放松')
      advice.push('减少咖啡因摄入，保证充足睡眠')
    } else if (gad7 >= 5) {
      advice.push('注意识别和管理压力源')
      advice.push('保持适度运动，有助于缓解紧张情绪')
    }
    
    if (advice.length === 0) {
      advice.push('您的心理状态良好，请继续保持')
      advice.push('建议定期进行自我评估，关注心理健康')
    }
    
    return advice
  },

  generateLifestyleAdvice: function(answers) {
    const advice = []
    
    // 根据饮酒情况
    if (answers[0] >= 2) {
      advice.push('建议控制饮酒量，每周饮酒不超过2-3次')
    }
    
    // 根据吸烟情况
    if (answers[1] === 2) {
      advice.push('吸烟严重危害健康，建议戒烟或寻求戒烟帮助')
    }
    
    // 根据睡眠质量
    if (answers[3] >= 2) {
      advice.push('改善睡眠环境，建立规律的作息时间')
      advice.push('睡前避免使用电子设备，可尝试冥想助眠')
    }
    
    // 根据饮食规律
    if (answers[4] >= 2) {
      advice.push('建立规律的三餐时间，定时定量')
    }
    
    // 根据油盐摄入
    if (answers[5] >= 2 || answers[6] >= 2) {
      advice.push('减少油盐摄入，多吃新鲜蔬菜水果')
    }
    
    // 根据运动情况
    if (answers[7] >= 2) {
      advice.push('增加运动频率，建议每周至少3次，每次30分钟以上')
    }
    
    if (advice.length === 0) {
      advice.push('您的生活方式较为健康，请继续保持')
    }
    
    return advice
  },

  saveProgress: function() {
    const progressData = {
      selectedType: this.data.selectedType,
      currentSection: this.data.currentSection,
      currentIndex: this.data.currentIndex,
      phq9Answers: this.data.phq9Answers,
      gad7Answers: this.data.gad7Answers,
      lifestyleAnswers: this.data.lifestyleAnswers,
      timestamp: Date.now()
    }
    
    wx.setStorageSync('assessmentProgress', progressData)
  },

  loadSavedAnswers: function() {
    try {
      const saved = wx.getStorageSync('assessmentProgress')
      if (saved && saved.timestamp) {
        const hoursPassed = (Date.now() - saved.timestamp) / (1000 * 60 * 60)
        if (hoursPassed < 24) {
          wx.showModal({
            title: '提示',
            content: '检测到未完成的评估，是否继续？',
            success: (res) => {
              if (res.confirm) {
                this.setData({
                  selectedType: saved.selectedType,
                  phq9Answers: saved.phq9Answers,
                  gad7Answers: saved.gad7Answers,
                  lifestyleAnswers: saved.lifestyleAnswers
                })
              } else {
                this.clearSavedProgress()
              }
            }
          })
        } else {
          this.clearSavedProgress()
        }
      }
    } catch (e) {
      console.error('加载保存的答案失败', e)
    }
  },

  clearSavedProgress: function() {
    wx.removeStorageSync('assessmentProgress')
  },

  saveResult: function() {
    const result = {
      type: this.data.selectedType,
      phq9Score: this.data.phq9Score,
      phq9Level: this.data.phq9Level,
      gad7Score: this.data.gad7Score,
      gad7Level: this.data.gad7Level,
      overallScore: this.data.overallScore,
      adviceList: this.data.adviceList,
      timestamp: Date.now(),
      date: util.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
    }
    
    app.saveAssessmentResult(result)
  },

  exitAssessment: function() {
    wx.showModal({
      title: '退出评估',
      content: '您的答题进度已自动保存，下次可继续完成',
      success: (res) => {
        if (res.confirm) {
          // 退出到选择评估类型页面
          this.setData({
            assessmentStarted: false,
            showResult: false
          })
        }
      }
    })
  },

  viewHistory: function() {
    wx.switchTab({
      url: '/pages/ai-chat/ai-chat'
    })
  },

  restart: function() {
    this.clearSavedProgress()
    this.setData({
      assessmentStarted: false,
      showResult: false,
      currentSection: 'phq9',
      currentIndex: 0,
      selectedOption: -1,
      phq9Answers: new Array(9).fill(-1),
      gad7Answers: new Array(7).fill(-1),
      lifestyleAnswers: {},
      physioData: {
        gender: '',
        age: '',
        height: '',
        weight: '',
        waistline: '',
        systolicBP: '',
        diastolicBP: '',
        fastingGlucose: '',
        ogttGlucose: '',
        triglycerides: '',
        hdlCholesterol: ''
      },
      calculatedBMI: '',
      bmiStatus: '',
      bmiStatusText: '',
      hasMetabolicSyndrome: false,
      metabolicCriteriaCount: 0,
      progress: 0
    })
  }
})