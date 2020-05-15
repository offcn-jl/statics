
(function () {
    let wechatLonginInterval

    // 隐藏窗口函数
    ChaosHideLogin = function () {
        // 隐藏窗口
        ChaosFunctions.HideByClass("hl-cover,hl-popup");
        // 结束微信登陆监听事件
        clearInterval(wechatLonginInterval);
    }

    // 注册关闭登陆框监听器
    document.getElementsByClassName("hl-cover")[0].addEventListener("click", ChaosHideLogin);
    document.getElementsByClassName("hl-close")[0].addEventListener("click", ChaosHideLogin);

    WechatInit = function () {
        // 创建微信登陆二维码
        ChaosXHR.POST(ChaosApiPath + "/qr-code", { "LMC": ChaosFunctions.Attr(document.getElementsByTagName('chaos')[0], "chaos-id", "MQ=="), "AppID": ChaosLoacation.AppID }, function (xhr) {
            if (typeof (xhr.responseJson) == "object") {
                if (typeof (xhr.responseJson.Result.ticket) == "string") {
                    document.getElementsByClassName("hlwm-qrcode")[0].setAttribute("src", "https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=" + xhr.responseJson.Result.ticket)
                    // 监听 ticket ，获取登陆状态
                    wechatMonitor(xhr.responseJson.Result.ticket)
                    ChaosFunctions.Logger({ Type: 'info', Info: '微信登陆二维码加载成功' });
                } else {
                    ChaosFunctions.Logger({ Type: 'error', Title: "微信登陆二维码加载失败，请求详情：", Info: xhr });
                    alert("微信登陆二维码加载失败");
                }
            } else {
                ChaosFunctions.Logger({ Type: 'error', Title: "微信登陆二维码加载失败，请求详情：", Info: xhr });
                alert("微信登陆二维码加载失败");
            }
        });

        // 监听微信扫码登陆
        function wechatMonitor(ticket) {
            wechatLonginInterval = setInterval(function () {
                ChaosXHR.GET(ChaosApiPath + "/qr-code/scan-status/" + ticket, function (xhr) {
                    if (typeof (xhr.responseJson) == "object") {
                        if (typeof (xhr.responseJson.Code) == "number") {
                            if (xhr.responseJson.Code == 0) {
                                // 设置为已经登陆
                                clearInterval(wechatLonginInterval);
                                ChaosFunctions.HideByClass("hl-cover,hl-popup"); // 隐藏注册窗口
                                ChaosLoginStatus = true;
                                Cookies.set('ChaosForm_' + ChaosForm, 'isLogin');// 保存注册状态
                                // 获取浏览器信息 (https://www.cnblogs.com/zcynine/p/5438883.html)
                                let browser = {
                                    versions: function () {
                                        var u = navigator.userAgent, app = navigator.appVersion;
                                        return {         //移动终端浏览器版本信息
                                            trident: u.indexOf('Trident') > -1, //IE内核
                                            presto: u.indexOf('Presto') > -1, //opera内核
                                            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                                            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                                            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                                            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                                            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                                            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                                            iPad: u.indexOf('iPad') > -1, //是否iPad
                                            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                                        };
                                    }(),
                                    language: (navigator.browserLanguage || navigator.language).toLowerCase()
                                }
                                // 判断是否是移动设备打开 (https://www.cnblogs.com/zcynine/p/5438883.html)
                                if (browser.versions.mobile) {
                                    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
                                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                                        //在微信中打开
                                    }
                                    if (ua.match(/WeiBo/i) == "weibo") {
                                        //在新浪微博客户端打开
                                    }
                                    if (ua.match(/QQ/i) == "qq") {
                                        //在QQ空间打开
                                    }
                                    if (browser.versions.ios) {
                                        //是否在IOS浏览器打开
                                    }
                                    if (browser.versions.android) {
                                        //是否在安卓浏览器打开
                                    }
                                } else {
                                    //否则就是PC浏览器打开
                                    alert("登陆成功！")
                                }
                            }
                        } else {
                            ChaosFunctions.Logger({ Type: 'error', Title: "获取扫码状态失败，请求详情：", Info: xhr });
                        }
                    } else {
                        ChaosFunctions.Logger({ Type: 'error', Title: "获取扫码状态失败，请求详情：", Info: xhr });
                    }
                });
            }, 1000)
        }
    }
    ChaosFunctions.Logger({ Type: 'warn', Info: '微信登陆模块 ( 处理函数 ) 中定义了全局变量 [ WechatInit ( 二维码登陆初始化函数 ) ] [ ChaosHideLogin ( 隐藏登陆模块函数 ) ] ，请注意不要覆盖！' });
    ChaosFunctions.Logger({ Type: 'info', Info: '微信登陆模块处理函数 ( wechat-functions.js ) 加载成功' });
})();
