const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countryCodes: ["+86", "+80", "+84", "+87"],
    countryCodeIndex: 0,
    radioItems: [
      { name: '男', value: '1', checked: true },
      { name: '女', value: '2',  }
    ],
    user: null,
    nickName: "",
    realName: "",
    gender: "0",
    phone: "",
    receiveRemind: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },

  // 区号改变
  bindCountryCodeChange: function (e) {
    this.setData({
      countryCodeIndex: e.detail.value
    })
  },
  // 性别改变
  radioChange: function (e) {
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }
    this.setData({
      radioItems: radioItems,
      gender: e.detail.value
    });

  },
  // 接收任务提醒改变
  receiveRemindChange: function(e){
    console.log(e.detail.value);
  },

  bindNickNameInput: function(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  bindRealNameInput: function (e) {
    this.setData({
      realName: e.detail.value
    })
  },
  bindPhoneInput: function(e){
    this.setData({
      phone: e.detail.value,
    })
  },

  // 获取用户信息
  getUserInfo: function(){
    util.apiRequest("user/info", "get").then(data => {
      if (data.Code == 200) {
        console.log(data.Data)
        this.setData({
          user: data.Data
        })
        this.setUserInfo();
      }
    })
  },
  //设置用户信息
  setUserInfo: function(){
    let user = this.data.user;
    if (user != null) {
      this.setData({
        nickName: user.NickName,
        realName: user.RealName,
        gender: user.Gender,
        phone: user.Phone,
      })
      let gender = user.Gender;
      let radioItems = this.data.radioItems;
      for (var i = 0, len = radioItems.length; i < len; ++i) {
        radioItems[i].checked = radioItems[i].value == gender;
      }
      this.setData({
        radioItems: radioItems,
      });
    }
  },
  // 更新用户信息
  updateUsserInfo: function(e){
    let { nickName,realName,gender,phone,receiveRemind } = this.data;
    if(nickName == ""){
      util.showErrorMessage("昵称不能为空");
      return;
    }
    util.apiRequest("user/update", "post",{
      "nickName": nickName,
      "realName": realName,
      "gender": gender,
      "phone": phone,
    }, e.detail.formId).then(data => {
      if (data.Code == 200) {
        util.showSuccessMessage("更新成功");
      }
    })
  }

})