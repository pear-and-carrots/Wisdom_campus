const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanli: wx.getStorageSync('guanli'),
    showModal1: false,
    detail: '',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const guanli = 3
    if(guanli == 3){
      this.getmessage()
      wx.showLoading({
        title: '加载中',
      })
    }
  },

  textarea: function(e){
    this.setData({
      messageBox: e.detail.value
    })
  },

  stuList: function(e){
    console.log(e.currentTarget.dataset.id);
    this.setData({
      showModal1 : true,
      id: e.currentTarget.dataset.id
    })
  },

  input: function(e){
    db.collection("class")
    .add({
      data: {
        type: "校长信箱",
        data: this.data.messageBox,
      }
    })
    .then(res => {
      wx.showToast({
        title: "上传成功",
      })
    })
  },

  getmessage: function(e){
    db.collection('class')
      .where({
        type: "专题活动"
      })
      .get()
      .then(res => {
        db.collection("class")
          .where({
            type: "校长信箱"
          })
          .get()
          .then(res => {
            this.setData({
              xinxi: res.data.reverse()
            })
          })
        wx.hideLoading();
      })
      .catch(err => {

      })
  },

  close_mask: function(e){
    this.setData({
      showModal1: false
    })
  },

  removamessage: function(){
    if (this.data.guanli == 3) {
      wx.showModal({
        title: '提示',
        content: '确定删除该内容！',
        success: (res) => {
          if (res.confirm) {
            db.collection("class")
              .doc(this.data.id)
              .remove()
              .then(res => {
                this.getmessage()
                console.log("成功", res);
                this.setData({
                  showModal1: false
                })
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {

    }
  }
})