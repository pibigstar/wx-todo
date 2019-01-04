const util = require("../../../utils/util.js")
Page({
  data: {
    searchShowed: false,
    inputVal: "",
    group: {},
    noResult: false,
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

 searchGroup: function () {
   let groupID = this.data.inputVal;
   if(groupID == "") {
     wx.showToast({
       title: '组织ID不能为空',
       icon: 'none',
       duration: 2000
     })
     return false;
   }
   util.apiRequest("group/search","get",{
     groupId: groupID,
   }).then(data => {
     if(data.Code==200) {
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
  joinGroup: function() {
    
  }


});