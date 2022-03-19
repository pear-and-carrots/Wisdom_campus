const db = wx.cloud.database()
const _ = db.command
const $ = db.command.aggregate
var util = require('../../utils/util.js');
var time = util.formatTime(new Date()).substring(0, 10);
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuName: wx.getStorageSync('stuName'),
    stuSchool: wx.getStorageSync('stuSchool'),
    stuClass: wx.getStorageSync('stuClass'),
    teaclass: wx.getStorageSync('teaclass'),
    stuNumber: wx.getStorageSync('stuNumber'),
    guanli: wx.getStorageSync('guanli'),
    menubar:[],
    quantity: 0,
    xinxi: [],
    xinxi1: [],
    array: ["今日消息", "全部消息"],
    num: ['', '', '', ''],
    dex: 0,
    member: []
  },
  selected: function (e) {
    this.setData({
      dex: e.currentTarget.dataset.dex
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('stuName') == ""&&wx.getStorageSync('teaName') == "") {
      wx.setStorageSync('guanli', -1)

    }
    this.getClassNotice()
    wx.showLoading({
      title: "加载中"
    });
    this.setData({
      stuClass: wx.getStorageSync('stuClass'),
      guanli: wx.getStorageSync('guanli')
    })
    if (this.data.stuClass) {
      this.tozhi(time);
      this.tozhi1();
    }
    this.member()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    if (wx.getStorageSync('stuName') == ""&&wx.getStorageSync('teaName') == "") {
      wx.showModal({
        title: '提示',
        content: '请先完成学校认证，否则将无法使用班级功能',
        showCancel: false,
        success: (res) => {
          this.setData({
            stuClass: wx.getStorageSync('stuName'),
          })
          if (res.confirm) {
            wx.redirectTo({
              url: '../../packageB/pages/authentication/authentication',
              success: (result) => {

              },
              fail: () => {},
              complete: () => {}
            });

          }
        }
      })
    } else {
      wx.hideLoading();

    }

  },
  lunbo: function (e) {
    this.setData({
      lunboData: e.detail.value
    })
  },

  inputLunbo: function () {
    db.collection("class")
      .add({
        data: {
          type: "班级轮播公告",
          data: this.data.lunboData,
        }
      })
      .then(res => {
        wx.showToast({
          title: "上传成功",
        })
        this.getClassNotice()
        this.setData({
          lunboData: ''
        })

      })
  },

  getClassNotice: function () {
    db.collection('class')
      .where({
        type: "班级轮播公告"
      })
      .get()
      .then(res => {
        this.setData({
          getNotice: res.data
        })
      })
  },

  //班级成员
  member() {
    if (this.data.guanli==0) {
      db.collection('authentication')
      .where({
        class: this.data.stuClass
      })
      .get()
      .then(res => {
        console.log(res.data.length);
        const quantity = res.data.length;
        this.setData({
          member: res.data,
          quantity: quantity
        })
      })
    }
    if (this.data.guanli==1) {
      const array=this.data.teaclass;
      for (let  i= 0;  i< array.length; i++) {
        db.collection('authentication')
        .where({
          class: array[i]
        })
        .get()
        .then(res => {
          console.log(res.data.length);
          const quantity = res.data.length;
          this.setData({
            member: this.data.menubar.concat(res.data),
            quantity: this.data.quantity+quantity
          })
        })
      }
    }
  },
  //通知
  tozhi(e) {
    db.collection('notice')
      .where({
        stuClass: this.data.stuClass,
        time: db.RegExp({
          regexp: time,
          options: '/^i/',
        })
      })
      .get()
      .then(res => {
        this.data.xinxi = res.data
        if (this.data.guanli==0) {
          this.zuoye()
        }
      })
  },
  //作业
  zuoye() {
    db.collection('homework')
      .where({
        class: this.data.stuClass,
        time: db.RegExp({
          regexp: time,
          options: '/^i/',
        }),

      })
      .get()
      .then(res => {
        this.setData({
          xinxi: this.data.xinxi.concat(res.data.reverse())
        })
        this.daka()
      })
  },
  //打卡
  daka() {
    db.collection('checking-in')
      .where({
        class: this.data.stuClass,
        startTime: db.RegExp({
          regexp: time,
          options: '/^i/',
        }),
        class: this.data.stuClass
      })
      .get()
      .then(res => {
        this.setData({
          xinxi: this.data.xinxi.concat(res.data.reverse())
        })
        this.toji()
      })
  },
  //统计
  toji() {
    db.collection('sas')
      .where({
        class: this.data.stuClass,
        currentTime: db.RegExp({
          regexp: time,
          options: '/^i/',
        })
      })
      .get()
      .then(res => {
        this.setData({
          xinxi: this.data.xinxi.concat(res.data.reverse())
        })
        this.cheshi()
      })
  },
  cheshi() {
    db.collection('statistics_question')
      .where({
        class: this.data.stuClass,
        currentTime: db.RegExp({
          regexp: time,
          options: '/^i/',
        })
      })
      .get()
      .then(res => {
        this.setData({
          xinxi: this.data.xinxi.concat(res.data.reverse())
        })
        const xinxi = this.data.xinxi.sort(this.objectSort("date"))
        console.log(xinxi);
        this.setData({
          xinxi: xinxi
        })
        wx.hideLoading();
      })
  },
  navigateTo(e) {
    console.log(e.currentTarget.dataset);
    switch (e.currentTarget.dataset.genre) {
      case "班级通知":
        wx.navigateTo({
          url: '../../packageA/pages/notice_details/notice_details?id=' + e.currentTarget.dataset.id,
        });
        break;
      case "课程作业":
        wx.navigateTo({
          url: '../../packageA/pages/homework_upload/homework_upload?id=' + e.currentTarget.dataset.id + "&ids=" + 1,
        });
        break;
      case "考勤打卡":
        wx.navigateTo({
          url: '../../packageA/pages/checking-in/checking-in?stuClass=' + this.data.stuClass,
        });
        break;

      case "信息统计":
        wx.navigateTo({
          url: '../../packageA/pages/statistics/statistics?_id=' + e.currentTarget.dataset.id,
        });
        break;
      case "课程检测":
        wx.navigateTo({
          url: '../../packageA/pages/matter/matter?_id=' + e.currentTarget.dataset.id,
        });
        break;

      default:
        break;
    }
  },
  objectSort: function (property) {
    return function (Obj1, Obj2) {
      return Obj2[property] - Obj1[property]
    }
  },
  tozhi1(e) {
    db.collection('notice')
      .where({
        stuClass: this.data.stuClass,
      })
      .get()
      .then(res => {
        this.data.xinxi1 = res.data
        this.zuoye1()
      })
  },
  //作业
  zuoye1() {
    db.collection('homework')
      .where({
        class: this.data.stuClass,
      })
      .get()
      .then(res => {
        this.setData({
          xinxi1: this.data.xinxi1.concat(res.data.reverse())
        })
        this.daka1()
      })
  },
  //打卡
  daka1() {
    db.collection('checking-in')
      .where({
        class: this.data.stuClass,
      })
      .get()
      .then(res => {
        this.setData({
          xinxi1: this.data.xinxi1.concat(res.data.reverse())
        })
        this.toji1()
      })
  },
  toji1() {
    db.collection('sas')
      .where({
        class: this.data.stuClass,
      })
      .get()
      .then(res => {
        this.setData({
          xinxi1: this.data.xinxi1.concat(res.data.reverse())
        })
        this.cheshi1()
      })
  },
  cheshi1() {
    db.collection('statistics_question')
      .where({
        class: this.data.stuClass,
      })
      .get()
      .then(res => {
        this.setData({
          xinxi1: this.data.xinxi1.concat(res.data.reverse())
        })
        const xinxi1 = this.data.xinxi1.sort(this.objectSort("date"))
        console.log(xinxi1);
        this.setData({
          xinxi1: xinxi1
        })
      })
  },

  setNotice: function () {
    this.setData({
      showModal: true
    })
  },

  setNotice1: function () {
    this.setData({
      showModal1: true
    })
  },

  close_mask: function () {
    this.setData({
      showModal: false,
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
                this.getClassNotice()
                console.log("成功", res);
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