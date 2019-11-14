(function () {
    let initTimer = setInterval(function () {
        if (typeof (ChaosFunctions) === "object") {
            clearInterval(initTimer);
            // 加载代码表
            ChaosFunctions.DynamicLoading.JS( ChaosPath + "../codes.js");
            initTimer = setInterval(function () {
                if (typeof (ChaosCodes) === "object") {
                    clearInterval(initTimer);
                    ChaosXHR = {
                        GET: function (url, callback) {
                            var xhr = createXHR();
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源
                                        // 处理返回的内容
                                        try {
                                            xhr.responseJson = JSON.parse(xhr.response)
                                        } catch(e){
                                            ChaosFunctions.Logger({Type: 'error', Title: "GET XHR Error：", Info : e});
                                        }
                                        callback(xhr);
                                    } else {
                                        ChaosFunctions.Logger({Type: 'log', Info : xhr});
                                        errorHandler(xhr);
                                        return 'request is unsucessful ' + xhr.status;
                                    }
                                }
                            };
                            xhr.open('get', url, true);
                            xhr.send();
                        },
                        POST: function (url, data, callback) {
                            var xhr = createXHR();
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState === 4) {
                                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源
                                        // 处理返回的内容
                                        try {
                                            xhr.response = JSON.parse(xhr.response)
                                        } catch(e){
                                            ChaosFunctions.Logger({Type: 'error', Title: "POST XHR Error：", Info : e});
                                        }
                                        callback(xhr);
                                    } else {
                                        ChaosFunctions.Logger({Type: 'log', Info : xhr});
                                        errorHandler(xhr);
                                        return 'request is unsucessful ' + xhr.status;
                                    }
                                }
                            };
                            xhr.open('post', url, true);
                            xhr.send(JSON.stringify(data));
                        }
                    };
                }
            },500)
        }
    }, 500)

    // create xhr object cross browser
    function createXHR() {
        if (typeof XMLHttpRequest != 'undefined') {
            return new XMLHttpRequest();
        }
        else if (typeof ActiveXObject != 'undefined') {
            if (typeof arguments.callee.activeXString != 'string') {
                var versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'], // ie browser different vesions
                    i, len;
                for (i = 0, len = versions.length; i < len; i++) {
                    try {
                        new ActiveXObject(versions[i]);
                        arguments.callee.activeXString = versions[i];
                        break;
                    }
                    catch (ex) {
                        // jump
                    }
                }
            }
            return new ActiveXObject(arguments.callee.activeXString);

        }
        else {
            throw new Error('No XHR object available.');
        }
    }

    // 错误处理
    function errorHandler(xhr) {
        let code = 0;
        try {
            code = JSON.parse(xhr.response).Code
        } catch(e){
            ChaosFunctions.Logger({Type: 'error', Title: "Handle Error：", Info : e});
        }

        let tips = "未知错误";
        if (ChaosCodes[code]) {
            tips = ChaosCodes[code]
        }

        switch (xhr.status) {
            case 400:
                alert("[ 请求错误 ] " + tips);
                break;
            case 401:
                alert("[ 未授权 ] " + tips);
                break;
            case 403:
                alert("[ 拒绝访问 ] " + tips);
                break;
            case 404:
                alert("[ 请求出错 ] " + tips);
                break;
            case 408:
                alert("[ 请求超时 ] " + tips);
                break;
            case 500:
                alert("[ 服务器内部错误 ] " + tips);
                break;
            case 501:
                alert("[ 服务未实现 ] " + tips);
                break;
            case 502:
                alert("[ 网关错误 ] " + tips);
                break;
            case 503:
                alert("[ 服务不可用 ] " + tips);
                break;
            case 504:
                alert("[ 网关超时 ] " + tips);
                break;
            case 505:
                alert("[ HTTP版本不受支持 ] " + tips);
                break;
            default: break
        }
    }

    ChaosFunctions.Logger({Type: 'warn', Info : 'XHR 模块 ( xhr.js ) 中定义了全局变量 [ ChaosXHR ( XHR 请求工具 ) ] ，请注意不要覆盖！'});
})();
