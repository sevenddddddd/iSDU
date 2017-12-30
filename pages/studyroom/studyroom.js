// pages/studyroom/studyroom.js
var app = getApp();
var utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    symbols: [{ name: "中心校区", pn: "zx", background: "white", color: "black", tf: "none", selected: false, para: "中心校区" },
    { name: "洪家楼校区", pn: "hjl", background: "white", color: "black", tf: "none", selected: false, para: "洪家楼校区" },
    { name: "趵突泉校区", pn: "btq", background: "white", color: "black", tf: "none", selected: false, para: "趵突泉校区" },
    { name: "软件园校区", pn: "rjy", background: "white", color: "black", tf: "none", selected: false, para: "软件园校区" },
    { name: "兴隆山校区", pn: "xls", background: "white", color: "black", tf: "none", selected: false, para: "兴隆山校区" },
    { name: "千佛山校区", pn: "qfs", background: "white", color: "black", tf: "none", selected: false, para: "千佛山校区" }],//{name:校区名,background:背景色,color:字的颜色,tf:标志缩放,selected:是否被选中}
    pickerrange: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], ["一", "二", "三", "四", "五", "六", "日"]],
    time: [0, 0],
    campus: -1,
    result: {
      hint: "请选择校区",
      buildings: []
    },
    now: {},
    buildings: {},
  },

  /**
   * 获取选定校区所有教学楼
   */
  loadBuildings: function (id) {
    if (id == -1)
      return;
    wx.showLoading({
      title: '查询中',
      mask: true
    })
    var para = this.data.symbols[id].para;
    var date = utils.wd_toDate(this.data.time[0], this.data.time[1] + 1);
    var that = this;
    wx.request({
      url: "https://sduonline.cn/isdu/studyroom/api/",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        campus: para,
        date: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      },
      success: function (res) {
        wx.hideLoading()
        that.data.buildings = res.data;
        var buildings = new Array();
        var index = 0;
        var attr;
        for (attr in that.data.buildings) {
          buildings[index] = { name: attr };
          index++;
        }
        that.setData({
          "result.buildings": buildings
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      now: app.globalData.now
    })
    this.setData({
      time: [this.data.now.week, this.data.now.day - 1],
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
   * 选择校区，改变校区样式（请求接口数据，改变result.buildings）
   */
  campusTap: function (e) {
    var id = e.currentTarget.id;//获取校区号
    var campus = this.data.campus;//当前的校区
    var change = new Object();//改变对象
    var key = 'symbols[' + id + '].selected';
    if (this.data.symbols[id].selected)//如果改校区已经选中则取消选中并提示选校区
    {
      change[key] = false;
      change['campus'] = -1;
      change['result.buildings'] = []
    }
    else {//如果未选中则选中
      this.loadBuildings(id);//加载该校区教学楼
      change[key] = true;
      change['campus'] = id;
      if (campus != -1) {//当前如果未选中其他校区则只需改变当前点击校区的样式，否则还需改变当前已选中校区的样式
        key = 'symbols[' + campus + '].' + 'selected';
        change[key] = false;
      }
    }
    this.setData(change);
  },

  /**
   * 选择时间（请求接口数据，改变result.builings）
   */
  changeTime: function (e) {
    this.setData({
      time: e.detail.value
    })
    this.loadBuildings(this.data.campus);
  },

  /**
   * 选择教学楼，查看具体教室信息
   */
  buildingTap: function (e) {
    var id = e.currentTarget.id;//获取教室id
    app.setStudyrooms(this.data.buildings[id])
    wx.navigateTo({
      url: '/pages/room/room?building=' + id,
    })
  }
})