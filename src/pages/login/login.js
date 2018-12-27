const util = require("../../utils/util.js")
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

    wx.login({
      success(res) {
        if (res.code) {
          // 获取openId和session_key
          util.apiRequest("wxLogin", "post", {
            code: res.code
          }).then(data => {
            console.log(data)
            util.setToken("token", data.token);
            wx.switchTab({
              url: '/pages/todo/todo',
            })
          }).catch(err => {
            util.showErrorMessage(err);
          })
        } else {
          console.log('获取code失败！' + res.errMsg)
        }
      }
    })
  },
  // // 请求服务器登录
  login: function(code) {
   
  },

})