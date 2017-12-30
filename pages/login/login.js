// pages/login/login.js
var app = getApp();
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    formFocus: [true, false, false],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page_from=options.from;//跳转来源
    if(page_from=='logout')
      wx.showToast({
        title: '已退出',
      })
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
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
   * 获取表单内容并提交
   */
  login: function (e) {
    var value = e.detail.value;//获取表单内容
    if (!value.stuID || !value.pass)//如果学号或密码为空，弹出提示框
      wx.showModal({
        title: '提示',
        content: '请输入学号和教务密码',
        showCancel: false,
      })
    else {
      //获取本地缓存中的id和token
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      var obj = wx.getStorageSync('obj');
      wx.request({
        url: baseURL + '/academic/bind',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-Authorization': obj.token
        },
        data: {
          id: obj.id,
          stuNo: value.stuID,
          password: value.pass
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data['code'] >= 0) {
            console.log("绑定教务成功！");
            app.globalData.academic='YES';//设定为绑定了教务
            wx.reLaunch({
              url: '/pages/homepage/homepage',
            })
          }
          else {
            wx.showModal({
              title: '错误',
              content: '请输入正确的学号和查询密码',
              showCancel: false,
            })
          }
        }
      })
    }
  },

  /**
   * 改变表单焦点
   */
  next: function () {
    var change = new Object();
    var key1 = "formFocus[" + this.data.index + "]"
    change[key1] = false
    this.data.index++;
    var key2 = "formFocus[" + this.data.index + "]"
    change[key2] = true
    this.setData(change)
  }
})