const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanli: wx.getStorageSync('guanli'),
    type: "",
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
    console.log("当前页面参数：", options.type)
    this.type()
  },

  type() {
    db.collection('class')
      .where({
        type: this.data.type
      })
      .get()
      .then(res => {
        wx.hideLoading();
        this.setData({
          xinxi: res.data
        })
      })
  },

  //返回上一个页面
  tiaozuang() {
    wx.navigateBack({
      delta: 1
    });
  },
  
  onHide: function () {
    this.type()
  },
  //删除已发布新闻
  bindlongpress(e) {
    console.log(e.currentTarget.dataset.id);
    if (this.data.guanli == 1) {
      wx.showModal({
        title: '删除信息',
        content: '是否确定删除',
        success: (res) => {
          if (res.confirm) {
            db.collection('class')
              .doc(e.currentTarget.dataset.id)
              .remove()
              .then(res => {
                this.type()
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })

              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
})