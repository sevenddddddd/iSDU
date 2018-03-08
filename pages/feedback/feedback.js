// pages/feedback/feedback.js
var baseURL = "https://sduonline.cn/isdu-new";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    feedback:"feedback"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
   *获取表单内容并提交
  */
  submit: function (e) {
    var value=e.detail.value;//获取表单内容
    if(!value.fbcontent)//如果反馈内容为空，弹出提示框
        wx.showModal({
          title: '提示',
          content: '请输入反馈内容',
          showCancel: false,
        })
    else{
      var that = this;
      //获取本地缓存中的id和token
      var obj = wx.getStorageSync('obj');
      wx.request({
        url: baseURL+'/user/feedback',
        method:'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-Authorization': obj.token
        },
        data:{
          content:value.fbcontent+' tel:'+value.tel+'&qq:'+value.qq,
          clientType:'MINIAPP'
        },
        success:function(res){
          if(res.data['code']>=0){
            wx.showToast({
              title: '反馈成功',
              icon: 'success'
            })
            that.setData({
              'feedback': ''
            })
          }
        }
      })
    }
  }
})