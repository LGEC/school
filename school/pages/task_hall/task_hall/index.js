// pages/task_hall/task_hall/index.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,  //可接单数量
    nowTask: 0, //已接单数量
    oldTask: 0, //已完成数量
    list: [] ,  //可接单
    userInfo: '', //用户信息
    schoolName: '',  //所在校区

  }, 
  onLoad: function (options) {
     
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
    var that = this;
    wx.getUserInfo({
      success(e) {
        console.log(e)
        if (e.userInfo){
          that.setData({
            userInfo: e.userInfo
          })
        }
      }
    })
    var schoolId = wx.getStorageSync('schoolId');
    var userId = wx.getStorageSync('userId');
    var schoolName = wx.getStorageSync('schoolName');
    this.setData({
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
        taskStatus:0
      },
      success:res=>{
        console.log(res)
        var data = res.data;
        var status = data.status;
        if (status == 1) {
          var list = data.data.list;
          var count = data.data.count;
          if (!count) {
            count = 0;
          }
          var len = list.length;
          if (len>0){
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
// 派送员统计信息
    wx.request({
      url: app.globalData.api + 'task/getUserTaskReport',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: userId,
      },
      success: res => {
        console.log(res)
        var data = res.data;
        var status = data.status;
        if (status == 1) {
          var nowTask = data.data.nowTask;
          if (!nowTask) {
            nowTask = 0;
          }
          var oldTask = data.data.oldTask;
          if (!oldTask) {
            oldTask = 0;
          }
          wx.setStorageSync('nowTask', nowTask);
          wx.setStorageSync('oldTask', oldTask);
            this.setData({
              nowTask: nowTask,
              oldTask: oldTask
            })
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
      url: `../grab_detail/grab_detail?type=0&taskId=${taskId}&name=${publishName}&photo=${publishPhoto}`
    })
  },
  // 抢单
  grab(e) { 
    wx.showLoading({
      title: '正在抢单中。。。',
    })
    var orderId = e.currentTarget.dataset.orderid;
    console.log(orderId)
    wx.request({
      url: app.globalData.api + 'task/GO',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: this.data.userId,
        taskId: orderId
      },
      success: res => {
        //console.log(res)
        var data = res.data;
        var status = data.status;
        if (status == 1) {
          wx.hideLoading();
          wx.showToast({
            title: '抢单成功',
            duration: 2000
          });
          setTimeout(()=>{
            this.onShow();
          },1000)
          
        } else {
          wx.hideLoading();
          wx.showToast({
            title: data.msg,
            duration: 2000,
            icon: 'none'
          });
        }
      },
      fail: function () {
        wx.hideLoading();
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          icon: 'none'
        });
      }
    })
  }
})