// pages/exam/exam.js
var app=getApp();
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exams: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.academic == 'NO') {
      wx.redirectTo({
        url: '/pages/login/login'		 
        })
    }
    else if (app.globalData.academic == 'YES') {
      wx.showLoading({
        title: '获取中',
      })
      var that = this;
      //获取本地缓存中的id和token
      var obj = wx.getStorageSync('obj');
      wx.request({
        url: baseURL + '/academic/schedule/' + obj.id,
        method: 'GET',
        header: {
          'X-Authorization': obj.token
        },
        success: function (res) {
          wx.hideLoading()
          if (res.data['code'] >= 0) {
            console.log("获取考试安排成功！")
            that.setData({
              exams: res.data['obj']['期末考试']
            })
            if (!res.data['obj']['期末考试'])
              wx.showModal({
                title: '提示',
                content: '现在暂无考试',
                showCancel: false,
                success: function (res) {
                  if (res.confirm)
                    wx.navigateBack({
                      delta: 1
                    })
                }
              })
          }
        }
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

  }
})