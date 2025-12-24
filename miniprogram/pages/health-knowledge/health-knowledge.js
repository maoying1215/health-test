Page({
  data: {
    // 当前选中的分类
    currentCategory: 'all',
    
    // 分类列表
    categories: [
      { id: 'all', name: '全部', icon: '📚' },
      { id: 'psychology', name: '心理健康', icon: '🧠' },
      { id: 'metabolism', name: '代谢健康', icon: '💪' },
      { id: 'sleep', name: '睡眠健康', icon: '😴' },
      { id: 'diet', name: '饮食营养', icon: '🥗' },
      { id: 'exercise', name: '运动健身', icon: '🏃' }
    ],
    
    // 文章列表
    articles: [
      {
        id: 1,
        category: 'psychology',
        title: '如何识别和应对焦虑情绪？',
        summary: '焦虑是现代人常见的情绪问题，学会识别和管理焦虑对心理健康至关重要。',
        image: '',
        readTime: '5分钟',
        views: 1280,
        isNew: true
      },
      {
        id: 2,
        category: 'psychology',
        title: '深呼吸练习：快速缓解压力的方法',
        summary: '掌握正确的深呼吸技巧，可以在几分钟内有效降低压力水平。',
        image: '',
        readTime: '3分钟',
        views: 986,
        isNew: true
      },
      {
        id: 3,
        category: 'sleep',
        title: '改善睡眠质量的10个科学方法',
        summary: '失眠困扰着很多人，这些经过科学验证的方法可以帮助你获得更好的睡眠。',
        image: '',
        readTime: '8分钟',
        views: 2341,
        isNew: false
      },
      {
        id: 4,
        category: 'metabolism',
        title: '什么是代谢综合征？如何预防？',
        summary: '了解代谢综合征的危害和预防方法，保护您的心血管健康。',
        image: '',
        readTime: '6分钟',
        views: 1567,
        isNew: false
      },
      {
        id: 5,
        category: 'diet',
        title: '地中海饮食：心脏健康的黄金法则',
        summary: '地中海饮食被认为是最健康的饮食方式之一，了解它的核心原则。',
        image: '',
        readTime: '7分钟',
        views: 1892,
        isNew: false
      },
      {
        id: 6,
        category: 'exercise',
        title: '每天30分钟运动的惊人好处',
        summary: '研究表明，每天坚持30分钟中等强度运动可以显著改善身心健康。',
        image: '',
        readTime: '4分钟',
        views: 2156,
        isNew: false
      },
      {
        id: 7,
        category: 'psychology',
        title: '正念冥想入门指南',
        summary: '正念冥想可以帮助减轻压力、提升专注力，初学者也能轻松上手。',
        image: '',
        readTime: '6分钟',
        views: 1734,
        isNew: false
      },
      {
        id: 8,
        category: 'metabolism',
        title: '血糖管理：饮食与生活方式的关键',
        summary: '通过合理的饮食和生活方式调整，可以有效控制血糖水平。',
        image: '',
        readTime: '7分钟',
        views: 1423,
        isNew: false
      },
      {
        id: 9,
        category: 'sleep',
        title: '睡前放松技巧：告别失眠之夜',
        summary: '学习这些简单的放松技巧，帮助你更快入睡，提高睡眠质量。',
        image: '',
        readTime: '5分钟',
        views: 1678,
        isNew: true
      },
      {
        id: 10,
        category: 'diet',
        title: '减盐饮食：保护心血管的第一步',
        summary: '高盐饮食是高血压的重要危险因素，了解如何科学减盐。',
        image: '',
        readTime: '4分钟',
        views: 1245,
        isNew: false
      }
    ],
    
    // 当前显示的文章列表
    displayArticles: [],
    
    // 是否显示文章详情
    showDetail: false,
    
    // 当前查看的文章
    currentArticle: null,
    
    // 文章详情内容
    articleContents: {
      1: {
        title: '如何识别和应对焦虑情绪？',
        content: [
          { type: 'text', content: '焦虑是一种常见的情绪反应，适度的焦虑可以帮助我们应对挑战，但过度焦虑则会影响日常生活和身心健康。' },
          { type: 'subtitle', content: '焦虑的常见表现' },
          { type: 'list', content: ['持续感到紧张或不安', '难以控制担忧的想法', '容易疲劳', '注意力难以集中', '肌肉紧张', '睡眠问题'] },
          { type: 'subtitle', content: '应对焦虑的方法' },
          { type: 'text', content: '1. 深呼吸练习：当感到焦虑时，尝试4-7-8呼吸法。吸气4秒，屏息7秒，呼气8秒。' },
          { type: 'text', content: '2. 接纳情绪：不要抗拒焦虑，承认它的存在，告诉自己"这只是暂时的情绪"。' },
          { type: 'text', content: '3. 规律运动：每周至少150分钟的中等强度运动可以有效缓解焦虑。' },
          { type: 'text', content: '4. 保持社交：与信任的朋友或家人交流，分享你的感受。' },
          { type: 'tip', content: '如果焦虑严重影响了您的日常生活，建议寻求专业心理咨询帮助。' }
        ]
      },
      2: {
        title: '深呼吸练习：快速缓解压力的方法',
        content: [
          { type: 'text', content: '深呼吸是一种简单而有效的放松技巧，可以激活副交感神经系统，帮助身体从紧张状态恢复平静。' },
          { type: 'subtitle', content: '4-7-8 呼吸法' },
          { type: 'list', content: ['用鼻子吸气，数4秒', '屏住呼吸，数7秒', '用嘴巴缓慢呼气，数8秒', '重复3-4次'] },
          { type: 'subtitle', content: '腹式呼吸法' },
          { type: 'text', content: '将一只手放在胸部，另一只手放在腹部。吸气时让腹部隆起，胸部保持不动。呼气时腹部收缩。' },
          { type: 'text', content: '每次练习5-10分钟，每天坚持可以显著降低压力水平。' },
          { type: 'tip', content: '建议在安静的环境中练习，可以闭上眼睛，专注于呼吸的感觉。' }
        ]
      },
      3: {
        title: '改善睡眠质量的10个科学方法',
        content: [
          { type: 'text', content: '良好的睡眠对身心健康至关重要。以下是经过科学验证的改善睡眠的方法：' },
          { type: 'subtitle', content: '建立规律作息' },
          { type: 'text', content: '1. 固定就寝和起床时间，即使周末也要保持一致。' },
          { type: 'text', content: '2. 睡前1小时开始放松，远离电子设备。' },
          { type: 'subtitle', content: '优化睡眠环境' },
          { type: 'text', content: '3. 保持卧室凉爽，理想温度在18-22°C。' },
          { type: 'text', content: '4. 确保卧室足够黑暗，可以使用遮光窗帘。' },
          { type: 'text', content: '5. 减少噪音干扰，必要时使用白噪音。' },
          { type: 'subtitle', content: '调整生活习惯' },
          { type: 'text', content: '6. 下午2点后避免咖啡因。' },
          { type: 'text', content: '7. 睡前3小时避免大量进食。' },
          { type: 'text', content: '8. 规律运动，但睡前4小时避免剧烈运动。' },
          { type: 'text', content: '9. 限制午睡时间在30分钟以内。' },
          { type: 'text', content: '10. 睡前可尝试冥想或轻度拉伸。' },
          { type: 'tip', content: '如果失眠持续超过3周，建议咨询医生。' }
        ]
      },
      4: {
        title: '什么是代谢综合征？如何预防？',
        content: [
          { type: 'text', content: '代谢综合征是一组代谢异常的集合，会显著增加心血管疾病和2型糖尿病的风险。' },
          { type: 'subtitle', content: '诊断标准（符合3项及以上）' },
          { type: 'list', content: ['腰围：男性≥90cm，女性≥85cm', '血压：≥130/85mmHg', '空腹血糖：≥5.6mmol/L', '甘油三酯：≥1.7mmol/L', '高密度脂蛋白：男性<1.0mmol/L，女性<1.3mmol/L'] },
          { type: 'subtitle', content: '预防措施' },
          { type: 'text', content: '1. 控制体重：保持健康的BMI（18.5-23.9）' },
          { type: 'text', content: '2. 健康饮食：多吃蔬果、全谷物，少油少盐少糖' },
          { type: 'text', content: '3. 规律运动：每周至少150分钟中等强度运动' },
          { type: 'text', content: '4. 戒烟限酒' },
          { type: 'text', content: '5. 定期体检：及早发现问题' },
          { type: 'tip', content: '代谢综合征是可以逆转的，通过生活方式改变可以显著改善各项指标。' }
        ]
      },
      5: {
        title: '地中海饮食：心脏健康的黄金法则',
        content: [
          { type: 'text', content: '地中海饮食是以地中海沿岸国家传统饮食习惯为基础的饮食模式，被认为是最健康的饮食方式之一。' },
          { type: 'subtitle', content: '核心原则' },
          { type: 'list', content: ['大量蔬菜、水果、全谷物、豆类', '橄榄油作为主要脂肪来源', '适量鱼类和海鲜', '适量禽肉、蛋、奶制品', '少量红肉', '适量红酒（可选）'] },
          { type: 'subtitle', content: '健康益处' },
          { type: 'text', content: '研究表明，地中海饮食可以：降低心血管疾病风险、改善血糖控制、降低认知衰退风险、帮助体重管理。' },
          { type: 'tip', content: '开始改变饮食习惯时，可以逐步调整，每周增加一种健康食物。' }
        ]
      },
      6: {
        title: '每天30分钟运动的惊人好处',
        content: [
          { type: 'text', content: '世界卫生组织建议成年人每周至少进行150分钟中等强度有氧运动。每天30分钟，就能达到这个目标。' },
          { type: 'subtitle', content: '身体益处' },
          { type: 'list', content: ['增强心肺功能', '控制体重', '降低慢性病风险', '增强骨骼和肌肉', '提高免疫力'] },
          { type: 'subtitle', content: '心理益处' },
          { type: 'list', content: ['减轻焦虑和抑郁', '改善睡眠', '提升自信心', '增强认知功能'] },
          { type: 'subtitle', content: '适合的运动' },
          { type: 'text', content: '快走、慢跑、骑自行车、游泳、跳舞都是很好的选择。关键是找到自己喜欢的运动并坚持下去。' },
          { type: 'tip', content: '如果时间有限，可以分成3个10分钟的运动，效果同样有效。' }
        ]
      },
      7: {
        title: '正念冥想入门指南',
        content: [
          { type: 'text', content: '正念冥想是一种通过专注当下、不加评判地觉察自己的想法和感受来培养内心平静的练习方法。' },
          { type: 'subtitle', content: '简单入门步骤' },
          { type: 'text', content: '1. 找一个安静的地方，舒适地坐下' },
          { type: 'text', content: '2. 轻轻闭上眼睛' },
          { type: 'text', content: '3. 将注意力集中在呼吸上' },
          { type: 'text', content: '4. 当思绪飘走时，温和地将注意力带回呼吸' },
          { type: 'text', content: '5. 从5分钟开始，逐渐增加时间' },
          { type: 'subtitle', content: '常见误区' },
          { type: 'list', content: ['冥想不是要"清空大脑"', '走神是正常的，不需要自责', '不需要特殊姿势或设备', '每天短时间练习比偶尔长时间更有效'] },
          { type: 'tip', content: '可以使用冥想App辅助练习，如本小程序中的正念冥想功能。' }
        ]
      },
      8: {
        title: '血糖管理：饮食与生活方式的关键',
        content: [
          { type: 'text', content: '保持血糖稳定对于预防糖尿病和维护整体健康至关重要。' },
          { type: 'subtitle', content: '饮食建议' },
          { type: 'list', content: ['选择低GI（升糖指数）食物', '增加膳食纤维摄入', '控制碳水化合物总量', '避免含糖饮料和精制糖', '规律进餐，避免暴饮暴食'] },
          { type: 'subtitle', content: '生活方式调整' },
          { type: 'text', content: '1. 规律运动可以提高胰岛素敏感性' },
          { type: 'text', content: '2. 保持健康体重' },
          { type: 'text', content: '3. 充足睡眠（7-8小时）' },
          { type: 'text', content: '4. 管理压力' },
          { type: 'tip', content: '如果血糖持续偏高，请及时就医，遵医嘱用药。' }
        ]
      },
      9: {
        title: '睡前放松技巧：告别失眠之夜',
        content: [
          { type: 'text', content: '建立睡前放松习惯可以帮助大脑和身体从白天的紧张状态过渡到睡眠状态。' },
          { type: 'subtitle', content: '推荐的睡前活动' },
          { type: 'list', content: ['温水泡脚或热水澡', '阅读纸质书籍', '轻柔的拉伸运动', '听轻音乐或白噪音', '写感恩日记', '渐进性肌肉放松'] },
          { type: 'subtitle', content: '渐进性肌肉放松法' },
          { type: 'text', content: '从脚部开始，依次收紧和放松每个肌肉群，持续5-10秒。这种方法可以释放身体紧张，促进放松。' },
          { type: 'subtitle', content: '避免的事项' },
          { type: 'list', content: ['睡前使用电子设备', '在床上工作或看电视', '睡前剧烈运动', '饮用咖啡因或酒精'] },
          { type: 'tip', content: '坚持21天建立睡前放松习惯，你的睡眠质量会明显改善。' }
        ]
      },
      10: {
        title: '减盐饮食：保护心血管的第一步',
        content: [
          { type: 'text', content: '过量摄入钠盐是高血压的主要危险因素之一。中国居民平均每天摄入盐超过10克，远高于推荐量。' },
          { type: 'subtitle', content: '推荐摄入量' },
          { type: 'text', content: '世界卫生组织建议成人每天盐摄入量不超过5克（约一啤酒瓶盖）。' },
          { type: 'subtitle', content: '减盐技巧' },
          { type: 'list', content: ['逐渐减少盐的用量，让味蕾适应', '使用香料、醋、柠檬汁增添风味', '少吃加工食品和腌制食品', '选择"低钠"或"无添加盐"产品', '在餐桌上不额外加盐', '烹饪时最后放盐'] },
          { type: 'subtitle', content: '隐藏的高盐食物' },
          { type: 'list', content: ['酱油、蚝油等调味品', '腌菜、咸鱼、腊肉', '方便面、薯片等零食', '面包、饼干等烘焙食品'] },
          { type: 'tip', content: '减盐需要循序渐进，2-3周后味蕾会适应较淡的口味。' }
        ]
      }
    },
    
    // 搜索关键词
    searchKeyword: '',
    
    // 收藏的文章ID
    favoriteIds: []
  },

  onLoad: function() {
    this.loadFavorites()
    this.filterArticles()
  },

  onShow: function() {
    this.loadFavorites()
  },

  // 加载收藏
  loadFavorites: function() {
    try {
      const favorites = wx.getStorageSync('articleFavorites') || []
      this.setData({ favoriteIds: favorites })
    } catch (e) {
      console.error('加载收藏失败:', e)
    }
  },

  // 切换分类
  switchCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id
    this.setData({ currentCategory: categoryId })
    this.filterArticles()
  },

  // 筛选文章
  filterArticles: function() {
    const { articles, currentCategory, searchKeyword } = this.data
    let filtered = articles

    // 按分类筛选
    if (currentCategory !== 'all') {
      filtered = filtered.filter(function(article) {
        return article.category === currentCategory
      })
    }

    // 按关键词筛选
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase()
      filtered = filtered.filter(function(article) {
        return article.title.toLowerCase().indexOf(keyword) > -1 ||
               article.summary.toLowerCase().indexOf(keyword) > -1
      })
    }

    this.setData({ displayArticles: filtered })
  },

  // 搜索输入
  onSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value })
    this.filterArticles()
  },

  // 清空搜索
  clearSearch: function() {
    this.setData({ searchKeyword: '' })
    this.filterArticles()
  },

  // 查看文章详情
  viewArticle: function(e) {
    const articleId = e.currentTarget.dataset.id
    const article = this.data.articles.find(function(a) {
      return a.id === articleId
    })
    const content = this.data.articleContents[articleId]

    if (article && content) {
      // 增加阅读量
      const articles = this.data.articles
      const index = articles.findIndex(function(a) {
        return a.id === articleId
      })
      if (index > -1) {
        articles[index].views += 1
      }

      this.setData({
        showDetail: true,
        currentArticle: {
          ...article,
          content: content.content
        },
        articles: articles
      })
    }
  },

  // 关闭文章详情
  closeDetail: function() {
    this.setData({
      showDetail: false,
      currentArticle: null
    })
  },

  // 切换收藏
  toggleFavorite: function(e) {
    const articleId = e.currentTarget.dataset.id
    let favoriteIds = this.data.favoriteIds.slice()
    const index = favoriteIds.indexOf(articleId)

    if (index > -1) {
      favoriteIds.splice(index, 1)
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favoriteIds.push(articleId)
      wx.showToast({ title: '已收藏', icon: 'success' })
    }

    this.setData({ favoriteIds: favoriteIds })
    
    try {
      wx.setStorageSync('articleFavorites', favoriteIds)
    } catch (e) {
      console.error('保存收藏失败:', e)
    }
  },

  // 分享文章
  shareArticle: function() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    })
  },

  // 阻止触摸穿透
  preventTouchMove: function() {
    return false
  },

  // 页面分享
  onShareAppMessage: function() {
    if (this.data.currentArticle) {
      return {
        title: this.data.currentArticle.title,
        path: '/pages/health-knowledge/health-knowledge?id=' + this.data.currentArticle.id
      }
    }
    return {
      title: '健康知识 - 心理代谢健康管理',
      path: '/pages/health-knowledge/health-knowledge'
    }
  }
})
