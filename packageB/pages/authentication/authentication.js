const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['游客','学生', '教职工'],
    dex: 0
  },

  onLoad: function(option){
    wx.hideLoading();
    if(wx.getStorageSync('stuName') != 0){
      wx.showModal({
        title: '温馨提示',
        content: '亲爱的' + wx.getStorageSync('stuName') + '同学，您已经认证成功，再次认证会覆盖您现在的身份!',
        showCancel: false
        })
      }else if(wx.getStorageSync('teaName') != 0){
        wx.showModal({
          title: '温馨提示',
          content: '亲爱的' + wx.getStorageSync('key') + '老师，您已经认证成功，再次认证会覆盖您现在的身份!',
          showCancel: false
          })
        }
  },

  formSubmit: function (res) {
    if(this.data.dex == 1){
      this.shujuku(res.detail.value)
    }else if(this.data.dex == 2){
      this.shujuku1(res.detail.value)
    }
  },

  shujuku(e) {
    console.log("学生认证");
    console.log(e);
    db.collection('authentication')
      .where({
        name: e.姓名,
        class: e.班级,
        school: e.学校,
        studentID: e.学号,
      })
      .get()
      .then(res => {
        console.log("resssss", res.data)
        if (res.data.length != 0) {
          const e = res.data[0];
          wx.setStorageSync('stuSchool', e.school)
          wx.setStorageSync('stuName', e.name)
          wx.setStorageSync('stuClass', e.class)
          wx.setStorageSync('stuNumber', e.studentID)
          wx.setStorageSync('guanli', e.guanli)
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '认证成功',
            success: (res) => {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击确定')
                wx.reLaunch({
                  url: '../seting/seting',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.data.length == 0) {
          console.log("jhasgdfjuhsg")
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '认证失败，请核对您的信息',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  },

  shujuku1(e) {
    console.log("教师认证");
    console.log(e);
    db.collection('authentication')
      .where({
        name: e.姓名,
        class: e.班级,
        school: e.学校,
        telephone: e.电话,
      })
      .get()
      .then(res => {
        console.log("resssss", res.data)
        if (res.data.length != 0) {
          const e = res.data[0];
          wx.setStorageSync('teaSchool', e.school)
          wx.setStorageSync('teaName', e.name)
          wx.setStorageSync('telephone', e.telephone)
          wx.setStorageSync('guanli', e.guanli)
          wx.setStorageSync('teaclass', e.teaclass)
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '认证成功',
            success: (res) => {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击确定')
                wx.reLaunch({
                  url: '../seting/seting',
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        } else if (res.data.length == 0) {
          console.log("jhasgdfjuhsg")
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '认证失败，请核对您的信息',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      })
      .catch(err => {
        console.log(err);
      })
  },

  tea:function(e){
    wx.setStorageSync('guanli', -1)
    wx.switchTab({
      url: '../../../pages/shcool/shcool',
    });
      
  },

  selected: function (e) {
    this.setData({
      dex: e.currentTarget.dataset.dex
    })
  },
})