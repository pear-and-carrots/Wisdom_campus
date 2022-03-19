const db = wx.cloud.database()
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder:{
      type:String,
      value:""
    },
    cloud:{
      type:String,
      value:""
    },
    stuClass:{
      type:String,
      value:""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgbox: [], //选择图片
    fileIDs: [], //上传云存储后的返回值
    form_info: "",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindsubmit(e) {
      var time = util.formatTime(new Date()).substring(0, 16);
      // consoel.log(e.detail.value);
      let form = e.detail.value;
      this.setData({
        form: form
      })
      // if (!this.data.form.textarea.length) {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '描述内容不能为空'
      //   });
      // } else {
      //   //上传图片到云存储
      //   wx.showLoading({
      //     title: '上传中',
      //   })
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
              },
              fail: res => {
 
              }
    
            })
          }));
          console.log(this.data.fileIDs);
        }
        Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
          this.triggerEvent('callParent', {
            src: this.data.fileIDs,
            stuClass:this.data.stuClass,
            textarea: this.data.form.textarea,
            time:time })
          console.log("图片上传完成后再执行")
          this.setData({
            imgbox: [],
            form_info:"",
          })
        })
    
      // }
    
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
      var n = 5;
      if (5 > imgbox.length > 0) {
        n = 5 - imgbox.length;
      } else if (imgbox.length == 5) {
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
          // wx.cloud.callFunction({
          //   name: 'imgCheck',              
          //   data:{
          //     img: tempFilePaths
          //   }            
          // }).then(res=>{
          //   console.log("图片检测",res);
          //   // wx.hideLoading()
          //   // //存在违规
          //   // if(res.result.errCode != 0){
          //   //   wx.showModal({
          //   //     title: '违规提示',
          //   //     content: '图片违规',
          //   //     showCancel: false,
          //   //     confirmColor: '#DC143C'
          //   //   })
          //   // }else{
          //   //   wx.showModal({
          //   //     title: '提示',
          //   //     content: '图片正常',
          //   //     showCancel: false,
          //   //     confirmColor: '#008080'
          //   //   })
          //   // }
          // })
          if (imgbox.length == 0) {
            imgbox = tempFilePaths
          } else if (5 > imgbox.length) {
            imgbox = imgbox.concat(tempFilePaths);
          }
          that.setData({
            imgbox: imgbox,
          });
        }
      })
    },
  }
})
