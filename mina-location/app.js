//app.js

var util = require('./utils/util.js');

App({
  onLaunch: function () {
    // this.getLocationData();
    util.login()
  },
  
  getLocationData: function () {
    wx.getLocation({
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        var locationDic = { 'latitude': latitude, 'longitude': longitude };
        wx.setStorage({
          key: 'map_Location',
          data: locationDic,
        })
      }
    })
  },

  globalData: {
    // host: "https://www.woainankai.com",
    host: "http://self.tools",
    userInfo: null,
    userType: 0,
    hasUserInfo: false,
    isSeeker: true,
    sessionId: null
  }
})