var termBegin = {
  year: 2019,
  month: 1,
  date: 25
} //开学第一周星期一
function getWeek_day() { //获取当前周、星期
  var current = {}; //当前时间
  var now = new Date()
  var year = now.getFullYear()
  var month = now.getMonth()
  var date = now.getDate()
  var day = now.getDay()
  var month_days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0)
    month_days[1] = 29
  var termBegin_year = termBegin.year,
    termBegin_month = termBegin.month,
    termBegin_date = termBegin.date;
  var days = 0; //开学后过去的天数
  if (termBegin_year === year) { //未跨年
    if (month === termBegin_month && date < termBegin_date || month < termBegin_month) { //学期前的假期
      for (let i = month; i < termBegin_month; i++) {
        days -= month_days[i];
      }
      days -= termBegin_date - date;
    } else { //已开学
      for (let i = termBegin_month; i < month; i++) {
        days += month_days[i];
      }
      days += date - termBegin_date;
    }
  } else { //跨年
    for (let i = termBegin_month; i < 12; i++) {
      days += month_days[i];
    }
    for (let i = 0; i < month; i++) {
      days += month_days[i];
    }
    days += date - termBegin_date;
  }
  if (days < 0) {
    current = {
      week: 0,
      day: 1
    };
  } else {
    var week = Math.floor(days / 7);
    if (week > 19) {
      current = {
        week: 19,
        day: 7
      };
    } else {
      current = {
        week: week,
        day: day === 0 ? 7 : day
      };
    }
  }

  return current;
}

function wd_toDate(week, day) { //将周、星期转化成日期
  var date = new Date(2018, termBegin.month, termBegin.date);
  date.setDate(week * 7 + day - 1 + termBegin.date)
  return date;
}

function getClasstime() { //当前是否夏令时
  var now = new Date();
  var month = now.getMonth();
  return month >= 4 && month <= 8;
}
module.exports = {
  getWeek_day: getWeek_day,
  wd_toDate: wd_toDate,
  getClasstime: getClasstime
}