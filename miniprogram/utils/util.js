/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute)
    .replace('ss', second)
}

/**
 * 计算BMI
 */
function calculateBMI(weight, height) {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)
  return bmi.toFixed(1)
}

/**
 * 获取BMI评级
 */
function getBMILevel(bmi) {
  if (bmi < 18.5) return '偏瘦'
  if (bmi < 24) return '正常'
  if (bmi < 28) return '偏胖'
  return '肥胖'
}

/**
 * 计算心理评分等级
 */
function getPsychologicalLevel(score) {
  if (score >= 80) return '优秀'
  if (score >= 60) return '良好'
  if (score >= 40) return '一般'
  return '需关注'
}

/**
 * 生成健康建议（模拟数据，实际应由AI生成）
 */
function generateHealthAdvice(assessmentData) {
  const advice = {
    psychological: [],
    metabolic: [],
    lifestyle: []
  }

  // 心理健康建议
  if (assessmentData.psychologicalScore < 60) {
    advice.psychological.push('建议进行放松训练,如深呼吸、冥想')
    advice.psychological.push('保持规律作息,确保充足睡眠')
    advice.psychological.push('适当参与社交活动,建立支持网络')
  }

  // 代谢健康建议
  if (assessmentData.bmi >= 24) {
    advice.metabolic.push('控制每日热量摄入,建议减少500卡路里')
    advice.metabolic.push('增加有氧运动,每周至少150分钟')
  }
  if (assessmentData.bloodSugar > 6.1) {
    advice.metabolic.push('监测血糖,控制碳水化合物摄入')
    advice.metabolic.push('餐后适量运动,帮助血糖稳定')
  }

  // 生活方式建议
  advice.lifestyle.push('每日饮水量建议1500-2000ml')
  advice.lifestyle.push('保持规律运动,每周3-5次,每次30分钟')
  advice.lifestyle.push('减少久坐时间,每小时活动5-10分钟')

  return advice
}

module.exports = {
  formatDate,
  calculateBMI,
  getBMILevel,
  getPsychologicalLevel,
  generateHealthAdvice
}
