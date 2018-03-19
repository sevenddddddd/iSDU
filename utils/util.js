var termBegin = { year:2018, month: 2, date: 5 }//开学第一周星期一
function getWeek_day() {//获取当前周、星期
  var current = {};//当前时间
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth()
  var date = now.getDate()
  var day = now.getDay()
  current.day = day;
  if (day == 0)
    current.day = 7;
  var month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
    month_days[1] = 29
  var days = date - termBegin.date;
  if (termBegin.month > month || termBegin.month == month && days < 0)//当前在假期则判为第一周第一天
    current = { week: 0, day: 1 };
  else {
    for (let m = termBegin.month; m < month; m++)
      days += month_days[m];
      var week = Math.floor(days / 7)
      current.week = week>19?19:week
  }
  return current;
}
function wd_toDate(week, day) {//将周、星期转化成日期
  var date = new Date(2018, termBegin.month, termBegin.date);
  date.setDate(week * 7 + day - 1 + termBegin.date)
  return date;
}
function getClasstime() {//当前是否夏令时
  var now = new Date();
  var month = now.getMonth();
  return month >= 4 && month <= 8;
}
module.exports = {
  getWeek_day: getWeek_day,
  wd_toDate: wd_toDate,
  getClasstime: getClasstime
}
