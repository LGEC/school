// pages/meal/shop/shop.js
var app = getApp();
Page({
  data: {
    show:0,
    goodslist:[],
    total_price:0,
    num:0,
    shop_id:0,
    imgUrl: app.globalData.baseUrl,
    shopName: '',
    shopAddress: ''
  },
  onLoad: function (options) {
    var schoolId = wx.getStorageSync('schoolId');
    var userId = wx.getStorageSync('userId');
    this.setData({
      schoolId: schoolId,
      userId: userId
    })
    console.log(options)
    var shop_id = options.shop_id;
    this.setData({
      shop_id: shop_id
    })
    var that = this;
    wx.request({
      url: app.globalData.api + 'shop/shopInfo',
      method: 'POST',
      header:{
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: {
        shopId: 1,
      },
      success(res) {
        var shopName = res.data.shopName;
        var goodslist = res.data.goodslist;
        var shopAddress = res.data.shopAddress;
        that.setData({
          goodslist: goodslist,
          shopName: shopName,
          shopAddress: shopAddress
        })
        var dining = wx.getStorageSync('dining');
        var test = true;
        if (dining) {
          var len = dining.length;
          for (var i = 0; i < len; i++) {
            if (dining[i].shop_id == shop_id) {
              var d_item = dining[i].val;
              that.setData({
                goodslist: d_item
              })
              test = false;
              len = i;
            }
          }
        }
        if (test) {
          that.setData({
            goodslist: goodslist
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
          icon: 'none'
        });
      }
    })


    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowWidth;
        var height = res.windowHeight;
        var new_height = height - width/750*431;
        that.setData({
          height: new_height
        })
      }
    }) 
    
    var dining_shop_cart = wx.getStorageSync("dining_shop_cart");
    
    if (dining_shop_cart) {
      var len = dining_shop_cart.length;
      for (var i = 0; i < len; i++) {
        if (dining_shop_cart[i].shop_id == shop_id) {
          var dining_cart_item = dining_shop_cart[i].val;
          if (dining_cart_item) {
            var len2 = dining_cart_item.length;
            var total_price = 0;
            var num = 0;
            for (var j = 0; j < len2; j++) {
              var num2 = parseInt(dining_cart_item[j].num);
              total_price += parseFloat(dining_cart_item[j].price_yh) * num2;
              num += num2;
            }
            total_price = total_price.toFixed(2);
            this.setData({
              num: num,
              total_price: total_price
            })
          }
          len = i;
        }
      }
    }

    
  },
  // 左侧菜单点击
  active:function(e){
    var index = e.currentTarget.dataset.index;
    this.setData({
      show:index
    })
  },
  // 增加商品数量
  add(e){
    var index = e.currentTarget.dataset.index;
    var show = this.data.show;
    var goodslist = this.data.goodslist;
    console.log(goodslist)
    console.log(show)
    console.log(index)
    var goods_info = goodslist[show].list[index];
    if (goods_info.num){
      var num = goods_info.num;
    }else{
      var num = 0;
    }
    
    var id = goods_info.id;
    var price = goods_info.price_yh;
    var detail = goods_info.intro;
    var name = goods_info.name;
    var img = app.globalData.baseUrl + goods_info.photo_x;
    num++;
    goodslist[show].list[index].num = num;
    console.log(goodslist)
    var shop_id = this.data.shop_id;
    var dining_item = { shop_id: shop_id, val: goodslist};
    var dining = wx.getStorageSync('dining');
    if (dining){
      var test_dining = true;
      var len = dining.length;
      for(var i=0;i<len;i++){
        if (dining[i].shop_id == shop_id){
          dining.splice(i, 1, dining_item);
          test_dining = false;
          len = i;
        }
      }
      if (test_dining){
        dining.push(dining_item);
      }
    }else{
      dining = [];
      dining.push(dining_item);
    }
    wx.setStorageSync('dining', dining);
    this.setData({
      goodslist: goodslist
    })
    this.shopcar(id, name, price, 1, detail, img);
  },
  // 减少商品数量
  sub(e) {
    var index = e.currentTarget.dataset.index;
    var show = this.data.show;
    var goodslist = this.data.goodslist;
    var goods_info = goodslist[show].list[index];
    var num = goods_info.num;
    var id = goods_info.id;
    var price = goods_info.price_yh;
    var detail = goods_info.intro;
    var name = goods_info.name;
    var img = app.globalData.baseUrl+goods_info.photo_x;
    num--;
    goodslist[show].list[index].num = num;
    var shop_id = this.data.shop_id;
    var dining_item = { shop_id: shop_id, val: goodslist };
    var dining = wx.getStorageSync('dining');
    if (dining) {
      var len = dining.length;
      for (var i = 0; i < len; i++) {
        if (dining[i].shop_id == shop_id) {
          dining.splice(i, 1, dining_item);
        }
      }
    } else {
      dining = [];
      dining.push(dining_item);
    }
    wx.setStorageSync('dining', dining);
    this.setData({
      goodslist: goodslist
    })
    this.shopcar(id, name, price, -1, detail, img);
  },
  // 计算总价
  shopcar(id2, name, price, num2, detail, img){
    var total_price = this.data.total_price;
    total_price = parseFloat(total_price) + parseFloat(price) * num2;
    total_price = total_price.toFixed(2);
    this.setData({
      total_price: total_price
    })
    var shop_id = this.data.shop_id;
    var dining_shop_cart = wx.getStorageSync('dining_shop_cart');
    var config = 0;
    var item_val = {
      'id': id2,
      'name': name,
      'price_yh': price,
      'num': 1,
      "detail": detail,
      "img": img
    };
    var shopName = this.data.shopName;
    if (dining_shop_cart) {
      var len = dining_shop_cart.length;
      if(len>0){
        for (var i = 0; i < len; i++) {
          if (dining_shop_cart[i].shop_id == shop_id) {
            var dining_cart_item = dining_shop_cart[i].val;
            if (dining_cart_item) {
              var len2 = dining_cart_item.length;
              for (var j = 0; j < len2; j++) {
                if (dining_cart_item[j].id == id2) {
                  dining_shop_cart[i].val[j].num = parseInt(dining_cart_item[j].num) + num2;
                  if (dining_shop_cart[i].val[j].num <= 0) {
                    dining_shop_cart[i].val.splice(j, 1);
                    len2--;
                  }
                  config = 1;
                  // console.log(dining_shop_cart)
                }
              }
            }
            if (config == 0) {
              dining_shop_cart[i].val.push(item_val);
              config = 1;
            }
            len = i;
          }
        }
        if (config==0){
          var new_item = { shop_id: shop_id, shopName: shopName, val: [] };
          new_item.val.push(item_val);
          dining_shop_cart.push(new_item);
          config = 1;
        }
      }
    }
    if (config == 0) {
      dining_shop_cart = [];
      var new_item = { shop_id: shop_id, shopName: shopName, val: [] };
      new_item.val.push(item_val);
      dining_shop_cart.push(new_item)
    }
    

    var num = this.data.num;
    num = num + num2;
    this.setData({
      num:num
    })

    
    wx.setStorageSync("dining_shop_cart", dining_shop_cart);
  },
  // 去结算
  to_pay(){
    var num = this.data.num;
    if(num>0){
      var shop_id = this.data.shop_id;
      var dining_shop_cart = wx.getStorageSync("dining_shop_cart");
      var len = dining_shop_cart.length;
      for(var i=0;i<len;i++){
        if (dining_shop_cart[i].shop_id == shop_id){
          var dining_buy = dining_shop_cart[i];
          wx.setStorageSync('dining_buy', dining_buy);
        }
      }
      wx.navigateTo({
        url: '../../submitOrder/submitOrder?type=3'
      })
    }
  }
})