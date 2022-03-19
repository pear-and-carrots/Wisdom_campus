// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    const result = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png/jpen',
        value: Buffer.from(event.img)   // 这里必须要将小程序端传过来的进行Buffer转化,否则就会报错,接口异常
      }
      
    })
return result,event.img
    if (result && result.errCode.toString() === '87014') {
      return { code: 500, msg: '图片内容含有违法违规内容', data: result }
    } else {
      return {event, code: 200, msg: '内容ok', data: result, }
    }
  } catch (err) {
    // 错误处理
    if (err.errCode.toString() === '87014') {
      return { code: 500, msg: '图片内容含有违法违规内容', data: err }
    }
    return { code: 502, msg: '调用imgSecCheck接口异常', data: err }
  }
}
