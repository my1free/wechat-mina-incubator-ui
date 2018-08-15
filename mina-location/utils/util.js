const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const app = getApp()

// var host = "https://www.woainankai.com";
var host = "http://self.tools"

/**
 * 调用wx.login()，并从后端服务换取sessionId
 */
function login() {
  wx.login({
    success: res => {
      console.log("[wx login] login success. res.code is", res.code)
      //发送 res.code 到后台换取 openId, sessionKey, unionId
      var url = host + '/user/login'
      var data = { "code": res.code }
      httpPost(url, data, {
        do: function (data) {
          //重新获取sessionId
          setSessionId(data)
        }
      })
    }
  })
}

/**
 * 封装wx.request请求，可以在request前或者后做一些额外事情，如登录失效后，重新获取凭证
 * 此方法只适用于http get method
 * @param url: 带有参数的请求url
 * @param callback: 获得结果以后的后续处理对象
 *     1) page: 如果需要setData，则需要对应
 *     1）do(data): 请求成功后的处理函数。
 *     2）clear(): 如果需要在调用错误后做后续处理，必须实现clear()方法
 * 如：{
 *    page: jobPage,
 *    do: function(data){...},
 *    clear: function(){...}
 * }
 */
function httpGet(url, callback) {
  wx.request({
    url: url,
    method: "GET",
    success: function (res) {
      var result = res.data;
      if (result.code == 0) {
        if (callback.do) {
          callback.do(result.data)
        }
      } else if (result.code == 401) {
        toast("登录已过期，请重新尝试", 1000)
        //登录失效，需要重新登录以获取凭证
        login()
      } else {
        requestFail(result, callback)
      }
    },
    fail: function (res) {
      requestFail(res, callback)
    }
  })
}

/**
 * 同httpGet(url)
 * 此方法只适用于http post method
 * @param url: url
 * @param data: 请求数据
 * @param callback: 获得结果以后的后续处理对象，必须有do(data)方法。如果需要setData，必须也得有page成员
 * 如：{
 *    page: jobPage,
 *    do: function(data){...}
 * }
 */
function httpPost(url, data, callback) {
  wx.request({
    url: url,
    data: data,
    method: "GET",
    success: function (res) {
      var result = res.data;
      if (result.code == 0) {
        if (callback.do) {
          callback.do(result.data)
        }
      } else if (result.code == 401) {
        toast("登录已过期，请重新尝试", 1000)
        //登录失效，需要重新登录以获取凭证
        login()
      } else {
        requestFail(result, callback)
      }
    },
    fail: function (res) {
      requestFail(res, callback)
    }
  })
}

/**
 * http请求失败后的处理
 * @param result: 请求返回结果
 * @param callback: callback对象
 */
function requestFail(result, callback) {
  console.log("[httpRequest] request fail: ", result)
  //请求失败
  if (isNotNullAndUndefinded(result.code)) {
    //有信息的错误
    toast(result.msg, null)
  } else if (isNotNullAndUndefinded(result.status) && result.status != 200) {
    //http请求错误
    toast(result.error, null)
  } else {
    toast("请求错误", null)
  }
  //如果callback有clear方法，则进行清理工作
  if (callback.clear) {
    callback.clear()
  }
}

/**
 * 检测value的有效性
 */
function isNotNullAndUndefinded(value) {
  return value != null && value != undefined
}

//job页导航栏
// function jobListNavi(page){
//   var cityArray = ["全国"]
//   var cityId = [0]
//   var cityOption = {}
//   var categoryList = [{ "id": "c0", "name": "不限"}]
//   wx.request({
//     url: 'http://localhost:8080/integrated/navi',
//     success: function (res) {
//       var data = res.data
//       if (data.code == 0) {
//         data.data.cities.forEach(function(e, i){
//           cityArray.push(e.name)
//           cityId.push(e.id)
//         })
//         data.data.categories.forEach(function(e, i){
//           //需要将int id转换成字符串
//           var newCategory = {}
//           newCategory.id = "c" + e.id
//           newCategory.name = e.name
//           categoryList.push(newCategory)
//         })
//         cityOption.ids = cityId
//         cityOption.options = cityArray
//         console.log("cityOption is:", cityOption)
//         console.log("categoryList is:", categoryList)
//         page.setData({
//           cityOption: cityOption,
//           categoryList: categoryList
//         })
//       }
//     },
//     fail: function (res) {
//       console.log("navi error: ", res)
//       cityOption.ids = cityId
//       cityOption.options = cityArray
//       console.log("cityOption is:", cityOption)
//       page.setData({
//         cityOption: cityOption,
//         categoryList: categoryList
//       })
//     }
//   })
// }

/**
 * 展示弹窗提示
 */
function toast(content, duration) {
  if (duration == null) {
    duration = 2000
  }
  wx.showToast({
    title: content,
    duration: duration,
    icon: 'none'
  })
}

// function checkSession(){
//   var sessionId = getSessionId()
//   wx.request({
//     url: 'http://localhost:8080/user/session?sessionId=' + sessionId,
//     success: function(e){
//       var data = e.data;
//       if(data.code == 0){
//         console.log("valid session")
//       }else if(data.code == 301){
//         console.log("invalid session")
//         session()
//       }else{
//         console.log("session check error")
//       }
//     },
//     fail: function(e){
//       console.log("session check error")
//     }
//   })
// }

// //登录
// function session() {
//   // wx.showLoading({
//   //   title: '登录中',
//   //   mask:true
//   // })
//   // 登录
//   wx.login({
//     success: res => {
//       console.log("login success. res.code is", res.code)
//       //发送 res.code 到后台换取 openId, sessionKey, unionId
//       wx.request({
//         url: 'http://localhost:8080/user/login',
//         data: {
//           code: res.code
//         },
//         success: function (e) {
//           var data = e.data;
//           if (data.code == 0) {
//             var sessionId = data.data
//             console.log("sessionId is", sessionId)
//             //存储sessionId
//             setSessionId(sessionId)
//             wx.hideLoading()
//           } else {
//             util.showErrTotast("系统故障，部分功能不可用")
//           }
//         },
//         fail: function (e) {
//           util.showErrTotast("系统故障，部分功能不可用")
//         }
//       })
//     }
//   })
// }


//更新或者创建用户
function updateUserInfo(sessionId, userInfo) {
  wx.request({
    url: 'http://localhost:8080/user/update?sessionId=' + sessionId
    + "&name=" + userInfo.nickName
    + "&avatar=" + userInfo.avatarUrl,
    success: function (e) {
      console.log("update or add user success", e)
    },
    fail: function (e) {
      console.log("update or add user failed", e)
    }
  })
}

function setSessionId(sessionId) {
  wx.setStorageSync("sessionId", sessionId)
}

function getUserType(sessionId) {
  var url = host + "/user/type/value?sessionId=" + sessionId
  httpGet(url, {
    do: function (res) {
      console.log("[getUserType] type=", res)
      wx.setStorageSync("userType", res)
    }
  })
}

/**
 * 是否是应聘者。
 * @return  true表示应聘者，false表示招聘者
 */
function isCandidate() {
  var userType = wx.getStorageSync("userType")
  return userType == 0
}

function changeUserType(page) {
  var userType = wx.getStorageSync("userType")
  var url = host + "/user/type/change"
  var data = {
    "sessionId": getSessionId(),
    "srcType": userType
  }
  httpPost(url, data, {
    do: function (res) {
      wx.setStorageSync("userType", res)
      page.setData({
        isCandidate: isCandidate()
      })
    }
  })
}

function getSessionId() {
  return wx.getStorageSync("sessionId")
}

module.exports = {
  formatTime: formatTime,
  login: login,
  // session: session,
  getSessionId: getSessionId,
  // checkSession: checkSession,
  httpGet: httpGet,
  httpPost: httpPost,
  toast: toast,
  isNotNullAndUndefinded: isNotNullAndUndefinded, //检查数据的有效性
  isCandidate: isCandidate,
  changeUserType: changeUserType
}