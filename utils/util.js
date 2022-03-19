const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
 const MillisecondToDate = mss => {
  /* eslint-disable */
  let date='';
  const days = parseInt(mss / (1000 * 60 * 60 * 24));
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = (mss % (1000 * 60)) / 1000;
  if(days>0){
    date+=`${days} 天`;
  }
  if(hours>0){
    date+=`${hours} 小时`;
  }
  if(minutes>0){
    date+=`${minutes} 分钟`;
  }
  /* eslint-enable */
  return date;
};

module.exports = {
  formatTime,
  MillisecondToDate
}
