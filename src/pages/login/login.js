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
    // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    wx.login({
      success(res) {
        if (res.code) {
          console.log("code:"+res.code);
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
            util.showError(err);
          })
        } else {
          console.log('获取code失败！' + res.errMsg)
        }
      }
    })
  },
})