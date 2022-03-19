const db = wx.cloud.database()
var util = require('../../../utils/util.js');
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // id: "",
    id: 2,
    ids: "",
    xinxi: [],
    value: "",
    answer:"",
    form: "",
    xinbei: "男",
    index: 0,
    classroomList: ["情感困惑", "心理健康", "人际关系", "个人成长", "两性心理"],
    classrooms: "情感困惑",
    items: [
      { name: '男', value: '男', checked: 'true' },
      { name: '女', value: '女' },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      ids: options.ids
    })
    if (options.id == 1||options.id==3) {
      db.collection("psychology_question")
        .doc(options.ids)
        .get()
        .then(res => {
          this.setData({
            xinxi: res.data
          })
        })
    }
    if (options.id==2) {
      db.collection("psychology")
      .doc(options.ids)
      .get()
      .then(res => {
        this.setData({
          xinxi: res.data
        })
      })
    }

  },
  //性别
  radioChange: function (e) {
    this.setData({
      xinbei: e.detail.value
    })
  },
  //选择器
  prckerList(e) {
    switch (Number(e.detail.value)) {
      case 0:
        this.data.classrooms = "情感困惑"
        break;
      case 1:
        this.data.classrooms = "心理健康"
        break;
      case 2:
        this.data.classrooms = "人际关系"
        break;
      case 3:
        this.data.classrooms = "个人成长"
        break;
      case 4:
        this.data.classrooms = "两性心理"
        break;
      default:
    };
    this.setData({
      index: Number(e.detail.value)
    })
  },
  //表单
  formSubmit(e) {
    var time = util.formatTime(new Date()).substring(0, 16);
    console.log(e.detail.value);
    db.collection('psychology')
      .add({
        data: {
          name: e.detail.value.name,
          class: e.detail.value.class,
          studentID: e.detail.value.studentID,
          sjhaoma: e.detail.value.sjhaoma,
          classrooms: this.data.classrooms,
          time: time,
          xinbei: this.data.xinbei,
          shenpi: false
        }
      })
      .then(res => {
        console.log(res);
      })
  },
  daan(e){
this.setData({
  answer:e.detail.value
})
  },
  //管理端问题解答
  jieda(e) {
   let answer=this.data.answer;
    db.collection("psychology_question")
      .doc(this.data.ids)
      .update({
        data: { 
           answer
        }
      })
      .then(res => {
        this.setData({
          value:"",
        })
        wx.navigateBack({
          delta: 1
        });
          
      })
  },
  //管理端预约审核
  toguo(){
    let answer=this.data.answer;
    if(answer==""){
      wx.showToast({
        title: '还没有输入内容呢',
        icon:"none",
      })
      return
    }
    db.collection("psychology")
      .doc(this.data.ids)
      .update({
        data:{ 
          shenpi:true,
          answer:this.data.answer
        }
      })
      .then(res => {
        this.setData({
          value:"",
        })
        wx.navigateBack({
          delta: 1
        });
          
      })
  },
  bohui(){
    if(answer==""){
      wx.showToast({
        title: '还没有输入内容呢',
        icon:"none",
      })
      return
    }
    let answer=this.data.answer;
    db.collection("psychology")
      .doc(this.data.ids)
      .update({
        data:{ 
          answer,
          shenpi:false
        }
      })
      .then(res => {
        this.setData({
          value:"",
        })
        wx.navigateBack({
          delta: 1
        });
          
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})