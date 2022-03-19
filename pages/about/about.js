var amapFile = require('../../utils/amap-wx.js');
let ak = 'd6ljkDpK2SI8NF30Gx0ehv1Ut7jSAENG';
Page({
  data: {
    city: "",
    today: {},
    future: {},
    pollution: "",
    // productType:productData,
    nickName: wx.getStorageSync('nickName'),
    avatarUrl: wx.getStorageSync('avatarUrl'),   
    input: wx.getStorageSync('input'),
    weatherData: '',
    guanli: wx.getStorageSync('guanli')
  },

  input: function (e) {
    this.setData({
      input: e.detail.value
    })
    wx.setStorageSync('input', e.detail.value)
  },

  productType: function (e) {
    wx.navigateTo({
      url: '../productType/productType?itemId=' + e.currentTarget.dataset.mark,
    })
  },

  seting: function (res) {
    wx.navigateTo({
      url: '../../packageB/pages/seting/seting',
    })
  },

  getUserInfo: function (e) {
    wx.getUserProfile({
      desc: '展示用户信息',
      success: res => {
        console.log(res)
        wx.setStorageSync('nickName', res.userInfo.nickName)
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      }, fail: res => {

      }
    })
  },

  end: function (e) {
    this.setData({
      showModal: true
    })
  },

  close: function (e) {
    this.setData({
      showModal: false
    })
  },

  remove: function (e) {
    wx.removeStorageSync('nickName')
    wx.removeStorageSync('avatarUrl')
    wx.removeStorageSync('input')
    this.setData({
      showModal: false
    })
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('stuName')==""&&wx.getStorageSync('teaName')=="") {
      console.log("111");
      wx.setStorageSync('guanli', -1)
    }
    else{
    }
    this.setData({
      guanli: wx.getStorageSync('guanli')
    })
    this.weizhi()
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'db3577db1fad71b0290aead89355cfc4' });
    
    wx.cloud.callFunction({
      name: 'good',
      success: (res) => {
        wx.setStorageSync('openid', res.result.openid)
      }
    })
    
    myAmapFun.getWeather({
      success: (res) => {
        //成功回调
        console.log(res);
        this.setData({
          weatherData: res
        })
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
  /**
   * 
   * 生命周期函数--监听页面初次渲染完成
   */
  weizhi() {
    wx.getLocation({			//获取经纬度
      success: ({ latitude, longitude }) => {
        console.log("经纬度",latitude, longitude);
        var that = this;
        wx.request({
          url: 'https://devapi.qweather.com/v7/indices/1d?type=1,3&key=a08c579ec122406f83781a7132da6624&location=' + longitude + "," + latitude,
          data: {

          },
          success: function (res) {
            console.log("成功");
            that.setData({
              weather: res.data
            })
            console.log(res.data)

          }
        })
      }
    })
  },

  inputt : function(e){
    this.setData({
      input: ''
    })
  },

  onReady: function () {

  },


})