const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xinxi:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type
    })
    wx.showLoading({
      title: "加载中"
    });
    console.log(options.frequency);
    db.collection('class')
    .doc(options.id)
    .update({
      data:{
        frequency:Number(options.frequency) +1
      }
    })
    .then(res=>{
      db.collection('class')
      .doc(options.id)
      .get()
    .then(res=>{
      console.log(res);
      wx.hideLoading();
      this.setData({
        xinxi:res.data,
        id:options.id
      })
    })
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
  onReady: function (options) {

  },
  dianji(e){
    console.log(e.currentTarget.dataset.img);
    wx.previewImage({
      current:e.currentTarget.dataset.img, // 当前显示图片的http链接
      urls:this.data.xinxi.img // 需要预览的图片http链接列表
    })
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