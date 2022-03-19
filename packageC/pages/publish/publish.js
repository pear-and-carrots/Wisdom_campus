const db = wx.cloud.database();
var util = require('../../../utils/util.js');
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud: "class",
    placeholder: "发布内容",
    classrooms: "学校概况",
    title: "",
    goods: ["学校概况", "学校通知", "学校须知", "校园动态", "师资队伍", "国际交流", "学术讲座", "专题活动", "通知轮播栏", "顶部轮播图"],
    indexx: 0,
    guanli: wx.getStorageSync('guanli'),
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    notice: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context;
      that.editorCtx.setContents({
        html: that.data.notice,
        success: function () {}
      })
    }).exec();
  },

  goods(e) {
    console.log("goods:", e.detail.value);
    switch (Number(e.detail.value)) {
      case 0:
        this.data.classrooms = "学校概况"
        break;
      case 1:
        this.data.classrooms = "学校通知"
        break;
      case 2:
        this.data.classrooms = "学校须知"
        break;
      case 3:
        this.data.classrooms = "校园动态"
        break;
      case 4:
        this.data.classrooms = "师资队伍"
        break;
      case 5:
        this.data.classrooms = "国际交流"
        break;
      case 6:
        this.data.classrooms = "学术讲座"
        break;
      case 7:
        this.data.classrooms = "专题活动"
        break;
      case 8:
        this.data.classrooms = "通知轮播栏"
        break;
      case 9:
        this.data.classrooms = "顶部轮播图"
        break;
      default:
    };
    this.setData({
      indexx: Number(e.detail.value)
    })
  },

  //标题
  title(e) {
    //console.log(e);
    this.setData({
      title: e.detail.value
    })
  },
  //组件
  // parentFunction(e) {
  //   console.log(e);
  //   db.collection(this.data.cloud)
  //     .add({
  //       data: {
  //         title: this.data.title,
  //         type: this.data.classrooms,
  //         img: [e.detail.src],
  //         textarea: e.detail.textarea,
  //         date: e.detail.time,
  //         frequency:0,
  //       }
  //     })
  //     .then(res => {
  //       wx.showToast({
  //         title: "上传成功",
  //       })
  //       this.setData({
  //         form_info: ""
  //       })
  //       wx.navigateBack({
  //         delta: 1
  //       });  
  //     })
  // },

  lunbo: function (e) {
    this.setData({
      lunboData: e.detail.value
    })
  },

  inputLunbo: function () {
    db.collection(this.data.cloud)
      .add({
        data: {
          type: this.data.classrooms,
          data: this.data.lunboData,
        }
      })
      .then(res => {
        wx.showToast({
          title: "上传成功",
        })
        this.setData({
          form_info: "",
          lunboData: ''
        })
      })
  },

  readOnlyChange() {
    this.setData({
      readOnly: !that.data.readOnly
    })
  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    this.editorCtx.format(name, value)

  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.getpublish(res.tempFilePaths, 0)
      }
    })
  },
  // 递归循环下载图片
  getpublish(list, i) {
    wx.showLoading({
      title: '正在上传第' + (i + 1) + '张',
    })
    var that = this
    wx.uploadFile({
      url: "https://api110.herbplantist.com/sucai/public/index.php/post/post/uploadFile",
      filePath: list[i],
      name: 'file',
      formData: {
        key: 'Gn1xVdBiTClSSHKZifg0pTQSU5XGagWO',
        is_https: 1,
      },
      success(res) {
        var data = JSON.parse(res.data)
        console.log(data)
        if (data.status == 200) {
          that.editorCtx.insertImage({
            src: data.info.url,
            success: function () {}
          })
        }
        if (i + 1 == list.length) {
          wx.showToast({
            title: '上传成功',
          });
        }
        wx.hideLoading()
        if (++i < list.length) {
          that.getpublish(list, i);
        }
      },
    })
  },
  goplay(e) {
    this.setData({
      notice: e.detail.html
    })
  },
  sublimt(e) {
    let that = this
    wx.showModal({
      title: '温馨提示',
      content: '确定提交？',
      success(res) {
        if (res.confirm) {
          db.collection(that.data.cloud)
            .add({
              data: {
                title: that.data.title,
                type: that.data.classrooms,
                img: [e.detail.src],
                notice: that.data.notice,
                date: e.detail.time,
                frequency: 0,
              }
            })
            .then(res => {
              wx.showToast({
                title: "上传成功",
              })
              that.setData({
                form_info: "",
                notice:""
              })
            })

          wx.showToast({
            title: '提交成功，打开调试看打印',
          })
          console.log(that.data.dataArry)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})