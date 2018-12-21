const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var app = getApp();
var domain = app.globalData.domain;
var token;

// 抽取request请求
const apiRequest = (url, method, data) => {
  var promise = new Promise(function (resolve, reject) {
    token = getToken();
    wx.request({
      url: domain + url,
      data: data,
      method: method,
      header: { "grpc-metadata-token": token, "Content-Type": "application/json" },
      success: function (res) {
        if (res.statusCode === 200) {
           resolve(res.data);
        } else {
          reject({ errormsg: '服务器内部错误，请稍后重试', code: res.statusCode });
        }
      },
      fail: function (res) {
        // 调用接口失败
        reject({ errormsg: '网络错误,请稍后重试', code: 0 });
      }
    })
  });
  return promise;
};

// 从storage中拿token
function getToken(){
  return wx.getStorageSync("token");
}
// 存储token到storage
function setToken(key,data){
  wx.setStorage({
    key: key,
    data: data,
  })
}
// 跳转到登录页面
function toLogin(){
  wx.navigateTo({
    url: '/pages/login/login',
  })
}
// 检查是否已登录
function checkLogin(){
  if(getToken()===undefined){
    toLogin();
  }
}
// 显示错误弹窗
function showErrorMessage(error){
  wx.showModal({
    title: '错误',
    content: error.errormsg,
  })
}
// 显示成功弹窗
function showSuccessMessage(msg){
  wx.showModal({
    title: '成功',
    content: msg,
  })
}

// 暴露方法
module.exports = {
  apiRequest: apiRequest,
  getToken: getToken,
  setToken: setToken,
  toLogin: toLogin,
  checkLogin: checkLogin,
  showErrorMessage: showErrorMessage,
  formatTime: formatTime,
}