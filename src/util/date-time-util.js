const DateTimeUtil = {}

DateTimeUtil.format = function (timestamp, format) {
    if (!timestamp) {
        return ''
    }
    let date = new Date(timestamp * 1)
    let o = {
        'M+': date.getMonth() + 1,                 //月份
        'd+': date.getDate(),                    //日
        'H+': date.getHours(),                   //小时
        'm+': date.getMinutes(),                 //分
        's+': date.getSeconds(),                 //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds()             //毫秒
    }

    if (!format) {
        format = 'yyyy-MM-dd HH:mm:ss'
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return format
}

export default DateTimeUtil
