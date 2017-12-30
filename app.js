//app.js
var utils = require('utils/util.js')
var baseURL = "https://sduonline.cn/isdu-new";
App({
  onLaunch: function (option) {
    this.globalData.now = utils.getWeek_day();//获取今日第几周星期几
    this.globalData.classtime = utils.getClasstime();//当前是否夏令时
    var that = this;
    //小程序认证并判断是否绑定了教务
    wx.login({
      success: function (loginRes) {
        var code = loginRes.code;
        wx.getUserInfo({
          withCredentials: true,
          success: function (infoRes) {
            that.globalData.userInfo = infoRes.userInfo;
            wx.request({
              url: baseURL + '/oauth/mini/login',
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: code,
                signature: infoRes.signature,
                rawData: infoRes.rawData,
                encryptedData: infoRes.encryptedData,
                iv: infoRes.iv
              },
              success: function (res) {
                var data = res.data
                console.log(data)
                if (data['code'] >= 0) {
                  console.log("认证成功")
                  //存token和id到本地
                  wx.setStorageSync('obj', res.data['obj'])
                  //获取本地缓存中的id和token
                  var obj = wx.getStorageSync('obj');
                  //判断是否绑定了教务，若绑定了则正常进入首页；若未绑定则跳转到教务绑定页面
                  wx.request({
                    url: baseURL + '/info/bind/' + obj.id,
                    method: 'GET',
                    header: {
                      'X-Authorization': obj.token
                    },
                    success: function (res) {
                      if (res.data['code'] >= 0) {
                        console.log("获取绑定状态成功！");
                        that.globalData.bind=res.data['obj'];//存下绑定状态（用于card）
                        if (res.data['obj']['academic']) {
                          that.globalData.academic = 'YES';
                        }
                        else
                          that.globalData.academic = 'NO';
                      }
                    }
                  })
                }
                else {
                  wx.showToast({
                    title: '登录失败',
                    image: 'utils/pic/error.png',
                    duration: 3000
                  })
                  console.log("认证错误！")
                }
              }
            })
          }
        })
      }
    })
    var urlTab = ['sduOnline', 'underGraduate', 'sduYouth', 'sduView']
    for (let i = 0; i < 4; i++) {
      wx.request({
        url: "https://sduonline.cn/isdu/news/api/",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          site: urlTab[i],
          page: 1
        },
        success: function (res) {
          //获取资讯
          that.globalData.news[i] = res.data;
          if (i == 0)
            that.globalData.newsGot = true;
        },
        fail: function () {
          console.log("网络错误")
        }
      })
    }
  },
  //获取用户信息
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      wx.getUserInfo({
        success: function (res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },

  /**
   * 获取校车查询结果
   */
  getBuses: function () {
    return this.globalData.buses
  },

  /**
   * 存储校车查询结果
   */
  setBuses: function (buses) {
    this.globalData.buses = buses
  },

  /**
   * 获取自习室查询结果
   */
  getStudyrooms: function () {
    return this.globalData.studyrooms
  },

  /**
   * 存储自习室查询结果
   */
  setStudyrooms: function (studyrooms) {
    this.globalData.studyrooms = studyrooms
  },

  globalData: {
    classtime: false,//当前是否夏令时
    now: null,//当前周和星期{week:,day:}
    bind:{academic:'unknown',library:'unknown',card:'unknown'},//绑定状态（用于card）
    academic: 'unknown',//教务绑定状态{'YES':绑定了学生教务;'NO':未绑定}
    classinfo: null,//课程表
    news: [],//资讯
    newsGot: false,//资讯获取标志
    userInfo: null,//用户信息
    buses: [],//校车查询结果
    studyrooms: []//自习室查询结果
  }
})