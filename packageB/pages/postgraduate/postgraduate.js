const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloud:"postgraduate",
    nickName: wx.getStorageSync('nickName'),
    avatarUrl: wx.getStorageSync('avatarUrl'),
    classrooms: "",
    xinxi: [],
    guanli: wx.getStorageSync('guanli'),
    id:0,
    cutover:[
      {
        id:0,
        value:"考研墙",
        isActive:true,
      },
      {
        id:1,
        value:"一起加油",
        isActive:false,
      }
    ],
    openid:wx.getStorageSync('openid'),
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
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中"
    });
    this.xinxi();
  },
  //获取失物招领信息
  xinxi() {
    db.collection('postgraduate')
      .get()
      .then(res => {
        this.setData({
          xinxi: res.data.reverse()
        })
        wx.hideLoading();
      })
  },
  //切换
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

  input(e){
    this.data.classrooms=e.detail.value
  },
  //组件
  parentFunction(e){
    db.collection(this.data.cloud)
    .add({
      data: {
        classrooms:this.data.classrooms,
        nickName: this.data.nickName,
        avatarUrl: this.data.avatarUrl,
        src: e.detail.src,
        textarea: e.detail.textarea,
        time: e.detail.time,
        like:[],
        type:"考研墙"
      }
    })
    .then(res => {
      this.xinxi()
       wx.showToast({
        icon:"success",
          title: '上传成功',
          mask:true,
         
        });
        this.setData({
          id:0
        })

    })
  },
  getgoods(){
    wx.showLoading({
      title: "加载中"
    });
    const length=this.data.xinxi.length;
    //console.log(length);
    db.collection('postgraduate')
    .skip(length)
    .get()
    .then(res=>{
      wx.hideLoading();
      let datalength=res.data
      if (datalength<=0) {
        wx.showToast({
          title: '没有更多数据了',
          icon:"none"
        });
          
      }
      this.setData({
        xinxi:this.data.xinxi.concat(res.data)
      })
    })
    .catch(err=>{
      wx.hideLoading();
    })
  
    
  },
  //删除
  shangchu(e) {
    console.log("1",e.currentTarget.dataset.ids);
    // this.data.ids = e.currentTarget.dataset.ids;
    console.log(e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.openid === this.data.openid || this.data.guanli == 1) {
      wx.showModal({
        title: '提示',
        content: '确定删除该内容！！',
        success: (res) => {
          if (res.confirm) {
            db.collection("postgraduate")
              .doc(e.currentTarget.dataset.ids)
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
  //查询
  searchInput: function (e) {
    console.log(e.detail.value);
    db.collection('postgraduate')
    .where({
      time: db.RegExp({
        regexp: e.detail.value,
        options: '/^i/',
      })
    })
    .get()
    .then(res => {
      this.setData({
        xinxi: res.data.reverse()
      })
    })
  },
})