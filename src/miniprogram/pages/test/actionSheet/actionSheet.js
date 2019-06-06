
Page({

    /**
     * 页面的初始数据
     */
    data: {
        actionShow: false
    },

    // 打开ActionSheet组件
    openMysheet: function () {
        this.setData({
            actionShow: !this.data.actionShow
        })
    },
    //Action关闭之后就回调这个
    onActionHide: function () {
        console.log('ActionSheet关闭了')
    },

    //普通按钮点击
    handleBtn: function () {
        wx.showToast({
            title: '我是普通按钮',
            icon: 'none'
        })
    },
})