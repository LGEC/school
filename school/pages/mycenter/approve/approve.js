// pages/mycenter/approve/approve.js
const app = getApp();
Page({

  data: {
    datas: '', //激活后的用户信息
    status:'',  //状态
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    //用户信息获取
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}user/getAudit`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        this.setData({
          datas: res.data.data,
          status:res.data.status
        });
      }
    });
  },

  onShow: function() {

  },

  onShareAppMessage: function() {

  }
})