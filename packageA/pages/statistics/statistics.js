const db = wx.cloud.database()
// const qnaire = require("../../utils/sas.js") //导入题库
var ans = new Array() //答案数组初始化，会在onload函数中赋初值""
const util = require('../../../utils/util.js')

Page({
  data: {
    // qnaire: qnaire.qnaire,
    qnaire: [], //课堂检测题目
    detail: [],
    answer: [],
    id: 0,
    array: ["单选题", "多选题",  "填空题"],
    type: 0,
    conLists: [],
    score: [],
    correct: [],
    zimu: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
    zimu1: ["T", "F"],
  },

  onLoad: function (option) {
    // 获取课堂检测题目
    console.log("_id:",option._id)
    this.setData({
      Id: option._id
    })
    var _id = option._id
    db.collection('statistics_question')
      .orderBy('sendTime', 'desc')
      .where({
        "class": "信计1196",
        _id: option._id
      })
      .get()
      .then(res => {
        this.setData({
          detail: res.data[0],
          qnaire: res.data[0].qnaire,
          answer: new Array(res.data[0].qnaire.length),
        })
        console.log("?????", res.data[0].setTime)
      })
      .catch(err => {

      })
  },

  onShow: function () {

  },

  // 选择题答案
  checkboxChange: function (e) {
    // console.log(e.currentTarget.dataset.id);
    var a = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var ans = this.data.answer
    ans[id] = a;
    this.setData({
      answer: ans,
    })
    // console.log(this.data.answer);
  },

  // 填空题答案
  bindin: function (e) {
    // console.log(e.currentTarget.dataset.id)
    var a = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var ans = this.data.answer
    ans[id] = a;
    this.setData({
      answer: ans
    })
  },

  // 3.提交
  submit: function (e) {
  },

  //判断答题完成情况
  formSubmit: function () {
    var finish;
    var i = 0;
    var _this = this;
    var ans = this.data.answer
    console.log(ans)
    while (i < ans.length ) {
      if (ans[i] == null) {
        console.log(ans[i],":",finish)
        finish = 'false';
        break;
      } else {
        console.log(ans[i],":",finish)
        finish = 'true';
      }
      i++;
    }
    if (finish == 'false') {
      wx.showModal({
        title: '无法提交',
        content: '您还有部分题目未完成，请检查后重新提交',
        showCancel: false,
        confirmColor: '#fcbe39',
        confirmText: "好的",
        success(res) {
          _this.setData({
            id: i,
          })
        }
      })
    } else {
      wx.showLoading({
        title: '上传中...',
      })
      _this.answer2db();
    }
  },

  //将用户完成的答案数组上传至云数据库
  answer2db: function () {
    var time = util.formatTime(new Date()).substring(0, 16);
    db.collection('statistics_answer').add({
      data: {
        answer: this.data.answer,
        stuClass: wx.getStorageSync('stuClass'),
        stuName: wx.getStorageSync('stuName'),
        stuNumber: wx.getStorageSync('stuNumber'),
        avatarUrl: wx.getStorageSync('avatarUrl'),
        currentTime: time,
        Id: this.data.Id
      },
      success(res) {
        wx.showToast({
          title: '作业提交成功！'
        })
        wx.hideLoading()
        console.log(res._id);
        setTimeout(function () {
          wx.navigateTo({
            url: '../statistics3/statistics3',
          })
        }, 1000)
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '作业提交失败，请稍后再试！'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  area: function (e) {
    var _this = this;
    _this.setData({
      id: e.currentTarget.dataset.dex,
    })
    console.log()
  }
})