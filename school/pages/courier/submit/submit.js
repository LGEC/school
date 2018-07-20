var app = getApp();
Page({

  data: {
    //遮罩层
    mask: {
      opacity: 0,
      display: 'none'
    },
    //弹窗
    returnDeposit: {
      translateY: 'translateY(-1500px)',
      opacity: 1
    },
    insurance: 1,   //保险选择开关
    address: '',
    textarea:'',  //备注
    courier_buy:''  //快递参数
  },
  onLoad: function (options) {  // type 1 超市； 2 水；  3餐饮 ; 0 购物车
    console.log(options)
  },
  onShow: function (options) {
    var schoolId = wx.getStorageSync('schoolId');
    var userId = wx.getStorageSync('userId');
    this.setData({
      schoolId: schoolId,
      userId: userId
    })

    var courier_buy = wx.getStorageSync('courier_buy');
    this.setData({
      courier_buy: courier_buy
    })
    var default_address = courier_buy.send_info;
    if (default_address) {
      this.setData({
        address: default_address,
        textarea: courier_buy.textarea
      })
    }
  },
  // 写入备注 
  textarea(e) {
    this.setData({
      textarea: e.detail.value
    })
  },
  choose_address() {
    wx.navigateTo({
      url: '../address/address'
    })
  },
  //选择保险费开关
  switch1Change(e) {
    console.log(e)
    let insurance = e.detail.value == true ? 1 : 0;
    console.log(insurance)
    this.setData({
      insurance: insurance
    })
  },
  //弹窗显示
  bindtapMasks() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.display = 'block';
    this.setData({ mask });
    mask.opacity = 1;
    returnDeposit.translateY = 'translateY(-350rpx)';
    returnDeposit.opacity = 1;
    this.setData({ mask, returnDeposit });
  },
  //关闭弹窗
  bindtapClose() {
    let mask = this.data.mask,
      returnDeposit = this.data.returnDeposit;
    mask.opacity = 0;
    returnDeposit.opacity = 0;
    this.setData({ mask, returnDeposit });
    setTimeout(() => {
      mask.display = 'none';
      returnDeposit.translateY = 'translateY(-1500px)';
      this.setData({ mask, returnDeposit });
    }, 500);
  },
  submitOrders() {
    var schoolName = wx.getStorageSync('schoolName');
    var type = this.data.type;
    var that = this;
    var courier_buy = this.data.courier_buy;
    var address = this.data.address;
    var take_info = courier_buy.take_info;
    var insurance = this.data.insurance;
    console.log(address)
    console.log(courier_buy)
    wx.request({
      url: app.globalData.api + 'payment/unifiedorder',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: that.data.userId,
        schoolId: that.data.schoolId,
        userName: address.name,
        userPhone: address.tel,
        schoolName: schoolName,
        buildName: address.builde,
        floorNum: address.floor,
        address: address.address,
        orderRemarks: that.data.textarea,
        deliverAddress: take_info.address,
        deliverName: take_info.courier,
        packageName: take_info.name,
        packagePhone: take_info.tel,
        packageCode: take_info.code,
        sendTime: courier_buy.time.time,
        packageWeight: courier_buy.weight.weight,
        isProtect: insurance
      },
      success(res) {
        console.log(res)
        var status = res.data.status;
        if (status == 1) {
          var orderIds = res.data.data;
          orderIds = JSON.stringify(orderIds);
          wx.request({
            url: app.globalData.api + 'payment/unifiedpay',
            method: 'POST',
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
              userId: that.data.userId,
              orderIds: orderIds,
              fristOrder: ''
            },
            success(res) {
              console.log(res);
              setTimeout(function(){
                wx.switchTab({
                  url: '../../orderList/orderList'
                })
              },1000)
              
            }
          })
        } else {
          wx.showToast({
            title: data.data.msg,
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
})