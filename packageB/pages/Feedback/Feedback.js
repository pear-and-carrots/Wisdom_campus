const db = wx.cloud.database();
var util = require('../../../utils/util.js');
const _ = db.command
var tiem = util.formatTime(new Date());
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud:"Feedback",
    id:0,
    guanli: wx.getStorageSync('guanli'),
    classrooms:"产品建议",
    tabs:[
      {
        id:0,
        value:"产品建议",
        isActive:true,
      },
      {
        id:1,
        value:"咨询",
        isActive:false,
      },
      {
        id:2,
        value:"吐槽",
        isActive:false,
      },
      {
        id:3,
        value:"其他",
        isActive:false,
      }
    ],
    placeholder:"输入您的反馈详情，不少于5个字",
  },
  handleTtabsIemChange(e){
    switch (Number(e.detail.index)) {
      case 0:
        this.data.classrooms = "产品建议"
        break;
      case 1:
        this.data.classrooms = "咨询"
        break;
      case 2:
        this.data.classrooms = "吐槽"
        break;
      case 3:
        this.data.classrooms = "其他"
        break
      default:
    };
    console.log(e.detail.index);
    const {index}=e.detail;
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
     tabs
   })

   },
   parentFunction(e){
    console.log(e);
    db.collection(this.data.cloud)
    .add({
      data: {
        classrooms:this.data.classrooms,
        nickName: this.data.nickName,
        avatarUrl: this.data.avatarUrl,
        src: e.detail.src,
        textarea: e.detail.textarea,
        time: e.detail.time
      }
    })
    .then(res => {
      this.setData({
        form_info: ""
      })

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection(this.data.cloud)
    .get()
    .then(res=>{
      console.log(res);
      this.setData({
        xinxi:res.data
      })
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