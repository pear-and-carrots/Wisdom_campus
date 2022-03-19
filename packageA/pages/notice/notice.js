const db = wx.cloud.database()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholder:"通知内容",
    notice:[],
    guanli: wx.getStorageSync('guanli'),
    id:"",
    cloud:"notice",
    class:"",
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
    form_info: "",
    stuClass:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    db.collection('notice')
    .where({
      stuClass: options.stuClass
    })
    .get()
    .then(res => {
      this.setData({
        notice: res.data,
        id:options._id,
        stuClass:options.stuClass
      })
    })
    wx.hideLoading();
  },
  parentFunction(e){
    db.collection(this.data.cloud)
    .add({
      data: {
        date:new Date().getTime(),
        src: e.detail.src,
        stuClass: this.data.stuClass,
        textarea: e.detail.textarea,
        time: e.detail.time,
        genre:"班级通知"
      }
    })
    .then(res => {
      this.setData({
        form_info: ""
      })

    })
  },
  navigator(e){
    console.log(e);
    wx.navigateTo({
      url: '../../pages/notice_details/notice_details?id='+e.currentTarget.dataset.id,
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
  },
  neueo1(e) {
    this.setData({
      class: e.detail.value
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