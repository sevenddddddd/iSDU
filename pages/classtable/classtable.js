// pages/classtable/classtable.js
var app = getApp()
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    contentHeight: 0,
    classinfo: [],
    pickerrange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    time: 0,
    detail: [[], [], [], [], [], [], []],
    currentScale: { col: -1, row: -1 },
    classBg: ["#FFC125", "#48D1CC", "#62A4E1", "#E089FF", "#498496", "#66CC99", "#99CC33", "#40DE5A", "#FF888A", "#FF6666", "#EE4000", "#B23AEE", "#668B8B", "#71C671", "#CAFF70"],
    now: {}
  },

  /**
   * 获取课程表及今日课程
   */
  getClass: function () {
    var that = this;
    var now = app.globalData.now;//获取当前周和星期
    var classinfo = wx.getStorageSync('classinfo');//获取缓存中的课程表
    if (classinfo) {//若缓存中有
    console.log("获得课程表")
      app.globalData.classinfo = classinfo;
      that.setData({
        classinfo: classinfo
      })
      that.loadClassTable();//加载当前周课程
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
            app.globalData.classinfo = classinfo;//存到app全局变量中
            that.setData({
              classinfo: classinfo
            });
            this.loadClassTable();//加载当前周课程
          }
          else {
            console.log("服务器错误")
          }
        }
      })
    }
  },

  /**
   * 加载当前周课程
   */
  loadClassTable: function () {
    //由于整个显示的课程表都要重新渲染，因此直接将通过将detail整体改变来渲染
    var detail = this.data.detail;//引用与显示的课程表绑定的detail
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 5; j++)
        detail[i][j] = { hasClass: false, info: null };//课程全置无
    var classinfo = this.data.classinfo;//引用课程信息
    var bg = new Array(classinfo.length);//新建一个用于记录当前的背景色分配情况的数组，记录了课程名，对应的索引即背景色
    var index = 0;//记录当前已使用的背景数,即课程数
    var classBg = this.data.classBg;//引用背景色数组
    var time = this.data.time;//引用当前周time
    var c = null;//for循环遍历中当前课程
    for (let i = 0; i < classinfo.length; i++) {
      c = classinfo[i];
      if (c.week[time] == '1') {
        detail[c.weekday - 1][c.courseOrder - 1] = { hasClass: true, info: { courseName: c.courseName, room: c.room, teacher: c.teacher }, tf: "none" };
        for (let j = 0; j < index; j++)
          if (bg[j] == c.courseName) {
            detail[c.weekday - 1][c.courseOrder - 1].bg = classBg[j];
            break;
          }
        if (!detail[c.weekday - 1][c.courseOrder - 1].bg) {
          detail[c.weekday - 1][c.courseOrder - 1].bg = classBg[index];
          bg[index] = c.courseName;
          index++;
        }
      }
    }
    this.setData({ detail: detail });
  },

  /**
   * 页面加载(从课表粗信息提取该周的信息，从而确定课表，具体方法是在当前周对粗数据截取横切面)
   */
  onLoad: function (options) {
    this.setData({
      now: app.globalData.now
    })
    this.setData({
      time: this.data.now.week,
    })
    if (app.globalData.academic == 'NO') {
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
    else if (app.globalData.academic == 'YES') {
      this.getClass();//获取课程表
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var windowHeight = wx.getSystemInfoSync()['windowHeight'];//窗口高度
    var picker = wx.createSelectorQuery().select(".picker");//picker NodesRef
    picker.fields({ size: true }, function (res) {
      var pickerHeight = res.height//获取picker高度
      var th = wx.createSelectorQuery().select(".weekdays");//weekdays NodesRef
      th.fields({ size: true }, function (res) {
        var thHeight = res.height//获取表头高度
        that.setData({
          contentHeight: windowHeight - pickerHeight - thHeight,
          hidden: false
        })
      }).exec();//获得表头高度
    }).exec();//获得picker高度
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
   * 选择时间，并加载当前周课程
   */
  changeTime: function (e) {
    this.setData({
      time: e.detail.value
    })
    this.loadClassTable();
  },
  /**
   * 点击课程查看详细信息
   */
  infoTap: function (e) {
    var dataset = e.currentTarget.dataset;
    var col = dataset.col;
    var row = dataset.row;
    var currentCol = this.data.currentScale.col;
    var currentRow = this.data.currentScale.row;
    var scale = new Object();
    if (this.data.detail[col][row].hasClass) {
      var key = "detail[" + col + "][" + row + "].tf";
      if (currentCol != -1) {
        if (col == currentCol && row == currentRow) {
          scale[key] = "none";
          scale["currentScale"] = { col: -1, row: -1 };
        }
        else {
          scale[key] = "scale(1.4)";
          key = "detail[" + this.data.currentScale.col + "][" + this.data.currentScale.row + "].tf";
          scale[key] = "none";
          scale["currentScale"] = { col: col, row: row };
        }
      }
      else {
        scale[key] = "scale(1.4)";
        scale["currentScale"] = { col: col, row: row };
      }
    }
    else {
      if (currentCol != -1) {
        key = "detail[" + this.data.currentScale.col + "][" + this.data.currentScale.row + "].tf";
        scale[key] = "none";
        scale["currentScale"] = { col: -1, row: -1 };
      }
    }
    this.setData(scale);
  }
})