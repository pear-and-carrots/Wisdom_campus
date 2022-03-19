// pages/seting/seting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:["男","女"],
    stuName:''
  },

  phone:function(){
    wx.makePhoneCall({
        phoneNumber:'15088888888',
    })
  },

  getUserInfo: function(e) {
    // wx.getUserProfile({
    //   desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //   success: (res) => {
    //     wx.setStorageSync('nickName', res.userInfo.nickName)
    //     wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
    //     // this.setData({
    //     //   nickName:wx.setStorageSync('nickName', res.userInfo.nickName),
    //     //   avatarUrl:wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
    //     // })
    //     // this.setData({
    //     //   nickName1: true,
    //     //   nickName1: false,
    //     //   avatarUrl1: true,
    //     //   avatarUrl1: false,
    //     // })
    //     // var nickName1 = wx.
    //     // wx.reLaunch({
    //     //   url: '../../pages/about/about',
    //     // })
    //   },fail:(res)=>{
    //     console.log(res)
    //   }
    // })
    wx.getUserProfile({
      desc:'展示用户信息',
      success:res=>{
        console.log(res)
        wx.setStorageSync('nickName', res.userInfo.nickName)
        wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        this.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
      },fail:res=>{

      }
    })
  },

  authentication:function(res){
    wx.navigateTo({
      url: '../authentication/authentication',
    })
  },

  end:function(e){
    this.setData({
      showModal:true
    })
  },

  close:function(e){
    this.setData({
      showModal:false
    })
  },

  remove:function(e){
    wx.removeStorageSync('nickName')
    wx.removeStorageSync('avatarUrl')
    wx.removeStorageSync('input')
    this.setData({
      showModal:false
    })
    wx.reLaunch({
      url: '../about/about',
    })
  },
  weizhi(){
    wx.openSetting({
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      stuName : wx.getStorageSync('stuName')
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})