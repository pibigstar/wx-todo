const util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createGroups: null,
    joinGroups: null,
  },
  onShow: function () {
    this.listGroups();
  },
  listGroups: function(){
    util.apiRequest("group/my/list", "get").then(data => {
      console.log(data)
      this.setData({
        createGroups: data.Data.createGroups,
        joinGroups: data.Data.joinGroups
      })
    })
  }


})