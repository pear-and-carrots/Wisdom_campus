// app.js
App({
  onLaunch() {
    if(wx.getStorageSync('stuName') == ""&&wx.getStorageSync('teaName') == ""){
      console.log(wx.getStorageSync('stuName') == ""&&wx.getStorageSync('teaName') == "");
      wx.navigateTo({
        url: 'packageB/pages/authentication/authentication',
      })
    }
    if ( wx.getStorageSync('guanli')==1) {
      if ( wx.getStorageSync('teaName')!="王红") {
        wx.setStorageSync('guanli', -1)
      }
    }
    if(wx.getStorageSync('nickName') == ''){
      wx.showModal({
                      content: '检测到您没成功登录，是否去设置重新授权登录？',
                      confirmText: "确认",
                      cancelText: "取消",
                      success: function (res) {
                        console.log(res);
                        //点击“确认”时打开设置页面
                        if (res.confirm) {
                          console.log('用户点击确认')
                          wx.getUserProfile({
                            desc:'展示用户信息',
                            success:res=>{
                              console.log(res)
                              wx.setStorageSync('nickName', res.userInfo.nickName)
                              wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
                            },fail:res=>{
                      
                            }
                          })
                          
                        } else {
                          console.log('用户点击取消')
                        }
                      }
                    });
    }
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'wisdom-2gi81y0ra4bc0adb',
        traceUser: true,
      })
    }



    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
