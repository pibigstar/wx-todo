const util = require("../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    task: null,
    images: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })
    this.getTask(options.id);
    //开启分享
    wx.showShareMenu({
        // 要求小程序返回分享目标信息
        withShareTicket: true
    }); 
  },

  getTask: function(id){
    wx.showLoading({
        title: '加载中',
    })
    util.apiRequest("task/get", "get", { "id": id }).then(data => {
      console.log(data)
      const task = data.Data;
        this.setData({
            task: task
        })
        // 编辑器初始化完成  
        let html = this.data.task.html;
        let content = this.data.task.content;
        if(!html){
            html = content;
        }
        wx.createSelectorQuery().select('#editor').context(res => {
            this.editorCtx = res.context
            this.editorCtx.setContents({
                html: html,
            })
        }).exec()
        if(task.fileIds && task.fileIds.length!==0){
            let promiseArr = [];
            for(let i=0;i<task.fileIds.length;i++){
                promiseArr.push(new Promise((reslove, reject) => {
                    wx.cloud.downloadFile({
                        fileID: task.fileIds[i], 
                        success: res => {
                            // 返回临时文件路径
                            console.log(res.tempFilePath)
                            this.setData({
                                images: this.data.images.concat(res.tempFilePath)
                            })
                            reslove();
                        },
                        fail: console.error
                    })
                }));
            }
            Promise.all(promiseArr).then(res => {
                wx.hideLoading();
            }).catch(err=>{
                wx.hideLoading();
                console.error(err)
            })
        } else {
            wx.hideLoading();
        }
    })
  },
    /* 转发*/
    onShareAppMessage: function (ops) {
        let title = this.data.task.title;
        let id = this.data.id;
        return {
            title: title,
            path: `pages/task/detail/detail?id=${id}`,
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

})