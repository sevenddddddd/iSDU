// pages/bus/bus.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buses: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title:'查询结果'+'('+options.start+'->'+options.end+')'
    })
    this.setData({ buses: app.getBuses() })
  }


})