// pages/deposit/deposit.js
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: '0',
    disable: false,//自定义数额input是否可用
    focus: true//获取自定义输入input焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 获取radio-group的值
   */
  getAmount: function (event) {
    this.data.amount = event.detail["value"];
    if (this.data.amount == '0')
      this.setData({
        disable: false,
        focus: true
      })
    else
      this.setData({
        disable: true,
        focus: false
      })
  },

  /**
   * 获取用户自定义input的值
   */
  getUDamount: function (event) {
    this.data.amount = event.detail["value"]
  },

  /**
   * 重置按钮点击事件
   */
  deposit: function () {
    var amount = this.data.amount;
    if (amount == '0')
      wx.showModal({
        title: '提示',
        content: '请输入充值金额',
      })
    else if (amount > 300) {
      wx.showModal({
        title: '提示',
        content: '单次充值金额不能超过300',
      })
    }
    else {
      wx.showLoading({
        title: '充值中',
        mask: true
      })
      //获取本地缓存中的校园卡号和密码cardPass
      var cardPass = wx.getStorageSync('cardPass');
      var that = this;
      //获取本地缓存中的id和token
      var obj = wx.getStorageSync('obj');
      wx.request({
        url: baseURL + "/card/transfer",
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-Authorization': obj.token
        },
        data: {
          amount: amount
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data['code'] >= 0) {
            var system = wx.getSystemInfoSync()['system'];
            if (system.indexOf('iOS') != -1)
              wx.showModal({
                title: '成功',
                content: '充值成功',
              })
            else
              wx.showToast({
                title: '充值成功',
                icon: "success",
                duration: 3000
              })
          }
          else {
            wx.showModal({
              title: '失败',
              content: '校园卡交易系统已关闭，请明天再试'
            })
          }
        }
      })
    }
  }
})