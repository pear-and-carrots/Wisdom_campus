// var dateTimePicker = require('../../utils/dateTimePicker.js');
var util = require('../../../utils/util.js');
const db = wx.cloud.database();
Page({
  // 页面的初始数据
  data: {
    neirong: "",
    date: '',
    date1: '',
    selected: true,
    selected1: false,
    articles: [],
    shenpi: [],
    shenpi1: [],
    upload: true,
    files: [],
    sum: 0,
    guanli: wx.getStorageSync('guanli'),
    index: 0,
    cutover:[
      {
        id:0,
        value:"请假申请",
        isActive:true,
      },
      {
        id:1,
        value:"请假结果",
        isActive:false,
      }
    ],
    cutover1:[
      {
        id:0,
        value:"未审批",
        isActive:true,
      },
      {
        id:1,
        value:"已审批",
        isActive:false,
      }
    ],
    leave: ["病假", "事假"],
    dex: 0,
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
    stuName: wx.getStorageSync('stuName'),
    stuClass: wx.getStorageSync('stuClass'),
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
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    // 获取当天时间
    var that = this;
    var time = util.formatTime(new Date()).substring(0, 16);
    console.log(time)
    that.setData({
      date: time,
      date1: time,
    });
    if (this.data.guanli == 0) {
      wx.cloud.callFunction({
          name: 'good',
        })
        .then(res => {
          wx.hideLoading();
          this.huoqu(res.result.openid)
          this.setData({
            openid: res.result.openid
          })
        })
    }
    if (this.data.guanli == 1) {
      db.collection("qingjia")
        .get()
        .then(res => {
          wx.hideLoading();
          const array = res.data
          for (let i = 0; i < array.length; i++) {
            let arrays = array[i];
            if (arrays.shenpi) {
              console.log(arrays);
              this.setData({
                shenpi: this.data.shenpi.concat(arrays),
              })
            } else {
              this.setData({
                shenpi1: this.data.shenpi1.concat(arrays)
              })
            }

          }
        })

    }
  },
  //管理审批
  picker(e) {
    console.log(e);
    this.setData({
      index: Number(e.detail.value)
    })
  },
  previewImage: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        console.log(res) // 打印输出返回值
        let files = this.data.files
        files.push(res.tempFilePaths[0]) // 把图片地址push到数组中
        let sum = this.data.sum
        sum++ // 开始计数
        this.setData({
          sum: sum
        })
        if (this.data.sum == 1) {
          this.setData({
            upload: false
          })
        }
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          files: files
        });

      }
    })
  },
  // 删除图片
  delete: function (e) {
    let index = e.currentTarget.dataset.index
    let files = this.data.files
    files.splice(index, 1)
    this.setData({
      files: files
    })
    if (this.data.files.length == 0) {
      this.setData({
        upload: true,
        sum: 0
      })
    }
  },
  // 保存
  formSubmit: function (e) {
    if (e.detail.value.leaveDays == 1) {
      this.setData({
        leaveDays: "病假"
      })
    } else {
      this.setData({
        leaveDays: "事假"
      })
    };
    const className = e.detail.value.className;
    const endTime = e.detail.value.endTime;
    const leaveDays = this.data.leaveDays;
    const leaveReason = e.detail.value.leaveReason;
    const startTime = e.detail.value.startTime;
    const studentName = e.detail.value.studentName;
    const studentNo = e.detail.value.studentNo;
    if (!this.data.files.length) {
      wx.showToast({
        icon: 'none',
        title: '图片类容为空'
      });
    } else {
      //上传图片到云存储
      wx.showLoading({
        title: '上传中',
      })
      let promiseArr = [];
      for (let i = 0; i < this.data.files.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = this.data.files[i];
          let suffix = /\.\w+$/.exec(item)[0]; //正则表达式返回文件的扩展名

          console.log(item);
          console.log(suffix);
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

              wx.showToast({
                title: "上传失败",
              })
            }

          })
        }));
      }
      Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
        console.log("图片上传完成后再执行")
        const fileIDs = this.data.fileIDs[0];
        console.log(fileIDs);
        db.collection('qingjia')
          .add({
            data: {
              fileIDs,
              className,
              endTime,
              leaveDays,
              leaveReason,
              startTime,
              studentName,
              studentNo,
              shenpi: false

            }
          })
          .then(res => {
            console.log(res);
            this.setData({
              classroom: res.data,
              neirong: ""
            })
          })
          .catch(err => {
            console.log(err);
          })
        this.setData({
          files: [],
          upload: true
        })
      })

    }
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
  },
  // 时间
  changeDate(e) {
    console.log("0", e.detail.value);
    this.setData({
      date: e.detail.value,
    });
  },
  changeDate1(e) {
    console.log("1", e.detail.value);
    this.setData({
      date1: e.detail.value,
    });
  },

  //获取审批
  huoqu(type) {
    db.collection('qingjia')
      .where({
        _openid: type
      })
      .get()
      .then(res => {
        wx.hideLoading();
        this.setData({
          shenpi: res.data
        })
      })
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },

  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },

  // 生命周期函数--监听页面显示
  onShow: function () {

    // if (this.data.guanli==1) {
    //   this.setData({
    //     shenpi:[],
    //     shenpi1:[]
    //   })
    //   db.collection("qingjia")
    //   .get()
    //   .then(res=>{
    //     const array=res.data
    //     for (let i = 0; i < array.length; i++) {
    //      let  arrays = array[i];
    //       if (arrays.shenpi) {
    //         console.log(arrays);
    //         this.setData({
    //           shenpi:this.data.shenpi.concat(arrays),
    //         })
    //       }
    //       else{
    //         this.setData({
    //           shenpi1:this.data.shenpi1.concat(arrays)
    //         })
    //       }

    //     }
    //   })

    // }
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () {

  },
  // 生命周期函数--监听页面卸载
  onUnload: function () {

  },
})