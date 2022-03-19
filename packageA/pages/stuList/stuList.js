const db = wx.cloud.database();
Page({
  data: {
    stuList:[],
    guanli: wx.getStorageSync('guanli'),
    teaclass: wx.getStorageSync('teaclass'),
    stuClass: wx.getStorageSync('stuClass'),

  },

  onLoad: function (options) {
    this.setData({
      guanli:wx.getStorageSync('guanli'),
    })
    if (this.data.guanli==0) {
      db.collection('authentication')
      .where({
        class: this.data.stuClass
      })
      .get()
      .then(res => {
        console.log(res.data[0])
        this.setData({
          stuList : res.data
        })
      })
      .catch(err => {
  
      })
    }
    if (this.data.guanli==1) {
      const array=this.data.teaclass;
      for (let i = 0; i < array.length; i++) {
        db.collection('authentication')
        .where({
          class: array[i]
        })
        .get()
        .then(res => {
          console.log(res.data[0])
          this.setData({
            stuList : this.data.stuList.concat(res.data)
          })
        })
      }
    }

  }
 
})