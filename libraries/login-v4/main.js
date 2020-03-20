(function () {
    const VER = "哈士齐营销平台单点登录模块 ( Project Chaos Single Sign On Module @ 20200309 1342)";

    ChaosFunctions = {
        Logger: function (log) {
            // log = {Type: ""( log / info / warn / error / table ), Info : ""}
            // https://www.runoob.com/w3cnote/javascript-console-object.html
            // 日志组件等待时间
            let waitMillisecond = 1000 * 5;
            // 初始化日志对象
            if (typeof ChaosFunctions.Logs !== "object") {
                ChaosFunctions.Logs = {
                    Log: [],
                    Timer: null
                }
            }
            if (ChaosFunctions.Logs.Timer === null) {
                // console.log("初始化日志打印定时器");
                ChaosFunctions.Logs.Timer = setInterval(function () {
                    // 判断最后一条日志距离入栈时间是否足够
                    // console.log((new Date()).valueOf() < (ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond));
                    // console.log((ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond));
                    // console.log((new Date()).valueOf());
                    if ((new Date()).valueOf() < (ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond)) {
                        // console.log("跳过打印");
                        return
                    }
                    // console.log("开始打印日志");
                    clearInterval(ChaosFunctions.Logs.Timer); // 结束定时器
                    ChaosFunctions.Logs.Timer = null; // 清空定时器
                    // 将显示的信息分组
                    console.group(VER);
                    // 遍历日志对象
                    ChaosFunctions.Logs.Log.forEach(function (log) {
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
                    ChaosFunctions.Logs.Log = [];
                }, 1000 * 5);
            }
            // console.log(this) // == ChaosFunctions
            log.Time = (new Date()); // 直接使用 Date() 返回的是当前时间的字符串， (new Date()) 才可以获取到当前时间的对象。
            ChaosFunctions.Logs.Log.push(log);
        },
        Attr: function (node, attr, defaultValue) { // 获取节点 attr 属性的值
            return node.getAttribute(attr) || defaultValue;
        }, // https://github.com/hustcc/ribbon.js/blob/master/src/ribbon.js
        ShowByClass: function (classes) { // 根据 class 列表显示元素
            if (typeof (classes) == "string") {
                let classArray = classes.split(",");
                for (let i = 0; i < classArray.length; i++) {
                    Object.keys(document.getElementsByClassName(classArray[i])).forEach(function (key) {
                        //console.log(key, document.getElementsByClassName(classArray[i])[key].style.display = "block");
                        document.getElementsByClassName(classArray[i])[key].style.display = "block";
                    });
                }
            }
        },
        HideByClass: function (classes) { // 根据 class 列表隐藏元素
            if (typeof (classes) == "string") {
                let classArray = classes.split(",");
                for (let i = 0; i < classArray.length; i++) {
                    Object.keys(document.getElementsByClassName(classArray[i])).forEach(function (key) {
                        //console.log(key, document.getElementsByClassName(classArray[i])[key].style.display = "none");
                        document.getElementsByClassName(classArray[i])[key].style.display = "none";
                    });
                }
            }
        },
        DynamicLoading: { // 异步加载 CSS 与 JS
            CSS: function (c) {
                if (!c || c.length === 0) {
                    throw new Error("argument 'path' is required !")
                }
                var a = document.getElementsByTagName("chaos-v4")[0];
                var b = document.createElement("link");
                b.href = c;
                b.rel = "stylesheet";
                b.type = "text/css";
                a.appendChild(b)
            },
            JS: function (c) {
                if (!c || c.length === 0) {
                    throw new Error("argument 'path' is required !")
                }
                var b = document.getElementsByTagName("chaos-v4")[0];
                var a = document.createElement("script");
                a.src = c;
                a.type = "text/javascript";
                b.appendChild(a)
            }
        },
        GetQueryString: function (name) {
            let r = window.location.search.substr(1).match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"));
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        Cookies: {
            Get: function (name) {
                let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg)) {
                    return unescape(arr[2]);
                } else {
                    return null;
                }
            },
            Set: function (name, value, expires) {
                let exp = new Date();
                exp.setTime(exp.getTime() + expires); // Days * 24 * 60 * 60 * 1000
                document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            },
            Delete: function (name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = getCookie(name);
                if (cval != null)
                    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        },
        XHR: {
            GET: function (url, callback) {
                let that = this;
                let xhr = that.createXHR();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源
                            // 处理返回的内容
                            try {
                                xhr.responseJson = JSON.parse(xhr.response)
                            } catch (e) {
                                ChaosFunctions.Logger({ Type: 'error', Title: "GET XHR Error：", Info: e });
                            }
                            callback(xhr);
                        } else {
                            ChaosFunctions.Logger({ Type: 'log', Info: xhr });
                            that.errorHandler(xhr);
                            return 'request is unsucessful ' + xhr.status;
                        }
                    }
                };
                xhr.open('get', url, true);
                xhr.send();
            },
            POST: function (url, data, callback) {
                let that = this;
                let xhr = that.createXHR();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {  //200 表示相应成功 304 表示缓存中存在请求的资源
                            // 处理返回的内容
                            try {
                                xhr.responseJson = JSON.parse(xhr.response)
                            } catch (e) {
                                ChaosFunctions.Logger({ Type: 'error', Title: "POST XHR Error：", Info: e });
                            }
                            callback(xhr);
                        } else {
                            ChaosFunctions.Logger({ Type: 'log', Info: xhr });
                            that.errorHandler(xhr);
                            return 'request is unsucessful ' + xhr.status;
                        }
                    }
                };
                xhr.open('post', url, true);
                xhr.send(JSON.stringify(data));
            },
            createXHR: function () {
                if (typeof XMLHttpRequest != 'undefined') {
                    return new XMLHttpRequest();
                }
                else if (typeof ActiveXObject != 'undefined') {
                    if (typeof arguments.callee.activeXString != 'string') {
                        let versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'], // ie browser different vesions
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
            },
            errorHandler: function (xhr) {
                let code = 0;
                try {
                    code = JSON.parse(xhr.response).Code
                } catch (e) {
                    ChaosFunctions.Logger({ Type: 'error', Title: "Handle Error：", Info: e });
                }

                if (code === -1) {
                    alert(JSON.parse(xhr.response).Error)
                    return
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
        }
    }

    // 获取 19课堂推广编码
    function getKey419() {
        if (ChaosFunctions.GetQueryString("scode") === null) {
            return "0"
        } else {
            return ChaosFunctions.GetQueryString("scode")
        }
    }

    // 获取手机号
    function getPhone() {
        if (ChaosFunctions.Cookies.Get("chaos-v4-phone") * 1 === NaN) {
            return 0
        } else {
            return ChaosFunctions.Cookies.Get("chaos-v4-phone") * 1
        }
    }

    ChaosSingleSignOnModuleInfo = {
        Path: ChaosFunctions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "src", "./").split("main.js")[0],
        ApiPath: "https://api.chaos.jilinoffcn.com/test",
        MID: ChaosFunctions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "chaos-v4-id", 1) * 1,
        Type: ChaosFunctions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "chaos-v4-type", "lite"),
        // Page: ChaosFunctions.Attr(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "chaos-v4-page", 0) * 1,
        Phone: getPhone(),
        IsLogin: false,
        NeedToRegister: true,
        CRMID: 0,
        CRMChannel: 7,
        CRMUser: "",
        CRMOID: 0,
        CRMOName: "",
        Key419: getKey419(),
        Completed: false
    }
    // 根据环境配置接口地址
    if (ChaosSingleSignOnModuleInfo.Path.split(".")[0].split("https://")[1] === "test") {
        ChaosSingleSignOnModuleInfo.ApiPath = "https://api.chaos.jilinoffcn.com/test";  // 测试环境
    } else if (ChaosSingleSignOnModuleInfo.Path.split(".")[0].split("https://")[1] === "statics") {
        ChaosSingleSignOnModuleInfo.ApiPath = "https://api.chaos.jilinoffcn.com/release";  // 生产环境
    } else {
        ChaosSingleSignOnModuleInfo.ApiPath = "https://api.chaos.jilinoffcn.com/test";  // 本地环境
    }
    // 设置过的全局变量列表
    let globalVariablesList = "[ ChaosFunctions ( 基础函数库 ) ] [ ChaosSingleSignOnModuleInfo ( 单点登陆模块信息 ) ]";

    let initTimer = setInterval(function () {
        // 等待 Body 被加载到 DOM 树
        if (typeof (document.getElementsByTagName("body")[0]) === "object") {
            clearInterval(initTimer);

            // 判断 Dom 是否存在 Chaos-v4 标签
            if (typeof (document.getElementsByTagName('chaos-v4')[0]) !== "object") {
                // 向 Dom 中添加 Chaos-v4 标签
                let chaosNode = document.createElement("chaos-v4");
                chaosNode.setAttribute("chaos-v4-id", ChaosSingleSignOnModuleInfo.MID)
                chaosNode.setAttribute("chaos-v4-type", ChaosSingleSignOnModuleInfo.Type)
                // if (ChaosSingleSignOnModuleInfo.Type === "book") {
                //     chaosNode.setAttribute("chaos-v4-page", ChaosSingleSignOnModuleInfo.Page)
                // }
                document.getElementsByTagName("body")[0].appendChild(chaosNode)
            } else {
                // 设置 Chaos 标签的属性
                document.getElementsByTagName('chaos-v4')[0].setAttribute("chaos-v4-id", ChaosSingleSignOnModuleInfo.MID)
                document.getElementsByTagName('chaos-v4')[0].setAttribute("chaos-v4-type", ChaosSingleSignOnModuleInfo.Type)
                // if (ChaosSingleSignOnModuleInfo.Type === "book") {
                //     document.getElementsByTagName('chaos-v4')[0].setAttribute("chaos-v4-page", ChaosSingleSignOnModuleInfo.Page)
                // }
            }

            // 加载代码表
            ChaosFunctions.DynamicLoading.JS(ChaosSingleSignOnModuleInfo.Path + "../codes.js");

            // 等待代码表加载完成
            initTimer = setInterval(function () {
                if (typeof (ChaosCodes) === "object") {
                    clearInterval(initTimer);

                    // 调用检查登陆状态接口检查是否已经登陆
                    ChaosFunctions.XHR.GET(ChaosSingleSignOnModuleInfo.ApiPath + "/events/SSO/session/" + ChaosSingleSignOnModuleInfo.MID + "/" + ChaosSingleSignOnModuleInfo.Key419 + "/" + ChaosSingleSignOnModuleInfo.Phone, function (xhr) {
                        if (typeof (xhr.responseJson) == "object") {
                            ChaosSingleSignOnModuleInfo.IsLogin = xhr.responseJson.IsLogin
                            ChaosSingleSignOnModuleInfo.NeedToRegister = xhr.responseJson.NeedToRegister
                            ChaosSingleSignOnModuleInfo.CRMChannel = xhr.responseJson.Details.CRMChannel
                            ChaosSingleSignOnModuleInfo.CRMID = xhr.responseJson.Details.CRMID
                            ChaosSingleSignOnModuleInfo.CRMUser = xhr.responseJson.Details.CRMUser
                            ChaosSingleSignOnModuleInfo.CRMOID = xhr.responseJson.Details.CRMOID
                            ChaosSingleSignOnModuleInfo.CRMOName = xhr.responseJson.Details.CRMOName
                            if (xhr.responseJson.Details.Key419.length > 1) {
                                ChaosSingleSignOnModuleInfo.Key419 = xhr.responseJson.Details.Key419
                            } else {
                                ChaosSingleSignOnModuleInfo.Key419 = "0"
                            }

                            // 延长 Cookie 有效期
                            if (!ChaosSingleSignOnModuleInfo.NeedToRegister) {
                                ChaosFunctions.Cookies.Set("chaos-v4-phone", ChaosSingleSignOnModuleInfo.Phone, 30 * 24 * 60 * 60 * 1000);
                            }

                            // 填充 专题 后缀
                            if ( ChaosSingleSignOnModuleInfo.Key419 !== "0" ) {
                                ChaosFunctions.Logger({ Type: 'info', Info: '开始填充 「 专题 」 个人后缀.' });
                                let count = 0, doms = document.getElementsByClassName("chaos-v4-link-article");
                                Object.keys(doms).forEach(function (key) {
                                    doms[key].href = doms[key].href + "?scode=" + ChaosSingleSignOnModuleInfo.Key419;
                                    count++;
                                });
                                ChaosFunctions.Logger({ Type: 'info', Info: '「 专题 」 个人后缀填充完成，共填充 ' + count + ' 个。' });
                            }

                            // 填充 19课堂 后缀
                            if ( ChaosSingleSignOnModuleInfo.Key419 !== "0" ) {
                                ChaosFunctions.Logger({ Type: "info", Info: "开始填充 「 19 课堂 」 个人后缀." });
                                let count = 0, doms = document.getElementsByClassName("chaos-v4-link-19");
                                Object.keys(doms).forEach(function (key) {
                                    if (typeof doms[key].href === "string" && doms[key].href.length > 0) {
                                        doms[key].href = doms[key].href + "?scode=" + ChaosSingleSignOnModuleInfo.Key419;
                                        count++;
                                    }
                                });
                                ChaosFunctions.Logger({ Type: "info", Info: "「 19 课堂 」 个人后缀填充完成，共填充 " + count + " 个." });
                            }

                            // 设置 图片链接
                            if ( ChaosSingleSignOnModuleInfo.Key419 !== "0" ) {
                                ChaosFunctions.Logger({ Type: "info", Info: "开始设置 「图片链接」." });
                                let count = 0, imageDoms = document.getElementsByClassName("chaos-v4-image");
                                Object.keys(imageDoms).forEach(function (key) {
                                    if (typeof imageDoms[key].getAttribute("src") === "string" && imageDoms[key].getAttribute("src").length > 0) { // 判断是否填写了图片链接 ( 先判断 src 属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                        let filePath = imageDoms[key].getAttribute("src").substring(0, imageDoms[key].getAttribute("src").lastIndexOf("/") + 1),
                                            fileExtension = imageDoms[key].getAttribute("src").substring(imageDoms[key].getAttribute("src").lastIndexOf("."));
                                        imageDoms[key].src = filePath + ChaosSingleSignOnModuleInfo.Key419 + fileExtension;
                                        count++;
                                    }
                                });
                                ChaosFunctions.Logger({ Type: "info", Info: "「图片链接」 设置完成，共设置 " + count + " 个." });
                            }

                            // 如果未登过该专题，则根据登陆模块类型进入拦截逻辑
                            if (ChaosSingleSignOnModuleInfo.IsLogin && ChaosSingleSignOnModuleInfo.Type !== "callback-phone-only" && ChaosSingleSignOnModuleInfo.Type !== "page") {
                                ChaosFunctions.Logger({ Type: 'info', Info: '用户已经登陆，跳过拦截逻辑.' });
                            } else {
                                switch (ChaosSingleSignOnModuleInfo.Type) {
                                    case "a-tag": // 拦截 a 标签
                                        Object.keys(document.getElementsByClassName("need2login")).forEach(function (keyX) {
                                            Object.keys(document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")).forEach(function (keyY) {
                                                // 向 a 标签增加新属性 chaos-href
                                                document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].setAttribute("chaos-href", document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].getAttribute("href"));
                                                // 移除 a 标签原有的属性 href
                                                document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].setAttribute("href", "#");
                                                // 移除 a 标签原有的属性 target
                                                document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].setAttribute("target", "");
                                                // 监听点击事件
                                                document.getElementsByClassName("need2login")[keyX].getElementsByTagName("a")[keyY].addEventListener("click", function (event) {
                                                    //console.log(event)
                                                    event.preventDefault() // 阻止a标签默认事件
                                                    if (!ChaosSingleSignOnModuleInfo.IsLogin) {
                                                        ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                                                    } else {
                                                        if (typeof (event.target.attributes["chaos-href"]) !== "undefined") {
                                                            window.open(event.target.attributes["chaos-href"].value);
                                                        } else {
                                                            // a 标签内嵌套的元素被点击时，event 的主体为内部元素，所以要获取 a 标签的属性需要增加 parentElement
                                                            window.open(event.target.parentElement.attributes["chaos-href"].value);
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                        ChaosFunctions.Logger({ Type: 'info', Info: '当前使用的登陆模块为: 拦截 a 标签版.' });
                                        break;
                                    case "all-a-tag": // 拦截 a 标签
                                        Object.keys(document.getElementsByTagName("a")).forEach(function (key) {
                                            // 向 a 标签增加新属性 chaos-href
                                            document.getElementsByTagName("a")[key].setAttribute("chaos-href", document.getElementsByTagName("a")[key].getAttribute("href"));
                                            // 移除 a 标签原有的属性 href
                                            document.getElementsByTagName("a")[key].setAttribute("href", "#");
                                            // 移除 a 标签原有的属性 target
                                            document.getElementsByTagName("a")[key].setAttribute("target", "");
                                            // 监听点击事件
                                            document.getElementsByTagName("a")[key].addEventListener("click", function (event) {
                                                event.preventDefault() // 阻止a标签默认事件
                                                if (!ChaosSingleSignOnModuleInfo.IsLogin) {
                                                    ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                                                } else {
                                                    if (typeof (event.target.attributes["chaos-href"]) !== "undefined") {
                                                        window.open(event.target.attributes["chaos-href"].value);
                                                    } else {
                                                        // a 标签内嵌套的元素被点击时，event 的主体为内部元素，所以要获取 a 标签的属性需要增加 parentElement
                                                        window.open(event.target.parentElement.attributes["chaos-href"].value);
                                                    }
                                                }
                                            });
                                        });
                                        ChaosFunctions.Logger({ Type: 'info', Info: '当前使用的登陆模块为: 拦截全部 a 标签版.' });
                                        break;
                                    // case "book": // 电子书
                                    //     ChaosFunctions.DynamicLoading.JS(ChaosPath + "book.js")
                                    //     break;
                                    case "callback-phone-only":
                                        // 登陆中间件 ( 携带电话号码 )
                                        ChaosHandlerWithPhone = function (callback) {
                                            if (!ChaosSingleSignOnModuleInfo.IsLogin) {
                                                ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                                            } else {
                                                callback(ChaosSingleSignOnModuleInfo.Phone) // 调用回调函数
                                            }
                                        };
                                        globalVariablesList += " [ ChaosHandlerWithPhone ( 携带电话号码的登陆中间件 ) ]";
                                        // 二次判断登陆状态，如果已经登陆，跳过后续加载组件的步骤
                                        if (ChaosSingleSignOnModuleInfo.IsLogin) {
                                            ChaosFunctions.Logger({ Type: 'warn', Info: '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！' });
                                            ChaosFunctions.Logger({ Type: 'info', Info: '用户已经登陆, 未加载登陆模板.' });
                                            ChaosSingleSignOnModuleInfo.Completed = true;
                                            return;
                                        } else {
                                            break;
                                        }
                                    case "page":
                                        // 判断是否存在组件
                                        if ( document.getElementsByClassName("chaos-login-page-form").length === 0 || document.getElementsByClassName("chaos-login-page-is-login").length === 0 ) {
                                            alert("哈士齐登陆模块配置有误, 缺少页面元素!");
                                            return
                                        }
                                        // 判断登陆状态
                                        if (ChaosSingleSignOnModuleInfo.IsLogin) {
                                            // 已登陆
                                            // 调用 提交后事件处理钩子
                                            if ( typeof ChaosPageAfterSubmitHook === "function" ) {
                                                ChaosPageAfterSubmitHook(ChaosSingleSignOnModuleInfo.Phone);
                                            } else {
                                                ChaosFunctions.Logger({ Type: 'info', Info: '未定义 ChaosPageAfterSubmitHook ( 提交后事件处理钩子 ) , 跳过登陆回调.' });
                                            }
                                            // 切换到已登陆 DIV
                                            ChaosFunctions.ShowByClass("chaos-login-page-is-login");
                                            ChaosFunctions.Logger({ Type: 'warn', Info: '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！' });
                                            ChaosFunctions.Logger({ Type: 'info', Info: '用户已经登陆, 未加载登陆模板.' });
                                            ChaosSingleSignOnModuleInfo.Completed = true;
                                            return;
                                        } else {
                                            // 未登陆，加载页面模板
                                            ChaosFunctions.ShowByClass("chaos-login-page-form");
                                            // 加载样式表
                                            ChaosFunctions.DynamicLoading.CSS(ChaosSingleSignOnModuleInfo.Path + "template/page.css");
                                            // 渲染手机号登陆组件
                                            ChaosFunctions.DynamicLoading.JS(ChaosSingleSignOnModuleInfo.Path + "template/page.js");
                                            let templateTimer = setInterval(function () {
                                                if (typeof (ChaosTemplate) === "string") {
                                                    clearInterval(templateTimer);
                                                    // 加载登陆组件 HTML
                                                    document.getElementsByClassName("chaos-login-page-form")[0].innerHTML = ChaosTemplate;
                                                    ChaosFunctions.Logger({ Type: 'info', Info: '手机号登陆模板 ( 页面版 ) 加载成功.' });
                                                    // 加载处理函数
                                                    ChaosFunctions.DynamicLoading.JS(ChaosSingleSignOnModuleInfo.Path + "template/page-functions.js")
                                                    ChaosFunctions.Logger({ Type: 'warn', Info: '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！' });
                                                }
                                            }, 500);
                                            return;
                                        }
                                    default:
                                        ChaosFunctions.Logger({ Type: 'warn', Info: '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！' });
                                        // 加载 light 模块
                                        ChaosFunctions.Logger({ Type: 'info', Info: '当前使用的登陆模块为: 轻量版.' });
                                        // 直接结束后续程序执行
                                        return;
                                }

                                // 加载样式表
                                ChaosFunctions.DynamicLoading.CSS(ChaosSingleSignOnModuleInfo.Path + "template/phone.css");
                                // 渲染手机号登陆组件
                                ChaosFunctions.DynamicLoading.JS(ChaosSingleSignOnModuleInfo.Path + "template/phone.js");
                                let templateTimer = setInterval(function () {
                                    if (typeof (ChaosTemplate) === "string") {
                                        clearInterval(templateTimer);
                                        // 加载登陆组件 HTML
                                        document.getElementsByTagName('chaos-v4')[0].innerHTML += ChaosTemplate;
                                        ChaosFunctions.Logger({ Type: 'info', Info: '手机号登陆模板加载成功.' });
                                        // 加载处理函数
                                        ChaosFunctions.DynamicLoading.JS(ChaosSingleSignOnModuleInfo.Path + "template/phone-functions.js")
                                    }
                                }, 500);
                            }
                            ChaosFunctions.Logger({ Type: 'warn', Info: '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！' });
                        }
                    });
                }
            }, 500);
        }
    }, 500);
})();