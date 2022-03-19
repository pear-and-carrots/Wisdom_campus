const db = wx.cloud.database();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _id: 0,
    stuClass: "",
    class:"",
    fileid: "",
    name: "",
    wjname: "",
    nickName: wx.getStorageSync('nickName'),
    avatarUrl: wx.getStorageSync('avatarUrl'),
    guanli: wx.getStorageSync('guanli'),
    tempFilePaths: "",

    cutover:[
      {
        id:0,
        value:"文件列表",
        isActive:true,
      },
      {
        id:1,
        value:"上传文件",
        isActive:false,
      }
    ],
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    this.data.stuClass = options.stuClass,
      this.data._id = options._id,
      this.shuju();
  },
  handleTtabsIemChange1(e){
    console.log(e);
    const {index}=e.detail;
    let {cutover}=this.data;
    cutover.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      cutover
   })
   },
  //文件数据
  shuju() {
    db.collection("word")
      .where({
        stuClass: this.data.stuClass
      })
      .get()
      .then(res => {
        wx.hideLoading();
        this.setData({
          word: res.data
        })
      })
  },
  //文件名
  wordname(e) {
    console.log(e.detail.value);
    this.setData({
      name: e.detail.value
    })
  },
  wordname1(e) {
    console.log(e.detail.value);
    this.setData({
      class: e.detail.value
    })
  },
  //切换
  gongxiang(e) {
    console.log(e.currentTarget.dataset.id);
    this.setData({
      id: e.currentTarget.dataset.id
    })
  },
  //打开文件
  shangchuan(e) {
    // var that = this
    wx.chooseMessageFile({
      count: 1, //能选择文件的数量
      type: 'file', //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
      success: (res) => {
        console.log(res);
        //文件临时路径
        this.setData({
          tempFilePaths: res.tempFiles[0].path,
          wjname: res.tempFiles[0].name,
          show: true
        })

      }
    })
  },
  //上传到云存储
  yun() {
    if (this.data.tempFilePaths == "") {
      wx.showToast({
        "icon": "none",
        title: '还没有上传文件呢',
      })

      return
    }
    const tempFilePaths = this.data.tempFilePaths;
    //后缀名的获取
    const houzhui = tempFilePaths.match(/\.[^.]+?$/)[0];
    //存储在云存储的地址
    const cloudpath = 'word/' + new Date().getTime() + houzhui;
    console.log(cloudpath);
    //获取fileID
    wx.cloud.uploadFile({
      cloudPath: cloudpath,
      filePath: tempFilePaths,
      success: res => {
        this.cloud(res.fileID);
        this.setData({
          fileid: res.fileID
        })
        console.log(res);

      },
      fail: err => {
        console.log("失败");
        console.log(err)
      },
    })
  },
  //上传云数据库
  cloud(type) {
if (gaunli==0) {
  
  var date = util.formatTime(new Date()).substring(0, 16);
  db.collection('word')
    .add({
      data: {
        fileid: type,
        wjname: this.data.wjname,
        nickName: wx.getStorageSync('nickName'),
        avatarUrl: wx.getStorageSync('avatarUrl'),
        date: date,
        name: this.data.name,
        stuClass: this.data.stuClass,
      }
    })
    .then(res => {
      this.shuju();
      console.log("上传成功", res);
      wx.showToast({
        title: '上传成功！',
      })
      this.setData({
        show : false
      })
    })
    .catch(err => {
      console.log("上传失败".err);
    })
}
if (guanli==1) {
  
  var date = util.formatTime(new Date()).substring(0, 16);
  db.collection('word')
    .add({
      data: {
        fileid: type,
        wjname: this.data.wjname,
        nickName: wx.getStorageSync('nickName'),
        avatarUrl: wx.getStorageSync('avatarUrl'),
        date: date,
        name: this.data.name,
        stuClass: this.data.calss,
      }
    })
    .then(res => {
      this.shuju();
      console.log("上传成功", res);
      wx.showToast({
        title: '上传成功！',
      })
      this.setData({
        show : false
      })
    })
    .catch(err => {
      console.log("上传失败".err);
    })
}
  },
  //打开文件
  openfile: function (e) {
    console.log(e.currentTarget.dataset.fileid);
    var fileid = e.currentTarget.dataset.fileid;
    var that = this;
    wx.cloud.getTempFileURL({
      fileList: [fileid],
      success: res => {
        that.setData({
          //res.fileList[0].tempFileURL是https格式的路径，可以根据这个路径在浏览器上下载
          imgSrc: res.fileList[0].tempFileURL
        });
        //根据https路径可以获得http格式的路径(指定文件下载后存储的路径 (本地路径)),根据这个路径可以预览
        wx.downloadFile({
          url: that.data.imgSrc,
          success: (res) => {
            that.setData({
              httpfile: res.tempFilePath
            })
            //预览文件
            wx.openDocument({
              filePath: that.data.httpfile,
              success: res => {
                console.log(res);
              },
              fail: err => {
                console.log(err);
              }
            })
          },
          fail: (err) => {
            console.log('读取失败', err)
          }
        })
      },
      fail: err => {
        console.log(err);
      }
    })

  },
})