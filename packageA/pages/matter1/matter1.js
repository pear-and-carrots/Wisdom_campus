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
    index2:0,
    calss:"",
    array: ["单选题", "多选题", "判断题", "填空题"],
    array2: ['小程序端上传题目', '文件上传题目'],
    cutover:[
      {
        id:0,
        value:"上传题目",
        isActive:true,
      },
      {
        id:1,
        value:"我的题目",
        isActive:false,
      }
    ],
    // type: 0,
    conLists: [],
    score: [],
    correct: [],
    question_type: [],
    question: '',
    title: "",
    con: [{
      text: "T"
    }, {
      text: "F"
    }],
    dexId: 0,
    setTime: "",
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
    // var _list = this.data.conLists;
    // _list.push("")
    // _list.push("")
    // this.setData({
    //   conLists: _list
    // })
    this.setData({
      guanli: wx.getStorageSync('guanli')
    })
    this.notice()
  },
  notice() {
    db.collection("sas")
      .where({
        teacher: wx.getStorageSync('teaName'),
        telephone: wx.getStorageSync('telephone'),
      })
      .get()
      .then(res => {
        console.log("获取数据",res.data);
        this.setData({
          xinxi: res.data
        })
      })
  },
  changeConTitle3(e) {
    this.setData({
      class: e.detail.value
    })
  },
    // 上传类型
    bindPickerChange1: function (e) {
      this.setData({
        index2: e.detail.value,
      })
    },
  
  nt1: function (e) {
    this.setData({
      setTime: "无限",
      xuan1: true,
      xuan2: false
    })
  },

  nt2: function (e) {
    this.setData({
      xuan2: true,
      xuan1: false
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

  bindTime: function (e) {
    this.setData({
      setTime: e.detail.value
    })
  },

  selected: function (e) {
    // console.log(e.currentTarget.dataset.dex)
    this.setData({
      dexId: e.currentTarget.dataset.dex
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
        score: this.data.score,
        type: this.data.question_type,
        question: this.data.question,
        conLists: this.data.conLists,
        correct: this.data.correct
      }
    }


    _qnaire1.push(_data_list)
    this.setData({
      qnaire1: _qnaire1,
      question: '',
      conLists: [],
      correct: []
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

  // 2.上一题
  // lastq: function (e) {
  //   if (this.data.id != 0) {
  //     this.setData({
  //       id: this.data.id - 1,
  //     })
  //   }
  // },

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
  bindsubmit: function (e) {},

  // 上传题目
  formSubmit: function () {
    if (this.data.question == '') {
      this.add_statistics_question()
    } else if (this.data.question != '') {
      this.nextq()
      setTimeout(this.add_statistics_question, 1000)
    }
  },

  add_statistics_question: function (e) {
    console.log("end", this.data.qnaire1)
    const qnaire = this.data.qnaire1
    const title = this.data.title
    const setTime = this.data.setTime
    const endTime = this.data.endTime
    var time = util.formatTime(new Date()).substring(0, 16);
      db.collection("sas")
        .add({
          data: {
            qnaire,
            title,
            setTime,
            date:new Date().getTime(),
            class: this.data.class,
            avatarUrl: wx.getStorageSync('avatarUrl'),
            teacher: wx.getStorageSync('teaName'),
            telephone: wx.getStorageSync('telephone'),
            currentTime: time,
            endTime: endTime,
            genre:"课程作业"
          },
          success(res) {
            console.log(res._id);
            wx.showToast({
              title: '设置题目成功！'
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '../matter1/matter1',
              })
            })
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
        this.data.question_type = "判断题"
        break;
      case 3:
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

  // 分值设置
  slideChange: function (e) {
    this.setData({
      score: e.detail.value
    })
  },


  //添加选项
  add(e) {
    // 点击添加按钮，就往数组里添加一条空数据
    var _list = this.data.conLists;
    var _text = this.data.correct;
    if (this.data.question_type == "单选题" || this.data.question_type == "多选题") {
      _list.push("")
    } else if (this.data.question_type == "填空题") {
      _text.push("")
    }
    this.setData({
      conLists: _list,
      correct: _text,
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

  //复选框
  select: function (e) {
    if (this.data.question_type == "单选题") {
      switch (Number(e.currentTarget.dataset.dex)) {
        case 0:
          this.data.correct = "A"
          break;
        case 1:
          this.data.correct = "B"
          break;
        case 2:
          this.data.correct = "C"
          break;
        case 3:
          this.data.correct = "D"
          break;
        case 4:
          this.data.correct = "E"
          break;
        case 5:
          this.data.correct = "F"
          break;
        case 6:
          this.data.correct = "G"
          break;
        case 7:
          this.data.correct = "H"
          break;
        case 8:
          this.data.correct = "I"
          break;
        case 9:
          this.data.correct = "J"
          break;
        case 10:
          this.data.correct = "K"
          break;
        default:
      };
    } else if (this.data.question_type == "多选题") {
      let _correct = this.data.correct
      switch (Number(e.currentTarget.dataset.dex)) {
        case 0:
          _correct.unshift("A")
          break;
        case 1:
          _correct.unshift("B")
          break;
        case 2:
          _correct.unshift("C")
          break;
        case 3:
          _correct.unshift("D")
          break;
        case 4:
          _correct.unshift("E")
          break;
        case 5:
          _correct.unshift("F")
          break;
        case 6:
          _correct.unshift("G")
          break;
        case 7:
          _correct.unshift("H")
          break;
        case 8:
          _correct.unshift("I")
          break;
        case 9:
          _correct.unshift("J")
          break;
        case 10:
          _correct.unshift("K")
          break;
        default:
      };
      this.setData({
        correct: _correct
      })
    } else if (this.data.question_type == "判断题") {
      let _correct = this.data.correct
      switch (Number(e.currentTarget.dataset.dex)) {
        case 0:
          _correct = "T"
          break;
        case 1:
          _correct = "F"
          break;
        default:
      };
      this.setData({
        correct: _correct
      })
    }
  },

  ////单选题多选题判断题的选项内容
  changeConTitle(e) {
    var idx = e.currentTarget.dataset.index; //当前下标
    var val = e.detail.value; //当前输入的值
    var _list = this.data.conLists; //data中存放的数据
    //  if (this.data.question_type == "单选题" || this.data.question_type == "多选题") { 
    for (let i = 0; i < _list.length; i++) {
      if (idx == i) {
        _list[i] = {
          del: val
        }
      }

      //   if(this.data.question_type == "单选题" || this.data.question_type == "多选题"){
      // switch (Number(e.currentTarget.dataset.index)) {
      //   case 0:
      //     if (idx == i) {
      //       _list[i] = {
      //         A: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 1:
      //     if (idx == i) {
      //       _list[i] = {
      //         B: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 2:
      //     if (idx == i) {
      //       _list[i] = {
      //         C: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 3:
      //     if (idx == i) {
      //       _list[i] = {
      //         D: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 4:
      //     if (idx == i) {
      //       _list[i] = {
      //         E: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 5:
      //     if (idx == i) {
      //       _list[i] = {
      //         F: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 6:
      //     if (idx == i) {
      //       _list[i] = {
      //         G: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 7:
      //     if (idx == i) {
      //       _list[i] = {
      //         H: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 8:
      //     if (idx == i) {
      //       _list[i] = {
      //         I: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   case 9:
      //     if (idx == i) {
      //       _list[i] = {
      //         J: val
      //       } //将当前输入的值放到数组中对应的位置
      //     }
      //     break
      //   default:
      // }
      //  }else if(this.data.question_type == "判断题"){
      //   for (let i = 0; i < _list.length; i++) {
      //     switch (Number(e.currentTarget.dataset.index)) {
      //       case 0:
      //         if (idx == i) {
      //           _list[i] = {
      //             T: val
      //           } //将当前输入的值放到数组中对应的位置
      //         }
      //         break
      //       case 1:
      //         if (idx == i) {
      //           _list[i] = {
      //             F: val
      //           } //将当前输入的值放到数组中对应的位置
      //         }
      //         break
      //       default:
      //     }
      //   }
      //  }
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
  },

  // 填空题的点击事件
  tiankon: function (e) {
    this.setData({
      da: true
    })
  },
})