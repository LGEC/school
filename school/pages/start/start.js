// pages/start/start.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school:[],  //校区列表
    index:0,   //选择校区
    list:[],     //详细校区
    first:true  //首次点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  change: function (e) {
    this.setData({
      index: e.detail.value
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
    this.go();
  },

  // 点击进入提示
  go() {
    var index = this.data.index;
    if (index==0){
      wx.showToast({
        title: '请选择你的校区',
        icon:'none'
      })
      return;
    }
    var first = this.data.first;
    if (first) {
      wx.showModal({
        title: '提示',
        content: '校区选择后无法更改，请慎重选择',
        success: res => {
          if (res.confirm) {
            this.gohome();
          } else if (res.cancel) {
            this.setData({
              first: false
            })
          }
        }
      })
    } else {
      this.gohome();
    }
  },
  onShow: function () {
    wx.request({
      url: app.globalData.api + 'common/getSchoolList',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        schoolId: 1
      },
      success: res => {
        console.log(res)
        var status = res.data.status;
        if (status == 1) {
          var list = res.data.data;
          var len = list.length;
          var item = ['请选择你的校区'];
          for(var i=0;i<len;i++){
            item.push(list[i].schoolName)
          }
          this.setData({
            school: item,
            list: list
          })
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
  },
  gohome(){
    var userId = wx.getStorageSync('userId');
    var list = this.data.list;
    var index = this.data.index - 1;
    var schoolId = list[index].schoolId;
    var schoolName = list[index].schoolName;
    wx.setStorageSync('schoolId', schoolId);
    wx.setStorageSync('schoolName', schoolName);
    wx.request({
      url: app.globalData.api + 'user/modifySchool',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: userId,
        schoolId: schoolId
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
    wx.switchTab({
      url: '../index/index',
    })
  },
  onShareAppMessage: function () {
  
  }
})