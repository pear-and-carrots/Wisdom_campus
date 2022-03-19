const db = wx.cloud.database()
var wxCharts = require("../../../utils/wxcharts.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    abc: [0, 0, 0, 0,],
    abcd: [0, 0, 0, 0,],
    TF:[0 ,0],
    ABC:[],
    detail: [],
    tkt:0,
    guanli: wx.getStorageSync('guanli'),
    key: [],
    correct: [],
    xinxi: [],
    achievement: [],
    specialtyFraction:[],
    score: 0,
    gradePoint:0,
    specialtyRankings:0,
    classRanking:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      guanli: wx.getStorageSync('guanli')
    })
    console.log(options);
    wx.showLoading({
      title: "加载中"
    });
    if (wx.getStorageSync('guanli')== 0) {
      db.collection('sas')
      .orderBy('sendTime', 'desc')
      .where({
        "class": wx.getStorageSync('stuClass')
      })
      .get()
      .then(res => {
        console.log("学生页面");
        wx.hideLoading();
        this.setData({
          detail: res.data,
          answer: new Array(res.data[0].qnaire.length)
        })
        console.log("?????", res.data)
      })
      .catch(err => {

      })

    }
    if (wx.getStorageSync('guanli')==1) {
      db.collection("sas")
      .doc(options.id)
      .get()
      .then(res => {
        console.log("教师",res);
        this.setData({
          xinxi1: res.data
        })
      }).then(res=>{
        db.collection("answer")
        .where({
          Id: options.id
        })
        .get()
        .then(res => {
          console.log(res);
          wx.hideLoading();
          const array = res.data;
          for (let i = 0; i < array.length; i++) {
            this.setData({
              xinxi2:res.data,
              xinxi: this.data.xinxi.concat([array[i].answer])
            })
          }
          this.tuan(this.data.xinxi)
        })
        .then(res=>{
          this.analysis()
        })
      })

    }
  },
  //题型
  tuan(e) {
    const array = this.data.xinxi1.qnaire;
    for (let i = 0; i < array.length; i++) {
      console.log(i);
      switch (this.data.xinxi1.qnaire[i].key.type) {
        case "单选题":
          this.dan(i)
          break;
          case "判断题":
            this.panduan(i)
            break;
        case "多选题":
          console.log("2");
          this.duo(i)
          break;
        case "填空题":
          this.setData({
            tkt: i
          })
          break;
        default:
          break;
      }
    }
  },
  panduan(e){
    const array = this.data.xinxi;
    for (let i = 0; i < array.length; i++) {
      console.log(array[i][e]);
      switch (array[i][e]) {
        case "T":
          this.data.TF[0] = this.data.TF[0] + 1
          break;
        case "F":
          this.data.TF[1] = this.data.TF[1] + 1
          break;
        default:
          break;
      }

    }
  },
  //单项选择
  dan(e) {
    const array = this.data.xinxi;
    for (let i = 0; i < array.length; i++) {
      console.log(array[i][e]);
      switch (array[i][e]) {
        case "A":
          this.data.abc[0] = this.data.abc[0] + 1
          break;
        case "B":
          this.data.abc[1] = this.data.abc[1] + 1
          break;
        case "C":
          this.data.abc[2] = this.data.abc[2] + 1
          break;
        case "D":
          this.data.abc[3] = this.data.abc[3] + 1
          break;
        default:
          break;
      }

    }

  },
  //多项选择
  duo(e) {
    const array = this.data.xinxi;
    for (let i = 0; i < array.length; i++) {
      this.setData({
        ABC: this.data.ABC.concat(array[i][e])
      })

    }
    const array1 = this.data.ABC;
    for (let i = 0; i < array1.length; i++) {
      switch (array1[i]) {
        case "A":
          this.data.abcd[0] = this.data.abcd[0] + 1
          break;
        case "B":
          this.data.abcd[1] = this.data.abcd[1] + 1
          break;
        case "C":
          this.data.abcd[2] = this.data.abcd[2] + 1
          break;
        case "D":
          this.data.abcd[3] = this.data.abcd[3] + 1
          break;
        default:
          break;
      }
    }
  },
  getInto: function (e) {
    console.log(e)
    console.log(e.currentTarget.dataset.index);
    const detail = this.data.detail[e.currentTarget.dataset.index].qnaire;
    db.collection('answer')
      .orderBy('sendTime', 'desc')
      .where({
        "stuName": wx.getStorageSync('stuName'),
        Id: e.currentTarget.dataset._id
      })
      .get()
      .then(res => {
        console.log("?????", res.data[0])
        if (res.data[0] == null) {
          wx.navigateTo({
            url: '../matter/matter?_id=' + e.currentTarget.dataset._id,
          })
        } else {
          for (let i = 0; i < detail.length; i++) {
            this.setData({
              correct: this.data.correct + [i + 1] + ":" + detail[i].key.correct + ","
            })
          }
          this.setData({
            show: true,
            score: res.data[0]
          })
        }
      })
      .catch(err => {

      })

  },

  fabu1: function (e) {
    this.setData({
      show: false,
      look: false
    })
  },

  look: function (e) {
    this.setData({
      look: true
    })
  },
  //图表
  analysis() {
    console.log("1234123");
    const A = this.data.abc[0];
    const B = this.data.abc[1];
    const C = this.data.abc[2];
    const D = this.data.abc[3];
    console.log(A, B, C, D);
    new wxCharts({
      animation: true, //是否有动画
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: 'A',
        data: A,
      }, {
        name: 'B',
        data: B,
      }, {
        name: 'C',
        data: C,
      },
      {
        name: 'D',
        data: D,
      }
      ],
      width: 350,
      height: 200,
      dataLabel: true,
    });
    const T = this.data.TF[0];
    const F = this.data.TF[1];
    console.log('TF',T,F);
    new wxCharts({
      animation: true, //是否有动画
      canvasId: 'pieCanvas2',
      type: 'pie',
      series: [{
        name: '是',
        data: T,
      }, {
        name: '否',
        data: F,
      },
      ],
      width: 350,
      height: 200,
      dataLabel: true,
    });
    const A1 = this.data.abcd[0];
    const B1 = this.data.abcd[1];
    const C1 = this.data.abcd[2];
    const D1 = this.data.abcd[3];
    new wxCharts({
      animation: true, //是否有动画
      canvasId: 'pieCanvas1',
      type: 'pie',
      series: [{
        name: 'A',
        data: A1,
      }, {
        name: 'B',
        data: B1,
      }, {
        name: 'C',
        data: C1,
      },
      {
        name: 'D',
        data: D1,
      }
      ],
      width: 350,
      height: 200,
      dataLabel: true,
    });
  },

})