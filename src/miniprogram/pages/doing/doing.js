const util = require("../../utils/util.js")
const app = getApp();
Page({
  data: {
    searchWord: "",
    searchShowed: false,
    status: 1,// 状态，todo为0，doing为1
    tasks: [],
    unReadNum: 0,
  },

  onShow: function () {
    let status = this.data.status;
    this.listTask("", status);
  },
  // 搜索框JS显示控制逻辑
  showInput: function () {
    this.setData({
      searchShowed: true
    });
  },
  clearInput: function () {
    this.setData({
      searchWord: "",
      searchShowed: false,
    });
    let status = this.data.status;
    this.listTask("", status);
  },

  inputTyping: function (e) {
    this.setData({
      searchWord: e.detail.value
    });
  },

  // 查询task
  listTask: function (title, status) {
    util.apiRequest("task/list", "get", { "title": title, "status": status }).then(data => {
      console.log(data)
      this.setData({
        tasks: data.Data.tasks,
      })
    })
  },
  // 搜索任务
  searchTask: function () {
    let { searchWord, status } = this.data;
    if (searchWord == "") {
      util.showErrorMessage("搜索标题不能为空");
      return;
    }
    this.listTask(searchWord, status);
  },

  // 改变状态
  changeStatus: function (e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let status = this.getStatus(type)
    console.log("id:" + id + "status:" + status);
    util.apiRequest("task/changeStatus", "post", { "id": id, "status": status }).then(data => {
      let status = this.data.status;
      this.listTask("", status);
    })
  },
  // 根据文字获取状态值
  getStatus: function (type) {
    let status = this.data.status;
    if (type == "doing") {
      status = 1;
    } else if (type == "done") {
      status = 2;
    } else if (type == "close") {
      status = 3;
    } else if (type == "todo") {
      status = 0;
    }
    return status;
  },
})