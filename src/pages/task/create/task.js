const util = require("../../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: "",
    isRemind: true,
    remindAfterFin: true,
    groups: [],
    members: [],
    memberObjects: [],
    groupObjects: [],
    memberIndex: -1,
    groupIndex: -1,
    endTime: '2019-01-15',
    assign: "",
    isAll: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面一加载就拿取该用户下的组织
    util.apiRequest("group/list", "get",{}).then(data => {
      this.setData({
        groupObjects: data.Data.createGroups,
      })
      this.parseGroupObject(data.Data.createGroups);
    }).catch(err => {
      util.showError(err);
    })
  },

  // 组织下拉框改变
  bindGroupChange: function(e){
    let index = e.detail.value;
    this.setData({
      groupIndex: index
    })
    let { groupObjects } = this.data;
    let group = groupObjects[index];
    if(group!=null){
      // 拿取该组织下的用户
      util.apiRequest("group/members", "get", {
        "groupId":group.ID
      }).then(data=>{
        console.log(data);
        if(data.Data.length == 0){
          wx.showToast({
            title: '该组织下无成员',
            icon: 'none',
            duration: 2000
          })
        }
        this.setData({
          memberObjects: data.Data,
        });
        if(data.Data != null){
          this.parseMemberObject(data.Data);
        }
      }).catch(err=>{
        util.showError(err);
      })
    }
  },
  // 指派人下拉框改变
  bindMemberChange: function(e){
    let index = e.detail.value;
    this.setData({
      memberIndex: index
    })
    let { memberObjects } = this.data
    let user = memberObjects[index]
    this.setData({
      assign: user.UserID
    })
  },
  // 截止日期下拉框改变
  bindEndTimeChange: function(e){
    this.setData({
      endTime: e.detail.value
    })
  },
  // 标题改变
  bindTitleInput: function(e){
    this.setData({
      title: e.detail.value
    })
  },
  bindContentInput: function(e){
    this.setData({
      content: e.detail.value
    })
  },

  // 解析group对象
  parseGroupObject: function(objs){
    var groups = [];
    var groupObject;
    for(var i=0;i<objs.length;i++){
      groupObject = objs[i];
      groups[i] = groupObject.GroupName;
    }
    this.setData({
      groups: groups,
    })
  },

  // 解析成员对象
  parseMemberObject: function (objs) {
    var members = [];
    var memberObject;
    for (var i = 0; i < objs.length; i++) {
      memberObject = objs[i];
      members[i] = memberObject.UserName;
    }
    this.setData({
      members: members,
    })
  },

  // 任务创建
  createTask: function(){
    let { title, isAll, content, isRemind, remindAfterFin, groupIndex,
     memberIndex, groupObjects,memberObjects,assign,endTime } = this.data;
    if(memberIndex == -1){
      isAll = true;
    }
    if(title == ""){
      util.showErrorMessage("标题不能为空")
      return;
    }
    let groupId = groupObjects[groupIndex].ID;
    let groupName = groupObjects[groupIndex].GroupName;
    let appointTo = new Object();
    let exercisers = new Array();
    exercisers[0] = assign;
    appointTo.isAll = isAll;
    appointTo.exercisers = exercisers;
    let appointToStr = JSON.stringify(appointTo);
    util.apiRequest("task/create","post",{
      "taskTitle": title,
      "taskContent": content,
      "isRemind": isRemind,
      "remindAfterFin": remindAfterFin,
      "appointTo": appointToStr,
      "groupId": groupId,
      "groupName": groupName,
      "completionTime": endTime,
    }).then(data => {
      console.log(data)
      wx.showModal({
        title: '提示',
        content: '创建成功',
        success: function(res){
          if(res.confirm){
            wx.switchTab({
              url: '/pages/todo/todo',
            })
          }
        }
      })
    }).catch(err => {
      util.showErrorMessage("创建失败")
    })
  },
})