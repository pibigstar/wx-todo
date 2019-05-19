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
  onShow: function(){
      let token = wx.getStorageSync("token");
      let user = wx.getStorageSync("user");
      let expired = wx.getStorageSync("expired");
      if (token) {
          app.globalData.userInfo = user;
          let now = new Date();
          if (expired && now.getTime() > expired.getTime()) {
              wx.showModal({
                  title: '提示',
                  content: '你的身份信息已过期，请重新登录',
              })
          } else {
              wx.switchTab({
                  url: '/pages/todo/todo',
              })
          }
      }
  },

  doLogin: function (e) {
    // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    wx.setStorageSync("user", e.detail.userInfo);
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

  phonelogin:function(e){
    wx.navigateTo({
      url: '/pages/login/phone/phone',
    })
  },

})