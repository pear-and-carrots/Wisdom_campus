var context = null; // 使用 wx.createContext 获取绘图上下文
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
//获取系统信息
wx.getSystemInfo({
  success: function (res) {
    canvasw = res.windowWidth; //设备宽度
    canvash = res.windowHeight; //设备高度
  }
});
var util = require('../../../utils/util.js');
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    textarea: "",
    penColor: 'black',
    lineWidth: 3,
    Imgurl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用 wx.createContext 获取绘图上下文 context
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    this.setData({
      id:options.id
    })
    this.xinxi(options.id)
  },
  xinxi(e){
    db.collection("qingjia")
    .doc(e)
    .get()
    .then(res => {
      this.setData({
        leave: res.data,
      })
    })
    .catch(err => {
      console.log(err);
    })
  },
  toguo() {
    this.setData({
      toguo: true,
    })
  },
  toguo1() {
    this.setData({
      toguo: false,
      bohui: false
    })
  },
  bohui() {
    this.setData({
      bohui: true
    })
  },
  bindblur(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  //审批不通过
  bohui1() {
    db.collection('qingjia')
      .doc(this.data.id)
      .update({
        data: {
          textarea: this.data.textarea,
          shenpi:true
        }
      })
      .then(res => {
        this.setData({
          bohui: false,
          textarea: ""
        })
        wx.showToast({
          title: '上传成功',
        });
        wx.redirectTo({
          url: '../leave/leave',
        });    
      })

  },
  canvasIdErrorCallback: function (e) {
    console.error(e.detail.errMsg)
  },
  //绘制开始
  canvasStart: function (event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  },
  //绘制过程
  canvasMove: function (event) {
    if (isButtonDown) {
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
    };

    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      };
    };
    context.clearRect(0, 0, canvasw, canvash);

    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();

    context.draw(false);
  },
  canvasEnd: function (event) {
    isButtonDown = false;
  },
  cleardraw: function () {
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(true);
  },
  //导出图片
  getimg: function () {
    const id = this.data.id;
    // if (arrx.length == 0) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '签名内容不能为空！',
    //     showCancel: false
    //   });
    //   return false;
    // };
    //生成图片
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: (res)=>{
        const _ = db.command
        db.collection('qingjia')
          .doc(id)
          .update({
            data: {
              shenpi: true,
              img: res.tempFilePath
            }
          })
          .then(res => {
            this.toguo1()
            this.cleardraw()
            wx.showToast({
              title: '上传成功',
            });
            wx.redirectTo({
              url: '../leave/leave',
            });    
          })


      }
    })

  },})