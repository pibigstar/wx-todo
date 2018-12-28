const app = getApp()
// pages/me/me.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    var userInfo = app.globalData.userInfo
    console.log(userInfo)
    this.setData({
      userInfo: userInfo,
      hasUserInfo: true
    })
  },

})