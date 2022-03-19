const db = wx.cloud.database()
var dateTimePicker = require('../../../utils/dateTimePicker.js');
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var app = getApp();
//申请密钥地址 https://lbs.qq.com/
var qqmap = new QQMapWX({
  key: 'EK3BZ-P7U66-727SX-EXCWC-AHWFZ-O4B72'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateTime1: null,
    dateTimeArray1: null,
    dateTime2: null,
    dateTimeArray2: null,
    array1: ["普通打卡", "二维码打卡", "定点打卡"],
    address: "",
    title: "",
    type: "",
    guanli: wx.getStorageSync('guanli'),
    array: ['发布考勤', '考勤列表'],
    dex: 0,
    message: [],
    show: false
  },

  onLoad: function (options) {
    var that = this
    //获取当前经纬度
    wx.getLocation({
      type: 'wgs84',

      success: function (res) {
        qqmap.reverseGeocoder({
          location: {
            latitude: res.latitude, //回调的纬度
            longitude: res.longitude //回调的经度
          },
          //回调成功显示位置的详细数据
          success: function (res) {
            console.log('zzlzzlzzl', res);
            console.log(res.result.address)
            that.setData({
              address: res.result.address,
              latitude: res.result.location.lat,
              longitude: res.result.location.lng
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        })
      },
    })

    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();

    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTimeArray1: obj1.dateTimeArray,
      dateTimeArray2: obj1.dateTimeArray,
      dateTime1: obj1.dateTime,
      dateTime2: obj1.dateTime,
      guanli: wx.getStorageSync('guanli')
    });
  },

  selected: function (e) {
    // console.log(e.currentTarget.dataset.dex)
    let message = this.data.message
    this.setData({
      dex: e.currentTarget.dataset.dex
    })
    if (this.data.dex == 1 && message.length == 0) {
      wx.showLoading({
        title: '加载中',
      })
      db.collection('checking-in')
        .orderBy('sendTime', 'desc')
        .where({
          "class": wx.getStorageSync('stuClass'),
        })
        .get()
        .then(res => {
          wx.hideLoading();
          this.setData({
            message: res.data
          })
        })
        .catch(err => {

        })
    }
  },

  bindinput: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },

  changeDateTime1(e) {
    this.setData({
      dateTime1: e.detail.value,
      time1: this.data.dateTimeArray1[0][this.data.dateTime1[0]] + "-" + this.data.dateTimeArray1[1][this.data.dateTime1[1]] + "-" + this.data.dateTimeArray1[2][this.data.dateTime1[2]] + " " +
        this.data.dateTimeArray1[3][this.data.dateTime1[3]] + ":" + this.data.dateTimeArray1[4][this.data.dateTime1[4]]
    })
    console.log("time11", this.data.time1)
  },

  changeDateTime2(e) {
    this.setData({
      dateTime2: e.detail.value,
      time2: this.data.dateTimeArray2[0][this.data.dateTime2[0]] + "-" + this.data.dateTimeArray2[1][this.data.dateTime2[1]] + "-" + this.data.dateTimeArray2[2][this.data.dateTime2[2]] + " " +
        this.data.dateTimeArray2[3][this.data.dateTime2[3]] + ":" + this.data.dateTimeArray2[4][this.data.dateTime2[4]]
    });
    console.log("time22", this.data.time2)
  },

  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  changeDateTimeColumn2(e) {
    var arr = this.data.dateTime2,
      dateArr = this.data.dateTimeArray2;

    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

    this.setData({
      dateTimeArray2: dateArr,
      dateTime2: arr
    });
  },

  bindPickerChange: function (e) {
    let type = this.data.type
    switch (Number(e.detail.value)) {
      case 0:
        type = "普通打卡"
        break;
      case 1:
        type = "二维码打卡"
        break;
      case 2:
        type = "定点打卡"
        break;
      default:
    };
    this.setData({
      index: e.detail.value,
      type: type
    })
  },

  // 发布
  button: function (e) {
    db.collection("checking-in")
      .add({
        data: {
          date: new Date().getTime(),
          title: this.data.title,
          type: this.data.type,
          startTime: this.data.time1,
          endTime: this.data.time2,
          class: wx.getStorageSync('stuClass'),
          teacher: wx.getStorageSync('stuName'),
          avatarUrl: wx.getStorageSync('avatarUrl'),
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          address: this.data.address,
          genre: "考勤打卡",
        },
        success(res) {
          console.log(res._id);
          wx.showToast({
            title: '发布成功！'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../checking-in/checking-in',
            })
          }, 1000)
        },
        fail(res) {
          wx.showToast({
            icon: 'none',
            title: '考勤发布失败，请稍后再试！'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
  },

  onReady: function () {

  },

  onShow: function () {

  },

  checkingInList: function (e) {
    this.setData({
      show: true
    })
    db.collection('checking-inList')
      .orderBy('sendTime', 'desc')
      .where({
        Id: e.currentTarget.dataset._id
      })
      .get()
      .then(res => {
        console.log(res.data)
        this.setData({
          checkingList: res.data
        })
      })
      .catch(err => {

      })
  },

  fabu1: function (e) {
    this.setData({
      show: false
    })
  }

})