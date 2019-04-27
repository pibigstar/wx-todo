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
        this.setData({
          memberObjects: data.Data,
        });
        this.parseMemberObject(data.Data);
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
    let { memeberObjects } = this.data
    let user = memeberObjects[index]
    this.setData({
      assign: user.UserID
    })
  },
  // 截止日期下拉框改变
  bindEndTimeChange: function(e){

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
    let { title,contnet,isRemind,remindAfterFin,groupIndex,memberIndex,groupObjects,assign,endTime } = this.data;
    if(title == ""){
      util.showErrorMessage("标题不能为空")
      return;
    }
    let groupId = memberObjects[groupIndex].ID
    util.apiRequest("task/create","post",{
      "title": title,
      "content": content,
      "isRemind": isRemind,
      "remindAfterFin": remindAfterFin,
      "userId": assign,
      "groupId": groupId,
      "endTime": endTime,
    }).then(data => {
      util.showSuccessMessage("创建成功");
    }).cathc(err => {

    })
  },
})