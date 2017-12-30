// pages/librarylogin/librarylogin.js
var app = getApp();
var baseURL = "https://sduonline.cn/isdu-new";
//传入页面的数据：condition:['library'/'card']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condition: null,
    userInfo: {},
    formFocus: [true, false, false],
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.condition = options['condition'];//用于之后登陆成功跳转判断
    switch (this.data.condition) {
      case 'library':
        wx.setNavigationBarTitle({
          title: '图书馆-登录'
        })
        break;
      case 'card':
        wx.setNavigationBarTitle({
          title: '校园卡-登录'
        })
        break;
    }
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
    if (!value.cardNo || !value.pass)//如果学号或密码为空，弹出提示框
      wx.showModal({
        title: '提示',
        content: '请输入校园卡号和查询密码',
        showCancel: false,
      })
    else {
      wx.showLoading({
        title: '登录中',
        mask: true
      })
      //获取本地缓存中的id和token
      var obj = wx.getStorageSync('obj');
      var that = this;
      switch (this.data.condition) {
        case 'library':
          wx.request({
            url: baseURL + '/lib/bind',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'X-Authorization': obj.token
            },
            data: {
              id: obj.id,
              cardNo: value.cardNo,
              pass: value.pass
            },
            success: function (res) {
              wx.hideLoading()
              if (res.data['code'] == 0) {
                console.log("绑定图书馆成功！")
                wx.redirectTo({
                  url: '/pages/library/library',
                })
              }
              else if (res.data['code'] == 2) {
                wx.showModal({
                  title: '错误',
                  content: '请输入正确的校园卡号和查询密码',
                  showCancel: false,
                })
              }
              else {
                console.log(res.data)
              }
            }
          })
          break;
        case 'card':
          wx.request({
            url: baseURL + '/card/bind',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              'X-Authorization': obj.token
            },
            data: {
              cardNo: value.cardNo,
              password: value.pass
            },
            success: function (res) {
              wx.hideLoading()
              if (res.data['code'] == 0) {
                console.log("绑定校园卡成功！")
                app.globalData.bind['card']=true
                wx.redirectTo({
                  url: '/pages/card/card',
                })
              }
              else if (res.data['code'] == -1) {
                wx.showModal({
                  title: '错误',
                  content: '请输入正确的校园卡号和查询密码',
                  showCancel: false,
                })
              }
              else {
                console.log(res.data)
              }
            }
          })
          break;
      }
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