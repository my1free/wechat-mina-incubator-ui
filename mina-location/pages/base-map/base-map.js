// pages/base-map/base-map.js

var util = require('../../utils/util.js');

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    location: {
      "lng":"116.39739",
      "lat":"39.90886"
    },
    markers: [],
    keywords: "",
    tips: [],
    tipsHidden: true,
    currIdx: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("[baseMap] options=", options)
    var title = options.title
    var address = options.address
    var lng = options.lng
    var lat = options.lat
    if(lng != '' && lng != undefined && lat != '' && lat != undefined){
      this.setInitLocation(title, address, lng, lat)
    }else{
      // this.getCurrentLocation()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getCurrentLocation: function() {
    var that = this;
    wx.getLocation({
      success: function(res) {
        console.log("[getCurrentLocation] location=", res)
        var location = {}
        location.lat = res.latitude
        location.lng = res.longitude
        that.setData({
          location: location,
          markers: [{
            latitude: location.lat,
            longitude: location.lng,
            iconPath: 'http://img.tianxiahuo.cn/public/NetFile/20170713/901268273f91f5774ea87e6ae336c251.png'
          }]
        })
        // that.configMap();
      },
    })
  },

  bindSearchTap: function(e) {
    console.log(e.detail.value)
    this.setData({
      keywords: e.detail.value
    })
  },

  focusSearch: function(e){
    if(this.data.tips.length > 1){
      this.setData({
        tipsHidden: false
      })
    }
  },

  clickSearch: function(e) {
    var that = this;
    var keywords = that.data.keywords;
    console.log("keywords=", keywords)
    if (keywords == "" || keywords == null) {
      wx.showModal({
        title: '请输入搜索内容',
        confirmColor: '#e75858',
        showCancel: false,
      })
      return;
    }
    this.setData({
      tipsHidden: true,
      currIdx: null,
    })
    var qqmapsdk = new QQMapWX({
      key: 'GV7BZ-RWP3W-Y52RR-RPYDN-6FWLZ-QXFQT'
    });
    qqmapsdk.getSuggestion({
      keyword: keywords,
      success: function(res) {
        console.log('sucess', res);
      },
      fail: function(res) {
        console.log('fail', res);
      },
      complete: function(res) {
        console.log('complete', res);
        that.setData({
          tips: res.data
        });
        if (that.data.tips == []) {
          wx.showModal({
            title: '没有找到您想要的结果',
            confirmColor: "#E75858",
            showCancel: false,
          })
        }
      }
    })
  },

  selectTip: function(e){
    this.setData({
      tipsHidden: true
    })
    wx.hideKeyboard()
    var location = {}
    location.lat = e.currentTarget.dataset.lat;
    location.lng = e.currentTarget.dataset.lng;
    location.title = e.currentTarget.dataset.title;
    location.address = e.currentTarget.dataset.address
    var idx = e.currentTarget.dataset.idx;
    console.log("[baseMap] location=", location)
    this.setData({
      location: location,
      currIdx: idx,
      markers: [{
        latitude: location.lat,
        longitude: location.lng,
        iconPath: 'http://img.tianxiahuo.cn/public/NetFile/20170713/901268273f91f5774ea87e6ae336c251.png'
      }]
    })
  },

  cancel: function(){
    wx.navigateBack({
      delta: 1
    })
  },

  confirm: function(){
    var location = this.data.location
    if(location.title == '' || location.title == null || location.title == undefined){
      util.toast("请选取正确的位置", 1000)
      return
    }
    app.location = location
    var data = this.data.location
    data.sessionId = util.getSessionId()
    var url = app.globalData.host + "/location/add"
    util.httpPost(url, data, {
      do: function(data){
        console.log("confirm res")
      }
    })
    wx.navigateTo({
      url: '../add-address/add-address',
    })
  },

  setInitLocation: function(title, address, lng, lat){
    var location = {}
    location.title = title
    location.address = address
    location.lng = lng
    location.lat = lat
    var tips = []
    tips.push(location)
    this.setData({
      location: location,
      tips: tips,
      currIdx: 0,
      markers: [{
        title: location.title,
        latitude: location.lat,
        longitude: location.lng,
        callout: {
          content: location.address
        },
        iconPath: 'http://img.tianxiahuo.cn/public/NetFile/20170713/901268273f91f5774ea87e6ae336c251.png'
      }]
    })
  }
})