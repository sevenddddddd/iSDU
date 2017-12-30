// pages/news/news.js
var urlTab = ['sduOnline', 'underGraduate', 'sduYouth', 'sduView']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: '0',
    news: [],
    refresh: null//上一次刷新的request
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
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
          var change = new Object();
          var key = 'news[' + i + ']'
          change[key] = res.data;
          that.setData(change);
          if (i == 0)
            wx.hideLoading()
        },
        fail: function () {
          console.log("网络错误")
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var refresh = this.data.refresh;
    refresh && refresh.abort();//中断上一次刷新任务
    var that = this;
    var currentTab = this.data.currentTab;//当前site
    this.data.refresh = wx.request({
      url: "https://sduonline.cn/isdu/news/api/",
      header: {
        'content-type': 'application/json'
      },
      data: {
        site: urlTab[currentTab],
        page: 1
      },
      success: function (res) {
        wx.showToast({
          title: '刷新成功',
        })
        var change = new Object();
        var key = 'news[' + currentTab + ']'
        change[key] = res.data;
        that.setData(change);
        wx.stopPullDownRefresh();
      },
      fail: function () {
        console.log("网络错误")
      }
    })
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
  /**页面事件 */
  /**
   * 切换tab
   */
  changeTab: function (e) {
    var id = e.currentTarget.id;
    if (this.data.currentTab != id) {
      this.setData({
        currentTab: id
      })
    }
  },

  /**
   * 进入资讯详情页
   */
  getDetail: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/newsdetail/newsdetail?site=' + urlTab[this.data.currentTab] + '&id=' + id,
    })
  }
})