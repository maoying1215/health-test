const app = getApp()

Page({
  data: {
    // 表单数据
    formData: {
      nickName: '',
      gender: '',
      birthDate: '',
      age: '',
      nation: '汉族',
      education: '',
      marital: '',
      income: '',
      occupation: '',
      workYears: ''
    },

    // 选择器数据
    genderOptions: ['男', '女'],
    genderIndex: -1,

    educationOptions: ['小学', '初中', '高中/中专', '大专', '本科', '硕士', '博士'],
    educationIndex: -1,

    maritalOptions: ['未婚', '已婚', '离异', '丧偶'],
    maritalIndex: -1,

    incomeOptions: ['3000元以下', '3000-5000元', '5000-8000元', '8000-12000元', '12000-20000元', '20000元以上'],
    incomeIndex: -1,

    nationOptions: ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '苗族', '彝族', '壮族', '布依族', '朝鲜族', '满族', '侗族', '瑶族', '白族', '土家族', '哈尼族', '哈萨克族', '傣族', '黎族', '傈僳族', '佤族', '畲族', '高山族', '拉祜族', '水族', '东乡族', '纳西族', '景颇族', '柯尔克孜族', '土族', '达斡尔族', '仫佬族', '羌族', '布朗族', '撒拉族', '毛南族', '仡佬族', '锡伯族', '阿昌族', '普米族', '塔吉克族', '怒族', '乌孜别克族', '俄罗斯族', '鄂温克族', '德昂族', '保安族', '裕固族', '京族', '塔塔尔族', '独龙族', '鄂伦春族', '赫哲族', '门巴族', '珞巴族', '基诺族', '其他'],
    nationIndex: 0,

    // 当前日期（用于限制出生日期选择）
    maxDate: '',
    minDate: '1920-01-01'
  },

  onLoad: function() {
    // 设置当前日期
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    this.setData({
      maxDate: `${year}-${month}-${day}`
    })

    // 加载已有数据
    this.loadUserInfo()
  },

  loadUserInfo: function() {
    const userInfo = app.globalData.userInfo
    if (userInfo) {
      const formData = {
        nickName: userInfo.nickName || '',
        gender: userInfo.gender || '',
        birthDate: userInfo.birthDate || '',
        age: userInfo.age || '',
        nation: userInfo.nation || '汉族',
        education: userInfo.education || '',
        marital: userInfo.marital || '',
        income: userInfo.income || '',
        occupation: userInfo.occupation || '',
        workYears: userInfo.workYears || ''
      }

      // 设置选择器索引
      let genderIndex = -1
      let educationIndex = -1
      let maritalIndex = -1
      let incomeIndex = -1
      let nationIndex = 0

      if (formData.gender) {
        genderIndex = this.data.genderOptions.indexOf(formData.gender)
      }
      if (formData.education) {
        educationIndex = this.data.educationOptions.indexOf(formData.education)
      }
      if (formData.marital) {
        maritalIndex = this.data.maritalOptions.indexOf(formData.marital)
      }
      if (formData.income) {
        incomeIndex = this.data.incomeOptions.indexOf(formData.income)
      }
      if (formData.nation) {
        nationIndex = this.data.nationOptions.indexOf(formData.nation)
      }

      this.setData({
        formData,
        genderIndex,
        educationIndex,
        maritalIndex,
        incomeIndex,
        nationIndex
      })
    }
  },

  // 输入框变化
  onNickNameInput: function(e) {
    this.setData({
      'formData.nickName': e.detail.value
    })
  },

  onOccupationInput: function(e) {
    this.setData({
      'formData.occupation': e.detail.value
    })
  },

  onWorkYearsInput: function(e) {
    this.setData({
      'formData.workYears': e.detail.value
    })
  },

  // 性别选择
  onGenderChange: function(e) {
    const index = e.detail.value
    this.setData({
      genderIndex: index,
      'formData.gender': this.data.genderOptions[index]
    })
  },

  // 出生日期选择
  onBirthDateChange: function(e) {
    const birthDate = e.detail.value
    const age = this.calculateAge(birthDate)
    
    this.setData({
      'formData.birthDate': birthDate,
      'formData.age': age.toString()
    })
  },

  // 计算年龄
  calculateAge: function(birthDate) {
    if (!birthDate) return ''
    
    const birth = new Date(birthDate)
    const today = new Date()
    
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  },

  // 民族选择
  onNationChange: function(e) {
    const index = e.detail.value
    this.setData({
      nationIndex: index,
      'formData.nation': this.data.nationOptions[index]
    })
  },

  // 文化程度选择
  onEducationChange: function(e) {
    const index = e.detail.value
    this.setData({
      educationIndex: index,
      'formData.education': this.data.educationOptions[index]
    })
  },

  // 婚姻状况选择
  onMaritalChange: function(e) {
    const index = e.detail.value
    this.setData({
      maritalIndex: index,
      'formData.marital': this.data.maritalOptions[index]
    })
  },

  // 月收入选择
  onIncomeChange: function(e) {
    const index = e.detail.value
    this.setData({
      incomeIndex: index,
      'formData.income': this.data.incomeOptions[index]
    })
  },

  // 保存信息
  saveUserInfo: function() {
    const { formData } = this.data

    // 验证必填项
    if (!formData.nickName) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    if (!formData.gender) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      })
      return
    }

    if (!formData.birthDate) {
      wx.showToast({
        title: '请选择出生日期',
        icon: 'none'
      })
      return
    }

    // 保存到全局数据
    const userInfo = app.globalData.userInfo || {}
    Object.assign(userInfo, formData)
    app.saveUserInfo(userInfo)

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    })

    // 延迟返回
    setTimeout(() => {
      wx.navigateBack()
    }, 2000)
  },

  // 取消编辑
  cancelEdit: function() {
    wx.showModal({
      title: '提示',
      content: '确定要放弃修改吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack()
        }
      }
    })
  }
})