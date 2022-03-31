const NumberUtil = {}

NumberUtil.formatUsdt = function (num) {
    return this.format(num, 2)
}

NumberUtil.format = function (num, len) {
    if (num === undefined) {
        return ''
    }
    if (len === undefined || len < 0) {
        len = 8
    }
    if (!num) {
        let str = '0.'
        for (let i = 0; i < len; i++) {
            str += '0'
        }
        if (str === '0.') {
            return '0'
        }
        return str
    }
    num += '';
    if (!num.includes('.')) {
        num += '.'
    }
    num += '00000000'
    if (len <= 0) {
        return num.substring(0, num.indexOf("."))
    }
    return num.substring(0, num.indexOf(".") + len + 1);
}

NumberUtil.toInt = function (num) {
    return num.replace(/[^0-9]/g,'')
}

NumberUtil.toNumber = function (num, precision) {
    // 清除"数字"和"."以外的字符
    if (precision === 0) {
        num = num.replace(/[^0-9]/g,'')
    } else {
        num = num.replace(/[^0-9\\.]/g,'')
    }

    // 小数点的位置
    let pointIndex = num.indexOf('.')
    // 第一个字符如果是点，则前面加上0
    if (pointIndex === 0) {
        num = '0' + num
        pointIndex = 1
    }
    if (pointIndex !== -1) {
        let afterPoint = num.substring(pointIndex).replace(/[^0-9]/g,'')

        // 精度
        if (afterPoint.length > precision) {
            afterPoint = afterPoint.substring(0, precision)
        }

        // 只保留第一个点. 清除多余的点
        num = num.substring(0, pointIndex + 1) + afterPoint
    }

    // 防止00开头，但又要能输入x.00
    if (pointIndex === -1) {
        num = num * 1
    }

    return num
}

NumberUtil.randomIp = function () {
    return (Math.ceil(Math.random() * 200) + 10) + '.' +  Math.floor(Math.random() * 255) + '.' +  Math.floor(Math.random() * 255) + '.' +  Math.floor(Math.random() * 255)
}

NumberUtil.randomDeviceId = function (len) {
    if (!len) {
        len = 32
    }
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let res = ''
    for (let i = 0; i < len; i++) {
        res += chars[Math.floor(Math.random() * (len - 1))]
    }
    return res
}

export default NumberUtil
