const util = require("../../../utils/util.js")
Page({
  data: {
  },
  templateSend: function (e) {
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