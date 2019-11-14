/*
 * 解析 URL 参数
 * 返回 $_GET 对象, 仿 PHP 模式
 */

const $_GET = (function () {
    // 获取 URL
    let url = window.document.location.href.toString();
    // 删除微信分享时添加到VUE路径中到多余参数
    url = url.replace("?from=singlemessage&isappinstalled=0#", "#");
    url = url.replace("?from=singlemessage#", "#");
    // 使用 ? 将 URL 分割为数组
    let urlArray = url.split("?");
    // 判断是否存在 ? 后的内容
    if (typeof (urlArray[1]) == "string") {
        paramArray = urlArray[1].split("#")[0].split("&");
        let params = {};
        for (let count in paramArray) {
            let paramTemp = String(paramArray[count]).split("=");
            params[paramTemp[0]] = paramTemp[1]
        }
        return params
    } else {
        return {}
    }
})();

(function () {
    let initTimerInfo = 'GET 模块 ( get.js ) 中定义了全局变量 [ $_GET ( URL Query 参数 ) ] ，请注意不要覆盖！';
    let initTimerCount = 0;
    let initTimer = setInterval(function () {
        if (initTimerCount++ > 20) {
            clearInterval(initTimer);
            console.warn('Chaos > ' + initTimerInfo);
        }
        if (typeof ChaosFunctions === "object") {
            clearInterval(initTimer);
            ChaosFunctions.Logger({ Type: 'warn', Info: initTimerInfo });
        }
    }, 500);
})();
