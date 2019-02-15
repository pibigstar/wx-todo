const util = require("../../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    members: ["派大星","海绵宝宝","章鱼哥"],
    memberObjects: [],
    memberIndex: 0,
    groups: ["组织一", "组织二", "组织三"],
    groupObjects: [],
    groupIndex: 0,
    endTime: '2019-01-15'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面一加载就拿取该用户下的组织
    util.apiRequest("group/list", "get",{}).then(data => {
      console.log(data);
      this.setData({
        groupObjects: data.data,
      });
      parseGroupObject(data.data);
    }).catch(err => {
      util.showError(err);
    })
  },
  // 组织下拉框改变
  bindGroupChange: function(e){
    console.log(e.detail.value);
    let group = this.groupObjects[e.detail.value];
    if(group!=null){
      // 拿取该组织下的用户
      util.apiRequest("group/members", "get", {
        "groupId":group.id
      }).then(data=>{
        console.log(data);
        this.setData({
          memberObjects: data.data,
        });
        parseMemberObject(data.data);
      }).catch(err=>{
        util.showError(err);
      })
    }
  },
  parseGroupObject: function(objs){
    var groups = [];
    var groupObject;
    for(var i=0;i<objs.length;i++){
      groupObject = objs[i];
      groups[i] = groupObject.name;
    }
    this.setData({
      groups: groups,
    })
  },
  parseMemberObject: function (objs) {
    var members = [];
    var memberObject;
    for (var i = 0; i < objs.length; i++) {
      memberObject = objs[i];
      members[i] = memberObject.name;
    }
    this.setData({
      members: members,
    })
  },
})