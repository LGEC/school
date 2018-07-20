// pages/orderList/orderList.js
const app = getApp();
Page({

  data: {
    datas: [], //订单内容
    listsIndex: 0, //导航下标
    lists: ['now', 'over'], //点击两个导航向后台传的数据
    totalPage: '', //总页数
    currPage: 1, //当前页数
    total: '', //进行中订单数量
    total1: '', //已完成订单数量
    baseUrl: app.globalData.baseUrl, //图片路径
  },
  onShow: function() {
    this.getList();
    this.getList1();
  },
  //订单进行中的接口数据
  getList() {
    wx.showLoading({
      title: '加载中',
    });
    //用户订单接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        mark: this.data.lists[this.data.listsIndex],
        page: this.data.currPage,
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        this.setData({
          datas: this.data.datas.concat(res.data.root),
          totalPage: res.data.totalPage,
          currPage: res.data.currPage,
        });
        if (this.data.listsIndex == 0) {
          this.setData({
            total: res.data.total
          });
        } else {
          this.setData({
            total1: res.data.total
          });
        }
        console.log(this.data.datas);
      }
    });
  },
  //进行中订单数量接口
  getList1() {
    wx.showLoading({
      title: '加载中',
    });
    //用户订单接口
    wx.request({
      method: 'POST',
      url: `${app.globalData.api}order/orderList`,
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: {
        userId: app.globalData.userId,
        mark: 'over'
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        this.setData({
          total1: res.data.total
        });
        console.log(this.data.total1);
      }
    });
  },
  //订单导航
  bindtapDao(e) {
    console.log(e)
    this.setData({
      listsIndex: e.currentTarget.dataset.index,
      datas: [], //订单内容
      totalPage: '', //总页数
      currPage: 1, //当前页数
    });
    console.log(this.data.listsIndex);
    this.getList();
  },
  //点击超市商品跳转超市
  bindtapTiao(e) {
    let shopType = e.currentTarget.dataset.shoptype;
    console.log(shopType);
    if (shopType == 1) {
      wx.navigateTo({
        url: '../catering/catering'
      });
    } else if (shopType == 2) {
      wx.navigateTo({
        url: '../water/water'
      });
    } else if (shopType == 3) {
      wx.navigateTo({
        url: '../meal/index/index'
      });
    } else {
      wx.navigateTo({
        url: '../courier/courier'
      });
    }
  },
  //点击商品跳转商品详情页
  bindtapShop(e) {
    let shop = e.currentTarget.dataset.shop;
    console.log(shop);
    wx.navigateTo({
      url: `orderDetails/orderDetails?shop=${shop}`
    });
  },
  //取消和删除订单
  bindtapQuxiao(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    let orderStatus = e.currentTarget.dataset.orderstatus;
    console.log(goodsId);
    wx.showModal({
      title: '温馨提示',
      content: orderStatus == 0 ? '您是否要取消该订单' : '您是否要删除该订单',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '加载中',
          });
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}order/orderDel`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              orderId: goodsId,
              userId: app.globalData.userId
            },
            success: res => {
              console.log(res);
              wx.hideLoading();
              if (res.data.status == 1) {
                wx.showToast({
                  title: orderStatus == 0 ? '订单取消成功' : '订单删除成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(() => {
                  this.setData({
                    datas: [], //订单内容
                    totalPage: '', //总页数
                    currPage: 1, //当前页数
                  });
                  this.getList();
                  this.getList1();
                }, 500);
              } else {
                wx.showToast({
                  title: orderStatus == 0 ? '订单取消失败' : '订单删除失败',
                  image: '../../image/warning.png',
                  duration: 1500
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    });
  },
  //继续付款
  bindtapFukuan(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
  },
  //订单退款
  bindtapTuikuan(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    wx.navigateTo({
      url: `orderRefund/orderRefund?goodsId=${goodsId}`
    });
  },
  //确认收货
  bindtapQueren(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    console.log(goodsId);
    wx.showModal({
      title: '温馨提示',
      content: '您是否确认收货该商品',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '收货中',
          });
          wx.request({
            method: 'POST',
            url: `${app.globalData.api}order/orderConf`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            data: {
              orderId: goodsId,
              userId: app.globalData.userId
            },
            success: res => {
              console.log(res);
              wx.hideLoading();
              if (res.data.status == 1) {
                wx.showToast({
                  title: '确认收货成功',
                  icon: 'success',
                  duration: 1500
                });
                setTimeout(() => {
                  this.setData({
                    datas: [], //订单内容
                    totalPage: '', //总页数
                    currPage: 1, //当前页数
                  });
                  this.getList();
                  this.getList1();
                }, 500);
              } else {
                wx.showToast({
                  title: '确认收货失败',
                  image: '../../image/warning.png',
                  duration: 1500
                });
              }
            }
          });
        } else if (res.cancel) {
          console.log("用户点击取消")
        }
      }
    });
  },
  //订单评价
  bindtapPingjia(e) {
    let goodsId = e.currentTarget.dataset.goodsid;
    console.log(goodsId);
    wx.navigateTo({
      url: `../evaluate/evaluate?goodsId=${goodsId}`
    });
  },
  //上拉加载
  onReachBottom: function() {
    if (this.data.currPage < this.data.totalPage) {
      this.setData({
        currPage: this.data.currPage * 1 + 1
      });
      console.log(this.data.currPage);
      this.getList();
    } else {
      console.log("已经是最后一页");
    }
  },
});