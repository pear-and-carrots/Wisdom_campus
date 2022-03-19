const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://www.gdou.edu.cn/__local/5/B9/50/3E314312B6C6AAE9CD5E8B7FC29_DFDA714A_9F66.jpg',
      'https://www.gdou.edu.cn/__local/6/66/04/E3137A9F6E1F533AF50CEF2B99D_78999847_AD72.jpg',
      'https://www.gdou.edu.cn/__local/C/58/5A/3113F84CAB0DDD163B066D730D4_23C03E85_AEAD.jpg',
      'https://www.gdou.edu.cn/__local/7/F4/84/633B92C6179D180AE608728B2FA_727E9AAF_A8B8.jpg',
      'https://www.gdou.edu.cn/__local/E/6C/19/BA565274F28F6B306B941577846_AF087432_B405.jpg',
      'https://www.gdou.edu.cn/__local/C/29/79/2CFDBD336423C5A292AB439F488_BF08DF2C_1BB0E.jpg'
    ],
    name:[
      '曹俊明',
      '潘新祥',
      '彭权群',
      '林晓敏',
      '刘东超',
      '高秀梅'
    ],
    img:[
      'https://www.gdou.edu.cn/__local/E/71/42/A5D78A8669749787E2552475F6C_B98B9DA4_1AFF9.jpg',
      'https://www.gdou.edu.cn/__local/F/73/42/5DDD401B7FFEB3F0C0415F992D7_E7EEA0FC_24DE9.jpg',
      'https://www.gdou.edu.cn/__local/C/87/0E/4FAFB06DA9A63D54B4ADC5B26FE_A9C2CF8F_2911C.jpg',
      'https://www.gdou.edu.cn/__local/D/83/D9/90018474EB7F3BD8305D869B23C_670C4C46_1BFEC.jpg',
      'https://www.gdou.edu.cn/__local/E/78/1D/A560F2A64EF744B98785464D86C_3090129C_30AC6.jpg'
    ],
    spaceName:['图书馆夜景','舞蹈楼','钟海楼','西湖','艺术楼'],
    array:['学校简介','历史沿革','校园风光'],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    swiperIndex: 0,
    dex:0,
    current:0,
  },

  swiperChange(e) {
    const that = this;
    that.setData({
      swiperIndex: e.detail.current,
    })
  },

  swiperChang:function(e){
    console.log(e.detail.current)
    this.setData({
      current: e.detail.current
    })
  },

  selected:function(e){
    // console.log(e.currentTarget.dataset.dex)
    this.setData({
      dex:e.currentTarget.dataset.dex
    })
  },

  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    db.collection('class')
    .where({
      type:"学校概况"
    })
    .get()
    .then(res=>{
      wx.hideLoading();
      this.setData({
        xinxi:res.data[0],
      })
    })
  },


})