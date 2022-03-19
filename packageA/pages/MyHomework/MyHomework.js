const db = wx.cloud.database()
var util = require('../../../utils/util.js');
const $ = db.command.aggregate;
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuNumber: wx.getStorageSync('stuNumber'),
    guanli: wx.getStorageSync('guanli'),
    date: new Date().getTime(),
    zuoye: [],
    xinxi: [],
    class: [],
    classs: [],
    id: "",
    ids: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.guanli != 1) {
      console.log("1111");
      this.wode(options.id)
      wx.hideLoading();
      this.setData({
        
        id: options.id
      })
    } else {

      db.collection("authentication")
        .where({
          class: options.class
        })
        .get()
        .then(res => {
          this.setData({
            class: res.data,
            id:options.id
          })
          this.zuoye(options.id)
        })
      this.setData({
        ids: this.data.ids
      })

    }
  },
  //我的作业
  wode(e) {
    db.collection('homework')
      .doc(e)
      .get()
      .then(res => {
        this.setData({
          xinxi: res.data
        })
        const array = res.data.student
        console.log(array);
        for (let i = 0; i < array.length; i++) {
          if (array[i].stuNumber == this.data.stuNumber) {
            this.setData({
              zuoye: this.data.zuoye.concat(array[i])
            })
          }

        }
      })
  },
  xiugai(e) {
    wx.navigateTo({
      url: '../homework_upload/homework_upload?id=' + this.data.id + "&ids=" + 0,

    });
  },
  //作业管理端
  zuoye(e) {
    db.collection('homework')
      .doc(e)
      .get()
      .then(res => {
       // console.log(res.data.student);
        const array = res.data.student;
        for (let i = 0; i < array.length; i++) {
          const array1 = this.data.class;
          for (let j = 0; j < array1.length; j++) {
            if (array[i].stuName == array1[j].name) {
              this.setData({
                classs:this.data.classs.concat(array1[j])
              })
            }
          }

        }
        wx.hideLoading();
      })
  }
})