const db = wx.cloud.database();
var util = require('../../../utils/util.js');
const _ = db.command
var DATE = util.formatTime(new Date());
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud: "goods",
    placeholder: "失物的相关信息",
    id: 0,
    ids: "",
    nickName: wx.getStorageSync('nickName'),
    avatarUrl: wx.getStorageSync('avatarUrl'),
    guanli: wx.getStorageSync('guanli'),
    stuName: wx.getStorageSync('stuName'),
    goods: ["物品类型", "衣饰", "电子产品", "文具", "运动器械", "生活用品", "书籍", "其他"],
    array: ['失物墙', '我的招领'],
    classrooms: "",
    index: 0,
    textarea:"",
    indexx: 0,
    xinxi: [],
    xinxi1: [],
    likeList: [],
    isLikelist: [],
    ishow: true,
    openid: wx.getStorageSync('openid'),
    curindex: -1,
    dex: -1,
    cutover:[
      {
        id:0,
        value:"失误招领",
        isActive:true,
      },
      {
        id:1,
        value:"寻找失主",
        isActive:false,
      }
    ],
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    if (this.data.guanli !== 1) {
      this.xinxi();
    }else if(this.data.guanli == 1) {
      this.glxinxi()
    }
  },
  //获取失物招领信息
  xinxi() {
    db.collection('goods')
      .get()
      .then(res => {
        this.setData({
          xinxi: res.data.reverse()
        })
      })
    wx.cloud.callFunction({
      name: 'good',
      success: (res) => {
        wx.hideLoading();
        this.setData({
          openid: res.result.openid
        })

      }
    })

  },
  glxinxi() {
    db.collection("goods")
      .get()
      .then(res => {
        wx.hideLoading();
        this.setData({
          xinxi: res.data.reverse()
        })
      })
  },
  hadleCoolect(e) {
    console.log("点赞");
    const openid=this.data.openid;
   console.log(e.currentTarget.dataset.id);
   db.collection("goods")
   .doc(e.currentTarget.dataset.id)
   .update({
    data: {
      like: _.unshift(
        openid
      )
    }
  })
   .then(res=>{
    this.xinxi();
    this.setData({
      display:true
    })
    wx.showLoading({
      title: '点赞成功',
      mask:true ,
    });
    wx.hideLoading();
   })
  },
  hadleCoolect1(e) {
    console.log("取消");
    const openid=this.data.openid;
    db.collection('goods').doc(e.currentTarget.dataset.id)
    .update({
      data: {
        like: _.pull(
          openid
        )
      }
    })
    .then(res => {
      this.setData({
        display:false
      })
      this.xinxi(),
        wx.showLoading({
          title: '取消成功',
          mask:true ,
        });
        wx.hideLoading();
    })
  },
  //获取失物类型
  good(e) {
    console.log(e.detail.value);
    switch (Number(e.detail.value)) {
      case 0:
        this.data.classrooms = ""
        break;
      case 1:
        this.data.classrooms = "衣饰"
        break;
      case 2:
        this.data.classrooms = "电子产品"
        break;
      case 3:
        this.data.classrooms = "文具"
        break;
      case 4:
        this.data.classrooms = "运动器械"
        break;
      case 5:
        this.data.classrooms = "生活用品"
        break;
      case 6:
        this.data.classrooms = "书籍"
        break;
      case 7:
        this.data.classrooms = "其他"
        break;
      default:
    };
    this.setData({
      index: Number(e.detail.value)
    })
  },

  goods(e) {
    console.log(e.detail.value);
    switch (Number(e.detail.value)) {
      case 0:
        this.data.classrooms = ""
        break;
      case 1:
        this.data.classrooms = "衣饰"
        break;
      case 2:
        this.data.classrooms = "电子产品"
        break;
      case 3:
        this.data.classrooms = "文具"
        break;
      case 4:
        this.data.classrooms = "运动器械"
        break;
      case 5:
        this.data.classrooms = "生活用品"
        break;
      case 6:
        this.data.classrooms = "书籍"
        break;
      case 7:
        this.data.classrooms = "其他"
        break;
      default:
    };
    this.setData({
      indexx: Number(e.detail.value)
    })
  },
  //查询
  chaxun() {
    if (this.data.textarea!='') {
      if (this.data.guanli != 1) {
        db.collection('goods')
          .where({
            textarea: db.RegExp({
              regexp: this.data.textarea,
              options: '/^i/',
            })
          })
          .get()
          .then(res => {
            this.setData({
              xinxi: res.data.reverse()
            })
          })
      } else {
        db.collection('goods')
          .where({
            time: db.RegExp({
              regexp: this.data.textarea,
              options: '/^i/',
            })
          })
          .get()
          .then(res => {
            this.setData({
              xinxi: res.data.reverse()
            })
          })
      }
    }
    else{
      db.collection("goods")
      .where({
        classrooms: this.data.classrooms
      })
      .get()
      .then(res => {
        this.setData({
          xinxi: res.data
        })
      })
    }
  },

  fabu: function (e) {
    this.setData({
      id: 1
    })
  },

  fabu1: function (e) {
    this.setData({
      id: 0
    })
  },

  //搜索功能
  searchInput: function (e) {
    this.setData({
      textarea:e.detail.value
    })

  },
  //切换
  gongxiang(e) {
    console.log(e.currentTarget.dataset.id);
    this.setData({
      id: e.currentTarget.dataset.id
    })
  },
  //组件
  parentFunction(e) {
    console.log(e);
    db.collection(this.data.cloud)
      .add({
        data: {
          classrooms: this.data.classrooms,
          nickName: this.data.nickName,
          avatarUrl: this.data.avatarUrl,
          src: e.detail.src,
          textarea: e.detail.textarea,
          time: e.detail.time,
          like: [],
          type: "失物招领"
        }
      })
      .then(res => {
        this.xinxi();
        wx.showToast({
          title: "上传成功",
          icon:"success",
        })
        this.setData({
          form_info: "",
          id:0
        })
      })
  },
  ids(e) {
    this.data.ids = e.currentTarget.dataset.ids;
  },
  shangchu(e) {
    console.log(e);
    console.log(this.data._openid);
    // this.data.ids = e.currentTarget.dataset.ids;
    console.log(e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.openid === this.data.openid || this.data.guanli == 1) {
      wx.showModal({
        title: '提示',
        content: '确定删除该内容！！',
        success: (res) => {
          if (res.confirm) {
            wx.cloud.deleteFile({
              fileList: ['a7xzcb'], //云文件 ID
              success: res => {
                console.log(res.fileList)

              },

              fail: console.error

            })
            db.collection("goods")
              .doc(e.currentTarget.dataset.id)
              .remove()
              .then(res => {
                this.xinxi()
                console.log("成功", res);
              })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {

    }
  },
  bohui(e) {
    console.log(e.currentTarget.dataset.ids);
    console.log(e.currentTarget.dataset.curindex);
    this.setData({
      curindex: e.currentTarget.dataset.curindex,
      ids: e.currentTarget.dataset.ids,
    })
  },

  shouqi: function (e) {
    this.setData({
      curindex: -1,
    })
  },

  bindblur(e) {
    // console.log(e.detail.value)
    const indexs = e.currentTarget.dataset.inde1x;
    this.setData({
      textarea: e.detail.value,
    })
  },
  bohui1() {
    if (this.data.guanli == 3) {
      wx.showToast({
        title: '未认证不可以发表评论哦',
        icon: "none"
      });
    }
    else{
      const comment = this.data.textarea;
      const plopenid=this.data.openid;
      const nickName = wx.getStorageSync('nickName');
      const avatarUrl = wx.getStorageSync('avatarUrl');
      //内容合规性检查
      wx.cloud.callFunction({
        name: 'msgSecCheck',
        data: {
          text: comment
        }
      }).then((res) => {
        console.log(res);
        if (res.result.code == "200") {
          //检测通过
          db.collection('goods')
            .doc(this.data.ids)
            .update({
              data: {
                comment: _.unshift({
                  comment,
                  nickName,
                  plopenid,
                  avatarUrl,
                  DATE,
                })
              }
            })
            .then(res => {
              this.xinxi();
              this.setData({
                bohui: false,
                shouqi: false,
                textarea: "",
                curindex: -1,
              })
              wx.showToast({
                title: '上传成功',
              });
            })
  
          console.log("成功");
        } else {
  
          //执行不通过
          wx.showToast({
            title: '包含敏感字哦。',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
  },
  getgoods() {
    wx.showLoading({
      title: "加载中"
    });
    const length = this.data.xinxi.length;
    //console.log(length);
    db.collection('goods')
      .skip(length)
      .get()
      .then(res => {
        wx.hideLoading();
        let datalength = res.data
        if (datalength <= 0) {
          wx.showToast({
            title: '没有更多数据了',
            icon: "none"
          });

        }
        this.setData({
          xinxi: this.data.xinxi.concat(res.data)
        })
      })
      .catch(err => {
        wx.hideLoading();
      })


  },
//删除评论
bindlongpress(e) {
  const _id= e.currentTarget.dataset.id;
  const comment = e.currentTarget.dataset.comment;
  const plopenid = e.currentTarget.dataset.plopenid;
  const DATE = e.currentTarget.dataset.date;
  if (plopenid == this.data.openid) {
    wx.showModal({
        title: '删除',
        content: '是否确定删除',
      })
      .then(res => {
        if (res.confirm) {
          db.collection('goods').doc(_id).update({
              data: {
                comment: _.pull({
                  comment: comment
                }, {
                  DATE: DATE
                })
              }
            })
            .then(res => {
              console.log(res);
              this.xinxi(),
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                wx.hideLoading();
            })
            .catch(err => {
              console.log("失败", err);
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      })
  }
},
})