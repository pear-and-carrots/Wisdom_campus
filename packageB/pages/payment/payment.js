// pages/payment/payment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stuNumber: wx.getStorageSync('stuNumber'),
    id: 0,
    feiyong: [{
        id: 0,
        name: "10"
      },
      {
        id: 1,
        name: "20"
      },
      {
        id: 2,
        name: "30"
      },
      {
        id: 3,
        name: "50"
      },
      {
        id: 4,
        name: "100"
      },
      {
        id: 5,
        name: "200"
      }
    ],
    cutover:[
      {
        id:0,
        value:"饭卡充值",
        isActive:true,
      },
      {
        id:1,
        value:"水卡充值",
        isActive:false,
      },
      {
        id:1,
        value:"学费缴纳",
        isActive:false,
      }
    ],
    dex: 0
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
  feiyong(e) {
    console.log(e.currentTarget.dataset.id);
    this.setData({
      id : e.currentTarget.dataset.id
    })
  },

  onLoad: function (options) {

  },

  button:function(e){
    wx.showModal({
      showCancel: false,
      cancelColor: 'cancelColor',
      content:'功能尚未开发，敬请期待！'
    })
  }
})