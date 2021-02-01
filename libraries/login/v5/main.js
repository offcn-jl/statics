// 模块根节点
var Chaos = {
    // 模块基本信息
    Product: {
        Name: "单点登录模块 ( Single Sign On Module )",
        Ver: "20210201"
    },
    // 公共函数
    Functions: {
        // 获取节点 attr 属性的值
        // https://github.com/hustcc/ribbon.js/blob/master/src/ribbon.js
        Attr: function (node, attr, defaultValue) {
            return node.getAttribute(attr) || defaultValue
        },
        // Cookies 操作工具
        Cookies: {
            // 获取 Cookie
            Get: function (name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg)) {
                    return unescape(arr[2])
                } else {
                    return null
                }
            },
            // 设置 Cookie
            Set: function (name, value, expires) {
                var exp = new Date();
                exp.setTime(exp.getTime() + expires) // Days * 24 * 60 * 60 * 1000
                document.cookie = name + "=" + escape(value) + ";SameSite=Strict;Path=/;Expires=" + exp.toGMTString() // 添加 SameSite=Strict; 修正浏览器弹出警告的问题 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite
            },
            // 删除 Cookie
            // 由于需要保证 this 的作用域指向本对象, 所以不使用箭头函数
            Delete: function (name) {
                var exp = new Date()
                exp.setTime(exp.getTime() - 1)
                var cval = this.Get(name)
                if (cval != null)
                    document.cookie = name + "=" + cval + ";Path=/;Expires=" + exp.toGMTString()
            }
        },
        // 查询字符串操作工具
        GetQueryString: function (name) {
            var r = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"))
            if (r != null) {
                return unescape(r[2])
            }
            return null
        },
        // 异步加载 CSS 与 JS 工具
        DynamicLoading: {
            CSS: function (path) {
                if (!path || path.length === 0) {
                    throw new Error("参数 'path' 是必填项 !")
                }
                var chaosDOM = document.getElementsByTagName("chaos-v5")[0]
                var newCSS = document.createElement("link")
                newCSS.href = path
                newCSS.rel = "stylesheet"
                newCSS.type = "text/css"
                chaosDOM.appendChild(newCSS)
            },
            JS: function (path) {
                if (!path || path.length === 0) {
                    throw new Error("参数 'path' 是必填项 !")
                }
                var chaosDOM = document.getElementsByTagName("chaos-v5")[0];
                var newJS = document.createElement("script");
                newJS.src = path;
                newJS.type = "text/javascript";
                chaosDOM.appendChild(newJS)
            }
        },
        // 日志工具
        // log = {Type: ""( log / info / warn / error / table ), Info : ""}
        // https://www.runoob.com/w3cnote/javascript-console-object.html
        Logger: function (log) {
            // 日志组件等待时间
            var waitMillisecond = 1000 * 5;
            // 初始化日志对象
            if (typeof Chaos.Logs !== "object") {
                Chaos.Logs = {
                    Log: [],
                    Timer: null
                }
            }
            if (Chaos.Logs.Timer === null) {
                // console.log("初始化日志打印定时器");
                Chaos.Logs.Timer = setInterval(function () {
                    // 判断最后一条日志距离入栈时间是否足够
                    // console.log((new Date()).valueOf() < (ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond));
                    // console.log((ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond));
                    // console.log((new Date()).valueOf());
                    if ((new Date()).valueOf() < (Chaos.Logs.Log[Chaos.Logs.Log.length - 1].Time.valueOf() + waitMillisecond)) {
                        // 跳过打印
                        return
                    }
                    // 开始打印日志
                    clearInterval(Chaos.Logs.Timer); // 结束定时器
                    Chaos.Logs.Timer = null; // 清空定时器
                    // 将显示的信息分组
                    console.group(
                        "%c " + Chaos.Product.Name + " Ver." + Chaos.Product.Ver + " %c " + Chaos.Infos.Environment + " %c",
                        "background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;",
                        "background:" + (Chaos.Infos.Environment === "RELEASE" ? "#3488ff" : "#e6a23c") + "; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;",
                        "background:transparent"
                    )
                    // 遍历日志对象
                    Chaos.Logs.Log.forEach(function (log) {
                        switch (log.Type) {
                            case "info":
                                console.info(log.Time + " >> " + log.Info)
                                break;
                            case "warn":
                                console.warn(log.Time + " >> " + log.Info)
                                break;
                            case "error":
                                console.error(log.Time + " >> " + log.Title)
                                console.error(log.Info)
                                break;
                            case "table":
                                console.info(log.Time + " >> " + log.Title)
                                console.table(log.Info)
                                break;
                            default:
                                console.log(log.Time + " >> " + log.Info)
                        }
                    });
                    // 结束分组
                    console.groupEnd();
                    // 清空日志对象
                    Chaos.Logs.Log = [];
                }, 1000 * 5);
            }
            log.Time = (new Date()); // 直接使用 Date() 返回的是当前时间的字符串， (new Date()) 才可以获取到当前时间的对象。
            Chaos.Logs.Log.push(log);
        },
        // XHR 工具
        XHR: {
            GET: function (url, callback) {
                var that = this
                var xhr = that.createXHR()
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源
                            // 处理返回的内容
                            try {
                                if (xhr.response != "") {
                                    xhr.responseJson = JSON.parse(xhr.response)
                                }
                            } catch (e) {
                                Chaos.Functions.Logger({ Type: "error", Title: "发送 GET XHR 请求出错 :", Info: e });
                            }
                            callback(xhr);
                        } else {
                            that.errorHandler(xhr);
                            return "请求失败 " + xhr.status;
                        }
                    }
                };
                xhr.open("get", url, true);
                xhr.send();
            },
            POST: function (url, data, callback) {
                var that = this;
                var xhr = that.createXHR();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源
                            // 处理返回的内容
                            try {
                                if (xhr.response != "") {
                                    xhr.responseJson = JSON.parse(xhr.response)
                                }
                            } catch (e) {
                                Chaos.Functions.Logger({ Type: "error", Title: "发送 POST XHR 请求出错 :", Info: e });
                            }
                            callback(xhr);
                        } else {
                            that.errorHandler(xhr);
                            return "请求失败 " + xhr.status;
                        }
                    }
                };
                xhr.open("post", url, true);
                xhr.send(JSON.stringify(data));
            },
            createXHR: function () {
                if (typeof XMLHttpRequest != "undefined") {
                    return new XMLHttpRequest();
                }
                else if (typeof ActiveXObject != "undefined") {
                    if (typeof arguments.callee.activeXString != "string") {
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"], // ie browser different vesions
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
                    throw new Error("没有可用的 XHR 对象");
                }
            },
            errorHandler: function (xhr) {
                var code = 0;
                try {
                    code = JSON.parse(xhr.response).Code
                } catch (e) {
                    Chaos.Functions.Logger({ Type: "error", Title: "XHR 错误 :", Info: e });
                }

                if (code === -1) {
                    alert(JSON.parse(xhr.response).Error)
                    return
                }

                var tips = "未知错误";
                if (typeof ChaosCodes === "object" && ChaosCodes[code]) {
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
        },
        // 根据 class 列表显示元素
        ShowByClass: function (classes) {
            if (typeof (classes) == "string") {
                var classArray = classes.split(",");
                for (var i = 0; i < classArray.length; i++) {
                    Object.keys(document.getElementsByClassName(classArray[i])).forEach(function (key) {
                        document.getElementsByClassName(classArray[i])[key].style.display = "block";
                    });
                }
            }
        },
        // 根据 class 列表隐藏元素
        HideByClass: function (classes) {
            if (typeof (classes) == "string") {
                var classArray = classes.split(",");
                for (var i = 0; i < classArray.length; i++) {
                    Object.keys(document.getElementsByClassName(classArray[i])).forEach(function (key) {
                        document.getElementsByClassName(classArray[i])[key].style.display = "none";
                    });
                }
            }
        }
    },
    // 全局钩子
    Hooks: {
        // 登陆中间件
        Login: null,
        // 登陆注册提交前
        BeforeSubmit: null,
        // 登陆注册提交后
        AfterSubmit: null,
        // 隐藏登陆注册窗口
        HideLogin: null
    },
    // 模板
    Templates: {
        HTML: null
    }
}

// 公共信息
Chaos.Infos = {
    // 加载完成
    Completed: false,
    // 模块路径
    Path: Chaos.Functions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "src", "./").split("main.min.js")[0].split("main.js")[0],
    // 当前环境, 由于只有 RELEASE 环境配置了 HTTPS, 所以通过判断 Path 中是否包含 https 来进行区分
    Environment: Chaos.Functions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "src", "./").split("main.min.js")[0].split("main.js")[0].indexOf("https") === -1 ? "TEST" : "RELEASE",
    // 接口
    Apis: Chaos.Functions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "src", "./").split("main.min.js")[0].split("main.js")[0].indexOf("https") === -1 ? {
        SCF: "https://scf.tencent.jilinoffcn.com/test",
        TSF: "https://service-13mae2rr-1258962498.bj.apigw.tencentcs.com",
        TKE: "https://api.chaos.jilinoffcn.com/test"
    } : {
            SCF: "https://scf.tencent.jilinoffcn.com/release",
            TSF: "https://tsf.tencent.jilinoffcn.com/release",
            TKE: "https://api.chaos.jilinoffcn.com/release"
        },
    // 登陆模块 ID
    ID: Chaos.Functions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "data-id", 1) * 1,
    // 登陆模块类型
    Type: Chaos.Functions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "data-type", "lite"),
    // 用户手机号码
    Phone: isNaN(Chaos.Functions.Cookies.Get("chaos-v5-phone") * 1) ? 0 : Chaos.Functions.Cookies.Get("chaos-v5-phone") * 1,
    // 发信签名
    Sign: null,
    // 后缀 ( 19课堂个人后缀 )
    Suffix: Chaos.Functions.GetQueryString("scode"),
    // 小能咨询组
    NTalkerGID: null,
    // 是否登陆
    IsLogin: false,
    // 是否需要注册
    NeedToRegister: true,
    // CRM 信息
    CRM: {
        // CRM 活动 ID
        EID: null,
        // CRM 活动表单 ID
        SID: null,
        // CRM 所属渠道
        Channel: null,
        // CRM 组织代码
        OCode: null,
        // CRM 组织名称
        OName: null,
        // CRM 用户 ID
        UID: null,
        // CRM 用户名
        User: null,
    }
};

// 入口
(function () {
    // 打印警告
    Chaos.Functions.Logger({ Type: 'warn', Info: '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n[ Chaos ( 登陆模块根节点 ) ]\n\n请注意不要覆盖！' });
    // 初始化
    var initTimer = setInterval(function () {
        // 等待 Body 被加载到 DOM 树
        if (typeof (document.getElementsByTagName("body")[0]) === "object") {
            clearInterval(initTimer);

            // 判断 Dom 是否存在登陆模块自定义标签
            if (typeof (document.getElementsByTagName('chaos-v5')[0]) !== "object") {
                // 向 Dom 中添加登陆模块自定义标签
                var chaosNode = document.createElement("chaos-v5");
                chaosNode.setAttribute("data-id", Chaos.Infos.ID)
                chaosNode.setAttribute("data-type", Chaos.Infos.Type)
                document.getElementsByTagName("body")[0].appendChild(chaosNode)
            } else {
                // 设置登陆模块标签自定义属性
                document.getElementsByTagName('chaos-v5')[0].setAttribute("data-id", Chaos.Infos.ID)
                document.getElementsByTagName('chaos-v5')[0].setAttribute("data-type", Chaos.Infos.Type)
            }
            // 加载 Loading 遮罩
            // Chaos.Functions.DynamicLoading.CSS(Chaos.Infos.Path + "template/loading.css");
            // Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "template/loading.js");
        }

        // 如果是在移动端打开测试环境, 加载调试工具
        if (Chaos.Infos.Environment === "TEST" && navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i)) {
            Chaos.Functions.DynamicLoading.JS("https://cdn.jsdelivr.net/npm/eruda");
            var erudaTimer = setInterval(function() {
                if (typeof eruda === "object") {
                    clearInterval(erudaTimer);
                    eruda.init();
                }
            },500);
        }

        // 加载代码表, 由于存在 DOM 操作, 所以等待 Body 被加载到 DOM 树之后再进行操作
        Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "../../codes.js");

        // 等待代码表加载完成
        chaosCodesTimer = setInterval(function () {
            if (typeof (ChaosCodes) === "object") {
                clearInterval(chaosCodesTimer);
                // 获取会话状态
                // 这一步还进行了后缀正确性的检查
                // 并根据后缀获取了后缀对应的信息
                Chaos.Functions.XHR.GET(Chaos.Infos.Apis.TSF + "/sso/v2/sessions/info/" + Chaos.Infos.ID + "/" + Chaos.Infos.Suffix + "/" + Chaos.Infos.Phone, function (XHR) {
                    if (typeof (XHR.responseJson) == "object") {
                        // 校正后缀
                        Chaos.Infos.Suffix = XHR.responseJson.Suffix
                        // 更新模块信息
                        Chaos.Infos.Sign = XHR.responseJson.Sign // 签名
                        // 更新会话状态
                        Chaos.Infos.NeedToRegister = XHR.responseJson.NeedToRegister // 需要注册
                        Chaos.Infos.IsLogin = XHR.responseJson.IsLogin // 已经登陆
                        // 更新 CRM 相关信息
                        Chaos.Infos.CRM.Channel = XHR.responseJson.CRMChannel // 所属渠道
                        Chaos.Infos.CRM.EID = XHR.responseJson.CRMEID // 活动ID
                        Chaos.Infos.CRM.OCode = XHR.responseJson.CRMOCode // 所属分部代码
                        Chaos.Infos.CRM.OName = XHR.responseJson.CRMOName // 所属分部
                        Chaos.Infos.CRM.SID = XHR.responseJson.CRMSID // 活动表单ID
                        Chaos.Infos.CRM.UID = XHR.responseJson.CRMUID // 用户代码
                        Chaos.Infos.CRM.User = XHR.responseJson.CRMUser // 用户名
                        // 更新小能咨询组
                        Chaos.Infos.NTalkerGID = XHR.responseJson.NTalkerGID
                        // 打印配置
                        Chaos.Functions.Logger({
                            Type: "table", Title: "模块及后缀配置", Info: {
                                "后缀": Chaos.Infos.Suffix,
                                "签名": Chaos.Infos.Sign,
                                "活动代码": Chaos.Infos.CRM.EID,
                                "活动表单": Chaos.Infos.CRM.SID,
                                "所属组织": Chaos.Infos.CRM.OName,
                                "归属人": Chaos.Infos.CRM.User,
                                "小能咨询组": Chaos.Infos.NTalkerGID
                            }
                        });

                        // 延长 Cookies 有效期
                        if (!Chaos.Infos.NeedToRegister) {
                            Chaos.Functions.Cookies.Set("chaos-v5-phone", Chaos.Infos.Phone, 30 * 24 * 60 * 60 * 1000);
                        }

                        // 填充 个人后缀 链接
                        if (Chaos.Infos.Suffix !== null) {
                            Chaos.Functions.Logger({ Type: "info", Info: "开始填充 个人后缀 链接." });
                            var count = 0, doms = document.getElementsByClassName("chaos-v5-link");
                            Object.keys(doms).forEach(function (key) {
                                if (typeof doms[key].href === "string" && doms[key].href.length > 0) {
                                    // 判断是否已经含有参数
                                    if (doms[key].href.indexOf("?") !== -1) {
                                        // 含有参数, 将后缀拼接到原参数后
                                        doms[key].href = doms[key].href + "&scode=" + Chaos.Infos.Suffix;
                                    } else {
                                        // 没有参数, 直接拼接后缀
                                        doms[key].href = doms[key].href + "?scode=" + Chaos.Infos.Suffix;
                                    }
                                    // 覆盖 19课堂链接 默认打开方式 ( 阻止 IOS 默认的 H5 通用链接打开 APP 行为 )
                                    if (navigator.userAgent.indexOf('iPhone') !== -1 && doms[key].href.indexOf("19.offcn.com") !== -1) {
                                        doms[key].setAttribute("data-chaos-href", doms[key].href);
                                        doms[key].removeAttribute("href");
                                        doms[key].addEventListener("click", function (e) {
                                            e.preventDefault();
                                            window.open(this.getAttribute("data-chaos-href"));
                                        })
                                    }
                                    count++;
                                }
                            });
                            Chaos.Functions.Logger({ Type: "info", Info: "个人后缀 链接 填充完成，共填充 " + count + " 个." });
                        }

                        // 填充 个人后缀 图片
                        if (Chaos.Infos.Suffix !== null) {
                            Chaos.Functions.Logger({ Type: "info", Info: "开始填充 个人后缀 图片." });
                            var count = 0, imageDoms = document.getElementsByClassName("chaos-v5-image");
                            Object.keys(imageDoms).forEach(function (key) {
                                if (typeof imageDoms[key].getAttribute("src") === "string" && imageDoms[key].getAttribute("src").length > 0) { // 判断是否填写了图片链接 ( 先判断 src 属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                    var filePath = imageDoms[key].getAttribute("src").substring(0, imageDoms[key].getAttribute("src").lastIndexOf("/") + 1),
                                        fileExtension = imageDoms[key].getAttribute("src").substring(imageDoms[key].getAttribute("src").lastIndexOf("."));
                                    imageDoms[key].src = filePath + Chaos.Infos.Suffix + fileExtension;
                                    count++;
                                }
                            });
                            Chaos.Functions.Logger({ Type: "info", Info: "个人后缀 图片 填充完成，共填充 " + count + " 个." });
                        }

                        // 填充 个人后缀 微信小程序码
                        if (Chaos.Infos.Suffix !== null) {
                            Chaos.Functions.Logger({ Type: "info", Info: "开始填充 个人后缀 微信小程序码." });
                            var count = 0, imageDoms = document.getElementsByClassName("chaos-v5-wechat-mp-qr-code");
                            Object.keys(imageDoms).forEach(function (key) {
                                if (typeof imageDoms[key].getAttribute("data-appid") === "string" && imageDoms[key].getAttribute("data-appid").length > 0 && typeof imageDoms[key].getAttribute("data-page") === "string" && imageDoms[key].getAttribute("data-page").length > 0) { // 判断是否填写了 AppID 及 Page ( 先判断属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                    // 拼接图片路径
                                    imageDoms[key].src = Chaos.Infos.Apis.TKE + "/events/advertising-materials/wechat/mini-program/qr-code/suffix/" + Chaos.Infos.Suffix + "?app-id="+imageDoms[key].getAttribute("data-appid")+"&page="+imageDoms[key].getAttribute("data-page");
                                    count++;
                                }
                            });
                            Chaos.Functions.Logger({ Type: "info", Info: "个人后缀 微信小程序码 填充完成，共填充 " + count + " 个." });
                        }

                        // 填充 个人后缀 微信小程序链接
                        if (Chaos.Infos.Suffix !== null) {
                            Chaos.Functions.Logger({ Type: "info", Info: "开始填充 个人后缀 微信小程序链接." });
                            var wechatMpLinkCount = 0, doms = document.getElementsByClassName("chaos-v5-wechat-mp-link");
                            // 判断是否存在 个人后缀 微信小程序链接
                            if (doms.length > 0) {
                                // 判断当前终端类型 ( PC 端浏览器 / 移动端浏览器 / 移动端微信浏览器 ) , 加载对应的处理逻辑
                                if (navigator.userAgent.toLowerCase().match(/micromessenger/i)) {
                                    // 移动端微信浏览器
                                    // 加载微信 JS SDK
                                    Chaos.Functions.DynamicLoading.JS("https://res.wx.qq.com/open/js/jweixin-1.6.0.js");
                                    // 配置微信 JS SDK
                                    var chaosWxJsSdkLoadTimer = setInterval(function () {
                                        if (typeof (wx) === "object") {
                                            clearInterval(chaosWxJsSdkLoadTimer);
                                            // 请求接口获取签名
                                            Chaos.Functions.XHR.GET(Chaos.Infos.Apis.TKE + "/events/advertising-materials/wechat/official-account/js-sdk-signature?app-id=wx9a726689d50fc3d9", function (XHR) {
                                                if (typeof (XHR.responseJson) == "object") {
                                                    if (XHR.responseJson.Code !== 0) {
                                                        alert("请求出错 : " + XHR.responseJson.Error);
                                                    } else {
                                                        wx.config({
                                                            // debug: true, // 调试时可开启
                                                            appId: 'wx9a726689d50fc3d9', // AppID
                                                            timestamp: XHR.responseJson.Timestamp, // 必填
                                                            nonceStr: XHR.responseJson.NonceString, // 必填
                                                            signature: XHR.responseJson.Signature, // 必填
                                                            jsApiList: ['chooseImage'], // 必填，随意一个接口即可 
                                                            openTagList:['wx-open-launch-weapp'], // 填入打开小程序的开放标签名
                                                        })
                                                        // 给每个元素添加微信开放标签作为父元素
                                                        for (var i = doms.length-1; i >= 0; i -= 1) {
                                                            if (typeof doms[i].getAttribute("data-mp-username") === "string" && doms[i].getAttribute("data-mp-username").length > 0 && typeof doms[i].getAttribute("data-page") === "string" && doms[i].getAttribute("data-page").length > 0) { // 判断是否填写了 原始 ID 及 Page ( 先判断属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                                                var openTag = document.createElement('wx-open-launch-weapp');
                                                                openTag.setAttribute("username", doms[i].getAttribute("data-mp-username"));
                                                                openTag.setAttribute("path", doms[i].getAttribute("data-page") + "?scene=" + Chaos.Infos.Suffix);
                                                                var tempDom = doms[i];
                                                                doms[i].parentNode.replaceChild(openTag, doms[i]);
                                                                var template = document.createElement('template');
                                                                template.content.appendChild(tempDom); // 必须添加到 template 对象的 .content 中, 否则会出现 template 节点为空的问题
                                                                openTag.appendChild(template);
                                                                wechatMpLinkCount++;
                                                            } else {
                                                                Chaos.Functions.Logger({ Type: 'warn', Info: '个人后缀 微信小程序链接 [ '+key+' ] 配置不正确！' });
                                                            }
                                                        }
                                                        Chaos.Functions.Logger({ Type: "info", Info: "个人后缀 微信小程序链接 填充完成，共填充 " + wechatMpLinkCount + " 个." });
                                                    }
                                                } else {
                                                    alert("请求出错");
                                                }
                                            });
                                        }
                                    }, 500);
                                } else if (!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|IEMobile)/i)) {
                                    // PC 端
                                    // 加载样式表
                                    Chaos.Functions.DynamicLoading.CSS(Chaos.Infos.Path + "template/mp-link-pop.css");
                                    // 加载弹窗代码;
                                    var pop = document.createElement("div");
                                    pop.classList.add("chaos-v5wechat-mp-link-pop");
                                    pop.innerHTML = "<div>使用微信扫码查看</div><img src=\"\">";
                                    document.getElementsByTagName("chaos-v5")[0].appendChild(pop);
                                    // 添加事件
                                    Object.keys(doms).forEach(function (key) {
                                        if (typeof doms[key].getAttribute("data-appid") === "string" && doms[key].getAttribute("data-appid").length > 0 && typeof doms[key].getAttribute("data-page") === "string" && doms[key].getAttribute("data-page").length > 0) { // 判断是否填写了 AppID 及 Page ( 先判断属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                            // 添加事件
                                            doms[key].addEventListener("click", function () {
                                                Chaos.Functions.ShowByClass("hl-cover,chaos-v5wechat-mp-link-pop"); // 弹出窗口
                                                document.getElementsByClassName("chaos-v5wechat-mp-link-pop")[0].getElementsByTagName("img")[0].setAttribute("src", Chaos.Infos.Apis.TKE + "/events/advertising-materials/wechat/mini-program/qr-code/suffix/" + Chaos.Infos.Suffix + "?app-id="+this.getAttribute("data-appid")+"&page="+this.getAttribute("data-page"));
                                                // 添加关闭事件
                                                document.getElementsByClassName("hl-cover")[0].addEventListener("click", function() {
                                                    Chaos.Functions.HideByClass("hl-cover,chaos-v5wechat-mp-link-pop");
                                                });
                                            })
                                            wechatMpLinkCount++;
                                        } else {
                                            Chaos.Functions.Logger({ Type: 'warn', Info: '个人后缀 微信小程序链接 [ '+key+' ] 配置不正确！' });
                                        }
                                    });
                                    Chaos.Functions.Logger({ Type: "info", Info: "个人后缀 微信小程序链接 填充完成，共填充 " + wechatMpLinkCount + " 个." });
                                } else {
                                    // 移动端浏览器
                                    // 给每个元素添加事件监听
                                    Object.keys(doms).forEach(function (key) {
                                        if (typeof doms[key].getAttribute("data-appid") === "string" && doms[key].getAttribute("data-appid").length > 0 && typeof doms[key].getAttribute("data-page") === "string" && doms[key].getAttribute("data-page").length > 0) { // 判断是否填写了 AppID 及 Page ( 先判断属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                            // 添加事件
                                            doms[key].addEventListener("click", function () {
                                                // 弹出 tips
                                                var tips = document.createElement("div");
                                                tips.setAttribute("style", "background: rgba(0, 0, 0, 0.8);font-size: 24px;color: #fff;width: 200px;text-align: center;border-radius: 5px;position: fixed;top: 50%;left: 50%;margin-left: -100px;");
                                                tips.innerText = "正在准备跳转...";
                                                document.getElementsByTagName("chaos-v5")[0].appendChild(tips);
                                                // 请求接口获取 URL Schema
                                                Chaos.Functions.XHR.GET(Chaos.Infos.Apis.TKE + "/events/advertising-materials/wechat/mini-program/url-schema?app-id="+this.getAttribute("data-appid")+"&path="+this.getAttribute("data-page")+"&suffix="+Chaos.Infos.Suffix, function (XHR) {
                                                    if (typeof (XHR.responseJson) == "object") {
                                                        if (XHR.responseJson.Code !== 0) {
                                                            alert("请求出错 : " + XHR.responseJson.Error);
                                                        } else {
                                                            // 跳转到 URL Schema
                                                            location.href = XHR.responseJson.URLSchema;
                                                        }
                                                    } else {
                                                        alert("请求出错");
                                                    }
                                                })
                                            })
                                            wechatMpLinkCount++;
                                        } else {
                                            Chaos.Functions.Logger({ Type: 'warn', Info: '个人后缀 微信小程序链接 [ '+key+' ] 配置不正确！' });
                                        }
                                    });
                                    Chaos.Functions.Logger({ Type: "info", Info: "个人后缀 微信小程序链接 填充完成，共填充 " + wechatMpLinkCount + " 个." });
                                }
                            }
                        }

                        // 加载小能咨询插件
                        Chaos.Functions.DynamicLoading.JS("https://dl.ntalker.com/js/xn6/ntkfstat.js?siteid=kf_10353");
                        // 填充 个人后缀 小能
                        if (Chaos.Infos.Suffix !== null) {
                            Chaos.Functions.Logger({ Type: "info", Info: "开始填充 个人后缀 小能." });
                            var count = 0, ntalkerDoms = document.getElementsByClassName("chaos-v5-ntalker");
                            Object.keys(ntalkerDoms).forEach(function (key) {
                                ntalkerDoms[key].addEventListener("click", function () {
                                    if (typeof NTKF === "function") {
                                        NTKF.im_openInPageChat(Chaos.Infos.NTalkerGID)
                                    } else {
                                        alert("正在努力加载中～")
                                    }
                                })
                                count++;
                            });
                            Chaos.Functions.Logger({ Type: "info", Info: "个人后缀 小能 填充完成，共填充 " + count + " 个." });
                        }

                        // 判断终端类型, 加载对应悬浮
                        if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                            Chaos.Functions.DynamicLoading.CSS(Chaos.Infos.Path + "template/float-mobile.css");
                            Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "template/float-mobile.js");
                            Chaos.Functions.Logger({ Type: "info", Info: "当前终端类型为移动端, 已加载移动端悬浮." });
                        }else{
                            Chaos.Functions.DynamicLoading.CSS(Chaos.Infos.Path + "template/float-pc.css");
                            Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "template/float-pc.js");
                            Chaos.Functions.Logger({ Type: "info", Info: "当前终端类型为PC端, 已加载PC端悬浮." });
                        }
                         
                        // 如果未登过该活动，则根据登陆模块类型进入拦截逻辑
                        if (Chaos.Infos.IsLogin && Chaos.Infos.Type !== "callback" && Chaos.Infos.Type !== "page") {
                            Chaos.Functions.Logger({ Type: "info", Info: "用户已经登陆，跳过拦截逻辑." });
                            // 登陆模块加载状态 完成
                            Chaos.Infos.Completed = true;
                        } else {
                            switch (Chaos.Infos.Type) {
                                // 拦截 a 标签
                                case "a-tag":
                                    Object.keys(document.getElementsByClassName("need2login")).forEach(function (keyX) {
                                        Object.keys(document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")).forEach(function (keyY) {
                                            // 向 a 标签增加新属性 data-chaos-href
                                            document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].setAttribute("data-chaos-href", document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].getAttribute("href"));
                                            // 移除 a 标签原有的属性 href
                                            document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].setAttribute("href", "#");
                                            // 移除 a 标签原有的属性 target
                                            document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].setAttribute("target", "");
                                            // 监听点击事件
                                            document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].addEventListener("click", function (event) {
                                                event.preventDefault() // 阻止a标签默认事件
                                                if (!Chaos.Infos.IsLogin) {
                                                    Chaos.Functions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                                                } else {
                                                    if (typeof (event.target.attributes["data-chaos-href"]) !== "undefined") {
                                                        window.open(event.target.attributes["data-chaos-href"].value);
                                                    } else {
                                                        // a 标签内嵌套的元素被点击时，event 的主体为内部元素，所以要获取 a 标签的属性需要增加 parentElement
                                                        window.open(event.target.parentElement.attributes["data-chaos-href"].value);
                                                    }
                                                }
                                            });
                                        });
                                    });
                                    Chaos.Functions.Logger({ Type: 'info', Info: '当前使用的登陆模块为: 拦截 a 标签版.' });
                                    break;
                                // 拦截全部 a 标签
                                case "all-a-tag":
                                    Object.keys(document.getElementsByTagName("a")).forEach(function (key) {
                                        // 向 a 标签增加新属性 data-chaos-href
                                        document.getElementsByTagName("a")[key].setAttribute("data-chaos-href", document.getElementsByTagName("a")[key].getAttribute("href"));
                                        // 移除 a 标签原有的属性 href
                                        document.getElementsByTagName("a")[key].setAttribute("href", "#");
                                        // 移除 a 标签原有的属性 target
                                        document.getElementsByTagName("a")[key].setAttribute("target", "");
                                        // 监听点击事件
                                        document.getElementsByTagName("a")[key].addEventListener("click", function (event) {
                                            event.preventDefault() // 阻止a标签默认事件
                                            if (!Chaos.Infos.IsLogin) {
                                                Chaos.Functions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                                            } else {
                                                if (typeof (event.target.attributes["data-chaos-href"]) !== "undefined") {
                                                    window.open(event.target.attributes["data-chaos-href"].value);
                                                } else {
                                                    // a 标签内嵌套的元素被点击时，event 的主体为内部元素，所以要获取 a 标签的属性需要增加 parentElement
                                                    window.open(event.target.parentElement.attributes["data-chaos-href"].value);
                                                }
                                            }
                                        });
                                    });
                                    Chaos.Functions.Logger({ Type: 'info', Info: '当前使用的登陆模块为: 拦截全部 a 标签版.' });
                                    break;
                                // 登陆中间件 回调函数
                                case "callback":
                                    Chaos.Hooks.Login = function (callback) {
                                        if (!Chaos.Infos.IsLogin) {
                                            Chaos.Functions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                                        } else {
                                            callback(Chaos.Infos.Phone) // 调用回调函数
                                        }
                                    };
                                    // 二次判断登陆状态，如果已经登陆，跳过后续加载组件的步骤
                                    if (Chaos.Infos.IsLogin) {
                                        Chaos.Functions.Logger({ Type: 'info', Info: '用户已经登陆, 未加载登陆模板.' });
                                        // 登陆模块加载状态 完成
                                        Chaos.Infos.Completed = true;
                                        return;
                                    }
                                    break;
                                // 登陆中间件 页面嵌入式表单
                                case "page":
                                    // 判断是否存在组件
                                    if (document.getElementsByClassName("chaos-login-page-form").length === 0 || document.getElementsByClassName("chaos-login-page-is-login").length === 0) {
                                        alert("哈士齐登陆模块配置有误, 缺少页面元素!");
                                        return
                                    }
                                    // 判断登陆状态
                                    if (Chaos.Infos.IsLogin) {
                                        // 已登陆
                                        // 调用 提交后事件处理钩子
                                        if (typeof Chaos.Hooks.AfterSubmit === "function") {
                                            Chaos.Hooks.AfterSubmit(Chaos.Infos.Phone);
                                        } else {
                                            Chaos.Functions.Logger({ Type: 'info', Info: '未定义 Chaos.Hooks.AfterSubmit ( 提交后事件处理钩子 ) , 跳过登陆回调.' });
                                        }
                                        // 切换到已登陆 DIV
                                        Chaos.Functions.ShowByClass("chaos-login-page-is-login");
                                        Chaos.Functions.Logger({ Type: 'info', Info: '用户已经登陆, 未加载登陆模板.' });
                                        // 登陆模块加载状态 完成
                                        Chaos.Infos.Completed = true;
                                        return;
                                    } else {
                                        // 未登陆，加载页面模板
                                        Chaos.Functions.ShowByClass("chaos-login-page-form");
                                        // 加载样式表
                                        Chaos.Functions.DynamicLoading.CSS(Chaos.Infos.Path + "template/page.css");
                                        // 渲染手机号登陆组件
                                        Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "template/page.js");
                                        var templateTimer = setInterval(function () {
                                            if (typeof (Chaos.Templates.HTML) === "string") {
                                                clearInterval(templateTimer);
                                                // 判断是否存在可选组件
                                                if (document.getElementsByClassName("chaos-login-page-optional").length !== 0) {
                                                    // 拼接可选组件后，加载登陆组件 HTML
                                                    document.getElementsByClassName("chaos-login-page-form")[0].innerHTML = document.getElementsByClassName("chaos-login-page-optional")[0].innerHTML + Chaos.Templates.HTML;
                                                    document.getElementsByClassName("chaos-login-page-optional")[0].remove();
                                                } else {
                                                    // 直接加载登陆组件 HTML
                                                    document.getElementsByClassName("chaos-login-page-form")[0].innerHTML = Chaos.Templates.HTML;
                                                }
                                                Chaos.Functions.Logger({ Type: 'info', Info: '手机号登陆模板 ( 页面版 ) 加载成功.' });
                                                // 加载处理函数
                                                Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "template/page-functions.min.js")
                                            }
                                        }, 500);
                                        return
                                    }
                                default:
                                    // 登陆模块加载状态 完成
                                    Chaos.Infos.Completed = true;
                                    // 加载 light 模块
                                    Chaos.Functions.Logger({ Type: 'info', Info: '当前使用的登陆模块为: 轻量版.' });
                                    // 直接结束后续程序执行
                                    return;
                            }

                            // 加载样式表
                            Chaos.Functions.DynamicLoading.CSS(Chaos.Infos.Path + "template/page.css");
                            Chaos.Functions.DynamicLoading.CSS(Chaos.Infos.Path + "template/phone.css");
                            // 渲染手机号登陆组件
                            Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "template/phone.js");
                            var templateTimer = setInterval(function () {
                                if (typeof (Chaos.Templates.HTML) === "string") {
                                    clearInterval(templateTimer);
                                    // 加载登陆组件 HTML
                                    document.getElementsByTagName('chaos-v5')[0].innerHTML += Chaos.Templates.HTML;
                                    Chaos.Functions.Logger({ Type: 'info', Info: '手机号登陆模板加载成功.' });
                                    // 加载处理函数
                                    Chaos.Functions.DynamicLoading.JS(Chaos.Infos.Path + "template/phone-functions.min.js")
                                }
                            }, 500);
                        }
                    }
                })
            }
        }, 500)
    }, 500)
})()
