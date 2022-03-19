const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    db.collection('stuClass')
    .doc(options.id)
    .get()
    .then(res=>{
      this.setData({
        xinxi:res.data,
        id:options.id,
        
      })
     // this.aaa(res.data.frequency)
    })
  },
    //返回上一个页面
    tiaozuang(){
      wx.navigateBack({
        delta: 1
      });  
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