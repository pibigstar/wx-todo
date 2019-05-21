const util = require("../../../utils/util.js")
Page({
  data: {
    groupName: '',
    groupDescribe: '',
    joinMethod: '1',
    question: '',
    answer: '',
    joinGroupMethods: [
      { name: '输入秘钥', value: '1', checked: true },
      { name: '回答问题', value: '2' }
    ],
    hidden: true,
    length: 0,
  },
  joinGroupChange: function (e) {
    console.log(e.detail.value)
    if (e.detail.value == 1) {
      this.setData({
        hidden: true,
        joinMethod: e.detail.value,
      })
    } else {
      this.setData({
        hidden: false,
        joinMethod: e.detail.value,
      })
    }
    // 更改单选按钮状态
    var joinGroupMethods = this.data.joinGroupMethods, values = e.detail.value;
    for (var i = 0, lenI = joinGroupMethods.length; i < lenI; ++i) {
      joinGroupMethods[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (joinGroupMethods[i].value == values[j]) {
          joinGroupMethods[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      joinGroupMethods: joinGroupMethods
    });
  },

  bindGroupNameInput: function(e) {
    this.setData({
      groupName: e.detail.value,
    })
  },
  bindGroupDescribeInput: function(e) {
    this.setData({
      groupDescribe: e.detail.value,
    })
    let groupDescribe = this.data.groupDescribe
    let length = groupDescribe.length;
    this.setData({
        length: length,
    })
  },
  bindQuestionInput: function(e) {
    this.setData({
      question: e.detail.value,
    })
  },
  bindAnswerInput: function(e) {
    this.setData({
      answer: e.detail.value,
    })
  },
  submit: function() {
    if(!this.validata()) {
      return;
    }
    util.apiRequest("group/create", "post",{
      "groupName":this.data.groupName,
      "groupDescribe":this.data.groupDescribe,
      "joinMethod": this.data.joinMethod,
      "question": this.data.question,
      "answer":this.data.answer,
    }).then(data => {
      console.log(data);
      if (data.Code == 500) {
        util.showErrorMessage(data.Msg);
      }
      if (data.Code == 200) {
        wx.showToast({
          title: '创建成功',
          icon: 'success',
          duration: 1000,
        })
        setTimeout(function(){
          wx.switchTab({
            url: '/pages/me/me',
          })
        },1000)
      }
    }).catch(err => {
        util.showError(err);
    })
  },
  validata: function() {
    var groupName = this.data.groupName;
    if (groupName == "") {
      util.showErrorMessage("组织名不能为空")
      return false;
    }
    var joinMethod = this.data.joinGroupMethods;
    var question = this.data.question;
    var answer = this.data.answer;
    if (joinMethod == 2 && question == "") {
      util.showErrorMessage("问题不能为空")
      return false;
    }
    if (joinMethod == 2 && answer == "") {
      util.showErrorMessage("答案不能为空")
      return false;
    }
    if (!util.isLogin()) {
      return false;
    }
    return true;
  },

})