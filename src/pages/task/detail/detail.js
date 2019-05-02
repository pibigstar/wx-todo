const util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    task: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    this.getTask(options.id);
  },


  getTask: function(id){
    util.apiRequest("task/get", "get", { "id": id }).then(data => {
      console.log(data)
        this.setData({
          task: data.Data
        })
    })
  }

})