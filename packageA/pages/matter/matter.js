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
    score1:0,
    array: ["单选题", "多选题", "判断题", "填空题"],
    type: 0,
    conLists: [],
    score: [],
    correct: [],
    zimu: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"],
    zimu1: ["T", "F"],
    sum: 0,
    all: 0,
    time: '1',
    timer:''
    // timeStr: '05:00',
  },

  start: function () {
    this.setData({
      clockShow: true,
      mTime: this.data.time * 60 * 1000,
      timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00'
    })
    this.drawActive();
  },

  drawActive: function () {
    var _this = this;
    var timer = setInterval(function () {
      var angle = 1.5 + 2 * (_this.data.time * 60 * 1000 - _this.data.mTime) / (_this.data.time * 60 * 1000);
      var currentTime = _this.data.mTime - 100
      _this.setData({
        mTime: currentTime
      });
      if (angle < 3.5) {
        if (currentTime % 1000 == 0) {
          var timeStr1 = currentTime / 1000;
          var timeStr2 = parseInt(timeStr1 / 60)
          var timeStr3 = (timeStr1 - timeStr2 * 60) >= 10 ? (timeStr1 - timeStr2 * 60) : '0' + (timeStr1 - timeStr2 * 60);
          var timeStr2 = timeStr2 >= 10 ? timeStr2 : '0' + timeStr2;
          _this.setData({
            timeStr: timeStr2 + ":" + timeStr3
          })
        }
      } else if (_this.data.time == '无限') {
        _this.setData({
          timeStr: '无限'
        })
      } else {
        _this.setData({
          timeStr: '00:00'
        })
        clearInterval(timer);
        wx.showToast({
          title: '时间到！',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          _this.answer2db();
        }, 1000)
      }
    }, 100)
    this.setData({
      timer : timer
    })
  },

  onLoad: function (option) {
    // 获取课堂检测题目
    console.log("_id:",option._id)
    this.setData({
      Id: option._id
    })
    var _id = option._id
    db.collection('sas')
      .where({
        _id
      })
      .get()
      .then(res => {
        console.log(res);
        this.setData({
          detail: res.data[0],
          qnaire: res.data[0].qnaire,
          answer: new Array(res.data[0].qnaire.length),
          time: res.data[0].setTime
        })
        console.log("?????", res.data[0].setTime)
        this.start()
      })
      .catch(err => {

      })
  },

  onShow: function () {

  },

  // 按钮逻辑
  // 1.下一题
  nextq: function (e) {
    if (this.data.id < 20) {
      this.setData({
        id: this.data.id + 1,
      })
    }
  },

  // 2.上一题
  lastq: function (e) {
    if (this.data.id != 0) {
      this.setData({
        id: this.data.id - 1,
      })
    }
  },

  checkboxChange: function (e) {
    // console.log(e.detail.value);
    var a = e.detail.value;
    var id = this.data.id;
    var ans = this.data.answer
    ans[id] = a;
    this.setData({
      answer: ans,
    })
    // console.log(this.data.answer);
  },

  bindin: function (e) {
    var a = e.detail.value;
    var id = this.data.id;
    var ans = this.data.answer
    ans[id] = a;
    this.setData({
      answer: ans
    })
    // console.log("填空题的值：", e.a)
  },
  // 3.提交
  submit: function (e) {
    // console.log(e.detail.value);
    // var a = e.detail.value.answer;
    // var id = this.data.id;
    // ans[id] = a;
    // this.setData({
    //   answer: ans,
    // })
    // console.log(this.data.answer);
    // console.log("hhsadjgfcyuse",e.detail.value.answer)
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
    const qnaire=this.data.qnaire;
    const answer=this.data.answer;
    for (let i = 0; i < qnaire.length; i++) {
      this.data.score1=this.data.score1+qnaire[i].key.score;
     if (qnaire[i].key.correct==answer[i]) {
       console.log(qnaire[i].key.score);
      this.data.score=Number(this.data.score)+qnaire[i].key.score;
      console.log(this.data.score);
     }
    }
    db.collection('answer').add({
      data: {
        score:this.data.score,
        score1:this.data.score1,
        answer: answer,
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
            url: '../matter3/matter3',
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timer);
  }
})