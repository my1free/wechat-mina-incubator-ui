// pages/map-all/map-all.js

var util = require('../../utils/util.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAllLocation()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  getAllLocation: function(){
    var url = app.globalData.host + "/location/list"
    util.httpGet(url, {
      page: this,
      do: function(data){
        var markers = []
        data.forEach(function (location, i){
          markers.push({
            title: location.title,
            latitude: location.lat,
            longitude: location.lng,
            callout: {
              content: location.address
            },
            iconPath: 'http://img.tianxiahuo.cn/public/NetFile/20170713/901268273f91f5774ea87e6ae336c251.png'
          })
        })
        this.page.setData({
          markers: markers
        })
      }
    })
  }
})