// pages/library/library.js
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: true,
    current: "b-books",//当前引用模板（3个之一）
    get_borrowed: false,//当前是否已经获得当前借阅
    task_borrowed: null,//请求当前借阅的requestTask对象
    //当前借阅的图书
    borrowedbooks: [],
    borrowedHint: "获取当前借阅中...",
    //搜索图书结果
    resultbooks: [],
    resultHint: "",
    inputValue: null,//搜索图书名
    //余座查询模板数据——校区信息
    symbols: [{ name: "中心文理分馆", pn: "zxwl", background: "white", color: "black", tf: "none", selected: false, para: "zxwl" },
    { name: "蒋震分馆", pn: "zxjz", background: "white", color: "black", tf: "none", selected: false, para: "zxjz" },
    { name: "洪家楼分馆", pn: "hjl", background: "white", color: "black", tf: "none", selected: false, para: "hjl" },
    { name: "趵突泉分馆", pn: "btq", background: "white", color: "black", tf: "none", selected: false, para: "btq" },
    { name: "工学分馆", pn: "qfs", background: "white", color: "black", tf: "none", selected: false, para: "qfsgx" },
    { name: "兴隆山分馆", pn: "xls", background: "white", color: "black", tf: "none", selected: false, para: "xls" }],//{name:校区名,background:背景色,color:字的颜色,tf:标志缩放,selected:是否被选中}
    campus: -1,//余座查询模板数据——选中的校区
    hint: "请选择校区",//余座查询模板数据——提示
    //余座查询模板数据——各个房间余座信息
    rooms: [],
    //用于模板的数据
    library: {
      borrowedbooks: [],
      borrowedHint: "获取当前借阅中..."
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取本地缓存中的id和token
    var obj = wx.getStorageSync('obj');
    wx.request({
      url: baseURL + '/info/bind/' + obj.id,
      method: 'GET',
      header: {
        'X-Authorization': obj.token
      },
      success: function (res) {
        if (res.data['code'] >= 0) {
          console.log("（图书馆）获取绑定信息成功！");
          if (!res.data['obj']['library']) {
            wx.redirectTo({
              url: '/pages/cardlogin/cardlogin?condition=library'
            })
          }
          else
            that.getBorrowed();
        }
      }
    })
  },

  /**
   * 获取图书馆-当前借阅(此时也会检测校园卡账号和密码是否匹配,若不匹配则跳转到重新绑定校园卡页面)
   */
  getBorrowed: function () {
    wx.showNavigationBarLoading()
    var that = this;
    //获取本地缓存中的id和token
    var obj = wx.getStorageSync('obj');
    var task_borrowed = wx.request({
      url: baseURL + '/lib/borrowed',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Authorization': obj.token
      },
      data: {
        id: obj.id
      },
      success: function (res) {
        that.data.get_borrowed = true;
        wx.hideNavigationBarLoading()
        if (res.data['code'] == 0 || res.data['code'] == 1) {
          console.log("获取图书馆-当前借阅成功！")
          //当前有借阅书籍
          if (res.data['obj']) {
            //格式化日期
            for (let i = 0; i < res.data['obj'].length; i++) {
              var resDate = new Date(res.data['obj'][i]['retDate'])
              res.data['obj'][i]['retDate'] = resDate.getFullYear() + '年' + (resDate.getMonth() + 1) + '月' + resDate.getDate() + '日'
            }
            that.data.borrowedbooks = res.data['obj']
          }
          //当前无借阅书籍
          else {
            that.data.borrowedbooks = []
          }
          that.data.borrowedHint = "您当前无借阅书籍"
          that.setData({
            current: 'b-books',
            tab: true,
            library: { borrowedbooks: that.data.borrowedbooks, borrowedHint: that.data.borrowedHint }
          })
        }
        else if (res.data['code'] == 2) {
          console.log(res.data)
          wx.redirectTo({
            url: '/pages/cardlogin/cardlogin?condition=library',
          })
        }
        else {
          console.log('服务器错误')
        }
      }
    })
    this.data.task_borrowed = task_borrowed;
  },

  /**
   * 查询馆藏
   */
  searchBooks: function (name) {
    wx.showLoading({
      title: '检索中',
      mask: true
    })
    var that = this;
    //获取本地缓存中的id和token
    var obj = wx.getStorageSync('obj');
    wx.request({
      url: baseURL + '/lib/search',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-Authorization': obj.token
      },
      data: {
        name: name
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data['code'] >= 0) {
          console.log("查询馆藏成功！")
          //查询结果不为空
          if (res.data['obj']) {
            that.data.resultbooks = res.data['obj']
          }
          //查询结果为空
          else {
            that.data.resultbooks = []
          }
          that.data.resultHint = "没有查询到相关信息";
          that.setData({
            library: { resultbooks: that.data.resultbooks, resultHint: that.data.resultHint }
          })
        }
      }
    })
  },

  /**
   * tabbar点击切换(请求接口数据，修改library)
   */
  tab: function (e) {
    var id = e.currentTarget.id
    switch (id) {
      case '0':
        if (!this.data.tab) {
          if (this.data.get_borrowed) {
            this.setData({
              current: 'b-books',
              tab: true,
              library: { borrowedbooks: this.data.borrowedbooks, borrowedHint: this.data.borrowedHint }
            })
          }
          else
            this.getBorrowed();
        }
        break;
      case '1':
        if (this.data.tab) {
          this.data.task_borrowed && this.data.task_borrowed.abort();
          wx.hideNavigationBarLoading();
          this.setData({
            current: 'seats',
            tab: false,
            library: { symbols: this.data.symbols, campus: this.data.campus, hint: this.data.hint, rooms: this.data.rooms }
          })
        }
        break;
    }
  },

  /**
   * 点击搜索按钮或小键盘右下角搜索图书
   */
  search: function () {
    var inputValue = this.data.inputValue;
    if (inputValue) {
      this.setData({
        current: 'result',
      })
      this.searchBooks(inputValue)
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请输入书名',
        showCancel: false
      })
    }
  },


  /**
   * 获取value并搜索
   */
  getInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  /**
   * 选择校区，改变校区样式（请求接口数据，改变library.rooms）
   */
  campusTap: function (e) {
    var id = e.currentTarget.id;//获取校区号
    var campus = this.data.campus;//当前的校区
    var change = new Object();//改变对象
    var key = 'library.symbols[' + id + '].selected';
    if (this.data.symbols[id].selected)//如果改校区已经选中则取消选中并提示选校区
    {
      this.data.symbols[id].selected = false;
      change[key] = false;
      this.data.campus = -1;
      change['library.campus'] = -1;
      this.data.hint = "请选择校区";
      change['library.hint'] = this.data.hint;
      this.data.rooms = [];
      change['library.rooms'] = []
    }
    else {//如果未选中则选中
      wx.showLoading({
        title: '查询中',
        mask: true
      })
      //获取选中图书馆的余座情况
      var that = this;
      var para = this.data.symbols[id].para;
      wx.request({
        url: "https://sduonline.cn/isdu/library/api/",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          room: para
        },
        success: function (res) {
          that.data.rooms = res.data;
          that.setData({
            "library.rooms": that.data.rooms
          })
          wx.hideLoading()
        }
      })
      this.data.symbols[id].selected = true;
      change[key] = true;
      this.data.campus = id;
      change['library.campus'] = id;
      if (campus != -1) {//当前如果未选中其他校区则只需改变当前点击校区的样式，否则还需改变当前已选中校区的样式
        key = 'library.symbols[' + campus + '].' + 'selected';
        this.data.symbols[campus].selected = false;
        change[key] = false;
      }
    }
    this.setData(change);
  }
})