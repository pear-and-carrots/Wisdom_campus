const db = wx.cloud.database()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    neiron:"",
    id:0,
    cutover:[
      {
        id:0,
        value:"咨询中心",
        isActive:true,
      },
      {
        id:1,
        value:"预约结果",
        isActive:false,
      },
      {
        id:2,
        value:"咨询结果",
        isActive:false,
      }
    ],
   textarea:"",
   stuClass:wx.getStorageSync('stuClass'),
   stuName:wx.getStorageSync('stuName'),
   stuNumber:wx.getStorageSync('stuNumber'),
   stuSchool:wx.getStorageSync('stuSchool'),
   guanli: wx.getStorageSync('guanli'),
   cutover1:[
    {
      id:0,
      value:"问题解答",
      isActive:true,
    },
    {
      id:1,
      value:"预约审核",
      isActive:false,
    }
  ],
   dex: 0
  },
  gongxiang(e) {
    this.setData({
      id: e.currentTarget.dataset.id
    })
  },
  textarea(e){
    console.log(e.detail.value);
    this.setData({
      textarea:e.detail.value
    })
  },
  //问题咨询
  fb(){
    var time = util.formatTime(new Date()).substring(0, 16);
    db.collection('psychology_question')
    .add({
      data:{
        time:time,
        textarea:this.data.textarea,
        stuName:this.data.stuName,
        stuSchool:this.data.stuSchool,
        stuNumber:this.data.stuNumber,
        stuClass:this.data.stuClass,
        answer:"",
      }
    })
    .then(res=>{
      console.log("发布成功",res);
      wx.showToast({
        title: '提交成功！',
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    db.collection('psychology')
    .get()
    .then(res=>{
      this.setData({
        xinxi:res.data
      })
    })
    db.collection('psychology_question')
    .get()
    .then(res=>{
      this.setData({
        zixun:res.data
      })
    })
    wx.hideLoading();
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
   handleTtabsIemChange1(e){
    console.log(e);
    const {index}=e.detail;
    let {cutover1}=this.data;
    cutover1.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      cutover1
   })
   },
  selected1:function(e){
    this.setData({
      id : e.currentTarget.dataset.id
    })
  },
})