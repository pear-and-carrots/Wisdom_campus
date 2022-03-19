// pages/search/search.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classroomList: ["请选择教室", "第二教学楼", "钟海楼", "主楼", "兴教楼"],
    deta: ["请选择时间", "第一至第二节课", "第三至第四节课", "第五至第六节课", "第七至第八节课", "第九至第十节课"],
    louceng: ["请选择楼层", "一楼", "二楼", "三楼", "四楼", "五楼", "六楼", "七楼"],
    detas: "",
    guanli: wx.getStorageSync('guanli'),
    classrooms: "",
    indexs: 0,
    indexx: 0,
    indexxx: 0,
    list: [],
    city: '',
    none: false,
    classroom: []
  },
  prckerList(e) {
    console.log(e.detail.value);
    switch (Number(e.detail.value)) {
      case 0:
        this.data.classrooms = ""
        break;
      case 1:
        this.data.classrooms = "第二教学楼"
        break;
      case 2:
        this.data.classrooms = "钟海楼"
        break;
      case 3:
        this.data.classrooms = "主楼"
        break;
      case 4:
        this.data.classrooms = "兴教楼"
        break;
      default:
    };
    this.setData({
      indexx: Number(e.detail.value)
    })
  },
  prckerDeta(e) {
    this.setData({
      indexs: Number(e.detail.value)
    })
  },
  prckerlouceng(e) {
    this.setData({
      indexxx: Number(e.detail.value)
    })
  },
  //借用教室
  jieyon(e) {
    console.log(e);
    wx.navigateTo({
      url: '../classroom/classroom?id='+e.currentTarget.dataset.id,
    });
  },
  //数据库查找
  chaxun() {
    db.collection('classroom').where({
        classroom: db.RegExp({
          regexp: this.data.classrooms + 0 + this.data.indexxx,
          options: '/^i/',
        })
      }).get()
      .then(res => {
        console.log(res);
        this.setData({
          classroom: res.data
        })
      })
  },
  
  // //搜索功能
  // searchInput: function (e) {
  //   db.collection('classroom').where({
  //       classroom: db.RegExp({
  //         regexp: e.detail.value,
  //         options: '/^i/',
  //       })
  //     }).get()
  //     .then(res => {
  //       console.log(res);
  //       this.setData({
  //         classroom: res.data
  //       })
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     })
  // },

  onLoad: function (options) {

  },
})