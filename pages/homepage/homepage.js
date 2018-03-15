// pages/homepage/homepage.js
//获取应用实例
var app = getApp()
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classtime: false,
    todayclasses: [],//今日课程
    latestnews: {},//最新资讯
    time_order_summer: [null, '08:00-09:50', '10:10-12:00', '14:00-15:50', '16:00-17:50', '18:30-20:20'],//时刻表
    time_order_winter: [null, '08:00-09:50', '10:10-12:00', '13:30-15:20', '15:30-17:20', '18:30-20:20'],//时刻表
    classHint: '获取中...',//今天是否有课
    newsHint: '获取中...',  //新闻异常提示
    bbContent:"大家好，2017-2018年秋季学期校历已更新，具体请前往校历页查看；课表更新不及时的缺陷已修复，在此对之前给您所造成的种种不便表示歉意。",//公告板的内容
    bbTime:"2018-3-11",
    bbHidden: true,
  },

  /**
   * 课程表是否一定是最新的
   */
  classValid:function(){
    var classStampWeek = wx.getStorageSync('classStampWeek');//获取上次获取课程表的在第几周
    var now = app.globalData.now;//获取当前周和星期
    if(classStampWeek<=1||(classStampWeek>=16&&classStampWeek<=18)||!classStampWeek)
      return false;
    else
      return true;
  },

  /**
   * 获取课程表及今日课程
   */
  getClass: function () {
    var that = this;
    var now = app.globalData.now;//获取当前周和星期
    var classinfo = wx.getStorageSync('classinfo');//获取缓存中的课程表
    if (classinfo&&that.classValid()) {//若缓存中有而且上次获取的课程表一定是最新的
      app.globalData.classinfo = classinfo;
      //获取今日课程
      var c = null;
      var todayclasses = [];//今日课程
      for (let i = 0; i < classinfo.length; i++) {
        c = classinfo[i];
        if (c.weekday == now.day && c.week[now.week] == '1')
          todayclasses[c.courseOrder] = c;
      }
      that.setData({
        todayclasses: todayclasses,
        classHint: '今日无课'
      })
    }
    else {//若缓存中没有
      //获取本地缓存中的id和token
      var obj = wx.getStorageSync('obj');
      wx.request({
        url: baseURL + '/academic/table/' + obj.id,
        method: 'GET',
        header: {
          'X-Authorization': obj.token
        },
        success: function (res) {
          if (res.data['code'] >= 0) {
            console.log("获取课表成功！")
            var classinfo = res.data['obj'];
            wx.setStorage({
              key: 'classinfo',
              data: classinfo,
              success: function () {
                console.log("课程表缓存成功")
              }
            })
            wx.setStorage({
              key: 'classStampWeek',
              data: now.week,
            })
            app.globalData.classinfo = classinfo;//存到app全局变量中
            //获取今日课程
            var c = null;
            var todayclasses = []//今日课程
            for (let i = 0; i < classinfo.length; i++) {
              c = classinfo[i];
              if (c.weekday == now.day && c.week[now.week] == '1')
                todayclasses[c.courseOrder] = c;
            }
            that.setData({
              todayclasses: todayclasses,
              classHint: '今日无课'
            })
            console.log("获得今日课程！");
          }
          else {
            console.log("服务器错误")
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var lastBbTime=wx.getStorageSync('lastBbTime');
    if(lastBbTime===this.data.bbTime)
      this.setData({bbHidden:true})
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this;
    this.setData({
      classtime: app.globalData.classtime
    })
    if (app.globalData.academic == 'YES') {
      wx.hideLoading();
      this.getClass();
    }
    else if (app.globalData.academic == 'NO') {
      wx.hideLoading();
      console.log("未绑定教务")
      this.setData({
        classHint: "未绑定教务"
      });
    }
    else {
      var polling1 = setInterval(function () {
        if (app.globalData.academic == 'YES') {
          wx.hideLoading();
          that.getClass();
          clearInterval(polling1);
        }
        else if (app.globalData.academic == 'NO') {
          wx.hideLoading();
          console.log("未绑定教务")
          that.setData({
            classHint: "未绑定教务"
          });
          clearInterval(polling1);
        }
        else {
          console.log("正在等待教务绑定情况……");
        }
      }, 500)
    }
    if (app.globalData.newsGot) {
      if (app.globalData.news[0][0]['title']) {
        that.setData({
          newsHint: '',
          latestnews: app.globalData.news[0][0]
        })
        clearInterval(polling2)
        console.log("获得最新资讯!")
      }
      else {
        that.setData({
          newsHint: '获取失败'
        })
      }
    }
    else {
      var polling2 = setInterval(function () {
        if (app.globalData.newsGot) {
          if (app.globalData.news[0][0]['title']) {
            that.setData({
              newsHint: '',
              latestnews: app.globalData.news[0][0]
            })
            clearInterval(polling2)
            console.log("获得最新资讯!")
          }
          else {
            that.setData({
              newsHint: '获取失败'
            })
          }
        }
        else {
          console.log("正在等待最新资讯……")
        }
      }, 500)
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

  /**页面事件 */
  /**
   * 进入功能页
   */
  enterFunction: function (e) {
    var id = e.currentTarget.id;
    if (id == 'card') {
      wx.showModal({
        title: '提示',
        content: '校园卡功能维护中'
      })
      return;
    }
    if (id == 'schoolbus' || id == 'studyroom' || id == 'calendar') {//校车、校历、自习室无条件进入
      var url = "/pages/" + id + "/" + id;
      wx.navigateTo({
        url: url
      })
    }
    else {
      if (app.globalData.academic == 'YES') {
        var url = "/pages/" + id + "/" + id;
        wx.navigateTo({
          url: url
        })
      }
      else if (app.globalData.academic == 'NO') {
        wx.showModal({
          title: '提示',
          content: '您还未绑定教务，是否前往绑定',
          success: function (res) {
            if (res.confirm)
              wx.navigateTo({
                url: '/pages/login/login',
              })
          }
        })
      }
    }
  },

  /**
   * 进入课表
   */
  enterClasstable: function () {
    wx.navigateTo({
      url: '/pages/classtable/classtable',
    })
  },

  /**
    * 进入资讯
    */
  enterNews: function () {
    wx.switchTab({
      url: '/pages/news/news',
    })
  },

  /**
   * 进入资讯详情页
   */
  getDetail: function (e) {
    if (app.globalData.news[0][0]['title'] != null) {
      var id = e.currentTarget.id;
      wx.navigateTo({
        url: '/pages/newsdetail/newsdetail?site=sduOnline&id=0',
      })
    }
  },

  /**
   * 关闭公告板
   */
  hideBillboard:function(){
    this.setData({bbHidden:true})
    wx,wx.setStorageSync('lastBbTime', this.data.bbTime)
  }
})