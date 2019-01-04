const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  templateSend: function (e) {
    var _this = this;
    var openId = _this.data.openId;
    // 表单需设置report-submit="true"
    var formId = e.detail.formId;
    console.log(formId)
  
    // 发送随机模板消息
    util.apiRequest("send","get",{
      formID: formId,
      }).then(data => {
         console.log(data)
      })
  }
})