// pages/person/person.js
//获取应用实例
var app = getApp();
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    stuInfo: {},
    cardNo: undefined,
    logoutAction: "退出登录"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取微信头像
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
    if (app.globalData.academic == 'YES') {
      //获取本地缓存中的id和token
      var obj = wx.getStorageSync('obj');
      //获取校园卡号
      var cardNo = wx.getStorageSync('cardNo');//获取本地缓存中的cardNo
      if (cardNo) {//缓存中有cardNo
        this.setData({
          cardNo: cardNo
        })
      }
      else {//缓存中没有cardNo
        wx.request({
          url: baseURL + '/lib/info/' + obj.id,
          method: 'GET',
          header: {
            'X-Authorization': obj.token
          },
          success: function (res) {
            if (res.data['code'] >= 0) {
              console.log("获取校园卡号成功！")
              var cardNo = res.data['obj']['cardNo'];
              that.setData({
                cardNo: res.data['obj']['cardNo']
              })
              wx.setStorage({
                key: 'cardNo',
                data: cardNo,
                success: function () {
                  console.log('校园卡号缓存成功')
                }
              })
            }
            else if (res.data['code'] == -1) {
              console.log(res.data['msg'])
              that.setData({
                cardNo: '未绑定'
              })
            }
          }
        })
      };
      //获取学生信息
      var stuInfo = wx.getStorageSync('stuInfo');//获取本地缓存中的stuInfo
      if (stuInfo) {//缓存中有stuInfo
        this.setData({
          stuInfo: stuInfo
        })
      }
      else {//缓存中没有stuInfo
        wx.request({
          url: baseURL + '/academic/info/' + obj.id,
          method: 'GET',
          header: {
            'X-Authorization': obj.token
          },
          success: function (res) {
            if (res.data['code'] >= 0) {
              console.log("获取个人信息成功！")
              var stuInfo = res.data['obj'][0];
              that.setData({
                stuInfo: stuInfo
              })
              wx.setStorage({
                key: 'stuInfo',
                data: stuInfo,
                success: function () {
                  console.log('个人信息缓存成功')
                }
              })
            }
          }
        })
      }
    }
    else if (app.globalData.academic == 'NO') {
      that.setData({
        'stuInfo.name': "游客",
        logoutAction: "登录"
      })
    }
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

  logout: function () {
    if (app.globalData.academic == 'YES') {
      wx.showLoading({
        title: '正在退出...',
      })
      //获取本地缓存中的id和token
      var obj = wx.getStorageSync('obj');
      wx.request({
        url: baseURL + "/info/delete",
        method: 'DELETE',
        header: {
          'X-Authorization': obj.token
        },
        success: function (res) {
          if (res.data['code'] >= 0) {
            wx.removeStorageSync('classinfo');//清除classinfo缓存
            wx.removeStorageSync('stuInfo');//清除stuInfo缓存
            wx.removeStorageSync('cardNo');//清除cardNo缓存
            wx.redirectTo({
              url: '/pages/login/login?from=logout',
            })
          }
        }

      })
    }
    else if (app.globalData.academic=='NO') {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  }
})