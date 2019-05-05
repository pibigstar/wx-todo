const util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    group: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
   
  },
  onShow: function(){
    this.getGroupInfo();
  },

  getGroupInfo: function(){
    let id = this.data.id;
    util.apiRequest("group/info", "get", { "groupId": id}).then(data => {
      console.log(data)
      this.setData({
        group: data.Data,
      })
    })

  }

})