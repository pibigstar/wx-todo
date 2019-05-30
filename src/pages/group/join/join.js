const util = require("../../../utils/util.js")
Page({
  data: {
    searchShowed: false,
    inputVal: "",
    group: {},
    noResult: false,
    answer: "",
    groupCode: "",
  },
  onLoad: function(options){
      //开启分享
      wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
      });
      if(options.id!==undefined) {
          this.setData({
              inputVal: options.id
          })
          this.searchGroup()
      }
  },

  showInput: function () {
    this.setData({
      searchShowed: true
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      searchShowed: false,
      noResult: false,
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  inputAnswer: function (e) {
    this.setData({
      answer: e.detail.value
    })
  },

  inputGroupCode: function (e) {
    this.setData({
      groupCode: e.detail.value
    })
  },


  // 查找组织
  searchGroup: function () {
    let groupID = this.data.inputVal;
    this.setData({
      group: null,
      noResult:false
    })
    if (groupID == "") {
      wx.showToast({
        title: '组织ID不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    util.apiRequest("group/search", "get", {
      groupId: groupID,
    }).then(data => {
      if (data.Code == 200) {
        this.setData({
          group: data.Data,
        })
      } else {
        this.setData({
          noResult: true,
        })
      }
    })
  },

  // 加群
  joinGroup: function (e) {
    console.log(e.detail.formId);
    let group = this.data.group;
    let { answer, groupCode } = this.data;
    util.apiRequest("group/join", "post", {
      groupId: group.groupId,
      joinMethod: group.joinMethod,
      answer: answer,
      groupCode: groupCode,
    },e.detail.formId).then(data => {
      if (data.Code == 200) {
        console.log("加入成功")
      }else{
        util.showErrorMessage(data.Msg)
      }
    })
  },
    /* 转发*/
    onShareAppMessage: function (ops) {
        let title = this.data.group.groupName;
        let id = this.data.inputVal;
        return {
            title: title,
            path: `pages/group/join/join?id=${id}`,
            success: function (res) {
                // 转发成功
                console.log("转发成功:" + JSON.stringify(res));
                var shareTickets = res.shareTickets;
            },
            fail: function (res) {
                // 转发失败
                console.log("转发失败:" + JSON.stringify(res));
            }
        }
    },


});