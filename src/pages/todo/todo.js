const app = getApp();
Page({
  data: {
    tasks: [
      {
      id: 0,
      title: "任务一",
      content: "明天周六记得按时到考场考研明天周六记得按时到考场考研",
      groupName: "软件开发15-01",
      time: "2018-12-21 16:35",
      isRead: false,
    },
      {
        id: 1,
        title: "任务二",
        content: "明天周六记得按时到考场考研明天周六记得按时到考场考研",
        groupName: "软件开发15-01",
        time: "2018-12-21 16:35",
        isRead: false,
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setTabBarBadge({
      index: 0,
      text: '3',
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
})