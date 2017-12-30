// pages/newsdetail/newsdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    attachment: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '获取中',
      mask: true
    })
    var that = this;
    wx.request({
      url: "https://sduonline.cn/isdu/news/api/",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        site: options.site,
        page: 1,
        id: options.id,
        content: null,
      },
      success: function (res) {
        wx.hideLoading()
        wx.setNavigationBarTitle({
          title: res.data['title'],
        })
        var render = res.data;
        render.hidden = false;
        that.setData(render);
      },
      fail: function (res) {
        if (res.errMsg.indexOf('timeout') != 0)
          wx.showToast({
            title: '获取失败',
            image: '../../utils/pic/error.png'
          })
      }
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

  /**
   * 下载文件
   */
  saveDoc: function (e) {
    var id = e.currentTarget.id;
    var attachment = this.data.attachment[id];//当前点击的附件
    wx.downloadFile({
      url: attachment['url'],
      success: function (res) {
        console.log(res.tempFilePath)
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '文件已保存',
              duration:3000
            })
            console.log(res)
          },
          fail: function () {
            wx.showToast({
              title: '保存失败',
              image: '../../utils/pic/error.png'
            })
          }
        })
      }
    })
  },

  /**
   * 打开文件
   */
  openDoc: function (e) {
    var id = e.currentTarget.id;
    var attachment = this.data.attachment[id];//当前点击的附件
    wx.showLoading({
      title: '正在打开...',
    })
    wx.downloadFile({
      url: attachment['url'],
      success: function (res) {
        console.log(res.tempFilePath)
        wx.openDocument({
          filePath: res.tempFilePath,
          success: function () {
            wx.hideLoading()
          },
          fail: function () {
            wx.showToast({
              title: '文件格式不支持',
              image: '../../utils/pic/error.png'
            })
          }
        })
      }
    })
  },

  /**
   * 点击附件
   */
  attaClick:function(e){
    var that=this;
    wx.showActionSheet({
      itemList: ["打开","下载"],
      success:function(res){
        var index=res.tapIndex;//选择的方式
        switch(index){
          case 0:
            that.openDoc(e);
            break;
          case 1:
            that.saveDoc(e);
        }
      }
    })
  }
})