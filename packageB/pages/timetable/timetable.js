// pages/timetable/timetable.js
var kcbPlugin = requirePlugin("kcb-plugin");
Page({
  data: {
      appId:"wx206d5c2dc95323d2",
      openId:wx.getStorageSync('openid'),
  },

  onLoad: function (options) {
    
  },

  onReady: function () {
    kcbPlugin.initKcb(this.data.appId, this.data.openId);
  },

  onShow: function () {

  },

})