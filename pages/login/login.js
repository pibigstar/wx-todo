const app = getApp()
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  doLogin: function (e) {
    var domain = app.globalData.doLogin;
    // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    console.log(e.detail.userInfo)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    // 请求服务器登录
    wx.login({
      success(res) {
        if (res.code) {
          // 获取openId和session_key
          wx.request({
            url: 'http://192.168.1.68:7410/wxLogin',
            data: {
              code: res.code
            },
            success: function (data) {
              console.log(data)
              wx.switchTab({
                url: '/pages/todo/todo',
              })
            },
            fail: function (err) {
              console.error(err)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})