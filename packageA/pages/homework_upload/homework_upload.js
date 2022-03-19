const db = wx.cloud.database()
var util = require('../../../utils/util.js');
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    imgbox: [], //选择图片
    date: new Date().getTime(),
    guanli: wx.getStorageSync('guanli'),
    time: "",
    xinxi:[],
    fengshu:"",
    fengshu1:"",
    xinxi1:[],
    fileIDs: [], //上传云存储后的返回值
    tempFilePath: "",
    form_info: "",
    homework: [],
    ids: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    this.data.id = options.id;
    if (this.data.guanli == 0) {
      console.log("aaa");
      db.collection('homework')
        .doc(options.id)
        .get()
        .then(res => {
          console.log("111", util.MillisecondToDate(res.data.date - this.data.date));
          this.setData({
            time: util.MillisecondToDate(res.data.date - this.data.date),
            homework: res.data,
            ids: options.ids
          })

        })
    } if (this.data.guanli == 1) {
      console.log("bbb",);
      db.collection('homework')
      .doc(options.id)
      .get()
      .then(res => {
        console.log(res);
        const array=res.data.student;
        for (let i = 0; i < array.length; i++) {
          if (array[i].stuName==options.name) {
            this.setData({
              xinxi1:array[i]
            })
          }
        }
        this.setData({
          xinxi:res.data,
          id:options.id
        })

      })
     }
  },
  //管理端评分
  fengshu(e){
    this.setData({
      fengshu :e.detail.value
    })
  },
  fengshu1(e){
    this.setData({
      fengshu1 :e.detail.value
    })
  },
  guanli(){
    var time = util.formatTime(new Date()).substring(0, 16);
    if (this.data.fengshu=="") {
      wx.showLoading({
        title: "你还没有输入分数"
      });
    }
    db.collection('homework')
    .doc(this.data.id)
    .update({
      data: {
        student: _.pull({
          stuName:this.data.xinxi1.sruName,
          stuNumber:this.data.xinxi1.stuNumber
        })
      }
    })
    .then(res=>{
     db.collection('homework')
    .doc(this.data.id)
    .update({
      data: {
        student: _.addToSet({
          stuClass:this.data.xinxi1.stuClass,
          src	:this.data.xinxi1.src,   
          stuName	:this.data.xinxi1.stuName,
          stuNumber	:this.data.xinxi1.stuNumber,
          stuSchool	:	this.data.xinxi1.stuSchool,
          textarea	:	this.data.xinxi1.textarea,          
          time	: this.data.xinxi1.time,
          fengshu:this.data.fengshu,
          fengshu1:this.data.fengshu1,
          cjtime:time
        })
      }
    })
    .then(res => {
      this.setData({
        form_info: ""
      })
      wx.navigateBack({
        delta: 1
      })
    })
    })

  },
  bindsubmit(e) {

    let form = e.detail.value;
    this.setData({
      form: form
    })
    var time = util.formatTime(new Date()).substring(0, 16);
    let textarea = this.data.form.textarea;
    let stuName = wx.getStorageSync('stuName');
    let stuSchool = wx.getStorageSync('stuSchool');
    let stuClass = wx.getStorageSync('stuClass');
    let stuNumber = wx.getStorageSync('stuNumber');
    // console.log(e.detail.value);
    let promiseArr = [];
    for (let i = 0; i < this.data.imgbox.length; i++) {
      promiseArr.push(new Promise((reslove, reject) => {
        let item = this.data.imgbox[i];
        let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
          filePath: item, // 小程序临时文件路径
          success: res => {
            this.setData({
              fileIDs: this.data.fileIDs.concat(res.fileID)
            });
            console.log(res.fileID) //输出上传后图片的返回地址
            reslove();

            wx.showToast({
              title: "上传成功",
            })
          },
          fail: res => {
          }

        })
      }));
      console.log(this.data.fileIDs);
    }
    Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
      let src = this.data.fileIDs;
      db.collection('homework')
        .doc(this.data.id)
        .update({
          data: {
            student: _.unshift({
              stuName,
              stuSchool,
              stuClass,
              stuNumber,
              src,
              textarea,
              time
            })
          }
        })
        .then(res => {
          console.log(res);
          this.setData({
            form_info: ""
          })

        })
      console.log("图片上传完成后再执行")
      this.setData({
        imgbox: []
      })
    })

  },

  // 删除照片 &&
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片 &&&
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    var that = this;
    var n = 9;
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9，设置图片张数
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res.tempFilePaths)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (9 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },
  //音频
  yinpin() {
    console.log("开始录音");
    wx.startRecord({
      success: (res) => {
        console.log(res);
        this.setData({
          tempFilePath: res.tempFilePath
        })
      }
    })
    setTimeout(function () {
      wx.stopRecord() // 结束录音
    }, 1000)
  },
  play() {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = 'http://tmp/ejzJyHSYrM1S4cb43264382e821e85c558b9ac8457d1.silk'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    // wx.playVoice({
    //   filePath:this.data.tempFilePath
    // })
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