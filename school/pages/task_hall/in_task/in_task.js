// pages/task_hall/in_task/in_task.js
var app = getApp();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,  //可接单数量
    nowTask: 0, //已接单数量
    oldTask: 0, //已完成数量
    list: [],   //已接单
    schoolName: '',  //所在校区
    userInfo: '', //用户信息
  },
  onLoad: function (options) {
  
  },
  // 获取用户权限
  getUI: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      var userInfo = e.detail.userInfo;
      userInfo.userId = this.data.userId;
      this.setData({
        userInfo: userInfo
      })
      app.uploadInfo(userInfo)
      console.log(userInfo)
    }
  },
  onShow: function () {
    wx.getUserInfo({
      success(e) {
        console.log(e)
        if (e.userInfo) {
          that.setData({
            userInfo: e.userInfo
          })
        }
      }
    })
    var nowTask = wx.getStorageSync('nowTask');
    var oldTask = wx.getStorageSync('oldTask');
    var schoolId = wx.getStorageSync('schoolId');
    var schoolName = wx.getStorageSync('schoolName');
    var userId = wx.getStorageSync('userId');
    this.setData({
      nowTask: nowTask,
      oldTask: oldTask,
      schoolId: schoolId,
      userId: userId,
      schoolName: schoolName
    })
    // 任务列表
    var that = this;
    wx.request({
      url: app.globalData.api + 'task/taskList',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        schoolId: schoolId,
        userId: userId,
        taskStatus: 1
      },
      success: res => {
        console.log(res)
        var data = res.data;
        var status = data.status;
        if (status == 1) {
          var list = data.data.list;
          var count = data.data.count;
          if (!count){
            count=0;
          }
          var len = list.length;
          if (len > 0) {
            this.setData({
              count: count,
              list: list
            })
          }
        } else {
          wx.showToast({
            title: data.msg,
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
  },

  // 进入抢单详情页
  goDetail(e) {
    var list = this.data.list;
    var index = e.currentTarget.dataset.index;
    var taskId = list[index].orderId;
    var publishName = list[index].publishName;
    var publishPhoto = list[index].publishPhoto;
    console.log(index)
    wx.navigateTo({
      url: `../grab_detail/grab_detail?type=1&taskId=${taskId}&name=${publishName}&photo=${publishPhoto}`
    })
  },
  jump_start: function () {
    wx.redirectTo({
      url: '../task_hall/index'
    })
  },
  jump_center: function () {
    wx.redirectTo({
      url: '../in_task/in_task'
    })
  },
  jump_end: function () {
    wx.redirectTo({
      url: '../task_end/task_end'
    })
  }
})