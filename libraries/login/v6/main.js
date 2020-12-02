// 模块根节点
var 哈士齐单点登陆模块 = {
    // 模块基本信息
    模块信息: {
        名称: "哈士齐单点登陆模块 ( Single Sign On Module )",
        版本: "20201110"
    },
    // 公共函数
    公共函数: {
        // 获取节点指定属性名的属性值
        // https://github.com/hustcc/ribbon.js/blob/master/src/ribbon.js
        获取节点属性值: function (节点, 属性名, 默认值) {
            return 节点.getAttribute(属性名) || 默认值
        },
        // Cookies 操作工具
        Cookies: {
            // 获取 Cookie
            获取: function (属性名) {
                var arr, reg = new RegExp("(^| )" + 属性名 + "=([^;]*)(;|$)");
                if (arr = document.cookie.match(reg)) {
                    return unescape(arr[2])
                } else {
                    return null
                }
            },
            // 设置 Cookie
            设置: function (属性名, 值, 过期时间) {
                var exp = new Date();
                exp.setTime(exp.getTime() + 过期时间) // Days * 24 * 60 * 60 * 1000
                document.cookie = 属性名 + "=" + escape(值) + ";SameSite=Strict;Path=/;Expires=" + exp.toGMTString() // 添加 SameSite=Strict; 修正浏览器弹出警告的问题 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite
            },
            // 删除 Cookie
            // 由于需要保证 this 的作用域指向本对象, 所以不使用箭头函数
            删除: function (属性名) {
                var exp = new Date()
                exp.setTime(exp.getTime() - 1)
                var cval = this.Get(属性名)
                if (cval != null)
                    document.cookie = 属性名 + "=" + cval + ";Path=/;Expires=" + exp.toGMTString()
            }
        },
        // 查询字符串操作工具
        Get参数: function (属性名) {
            var r = window.location.search.substr(1).match(new RegExp("(^|&)" + 属性名 + "=([^&]*)(&|$)", "i"))
            if (r != null) {
                return unescape(r[2])
            }
            return null
        },
        // 异步加载 CSS 与 JS 工具
        异步加载: {
            CSS: function (CSS链接) {
                if (!CSS链接 || CSS链接.length === 0) {
                    throw new Error("参数 'CSS链接' 是必填项 !")
                }
                var 单点登陆模块DOM对象 = document.getElementsByTagName("offcn-sso")[0]
                var 新CSS的DOM对象 = document.createElement("link")
                新CSS的DOM对象.href = CSS链接
                新CSS的DOM对象.rel = "stylesheet"
                新CSS的DOM对象.type = "text/css"
                单点登陆模块DOM对象.appendChild(新CSS的DOM对象)
            },
            JS: function (JS链接) {
                if (!JS链接 || JS链接.length === 0) {
                    throw new Error("参数 'JS链接' 是必填项 !")
                }
                var 单点登陆模块DOM对象 = document.getElementsByTagName("offcn-sso")[0];
                var 新JS的DOM对象 = document.createElement("script");
                新JS的DOM对象.src = JS链接;
                新JS的DOM对象.type = "text/javascript";
                单点登陆模块DOM对象.appendChild(新JS的DOM对象)
            }
        },
        // 日志工具
        // log = {Type: ""( log / info / warn / error / table ), Info : ""}
        // https://www.runoob.com/w3cnote/javascript-console-object.html
        打印日志: function (日志内容) {
            // 日志组件等待时间
            var 打印日志延迟时间 = 1000 * 5;
            // 初始化日志对象
            if (typeof 哈士齐单点登陆模块.待打印日志 !== "object") {
                哈士齐单点登陆模块.待打印日志 = {
                    日志: [],
                    定时器: null
                }
            }
            if (哈士齐单点登陆模块.待打印日志.定时器 === null) {
                哈士齐单点登陆模块.待打印日志.定时器 = setInterval(function () {
                    // 判断最后一条日志距离入栈时间是否足够
                    if ((new Date()).valueOf() < (哈士齐单点登陆模块.待打印日志.日志[哈士齐单点登陆模块.待打印日志.日志.length - 1].入栈时间.valueOf() + 打印日志延迟时间)) {
                        // 跳过打印
                        return
                    }
                    // 开始打印日志
                    clearInterval(哈士齐单点登陆模块.待打印日志.定时器); // 结束定时器
                    哈士齐单点登陆模块.待打印日志.定时器 = null; // 清空定时器
                    // 将显示的信息分组
                    console.group(
                        "%c " + 哈士齐单点登陆模块.模块信息.名称 + " Ver." + 哈士齐单点登陆模块.模块信息.版本 + " %c " + 哈士齐单点登陆模块.公共信息.运行环境 + " %c",
                        "background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;",
                        "background:" + (哈士齐单点登陆模块.公共信息.运行环境 === "RELEASE" ? "#3488ff" : "#e6a23c") + "; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;",
                        "background:transparent"
                    )
                    // 遍历日志对象
                    哈士齐单点登陆模块.待打印日志.日志.forEach(function (日志) {
                        switch (日志.类型) {
                            case "信息":
                                console.info(日志.入栈时间 + " >> " + 日志.内容)
                                break;
                            case "警告":
                                console.warn(日志.入栈时间 + " >> " + 日志.内容)
                                break;
                            case "错误":
                                console.error(日志.入栈时间 + " >> " + 日志.标题)
                                console.error(日志.内容)
                                break;
                            case "对象":
                                console.info(日志.入栈时间 + " >> " + 日志.标题)
                                console.table(日志.内容)
                                break;
                            default:
                                console.log(日志.入栈时间 + " >> " + 日志.内容)
                        }
                    });
                    // 结束分组
                    console.groupEnd();
                    // 清空日志对象
                    哈士齐单点登陆模块.待打印日志.日志 = [];
                }, 1000 * 5);
            }
            日志内容.入栈时间 = (new Date()); // 直接使用 Date() 返回的是当前时间的字符串， (new Date()) 才可以获取到当前时间的对象。
            哈士齐单点登陆模块.待打印日志.日志.push(日志内容);
        },
        // XHR 工具
        XHR: {
            GET: function (链接, 回调函数) {
                var xhr = this.createXHR()
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        // 处理返回的内容
                        try {
                            if (xhr.response != "") {
                                xhr.responseJson = JSON.parse(xhr.response)
                                回调函数(xhr);
                            }
                        } catch (e) {
                            console.log(xhr)
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "错误", 标题: "发送 GET XHR 请求出错 :", 内容: e });
                        }
                    }
                };
                xhr.open("get", 链接, true);
                xhr.send();
            },
            POST: function (链接, data, 回调函数) {
                var xhr = this.createXHR();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        // 处理返回的内容
                        try {
                            if (xhr.response != "") {
                                xhr.responseJson = JSON.parse(xhr.response)
                                回调函数(xhr);
                            }
                        } catch (e) {
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "错误", 标题: "发送 POST XHR 请求出错 :", 内容: e });
                        }
                    }
                };
                xhr.open("post", 链接, true);
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
            }
        },
        // 根据 class 列表显示元素
        显示元素: function (Class列表) {
            if (typeof (Class列表) == "string") {
                var Class数组 = Class列表.split(",");
                for (var i = 0; i < Class数组.length; i++) {
                    Object.keys(document.getElementsByClassName(Class数组[i])).forEach(function (key) {
                        document.getElementsByClassName(Class数组[i])[key].style.display = "block";
                    });
                }
            }
        },
        // 根据 class 列表隐藏元素
        隐藏元素: function (Class列表) {
            if (typeof (Class列表) == "string") {
                var Class数组 = Class列表.split(",");
                for (var i = 0; i < Class数组.length; i++) {
                    Object.keys(document.getElementsByClassName(Class数组[i])).forEach(function (key) {
                        document.getElementsByClassName(Class数组[i])[key].style.display = "none";
                    });
                }
            }
        }
    },
    // 全局钩子
    钩子: {
        // 登陆中间件
        登陆: null,
        // 登陆注册提交前
        触发登陆事件前: null,
        // 登陆注册提交后
        触发登陆事件后: null,
        // 隐藏登陆注册窗口
        隐藏登陆窗口: null
    },
    // 模板
    模板: {
        HTML: null
    }
}

// 公共信息
哈士齐单点登陆模块.公共信息 = {
    // 加载完成
    加载完成: false,
    // 模块路径
    模块路径: 哈士齐单点登陆模块.公共函数.获取节点属性值(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "src", "./").split("main.min.js")[0].split("main.js")[0],
    // 当前环境, 由于只有 RELEASE 环境配置了 HTTPS, 所以通过判断 Path 中是否包含 https 来进行区分
    运行环境: 哈士齐单点登陆模块.公共函数.获取节点属性值(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "src", "./").split("main.min.js")[0].split("main.js")[0].indexOf("https") === -1 ? "TEST" : "RELEASE",
    // 接口
    接口: 哈士齐单点登陆模块.公共函数.获取节点属性值(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "src", "./").split("main.min.js")[0].split("main.js")[0].indexOf("https") === -1 ? {
        // 测试环境
        GAEA: "https://api.gaea.jilinoffcn.com/test"
    } : {
            // 生产环境
            GAEA: "https://api.gaea.jilinoffcn.com/release"
        },
    // 登陆模块 ID
    模块ID: 哈士齐单点登陆模块.公共函数.获取节点属性值(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "data-id", 1) * 1,
    // 登陆模块类型
    模块类型: 哈士齐单点登陆模块.公共函数.获取节点属性值(document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1], "data-type", "lite"),
    // 用户手机号码
    用户手机号: isNaN(哈士齐单点登陆模块.公共函数.Cookies.获取("offcn-sso-phone") * 1) ? 0 : 哈士齐单点登陆模块.公共函数.Cookies.获取("offcn-sso-phone") * 1,
    // 发信签名
    发信签名: null,
    // 后缀 ( 19课堂个人后缀 )
    宣传后缀: 哈士齐单点登陆模块.公共函数.Get参数("scode"),
    // 小能咨询组
    小能咨询组: null,
    // 用户是否登陆
    用户已登陆: false,
    // 是否需要注册
    用户需要注册: true,
    // CRM 信息
    CRM: {
        // CRM 活动编码
        活动编码: null,
        // CRM 活动表单 ID
        活动表单ID: null,
        // CRM 活动表单 SID
        活动表单SID: null,
        // CRM 所属渠道
        所属渠道: null,
        // CRM 组织代码
        组织代码: null,
        // CRM 组织名称
        组织名称: null,
        // CRM 用户 ID
        推广人ID: null,
        // CRM 用户名
        推广人用户名: null,
    }
};

// 入口
(function () {
    // 打印警告
    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '警告', 内容: '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n[ 哈士齐单点登陆模块 ( 登陆模块根节点 ) ]\n\n请注意不要覆盖！' });
    // 初始化
    var 初始化定时器 = setInterval(function () {
        // 等待 Body 被加载到 DOM 树
        if (typeof (document.getElementsByTagName("body")[0]) === "object") {
            clearInterval(初始化定时器);

            // 判断 Dom 是否存在登陆模块自定义标签
            if (typeof (document.getElementsByTagName('offcn-sso')[0]) !== "object") {
                // 向 Dom 中添加登陆模块自定义标签
                var 单点登陆模块DOM对象 = document.createElement("offcn-sso");
                单点登陆模块DOM对象.setAttribute("data-id", 哈士齐单点登陆模块.公共信息.模块ID)
                单点登陆模块DOM对象.setAttribute("data-type", 哈士齐单点登陆模块.公共信息.模块类型)
                document.getElementsByTagName("body")[0].appendChild(单点登陆模块DOM对象)
            } else {
                // 设置登陆模块标签自定义属性
                document.getElementsByTagName('offcn-sso')[0].setAttribute("data-id", 哈士齐单点登陆模块.公共信息.模块ID)
                document.getElementsByTagName('offcn-sso')[0].setAttribute("data-type", 哈士齐单点登陆模块.公共信息.模块类型)
            }

            // 获取会话状态
            // 这一步还进行了后缀正确性的检查
            // 并根据后缀获取了后缀对应的信息
            哈士齐单点登陆模块.公共函数.XHR.GET(哈士齐单点登陆模块.公共信息.接口.GAEA + "/events/sso/sessions/" + 哈士齐单点登陆模块.公共信息.模块ID + "/" + 哈士齐单点登陆模块.公共信息.宣传后缀 + "/" + 哈士齐单点登陆模块.公共信息.用户手机号, function (获取会话信息的响应) {
                if (typeof (获取会话信息的响应.responseJson) !== "object") {
                    alert("单点登陆模块获取会话失败")
                } else {
                    if (获取会话信息的响应.responseJson.Message !== "Success") {
                        alert(获取会话信息的响应.responseJson.Message)
                    } else {
                        // 校正后缀
                        哈士齐单点登陆模块.公共信息.宣传后缀 = 获取会话信息的响应.responseJson.Data.Suffix
                        // 更新模块信息
                        哈士齐单点登陆模块.公共信息.发信签名 = 获取会话信息的响应.responseJson.Data.Sign // 签名
                        // 更新会话状态
                        哈士齐单点登陆模块.公共信息.用户需要注册 = 获取会话信息的响应.responseJson.Data.NeedToRegister // 需要注册
                        哈士齐单点登陆模块.公共信息.用户已登陆 = 获取会话信息的响应.responseJson.Data.IsLogin // 已经登陆
                        // 更新 CRM 相关信息
                        哈士齐单点登陆模块.公共信息.CRM.所属渠道 = 获取会话信息的响应.responseJson.Data.CRMChannel // 所属渠道
                        哈士齐单点登陆模块.公共信息.CRM.活动编码 = 获取会话信息的响应.responseJson.Data.CRMEID // 活动ID
                        哈士齐单点登陆模块.公共信息.CRM.组织代码 = 获取会话信息的响应.responseJson.Data.CRMOCode // 所属分部代码
                        哈士齐单点登陆模块.公共信息.CRM.组织名称 = 获取会话信息的响应.responseJson.Data.CRMOName // 所属分部
                        哈士齐单点登陆模块.公共信息.CRM.活动表单ID = 获取会话信息的响应.responseJson.Data.CRMEFID // 活动表单ID
                        哈士齐单点登陆模块.公共信息.CRM.活动表单SID = 获取会话信息的响应.responseJson.Data.CRMEFSID // 活动表单ID
                        哈士齐单点登陆模块.公共信息.CRM.推广人ID = 获取会话信息的响应.responseJson.Data.CRMUID // 用户代码
                        哈士齐单点登陆模块.公共信息.CRM.推广人用户名 = 获取会话信息的响应.responseJson.Data.CRMUser // 用户名
                        // 更新小能咨询组
                        哈士齐单点登陆模块.公共信息.小能咨询组 = 获取会话信息的响应.responseJson.Data.NTalkerGID
                        // 打印配置
                        哈士齐单点登陆模块.公共函数.打印日志({
                            类型: "对象", 标题: "模块及后缀配置", 内容: {
                                "后缀": 哈士齐单点登陆模块.公共信息.宣传后缀,
                                "签名": 哈士齐单点登陆模块.公共信息.发信签名,
                                "活动编码": 哈士齐单点登陆模块.公共信息.CRM.活动编码,
                                "活动表单ID": 哈士齐单点登陆模块.公共信息.CRM.活动表单ID,
                                "活动表单SID": 哈士齐单点登陆模块.公共信息.CRM.活动表单SID,
                                "所属组织": 哈士齐单点登陆模块.公共信息.CRM.组织名称,
                                "推广人用户名": 哈士齐单点登陆模块.公共信息.CRM.推广人用户名,
                                "小能咨询组": 哈士齐单点登陆模块.公共信息.小能咨询组
                            }
                        });
                        
                        // 延长 Cookies 有效期
                        if (!哈士齐单点登陆模块.公共信息.用户需要注册) {
                            哈士齐单点登陆模块.公共函数.Cookies.设置("offcn-sso-phone", 哈士齐单点登陆模块.公共信息.用户手机号, 30 * 24 * 60 * 60 * 1000);
                        }

                        // 填充 个人后缀 链接
                        if (哈士齐单点登陆模块.公共信息.宣传后缀 !== null) {
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "开始填充 个人后缀 链接." });
                            var 填充数量 = 0, 要填充的DOM对象 = document.getElementsByClassName("offcn-sso-link");
                            Object.keys(要填充的DOM对象).forEach(function (下标) {
                                if (typeof 要填充的DOM对象[下标].href === "string" && 要填充的DOM对象[下标].href.length > 0) {
                                    // 判断是否已经含有参数
                                    if (要填充的DOM对象[下标].href.indexOf("?") !== -1) {
                                        // 含有参数, 将后缀拼接到原参数后
                                        要填充的DOM对象[下标].href = 要填充的DOM对象[下标].href + "&scode=" + 哈士齐单点登陆模块.公共信息.宣传后缀;
                                    } else {
                                        // 没有参数, 直接拼接后缀
                                        要填充的DOM对象[下标].href = 要填充的DOM对象[下标].href + "?scode=" + 哈士齐单点登陆模块.公共信息.宣传后缀;
                                    }
                                    填充数量++;
                                }
                            });
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "个人后缀 链接 填充完成，共填充 " + 填充数量 + " 个." });
                        }

                        // 填充 个人后缀 图片
                        if (哈士齐单点登陆模块.公共信息.宣传后缀 !== null) {
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "开始填充 个人后缀 图片." });
                            var 填充数量 = 0, 要填充的DOM对象 = document.getElementsByClassName("offcn-sso-image");
                            Object.keys(要填充的DOM对象).forEach(function (下标) {
                                if (typeof 要填充的DOM对象[下标].getAttribute("src") === "string" && 要填充的DOM对象[下标].getAttribute("src").length > 0) { // 判断是否填写了图片链接 ( 先判断 src 属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                    var 文件路径 = 要填充的DOM对象[下标].getAttribute("src").substring(0, 要填充的DOM对象[下标].getAttribute("src").lastIndexOf("/") + 1),
                                        文件后缀 = 要填充的DOM对象[下标].getAttribute("src").substring(要填充的DOM对象[下标].getAttribute("src").lastIndexOf("."));
                                        要填充的DOM对象[下标].src = 文件路径 + 哈士齐单点登陆模块.公共信息.宣传后缀 + 文件后缀;
                                    填充数量++;
                                }
                            });
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "个人后缀 图片 填充完成，共填充 " + 填充数量 + " 个." });
                        }

                        // 填充 个人后缀 微信小程序码
                        if (哈士齐单点登陆模块.公共信息.宣传后缀 !== null) {
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "开始填充 个人后缀 微信小程序码." });
                            var 填充数量 = 0, 要填充的DOM对象 = document.getElementsByClassName("offcn-sso-wechat-mp-qr-code");
                            Object.keys(要填充的DOM对象).forEach(function (下标) {
                                if (typeof 要填充的DOM对象[下标].getAttribute("data-appid") === "string" && 要填充的DOM对象[下标].getAttribute("data-appid").length > 0 && typeof 要填充的DOM对象[下标].getAttribute("data-page") === "string" && 要填充的DOM对象[下标].getAttribute("data-page").length > 0) { // 判断是否填写了 AppID 及 Page ( 先判断属性是否为字符串，即是否设置了该属性，可以避免判断长度时报错 )
                                    // 拼接图片路径
                                    要填充的DOM对象[下标].src = 哈士齐单点登陆模块.公共信息.接口.GAEA + "/events/sso/wechat/mini-program/qr-code/suffix/" + 哈士齐单点登陆模块.公共信息.宣传后缀 + "?app-id=" + 要填充的DOM对象[下标].getAttribute("data-appid") + "&page=" + 要填充的DOM对象[下标].getAttribute("data-page");
                                    填充数量++;
                                }
                            });
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "个人后缀 微信小程序码 填充完成，共填充 " + 填充数量 + " 个." });
                        }
                        
                        // 加载小能咨询插件
                        哈士齐单点登陆模块.公共函数.异步加载.JS("https://dl.ntalker.com/js/xn6/ntkfstat.js?siteid=kf_10353");
                        // 填充 个人后缀 小能
                        if (哈士齐单点登陆模块.公共信息.宣传后缀 !== null) {
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "开始填充 个人后缀 小能." });
                            var 填充数量 = 0, 要填充的DOM对象 = document.getElementsByClassName("offcn-sso-ntalker");
                            Object.keys(要填充的DOM对象).forEach(function (下标) {
                                要填充的DOM对象[下标].addEventListener("click", function () {
                                    if (typeof NTKF === "function") {
                                        NTKF.im_openInPageChat(哈士齐单点登陆模块.公共信息.小能咨询组)
                                    } else {
                                        alert("正在努力加载中～")
                                    }
                                })
                                填充数量++;
                            });
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "个人后缀 小能 填充完成，共填充 " + 填充数量 + " 个." });
                        }

                        // 判断终端类型, 加载对应悬浮
                        if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                            哈士齐单点登陆模块.公共函数.异步加载.CSS(哈士齐单点登陆模块.公共信息.模块路径 + "template/float-mobile.css");
                            哈士齐单点登陆模块.公共函数.异步加载.JS(哈士齐单点登陆模块.公共信息.模块路径 + "template/float-mobile.js");
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "当前终端类型为移动端, 已加载移动端悬浮." });
                        } else {
                            哈士齐单点登陆模块.公共函数.异步加载.CSS(哈士齐单点登陆模块.公共信息.模块路径 + "template/float-pc.css");
                            哈士齐单点登陆模块.公共函数.异步加载.JS(哈士齐单点登陆模块.公共信息.模块路径 + "template/float-pc.js");
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "当前终端类型为PC端, 已加载PC端悬浮." });
                        }

                        // 如果未登过该活动，则根据登陆模块类型进入拦截逻辑
                        if (哈士齐单点登陆模块.公共信息.用户已登陆 && 哈士齐单点登陆模块.公共信息.模块类型 !== "callback" && 哈士齐单点登陆模块.公共信息.模块类型 !== "page") {
                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "用户已经登陆，跳过拦截逻辑." });
                            // 登陆模块加载状态 完成
                            哈士齐单点登陆模块.公共信息.加载完成 = true;
                        } else {
                            switch (哈士齐单点登陆模块.公共信息.模块类型) {
                                // 拦截 a 标签
                                case "a-tag":
                                    Object.keys(document.getElementsByClassName("need2login")).forEach(function (容器下标) {
                                        Object.keys(document.getElementsByClassName("need2login")[容器下标].getElementsByTagName("a")).forEach(function (A标签下标) {
                                            // 向 a 标签增加新属性 data-offcn-href
                                            document.getElementsByClassName("need2login")[容器下标].getElementsByTagName("a")[A标签下标].setAttribute("data-offcn-href", document.getElementsByClassName("need2login")[容器下标].getElementsByTagName("a")[A标签下标].getAttribute("href"));
                                            // 移除 a 标签原有的属性 href
                                            document.getElementsByClassName("need2login")[容器下标].getElementsByTagName("a")[A标签下标].setAttribute("href", "#");
                                            // 移除 a 标签原有的属性 target
                                            document.getElementsByClassName("need2login")[容器下标].getElementsByTagName("a")[A标签下标].setAttribute("target", "");
                                            // 监听点击事件
                                            document.getElementsByClassName("need2login")[容器下标].getElementsByTagName("a")[A标签下标].addEventListener("click", function (event) {
                                                event.preventDefault() // 阻止a标签默认事件
                                                if (!哈士齐单点登陆模块.公共信息.用户已登陆) {
                                                    哈士齐单点登陆模块.公共函数.显示元素("hl-cover,hl-popup"); // 弹出登陆窗口
                                                } else {
                                                    if (typeof (event.target.attributes["data-offcn-href"]) !== "undefined") {
                                                        window.open(event.target.attributes["data-offcn-href"].value);
                                                    } else {
                                                        // a 标签内嵌套的元素被点击时，event 的主体为内部元素，所以要获取 a 标签的属性需要增加 parentElement
                                                        window.open(event.target.parentElement.attributes["data-offcn-href"].value);
                                                    }
                                                }
                                            });
                                        });
                                    });
                                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "当前使用的登陆模块为: 拦截 a 标签版." });
                                    break;
                                // 拦截全部 a 标签
                                case "all-a-tag":
                                    Object.keys(document.getElementsByTagName("a")).forEach(function (下标) {
                                        // 向 a 标签增加新属性 data-offcn-href
                                        document.getElementsByTagName("a")[下标].setAttribute("data-offcn-href", document.getElementsByTagName("a")[下标].getAttribute("href"));
                                        // 移除 a 标签原有的属性 href
                                        document.getElementsByTagName("a")[下标].setAttribute("href", "#");
                                        // 移除 a 标签原有的属性 target
                                        document.getElementsByTagName("a")[下标].setAttribute("target", "");
                                        // 监听点击事件
                                        document.getElementsByTagName("a")[下标].addEventListener("click", function (event) {
                                            event.preventDefault() // 阻止a标签默认事件
                                            if (!哈士齐单点登陆模块.公共信息.用户已登陆) {
                                                哈士齐单点登陆模块.公共函数.显示元素("hl-cover,hl-popup"); // 弹出登陆窗口
                                            } else {
                                                if (typeof (event.target.attributes["data-offcn-href"]) !== "undefined") {
                                                    window.open(event.target.attributes["data-offcn-href"].value);
                                                } else {
                                                    // a 标签内嵌套的元素被点击时，event 的主体为内部元素，所以要获取 a 标签的属性需要增加 parentElement
                                                    window.open(event.target.parentElement.attributes["data-offcn-href"].value);
                                                }
                                            }
                                        });
                                    });
                                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "当前使用的登陆模块为: 拦截全部 a 标签版." });
                                    break;
                                // 登陆中间件 回调函数
                                case "callback":
                                    哈士齐单点登陆模块.钩子.触发登陆 = function (回调函数, 登陆成功后马上执行一次回调函数) {
                                        if (!哈士齐单点登陆模块.公共信息.用户已登陆) {
                                            // uglifyjs 不支持 ES6 的语法, 所以采用下面的方式给第二个参数设置默认值
                                            // 参考了 https://blog.csdn.net/liwenfei123/article/details/71940397
                                            登陆成功后马上执行一次回调函数 = 登陆成功后马上执行一次回调函数 || false
                                            if (登陆成功后马上执行一次回调函数) {
                                                哈士齐单点登陆模块.钩子.触发登陆事件后 = 回调函数
                                            }
                                            哈士齐单点登陆模块.公共函数.显示元素("hl-cover,hl-popup"); // 弹出登陆窗口
                                        } else {
                                            回调函数(哈士齐单点登陆模块.公共信息.用户手机号) // 调用回调函数
                                        }
                                    };
                                    // 二次判断登陆状态，如果已经登陆，跳过后续加载组件的步骤
                                    if (哈士齐单点登陆模块.公共信息.用户已登陆) {
                                        哈士齐单点登陆模块.公共函数.打印日志({ 类型: "信息", 内容: "用户已经登陆, 未加载登陆模板." });
                                        // 登陆模块加载状态 完成
                                        哈士齐单点登陆模块.公共信息.加载完成 = true;
                                        return;
                                    }
                                    break;
                                // 登陆中间件 页面嵌入式表单
                                case "page":
                                    // 判断是否存在组件
                                    if (document.getElementsByClassName("offcn-sso-login-page-form").length === 0 || document.getElementsByClassName("offcn-sso-login-page-is-login").length === 0) {
                                        alert("哈士齐单点登陆模块配置有误, 缺少页面元素!");
                                        return
                                    }
                                    // 判断登陆状态
                                    if (哈士齐单点登陆模块.公共信息.用户已登陆) {
                                        // 已登陆
                                        // 调用 提交后事件处理钩子
                                        if (typeof 哈士齐单点登陆模块.钩子.触发登陆事件后 === "function") {
                                            哈士齐单点登陆模块.钩子.触发登陆事件后(哈士齐单点登陆模块.公共信息.用户手机号);
                                        } else {
                                            哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: '未定义 哈士齐单点登陆模块.钩子.触发登陆事件后 ( 登陆后事件处理钩子 ) , 跳过登陆回调.' });
                                        }
                                        // 切换到已登陆 DIV
                                        哈士齐单点登陆模块.公共函数.显示元素("offcn-sso-login-page-is-login");
                                        哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: '用户已经登陆, 未加载登陆模板.' });
                                        // 登陆模块加载状态 完成
                                        哈士齐单点登陆模块.公共信息.加载完成 = true;
                                        return;
                                    } else {
                                        // 未登陆，加载页面模板
                                        哈士齐单点登陆模块.公共函数.显示元素("offcn-sso-login-page-form");
                                        // 加载样式表
                                        哈士齐单点登陆模块.公共函数.异步加载.CSS(哈士齐单点登陆模块.公共信息.模块路径 + "template/page.css");
                                        // 渲染手机号登陆组件
                                        哈士齐单点登陆模块.公共函数.异步加载.JS(哈士齐单点登陆模块.公共信息.模块路径 + "template/page.js");
                                        var 模板加载定时器 = setInterval(function () {
                                            if (typeof (哈士齐单点登陆模块.模板.HTML) === "string") {
                                                clearInterval(模板加载定时器);
                                                // 判断是否存在可选组件
                                                if (document.getElementsByClassName("offcn-sso-login-page-optional").length !== 0) {
                                                    // 拼接可选组件后，加载登陆组件 HTML
                                                    document.getElementsByClassName("offcn-sso-login-page-form")[0].innerHTML = document.getElementsByClassName("offcn-sso-login-page-optional")[0].innerHTML + 哈士齐单点登陆模块.模板.HTML;
                                                    document.getElementsByClassName("offcn-sso-login-page-optional")[0].remove();
                                                } else {
                                                    // 直接加载登陆组件 HTML
                                                    document.getElementsByClassName("offcn-sso-login-page-form")[0].innerHTML = 哈士齐单点登陆模块.模板.HTML;
                                                }
                                                哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: '手机号登陆模板 ( 页面版 ) 加载成功.' });
                                                // 加载处理函数
                                                哈士齐单点登陆模块.公共函数.异步加载.JS(哈士齐单点登陆模块.公共信息.模块路径 + "template/page-functions.min.js")
                                            }
                                        }, 500);
                                        return
                                    }
                                default:
                                    // 登陆模块加载状态 完成
                                    哈士齐单点登陆模块.公共信息.加载完成 = true;
                                    // 加载 light 模块
                                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: '当前使用的登陆模块为: 轻量版.' });
                                    // 直接结束后续程序执行
                                    return;
                            }

                            // 加载样式表
                            哈士齐单点登陆模块.公共函数.异步加载.CSS(哈士齐单点登陆模块.公共信息.模块路径 + "template/page.css");
                            哈士齐单点登陆模块.公共函数.异步加载.CSS(哈士齐单点登陆模块.公共信息.模块路径 + "template/phone.css");
                            // 渲染手机号登陆组件
                            哈士齐单点登陆模块.公共函数.异步加载.JS(哈士齐单点登陆模块.公共信息.模块路径 + "template/phone.js");
                            var 模板加载定时器 = setInterval(function () {
                                if (typeof (哈士齐单点登陆模块.模板.HTML) === "string") {
                                    clearInterval(模板加载定时器);
                                    // 加载登陆组件 HTML
                                    document.getElementsByTagName('offcn-sso')[0].innerHTML += 哈士齐单点登陆模块.模板.HTML;
                                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: '手机号登陆模板加载成功.' });
                                    // 加载处理函数
                                    哈士齐单点登陆模块.公共函数.异步加载.JS(哈士齐单点登陆模块.公共信息.模块路径 + "template/phone-functions.min.js")
                                }
                            }, 500);
                        }
                    }
                }
            })
        }
    }, 500)
})()
