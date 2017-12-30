// pages/card/card.js
var app = getApp()
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    figure: "--",
    transition: "--",
    suspend: false,
    freeze: false
  },

  /**
   * 获取校园卡信息并渲染
   */
  getCardinfo:function(){
    wx.showLoading({
      title: '获取中',
      mask: true
    })
    var that = this;
    //获取本地缓存中的id和token
    var obj = wx.getStorageSync('obj');
    wx.request({
      url: baseURL + "/card/info",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Authorization': obj.token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data['code'] >= 0) {
          var cardInfo = res.data['obj'];
          var figure = cardInfo[2].value;
          var suspend = (cardInfo[6].value.indexOf("正常") == -1);
          var freeze = (cardInfo[7].value.indexOf("正常") == -1);
          var transition = cardInfo[4].value;
          that.setData({
            figure: figure,
            transition: transition,
            suspend: suspend,
            freeze: freeze
          })
        }
        else if (res.data['obj']['msg'].indexOf('验证码不正确') != -1) {
          wx.showModal({
            title: '请重试',
            content: '服务器忙，点击重试',
            confirmText: "重试",
            success: function (res) {
              if (res.confirm) {
                that.getCardinfo();//重新获取校园卡信息
              }
            }
          })
        }
        else {
          wx.showModal({
            title: '获取信息失败',
            content: '可能是以下原因：服务器故障，请在‘我->问题反馈’中提交反馈'
          })
        }
      }
    })
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
    var cardBind = app.globalData.bind['card']//获取校园卡绑定状态
    if (!cardBind)//未绑定校园卡
      wx.redirectTo({
        url: '/pages/cardlogin/cardlogin?condition=card'
      })
    else {//绑定了校园卡
      this.getCardinfo();
    }
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

  }
})