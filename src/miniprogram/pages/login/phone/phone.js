const util = require("../../../utils/util.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,

    phone: "",
    password: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 区号改变
  bindCountryCodeChange: function (e) {
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  // 手机号
  bindPhoneInput: function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // 密码
  bindPasswordInput: function(e){
    this.setData({
      password: e.detail.value
    })
  },
  
  doLogin: function(e){
    // 获取用户信息
    app.globalData.userInfo = e.detail.userInfo
    let { phone,password } = this.data;
    util.apiRequest("phoneLogin", "post",{"phone":phone,"password":password}).then(data => {
      if (data.Code == 200) {
        console.log(data)
        util.setToken("token", data.Data);
        wx.switchTab({
          url: '/pages/todo/todo',
        })
      }else{
        util.showErrorMessage(data.Msg);
      }
    })
  }


})