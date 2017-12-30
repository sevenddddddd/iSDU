// pages/score/score.js
var app = getApp();
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据(其中scoretab是最终要显示的成绩)
   */
  data: {
    tab: true,
    scoretab: { items: [], noScore: false },
    //用于本学期成绩模板的数据
    semester: { items: [], noScore: false },
    //用于历史成绩模板的数据
    GPA_all: '',
    history: { items: [], GPA: undefined },
    pickerrange: ['一', '二', '三', '四', '五', '六', '七', '八'],
    time: 0,
    hint: ""
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
      //获取本学期成绩
      this.getSemester()
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
   * 获取本学期成绩
   */
  getSemester: function () {
    wx.showLoading({
      title: '查询中',
      mask: true
    })
    var that = this;
    //获取本地缓存中的id和token
    var obj = wx.getStorageSync('obj');
    wx.request({
      url: baseURL + '/academic/curTerm/' + obj.id,
      method: 'GET',
      header: {
        'X-Authorization': obj.token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data['code'] >= 0) {
          console.log("获取本学期成绩成功！")
          that.data.semester.items = res.data['obj']
          that.data.semester.noScore = false
          that.setData({
            scoretab: that.data.semester
          })
        }
        else {
          that.data.semester.noScore = true
          that.setData({
            scoretab: that.data.semester
          })
        }
      }
    })
  },

  /**
   * 获取总绩点
   */
  getGPA: function () {
    var that = this;
    //获取本地缓存中的id和token
    var obj = wx.getStorageSync('obj');
    wx.request({
      url: baseURL + '/academic/credits/' + obj.id,
      method: 'GET',
      header: {
        'X-Authorization': obj.token
      },
      success: function (res) {
        if (res.data['code'] >= 0) {
          that.data.GPA_all = res.data['obj']['总绩点']
          that.setData({
            'scoretab.GPA_all': that.data.GPA_all
          })
        }
      }
    })
  },

  /**
   * 获取历年某学期成绩并计算GPA
   */
  getHistory: function (tid) {
    wx.showLoading({
      title: '查询中',
      mask: true
    })
    var that = this;
    //获取本地缓存中的id和token
    var obj = wx.getStorageSync('obj');
    wx.request({
      url: baseURL + '/academic/termScore/' + obj.id + '/' + tid,
      method: 'GET',
      header: {
        'X-Authorization': obj.token
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data['code'] >= 0) {
          console.log("获取第" + tid + "学期成绩成功！")
          var items = res.data['obj'];
          that.data.time = tid - 1;
          that.data.history.items = items;
          that.data.hint = "暂无该学期成绩"
          var credits = 0;
          var grade_credits = 0;
          for (let i = 0; i < res.data['obj'].length; i++) {
            if (items[i]['kxh'] < 600) {
              credits += items[i]['xf'];
              grade_credits += items[i]['xf'] * items[i]['wfzjd']
            }
          }
          that.data.history.GPA = (grade_credits / credits).toFixed(2);
          that.setData({
            'scoretab.items': that.data.history.items,
            'scoretab.GPA': that.data.history.GPA,
            'scoretab.hint': that.data.hint,
            'scoretab.time': that.data.time
          })
        }
      }
    })
  },


  /**
   * tabbar点击切换(请求接口数据，修改scoretab)
   */
  tab: function (e) {
    var id = e.currentTarget.id
    switch (id) {
      case '0':
        if (!this.data.tab) {
          this.setData({
            tab: true,
            'scoretab.items': []
          })
          this.getSemester()
        }
        break;
      case '1':
        if (this.data.tab) {
          this.data.hint = ""
          this.setData({
            tab: false,
            scoretab: { GPA_all: this.data.GPA_all, pickerrange: this.data.pickerrange, time: this.data.time, items: [], GPA: undefined, hint: this.data.hint }
          })
          this.getGPA();
          this.getHistory(this.data.time + 1)
        }
        break;
    }
  },

  /**
   * 选择时间(请求接口数据，修改scoretab)
   */
  changeTime: function (e) {
    this.getHistory(parseInt(e.detail.value) + 1)
  }
})