var wxCharts = require('../../../utils/wxcharts.js');
var util = require('../../../utils/util.js');
var app = getApp();
var pieChart = null;
Page({
  data: {
    todo: 5,
    doing: 3,
    done: 1,
  },
  touchHandler: function (e) {
    console.log(pieChart.getCurrentDataIndex(e).data);
  },
  onShow: function () {
    this.getTaskData();
  },

  setTaskData(){
    let { todo, doing, done } = this.data;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: 'todo',
        data: todo,
      }, {
        name: 'doing',
        data: doing,
      }, {
        name: 'done',
        data: done,
      }],
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });
  },

  getTaskData: function(){
    util.apiRequest("task/getTaskData", "get").then(data => {
      if (data.Code == 200) {
        this.setData({
          todo: data.Data.todo,
          doing: data.Data.doing,
          done: data.Data.done,
        })
        this.setTaskData();
      }
    })
  }



});