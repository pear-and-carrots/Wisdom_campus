const db = wx.cloud.database()
const _ = db.command
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud:"homework",
    placeholder:"输入发布作业内容",
    zuoye: [],
    homework: [],
    stuName: wx.getStorageSync('stuName'),
    openid: wx.getStorageSync('openid'),
    stuSchool: wx.getStorageSync('stuSchool'),
    stuClass: wx.getStorageSync('stuClass'),
    stuNumber: wx.getStorageSync('stuNumber'),
    guanli: wx.getStorageSync('guanli'),
    id: 0,
    xinxi:[],
    cutover:[
      {
        id:0,
        value:"未提交",
        isActive:true,
      },
      {
        id:1,
        value:"已提交",
        isActive:false,
      }
    ],
    cutover1:[
      {
        id:0,
        value:"发布作业",
        isActive:true,
      },
      {
        id:1,
        value:"已提交学生",
        isActive:false,
      }
    ],
    array: ['未提交', '已提交'],
    array1: ['发布作业', '已提交学生'],
  },
  //切换
  gongxiang(e) {
    console.log(e.currentTarget.dataset.id);
    this.setData({
      id: e.currentTarget.dataset.id
    })
  },
  //表单组件

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
  },

  handleTtabsIemChange1(e){
    console.log(e);
    const {index}=e.detail;
    let {cutover}=this.data;
    cutover.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      cutover
   })
   },//未提交
  weiqijiao(){
    db.collection('homework')
    .where({
      class: this.data.stuClass,
    })
    .get()
    .then(res => {
      const stuNumber = this.data.stuNumber;
      const array = res.data;
      for (let i = 0; i < array.length; i++) {
        if (array[i].student.length==""){
          this.setData({
            homework: this.data.homework.concat(array[i])
          })
        }
        else{
          const arrays=array[i];
          if (arrays.student.find(v=>v.stuNumber==stuNumber)==undefined) {
              this.setData({
                homework: this.data.homework.concat(arrays)
              })
            }
        }
      }
    })
  },
  tiaozuang(e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../../pages/homework_upload/homework_upload?id=' + e.currentTarget.dataset.id + "&ids=" + 1,

    });

  },

  tiaozuang1(e) {
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: '../../pages/MyHomework/MyHomework?id=' + e.currentTarget.dataset.id,

    });

  },
  //已提交
  wode() {
    db.collection('homework')
      .where({
        class: this.data.stuClass,
        student: {
          stuNumber: this.data.stuNumber
        }
      })
      .get()
      .then(res => {
        wx.hideLoading();
        this.setData({
          zuoye: res.data,
        })
      })
  },
  bindlongpress(e) {
    const _ = db.command
    db.collection('homework')
      .doc(e.currentTarget.dataset.id)
      .update({
        data: {
          student: _.pull({
            stuName: this.data.stuName,

          })
        }
      })
      .then(res => {
        console.log(res);
      })

  },
   //组件
   parentFunction(e) {
    db.collection(this.data.cloud)
      .add({
        data: {
          class:this.data.class,
          course:this.data.content,
          homework:this.data.homework,
          teacher: wx.getStorageSync('teaName'),
          teacherImg: wx.getStorageSync('avatarUrl'),
          src: e.detail.src,
          content: e.detail.textarea,
          time: e.detail.time,
          student:[],
          genre:"课程作业",
          date:new Date().getTime()+this.data.time*86400000,
        }
      })
      .then(res => {
        wx.showToast({
          title: "上传成功",
        })
        this.setData({
          form_info: ""
        })

      })
  },
  
  neueo(e){
    this.setData({
      class:e.detail.value
    })
  },
  neueo1(e){
    this.setData({
      content:e.detail.value
    })
  },
  neueo2(e){
    this.setData({
      homework: e.detail.value
    })
  },
  neueo3(e){
    this.setData({
      time: e.detail.value
    })
  },
  //未提交学生姓名
  xingming(){
    db.collection('homework')
    .where({
      teacher:wx.getStorageSync('teaName'),
    })
    .get()
    .then(res=>{
      wx.hideLoading();
      console.log("miz",res);
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
   if (this.data.guanli!=1) {
    this.setData({
      zuoye: [],
      homework: [],
    })
    this.weiqijiao()
    this.wode()
   }
   else{
     this.xingming()
   }
   // this.onLoad()
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