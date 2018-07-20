// pages/submitOrder/submitOrder.js
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
    vou: [{ vid: 9, full_money: 1000, amount: 10, title: "10元优惠券" }], //优惠券
    vou_show:false,  //优惠券弹框显示
    choose:0,        //选择优惠券
    insurance:1,   //保险选择开关
    address:'',   //地址
    shop_goods:[], //超市
    water:[],  //水
    dining:[],   //餐饮
    type:'' ,  //订单类型
    orderIds:[], //订单ID
    shop_cart: [], // 超市 购物车
    water_cart: [], // 水 购物车
    orderRemarks:'备注'
  },
  // 显示优惠券弹框
  vouShow(){
    this.setData({
      vou_show:true
    })
  },
  // 隐藏优惠券弹框
  shut(){
    this.setData({
      vou_show: false
    })
  },
  // 写入备注 
  textarea(e){
    console.log(e)
    this.setData({
      orderRemarks:e.detail.value
    })
  },
  // 选择优惠券
  choose(e){
    
  },
  onLoad: function (options) {  // type 1 超市； 2 水；  3餐饮 ; 0 购物车

    var schoolId = wx.getStorageSync('schoolId');
    var userId = wx.getStorageSync('userId');
    var schoolName = wx.getStorageSync('schoolName');
    this.setData({
      schoolId: schoolId,
      userId: userId,
      schoolName: schoolName
    })
    console.log(options)
    var type = options.type;
    this.setData({
      type:type
    })

    if (type == 0) {
      var shop_goods = wx.getStorageSync('shop_buy');
      
      if (shop_goods){
        this.setData({
          shop_goods: shop_goods
        })
      }
      var water = wx.getStorageSync('water_buy');
      if (water){
        this.setData({
          water: water
        })
      }
      
    }

    if (type == 1){
      var shop_goods = [];
      var shop_buy = wx.getStorageSync('shop_buy');
      shop_goods.push(shop_buy);
      console.log(shop_goods)
      this.setData({
        shop_goods: shop_goods
      })
    }

    if (type == 2 ) {
      var water = [];
      var water_buy = wx.getStorageSync('water_buy');
      water.push(water_buy);
      console.log(water_buy)
      this.setData({
        water: water
      })
    }
    if (type == 3) {
      var dining_buy = wx.getStorageSync('dining_buy');
      var dining = dining_buy.val;
      var shopId = dining_buy.shop_id;
      var shopName = dining_buy.shopName;
      this.setData({
        dining: dining,
        shopName:shopName,
        shopId: shopId
      })
    }
  },
  onShow: function (options) {
    var default_address = wx.getStorageSync('default_address');
    if (default_address){
      this.setData({
        address : default_address
      })
    }
  },
  choose_address(){
    wx.navigateTo({
      url: '../address/address?type=1'
    })
  },
  //选择保险费开关
  switch1Change(e){
    console.log(e)
    let insurance = e.detail.value == true ? 1 : 0;
    console.log(insurance)
    this.setData({
      insurance:insurance
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
  // 提交订单
  submitOrders(){
    var schoolId=this.data.schoolId;
    var userId = this.data.userId;
    var type = this.data.type;
    var that = this;
    var address = this.data.address;
    if (!address){
      wx.showToast({
        title: '请添加收货地址',
        icon:'none'
      })
      return
    }
    console.log(address)
    var orderRemarks = this.data.orderRemarks;
    if (type == 0) {
      var water = this.data.water;
      var shop_goods = this.data.shop_goods;
      console.log(shop_goods)
      var goods = [];
      var len = water.length;
      var len2 = shop_goods.length;
      for (var i = 0; i < len; i++) {
        var num = water[i].num;
        var goods_item = {
          shopId: water[i].shopId,
          goodsList: [{
            goodsId: water[i].goods_id,
            goodsNum: 1
          }]
        };
        for (var j = 0; j < num; j++) {
          goods.push(goods_item);
        }
      }
      var goods_item2 = {
        shopId: 1,
        goodsList: []
      };
      for(var i=0;i<len2;i++){
        goods_item2.goodsList.push({
          goodsId: shop_goods[i].goods_id,
          goodsNum: shop_goods[i].num
        })
      }
      goods.push(goods_item2);
      console.log(goods)
      goods = JSON.stringify(goods);
      wx.request({
        url: app.globalData.api + 'payment/unifiedorder',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: userId,
          schoolId: schoolId,
          userName: address.userName,
          userPhone: address.userPhone,
          schoolName: that.data.schoolName,
          buildName: address.buildName,
          floorNum: address.floorNum,
          address: address.address,
          goods: goods,
          orderRemarks: orderRemarks
        },
        success(res) {
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            var orderIds = res.data.data;
            orderIds = JSON.stringify(orderIds);
            that.payment(orderIds);
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
    if (type == 1) {
      var shopId = 1;
      var shop_goods = this.data.shop_goods;
      var goods = [];
      var goods_item = {shopId:1,goodsList:''};
      var list =[{
        goodsId: shop_goods[0].goods_id,
        goodsNum: shop_goods[0].num
      }]
      goods_item.goodsList = list;
      console.log(goods_item)
      goods.push(goods_item);
      goods = JSON.stringify(goods);
      console.log(goods)
      wx.request({
        url: app.globalData.api + 'payment/unifiedorder',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: userId,
          schoolId: schoolId,
          userName: address.userName,
          userPhone: address.userPhone,
          schoolName: that.data.schoolName,
          buildName: address.buildName,
          floorNum: address.floorNum,
          address: address.address,
          goods: goods,
          orderRemarks: orderRemarks
        },
        success(res) {
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            var orderIds = res.data.data;
            orderIds = JSON.stringify(orderIds);
            that.payment(orderIds);
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
    if (type == 2) {
      var water = this.data.water;
      console.log(water)
      var goods = [];
      var len = water.length;
      for(var i=0;i<len;i++){
        var num = water[i].num;
        var goods_item = {
          shopId: water[i].shopId, 
          goodsList: [{
            goodsId: water[i].goods_id,
            goodsNum: 1
          }] 
        };
        for(var j=0;j<num;j++){
          goods.push(goods_item)
        }
      }
      console.log(goods)
      goods = JSON.stringify(goods);
      console.log(goods)
      wx.request({
        url: app.globalData.api + 'payment/unifiedorder',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: userId,
          schoolId: schoolId,
          userName: address.userName,
          userPhone: address.userPhone,
          schoolName: that.data.schoolName,
          buildName: address.buildName,
          floorNum: address.floorNum,
          address: address.address,
          goods: goods,
          orderRemarks: orderRemarks
        },
        success(res) {
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            var orderIds = res.data.data;
            orderIds = JSON.stringify(orderIds);
            that.payment(orderIds);
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
    if(type==3){
        //goods.push(goods_item);

      var shopId = this.data.shopId;
      var dining = this.data.dining;
      var goods = [];
      var goods_item = {
        shopId: shopId,
        goodsList: ''
      };
      console.log(dining)
      var dining2 = [];
      var len = dining.length;
      for(var i=0;i<len;i++){
        dining2.push({
          goodsId: dining[i].id,
          goodsNum: dining[i].num
        })
      }
      goods_item.goodsList = dining2;
      goods.push(goods_item);
      console.log(goods)
      goods = JSON.stringify(goods);
      console.log(goods)
      wx.request({
        url: app.globalData.api + 'payment/unifiedorder',
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          userId: userId,
          schoolId: schoolId,
          userName: address.userName,
          userPhone: address.userPhone,
          schoolName: that.data.schoolName,
          buildName: address.buildName,
          floorNum: address.floorNum,
          address: address.address,
          goods: goods,
          orderRemarks: orderRemarks
        },
        success(res) {
          console.log(res)
          var status = res.data.status;
          if (status == 1) {
            var orderIds = res.data.data;
            orderIds = JSON.stringify(orderIds);
            that.payment(orderIds);
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
  payment(orderIds) {
    wx.request({
      url: app.globalData.api + 'payment/unifiedpay',
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: this.data.userId,
        orderIds: orderIds,
        fristOrder: ''
      },
      success(res) {
        console.log(res);
        setTimeout(function(){
          wx.switchTab({
            url: '../orderList/orderList'
          })
        },1000)
        
      }
    })
  }
})