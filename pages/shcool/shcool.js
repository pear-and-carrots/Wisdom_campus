// pages/shcool/shcool.js
const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanli: wx.getStorageSync('guanli'),
    banner: [],
    news: [{
        id: 0,
        name: "综合新闻"
      },
      {
        id: 1,
        name: "工作动态"
      }
    ],
    getNews: [],
    curIndex: 0,
    a: ["A", "C", "B", ],
    b: ["A", "B", ]
  },
  aaa(e) {
    console.log("21312");
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('stuName') == ""&&wx.getStorageSync('teaName') == "") {
      wx.setStorageSync('guanli', -1)

    }
    this.setData({
      guanli: wx.getStorageSync('guanli')
    })
    wx.showLoading({
      title: "加载中"
    });
    let a = this.data.a;
    let b = this.data.b;
    let c = 0;
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (a[i] == b[j]) {
          c++
        }
      }
    }
    console.log(c == a.length);
    //console.log( this.data.a.toString()===this.data.b.toString());
    // 1.获取轮播图数据
    db.collection('school').get({
      success: res => {
        console.log('轮播图获取成功', res)
        this.setData({
          banner: res.data
        })
      },
      fail: res => {
        console.log('轮播图获取失败', res)
      }
    })

    // 2.获取综合新闻数据
    this.type()
  },
  type() {
    db.collection('class')
      .where({
        type: "专题活动"
      })
      .get()
      .then(res => {
        db.collection("class")
          .where({
            type: "通知轮播栏"
          })
          .get()
          .then(res => {
            this.setData({
              xinxi: res.data.reverse()
            })
          })
        this.setData({
          getNews: res.data.reverse()
        })
        wx.hideLoading();
      })
      .catch(err => {

      })
  },
  getNews: function (e) {
    console.log(e.target.dataset.index)
    this.setData({
      curIndex: e.target.dataset.index
    })
    db.collection('schoolNews').where({
        pricker: e.currentTarget.dataset.id
      }).get().then(res => {
        console.log(res);
        this.setData({
          getNews: res.data
        })
      })
      .catch(err => {

      })
    // db.collection('schoolNews')
    // .where({pricker:"e.currentTarget.dataset.name"})
    // .get()
    // .then(res=>{
    //   console.log(res);
    //   this.setData({
    //     getNews:res.data
    //   })
    // })
    // .catch(err=>{

    // })
  },
  huodo() {
    wx.navigateTo({
      url: '../../packageC/pages/notice/notice?type=' + "专题活动",
    });
  },
  publish() {
    wx.navigateTo({
      url: '../../packageC/pages/publish/publish',
    });
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

  setNotice1: function () {
    this.setData({
      showModal1: true
    })
  },

  preventTouchMove: function () {

  },

  close_mask: function () {
    this.setData({
      showModal1: false
    })
  },

  reduceNotice: function (e) {
    console.log(e.currentTarget.dataset.id);
    if (this.data.guanli == 1) {
      wx.showModal({
        title: '提示',
        content: '确定删除该内容！！',
        success: (res) => {
          if (res.confirm) {
            db.collection("class")
              .doc(e.currentTarget.dataset.id)
              .remove()
              .then(res => {
                this.type()
                console.log("成功", res);
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {

    }
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
    this.type()
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