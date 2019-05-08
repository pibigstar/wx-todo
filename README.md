# 任务发布系统微信小程序端

## 项目截图


![个人页面](https://github.com/pibigstar/wx-todo/blob/master/screenshot/me.png)
![todo列表](https://github.com/pibigstar/wx-todo/blob/master/screenshot/todo.png)
![todo列表](https://github.com/pibigstar/wx-todo/blob/master/screenshot/todo2.png)


## API接口封装

### 抽取request请求

抽取出来请求之后你可以在内部加一些逻辑判断，比如是否登录，或者收集formId之类的。

```javascript
const apiRequest = (url, method, data) => {
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

```
#### 使用

```html
// 引入util
const util = require("../../utils/util.js")

// 获取用户信息
getUserInfo: function(){
util.apiRequest("user/info", "get").then(data => {
  if (data.Code == 200) {
	console.log(data.Data)
  }
})
},
```
