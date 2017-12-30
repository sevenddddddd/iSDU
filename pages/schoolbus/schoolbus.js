// pages/schoolbus/schoolbus.js
var app = getApp()
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    symbols: [{ name: "中心校区", pn: "zx", description: "中心校区", tf: "none", selected: false },
    { name: "洪家楼校区", pn: "hjl", description: "洪家楼校区", tf: "none", selected: false },
    { name: "趵突泉校区", pn: "btq", description: "趵突泉校区", tf: "none", selected: false },
    { name: "软件园校区", pn: "rjy", description: "软件园校区", tf: "none", selected: false },
    { name: "兴隆山校区", pn: "xls", description: "兴隆山校区", tf: "none", selected: false },
    { name: "千佛山校区", pn: "qfs", description: "千佛山校区", tf: "none", selected: false }],//{name:校区名,description:校区描述,background:背景色,color:字的颜色,tf:标志缩放,selected:是否被选中}
    sequence: [null, null],//起点和终点序列
    i: 0,//当前要设定的项在序列中的索引
    isWeekend: false,
    warnVis: "hidden"
  },

  /**
   * 监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isWeekend: app.globalData.now['day'] > 5
    })
  },

  /**
   * 改变校区标志背景色、图片大小和文字颜色
   */
  changeBg: function (id) {
    //要改变数组中的某一项，先创建具有相应值对的对象，然后用setData()
    var change = new Object()
    var key = 'symbols[' + id + '].'
    var s = this.data.symbols[id]//获取该校区标志对象
    var selected = s.selected//该校区标志是否已被选中
    if (!selected) {
      change[key + 'tf'] = "scale(1.1,1.1)"
    }
    else {
      change[key + 'tf'] = "none"
    }
    change[key + 'selected'] = !selected
    this.setData(change)
  },

  /**
  * 改变校区标志文字（有时需单独改变）
  */
  changeDp: function (id) {
    //要改变数组中的某一项，先创建具有相应值对的对象，然后用setData()
    var change = new Object()
    var key = 'symbols[' + id + '].'
    var s = this.data.symbols[id]//获取该校区标志对象
    var selected = s.selected//该校区标志是否已被选中
    if (!selected) {
      if (this.data.i == 0)
        change[key + 'description'] = '从 ' + s.description;
      else
        change[key + 'description'] = '到 ' + s.description;
    }
    else {
      if (this.data.sequence[1].id == id)
        change[key + 'description'] = s.description.replace('到', '从')
      else {
        change[key + 'description'] = s.description.substr(2)
      }
    }
    this.setData(change)
  },

  /**
   * 重置校区标志文字
   */
  resetDp: function (id) {
    //要改变数组中的某一项，先创建具有相应值对的对象，然后用setData()
    var change = new Object()
    var key = 'symbols[' + id + '].'
    var s = this.data.symbols[id]//获取该校区标志对象
    change[key + 'description'] = s.name;
    this.setData(change)
  },

  /**
   * 改变背景色和文字颜色、文字以及选中字段
   */
  changeStyle: function (id) {
    this.changeDp(id)
    this.changeBg(id)
  },

  /**
   * 监听校区标志触击事件
   */
  campusTap: function (event) {
    var id = event.currentTarget.id//获取校区号
    var i = this.data.i//当前索引
    var selected = this.data.symbols[id].selected//该校区是否已被选中
    if (!selected) {
      if (i == 0) {
        this.data.sequence[i] = { id: id, name: this.data.symbols[id].name }
        this.changeStyle(id)
        this.data.i++
      }
      else if (i == 1) {
        this.data.sequence[i] = { id: id, name: this.data.symbols[id].name }
        this.changeStyle(id)
        this.data.i++
      }
      else {
        var f = this.data.sequence[0]
        this.changeStyle(f.id)
        var s = this.data.sequence[1]
        this.changeDp(s.id)
        this.data.sequence[0] = s
        this.data.sequence[1] = { id: id, name: this.data.symbols[id].name }
        this.changeStyle(id)
      }
    }
  },

  /**
  * 非工作日选择事件
  */
  selectDay: function (e) {
    var id = e.currentTarget.id;
    if (id == "weekend" && this.data.isWeekend == 0)
      this.setData({
        isWeekend: true
      })
    else if (id == "work" && this.data.isWeekend == 1)
      this.setData({
        isWeekend: false
      })
  },

  /**
   * 查询并记录
   */
  busQuery: function () {
    if (this.data.i != 2)
      this.setData({ warnVis: "visible" });
    else {
      wx.showLoading({
        title: '查询中',
        mask: true
      })
      var start=this.data.sequence[0].name;
      var end=this.data.sequence[1].name;
      wx.request({
        url: "https://sduonline.cn/isdu/schoolbus/api/",
        method: "GET",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          act: 1,
          start: start,
          end: end,
          isWeekend: this.data.isWeekend?1:0
        },
        success: function (res) {
          /**兼容1.1.0以下**/
          if (wx.hideLoading)
            wx.hideLoading()
          else
            wx.hideNavigationBarLoading()
          app.setBuses(res.data)
          if (res.data.length == 0) {
            wx.showModal({
              title: '提示',
              content: '没有您所查询的校车',
              showCancel: false,
            })
          }
          else {
            wx.navigateTo({
              url: '../bus/bus?start='+start +'&end='+end,
            })
          }
        },
        fail: function () {
          console.log("服务器错误")
        }
      })
    }
  },

  /**
   * 重置
   */
  reset: function () {
    var seq = this.data.sequence
    for (; this.data.i > 0; this.data.i--) {
      this.changeBg(seq[this.data.i - 1].id)
      this.resetDp(seq[this.data.i - 1].id)
      seq[this.data.i - 1] = null
    }
    app.setBuses([])
  }
})