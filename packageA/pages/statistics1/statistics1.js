const db = wx.cloud.database()
// const qnaire = require("../../utils/sas.js") //导入题库
var ans = new Array(100) //答案数组初始化，会在onload函数中赋初值""
var util = require('../../../utils/util.js');

Page({
  data: {
    // qnaire: qnaire.qnaire,
    qnaire: [], //课堂检测题目
    qnaire1: [],
    answer: ans,
    id: 0,
    array: ["单选题", "多选题", "填空题"],
    array2: ['小程序端上传题目', '文件上传题目'],
    cutover:[
      {
        id:0,
        value:"问卷上传",
        isActive:true,
      },
      {
        id:1,
        value:"我的问卷",
        isActive:false,
      }
    ],
    guanli: wx.getStorageSync('guanli'),
    class: "",
    index2: 0,
    xinxi: [],
    // type: 0,
    conLists: [],
    question_type: [],
    question: '',
    dexId: 0,
    endTime: ""
  },
  handleTtabsIemChange(e){
    console.log(e);
    const {index}=e.detail;
    let {cutover}=this.data;
    cutover.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      cutover
   })
   },
  onLoad: function (e) {
    this.setData({
      guanli: wx.getStorageSync('guanli')
    })
    this.notice()

  },
  notice() {
    db.collection("statistics_question")
      .where({
        teacher: wx.getStorageSync('teaName'),
        telephone: wx.getStorageSync('telephone'),
      })
      .get()
      .then(res => {
        console.log(res.data);
        this.setData({
          xinxi: res.data
        })
      })
  },
  n1: function (e) {
    this.setData({
      setTime: "无限",
      endTime: "无限期",
      x1: true,
      x2: false
    })
  },

  n2: function (e) {
    this.setData({
      x2: true,
      x1: false
    })
  },

  endTime: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  // 按钮逻辑
  // 1.下一题
  nextq: function (e) {
    var _conLists = this.data.conLists;
    _conLists = Object.assign({}, this.data.conLists)

    if (this.data.id < 20) {
      this.setData({
        id: this.data.id + 1,
      })
    }

    // 存入新数组
    let _qnaire1 = this.data.qnaire1
    let _data_list = {
      key: {
        type: this.data.question_type,
        question: this.data.question,
        conLists: this.data.conLists,
      }
    }


    _qnaire1.push(_data_list)
    this.setData({
      qnaire1: _qnaire1,
      question: '',
      conLists: []
    })


    // 排除空选项

    console.log('这是模板内容标题数组', _conLists)
    for (let i = 0; i < _conLists.length + 3; i++) {
      if (!_conLists[i]) {
        wx.showToast({
          title: '请输入第' + `${i * 1 + 1}` + '条的选项内容！',
          icon: 'none'
        })
        return;
      }
    }

    if (this.data.question_type) {
      console.log("skdhfuiwesgh")
      var _list = this.data.conLists;
      _list.push("")
      _list.push("")
      this.setData({
        conLists: _list
      })
    }

    wx.showToast({
      title: '添加成功！',
    })
  },
  // 设置答案
  checkboxChange: function (e) {
    console.log(e.detail.value);
    var a = e.detail.value;
    var id = this.data.id;
    ans[id] = a;
    this.setData({
      answer: ans,
    })
    console.log(this.data.answer);
    console.log("选择题的值：", e.detail.value)
  },

  //填空题
  bindtextarea: function (e) {
    var a = e.detail.value;
    var id = this.data.id;
    ans[id] = a;
    this.setData({
      answer: ans
    })
    console.log("填空题的值：", e.detail.value)
  },
  // 3.提交
  bindsubmit: function (e) { },

  // 上传题目
  formSubmit: function () {
    if (this.data.question == '') {
      this.add_statistics_question()
    } else if (this.data.question != '') {
      this.nextq()
      setTimeout(this.add_statistics_question, 1000)
    }
  },

  // 上传数据库
  add_statistics_question: function (e) {
    console.log("空题目")
    console.log("end", this.data.qnaire1)
    const qnaire = this.data.qnaire1
    const title = this.data.title
    const endTime = this.data.endTime
    var time = util.formatTime(new Date()).substring(0, 16);
    db.collection("statistics_question")
      .add({
        data: {
          qnaire,
          title,
          class: this.data.class,
          teacher: wx.getStorageSync('teaName'),
          avatarUrl: wx.getStorageSync('avatarUrl'),
          telephone: wx.getStorageSync('telephone'),
          currentTime: time,
          endTime: endTime,
          date: new Date().getTime(),
          genre: "信息统计"
        },
        success(res) {
          console.log(res._id);
          wx.showToast({
            title: '问卷设置成功！'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../statistics1/statistics1',
            })
          }, 1000)
        },
        fail(res) {
          wx.showToast({
            icon: 'none',
            title: '设置题目失败，请稍后再试！'
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
  },

  // 管理端
  // 标题
  title: function (e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },
  // 上传类型
  bindPickerChange1: function (e) {
    this.setData({
      index2: e.detail.value,
    })
  },

  // 题目类型
  bindPickerChange: function (e) {
    switch (Number(e.detail.value)) {
      case 0:
        this.data.question_type = "单选题"
        break;
      case 1:
        this.data.question_type = "多选题"
        break;
      case 2:
        this.data.question_type = "填空题"
        break;
      default:
    };
    this.setData({
      index: e.detail.value,
      type: e.detail.value,
    })
  },

  //问题
  question: function (e) {
    console.log(e.detail.value)
    this.setData({
      question: e.detail.value
    })

  },

  radioChange: function (e) {
    console.log(e.detail.value)
  },

  //添加选项
  add(e) {
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.conLists;
    _list.push("")
    this.setData({
      conLists: _list,
    })
  },

  /**
   * 删除内容
   */
  del(e) {
    var idx = e.currentTarget.dataset.index;
    var _list = this.data.conLists;
    console.log(idx)
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list.splice(idx, 1)
      }
    }
    this.setData({
      conLists: _list
    })
  },
  changeConTitle3(e) {
    this.setData({
      class: e.detail.value
    })
  },
  ////单选题多选题的选项内容
  changeConTitle(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list = this.data.conLists; //data中存放的数据
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list[i] = {
          del: val
        }
      }
    }

    this.setData({
      conLists: _list
    })
  },

  //填空题的选项内容
  changeConTitle1: function (e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _text = this.data.correct; //data中存放的数据
    for (let i = 0; i < _text.length; i++) {
      if (idx == i) {
        _text[i] = {
          text_correct: val
        } //将当前输入的值放到数组中对应的位置
      }
    }
    this.setData({
      correct: _text
    })
  }
})