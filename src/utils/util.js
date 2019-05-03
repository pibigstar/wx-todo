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
var domain = app.globalData.host;
var token;

// 抽取request请求
const apiRequest = (url, method, data, formId) => {
  token = getToken()
  if(formId!=null && formId!=""){
    wx.request({
      url: domain + "collect",
      data: { "formId": formId },
      method: "post",
      header: { "todo-token": token },
      success: function (res) {
        console.log("收集formId成功" + formId);
      }
    })
  }
  var promise = new Promise(function (resolve, reject) {
    wx.request({
      url: domain + url,
      data: data,
      method: method,
      header: {"todo-token": token},
      success: function (res) {
        console.log(res);
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
function isLogin(){
  var token = wx.getStorageSync("token");
  if (token===undefined || token ===""){
    wx.showModal({
      title: '提示',
      content: '你的身份信息已过期，请重新登录',
      success(res) {
        if (res.confirm) {
          toLogin();
        }
      }
    })
    return false;
  }
  return true;
}
// 显示错误弹窗
function showError(error){
  wx.showModal({
    title: '错误',
    content: error.errormsg,
  })
}
// 显示错误弹窗
function showErrorMessage(msg) {
  wx.showModal({
    title: '错误',
    content: msg,
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
  isLogin: isLogin,
  showErrorMessage: showErrorMessage,
  showSuccessMessage: showSuccessMessage,
  formatTime: formatTime,
  showError: showError,
}