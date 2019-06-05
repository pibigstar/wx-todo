//app.js
App({
  onLaunch: function () {
      // 云开发初始化
      if (!wx.cloud) {
          console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
          wx.cloud.init({
              traceUser: true,
          })
      }
    // 自动更新
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log("有新的版本了:"+res.hasUpdate)
      })
      updateManager.onUpdateReady(function () {
          wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success(res) {
                  if (res.confirm) {
                      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                      updateManager.applyUpdate()
                  }
              }
          })
      })
      updateManager.onUpdateFailed(function () {
          wx.showToast({
              title: '更新失败，请重试',
              icon: 'none',
              duration: 2000
          })
      })

  },
  globalData: {
    userInfo: null,
    //host:"http://127.0.0.1:7410/",
    //host:"https://127.0.0.1:443/",
    host: "https://todo.pibigstar.com/"
  }
})