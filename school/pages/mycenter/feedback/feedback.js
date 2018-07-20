// pages/feedback/feedback.js
let check = 0;
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '1', value: '功能异常：功能故障或不可用' },
      { name: '2', value: '产品建议：用的不爽，我有建议' },
      { name: '3', value: '其它问题', checked: 'true' },
    ],
    text: '', //输入的内容
    checkbox: '', //选中的内容位置
  },

  /**
   * 生命周期函数--监听页面加载
   */ 
  onLoad: function(options) {
    if (!this.data.checkbox) {
      check = this.data.items.length;
      this.setData({
        checkbox: check-1
      });
    }
    console.log(this.data.checkbox)
  },
  //单选按钮
  checkboxChange: function(e) {
    check = e.detail.value;
    this.setData({
      checkbox: check-1
    });
    console.log(checkbox);
  },
  //输入框
  bindText(e) {
    let text = e.detail.value;
    this.setData({
      text: text
    });
  },
  //提交反馈
  bindtapButton() {
    var userId = wx.getStorageSync('userId');
    var content = this.data.text;
    var questionType = this.data.checkbox;
    if (!this.data.text) {
      wx.showToast({
        title: '意见不能为空',
        image: '../../../image/warning.png',
        duration: 1500
      })
    }else {
      wx.request({
        url: app.globalData.api + 'user/callback',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          content: content,
          questionType: 1,
          userId: userId
        },
        success: res => {
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            
          } else {
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'none'
            });
          }

        },
        fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
            icon: 'none'
          });
        }
      })
    }
  },
})