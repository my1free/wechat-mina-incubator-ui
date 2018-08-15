// pages/add-address/add-address.js

var util = require('../../utils/util.js');

var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    location: null,
    myLocation: [
      {
        'title':'test1',
        'address':'address1',
        'lng':'116.39739',
        'lat':'39.90886'
      },
      {
        'title': 'test2',
        'address': 'address2',
        'lng': '116.08735',
        'lat': '39.93147'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var location = app.location;
    // console.log("[address] location=", location)
    if (location != undefined) {
      this.setData({
        location: location
      })
    }

    this.getUserLocation()
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

  choosePosition: function() {
    wx.navigateTo({
      url: '../base-map/base-map',
    })
  },

  getUserLocation: function(){
    var url = app.globalData.host + "/location/user/list?sessionId=" + util.getSessionId()
    util.httpGet(url, {
      page: this,
      do: function(data){
        this.page.setData({
          myLocation: data
        })
      }
    })
  },

  delLocation: function(e){
    var id = e.currentTarget.dataset.id
    console.log("delete id=", id)
    var url = app.globalData.host + "/location/remove"
    var data = {
      "sessionId": util.getSessionId(),
      "id": id
    }
    util.httpPost(url, data, {
      page: this,
      do: function(data){
        var myLocation = []
        this.page.data.myLocation.forEach(function (e, i) {
          if(e.id != id){
            myLocation.push(e)
          }
        })
        this.page.setData({
          myLocation: myLocation
        })
      }
    })
  },

  getAllPositions: function(){
    wx.navigateTo({
      url: '../map-all/map-all',
    })
  }
})