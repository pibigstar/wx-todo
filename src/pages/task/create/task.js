const util = require("../../../utils/util.js")
const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    content: "",
    html: "",
    isRemind: true,
    remindAfterFin: true,
    groups: [],
    members: [],
    memberObjects: [],
    groupObjects: [],
    memberIndex: -1,
    groupIndex: -1,
    endTime: '2019-06-15',
    assign: "",
    isAll: false,
    images: [],
    fileIds: [],
    length: 0,
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
    let length = this.data.length;
    length++;
    this.setData({
      content: e.detail.value,
      length: length,
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
  createTask: function(e){
      let { title, isAll, content, html, isRemind, remindAfterFin, groupIndex,
     memberIndex, groupObjects,memberObjects,assign,endTime } = this.data;
    if(memberIndex == -1){
      isAll = true;
    }
    if(title == ""){
      util.showErrorMessage("标题不能为空")
      return;
    }
    if (groupIndex===-1){
        util.showErrorMessage("必须选择一个组织")
        return;
    }
    // 上传图片
      wx.showLoading({
          title: '创建中',
      })
      // 上传图片到云存储
      let promiseArr = [];
      for (let i = 0; i < this.data.images.length; i++) {
          promiseArr.push(new Promise((reslove, reject) => {
              let item = this.data.images[i];
              let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
              wx.cloud.uploadFile({
                  cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
                  filePath: item, // 小程序临时文件路径
                  success: res => {
                      // 返回文件 ID
                      console.log(res.fileID)
                      this.setData({
                          fileIds: this.data.fileIds.concat(res.fileID)
                      });
                      reslove();
                  },
                  fail: console.error
              })
          }));
      }
      Promise.all(promiseArr).then(res => {
        let groupId = groupObjects[groupIndex].ID;
        let groupName = groupObjects[groupIndex].GroupName;
        let appointTo = new Object();
        // let exercisers = new Array();
        // exercisers[0] = assign;
        appointTo.isAll = isAll;
        appointTo.exerciser = assign;
        let appointToStr = JSON.stringify(appointTo);
        util.apiRequest("task/create","post",{
        "taskTitle": title,
        "taskContent": content,
        "taskHtml": html,
        "isRemind": isRemind,
        "remindAfterFin": remindAfterFin,
        "isAll": isAll,
        "assign": assign,
        "groupId": groupId,
        "groupName": groupName,
        "completionTime": endTime,
        "fileIds": this.data.fileIds
        }, e.detail.formId).then(data => {
        console.log(data)
        wx.hideLoading();
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
            wx.hideLoading();
            util.showErrorMessage("创建失败")
        })
    });
  },

    uploadImg: function () {
        // 选择图片
        wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                console.log(tempFilePaths);
                this.setData({
                    images: this.data.images.concat(tempFilePaths)
                });
            }
        })
    },

    // 富文本编辑器相关函数
    contentChange(e) {
        this.setData({
            content: e.detail.text, 
            html: e.detail.html,
        })
    },

    // 编辑器初始化完成
    onEditorReady() {
        wx.createSelectorQuery().select('#editor').context(res => {
            this.editorCtx = res.context
            this.editorCtx.setContents({
                html: ""
            })
        }).exec()
    },

    //撤销
    undo() {
        this.editorCtx.undo()
    },
    //回滚
    redo() {
        this.editorCtx.redo()
    },
    // 调整格式，粗，斜，下划线
    format(e) {
        let { name, value } = e.target.dataset
        if (!name) {
            return
        }
        console.log('format', name, value)
        this.editorCtx.format(name, value)

    },
    // 格式状态改变
    onStatusChange(e) {
        const formats = e.detail
        this.setData({ formats })
    },

    removeFormat() {
        this.editorCtx.removeFormat()
    },
    //插入日期
    insertDate() {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
            text: formatDate
        })
    },

})