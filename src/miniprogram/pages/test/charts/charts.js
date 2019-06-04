const wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var startPos = null;
Page({
  data: {
  },
  onLoad: function (e) {
    // 获取屏幕宽度
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    // 获取数据
    var simulationData = this.createSimulationData();
    console.log(simulationData);
    // 创建图表
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      series: [{
        name: '平均分',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '分';
        }
      }],
      xAxis: {
        disableGrid: true,
        type: "data"
      },
      yAxis: {
        title: '评分 (百分制)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0,
        max:100,
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      enableScroll: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  // 触摸之后显示内容
  touchHandledr: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      //background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  // 创造模拟数据
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('周' + (i + 1));
      //线上的数据值
      data.push(Math.random() * (100 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },

    // 点击更新数据
    updateData: function () {
    var simulationData = this.createSimulationData();
    var series = [{
      name: '评分',
      data: simulationData.data,
      format: function (val, name) {
        return val.toFixed(2) + '万';
      }
    }];
    lineChart.updateData({
      categories: simulationData.categories,
      series: series
    });
  },

  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },

});