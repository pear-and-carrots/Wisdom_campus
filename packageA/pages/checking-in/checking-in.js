const db = wx.cloud.database()
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var app = getApp();
var util = require('../../../utils/util.js');
//申请密钥地址 https://lbs.qq.com/
var qqmap = new QQMapWX({
  key: 'EK3BZ-P7U66-727SX-EXCWC-AHWFZ-O4B72'
});
var util = require('../../../utils/util.js')
Page({
  data: {
    selected: true,
    selected1: false,
    address: '',
    time: '',
    PI: 3.14159,
    EARTH_RADIUS: 6378137.0,
    latitude: '',
    longitude: '',
    times: '',
    showdata: [],
    usimg: '',
    usname: '',
    usid: '',
    count: 0,
    // show: false
    // src:'https://thirdwx.qlogo.cn/mmopen/vi_32/HFUpbBbMvlKFXxic04v7DZM2mpEY4MwGdq0',
  },
  onLoad: function () {
    wx.showLoading({
      title: "加载中"
    });
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
              longitude: res.result.location.lng,
              openid: wx.getStorageSync('openid')
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
    this.getMessage()
  },

  // 获取打卡列表
  getMessage: function (e) {
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
  },

  // selected: function (e) {
  //   this.setData({
  //     selected1: false,
  //     selected: true,
  //     show: false
  //   })
  // },

  // selected1: function (e) {
  //   this.setData({
  //     selected: false,
  //     selected1: true,
  //     show: false
  //   })
  // },

  checkingIn: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    console.log(this.data.message[e.currentTarget.dataset.index].latitude)
    this.setData({
      Id: e.currentTarget.dataset._id,
    })
    wx.showModal({
      title: '提示',
      content: '确认是否打卡',
      success(res) {
        if (res.confirm) {
          if (that.data.latitude == that.data.message[e.currentTarget.dataset.index].latitude && that.data.longitude == that.data.message[e.currentTarget.dataset.index].longitude) {
            wx.showLoading({
              title: '打卡中',
            })
            that.search()
            // that.daka()
          } else {
            wx.showToast({
              icon: 'none',
              title: '考勤打卡失败，请到' + that.data.message[e.currentTarget.dataset.index].address + "处签到"
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 查询打卡状态

  search: function () {
    db.collection('checking-inList')
      .where({
        Id: this.data.Id,
      })
      .get()
      .then(res => {
        wx.hideLoading();
        console.log(res.data.length)
        if (res.data.length != 0) {
          wx.showToast({
            title: '您已经打过卡啦！',
          })
        } else if (res.data.length == 0) {
          this.daka()
        }
      })
  },

  // 打卡

  daka: function (e) {
    var time = util.formatTime(new Date()).substring(0, 16);
    db.collection("checking-inList")
      .add({
        data: {
          Id: this.data.Id,
          class: wx.getStorageSync('stuClass'),
          stuName: wx.getStorageSync('stuName'),
          avatarUrl: wx.getStorageSync('avatarUrl'),
          currentTime: time,
        },
        success(res) {
          console.log(res._id);
          wx.showToast({
            title: '打卡成功！'
          })
          this.putsign()
          setTimeout(function () {
            wx.navigateTo({
              url: '../checking-in/checking-in',
            })
          }, 1000)
        },
        fail(res) {
          wx.showToast({
            icon: 'none',
            title: '考勤打卡失败，请稍后再试！'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
  },

  // 打标签
  putsign: function () {
    const openid = this.data.openid
    db.collection('checking-in')
      .doc(this.data.Id)
      .update({
        data: {
          comment: _.unshift({
            openid
          })
        }
      })
      .then(res => {
        this.getMessage()
      })
  },
})