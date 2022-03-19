const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    cloud: "stuClass",
    stuClass: wx.getStorageSync('stuClass'),
    guanli: wx.getStorageSync('guanli'),
    placeholder: "请输入内容",
    form_info: "",
    class:"",
    title:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    this.setData({
      type: options.type
    })
    this.xinxi(options.type);
  },
  //返回上一个页面
  tiaozuang() {
    wx.switchTab({
      url: '../../../pages/class/class',

    });
  },
  //获取信息
  xinxi(e) {
    db.collection('stuClass')
      .where({
        type: e
      })
      .get()
      .then(res => {
        wx.hideLoading();
        this.setData({
          xinxi: res.data
        })
      })
  },
  //组件
  parentFunction(e) {
    console.log(e);
    db.collection(this.data.cloud)
      .add({
        data: {
          type: this.data.type,
          title: this.data.class,
          src: e.detail.src,
          textarea: e.detail.textarea,
          time: e.detail.time,
          class:this.data.class,
        }
      })
      .then(res => {
        wx.showToast({
          title: "上传成功",
        })
        this.setData({
          form_info: ""
        })

      })
  },
  neueo1(e) {
    this.setData({
      class: e.detail.value
    })
  },
  neueo(e) {
    this.setData({
      title: e.detail.value
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