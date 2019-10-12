(function () {
    ChaosFunctions = {
        Attr: function (node, attr, default_value) { // 获取节点 attr 属性的值
            return node.getAttribute(attr) || default_value;
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
                    throw new Error('argument "path" is required !')
                }
                var a = document.getElementsByTagName("chaos")[0];
                var b = document.createElement("link");
                b.href = c;
                b.rel = "stylesheet";
                b.type = "text/css";
                a.appendChild(b)
            },
            JS: function (c) {
                if (!c || c.length === 0) {
                    throw new Error('argument "path" is required !')
                }
                var b = document.getElementsByTagName("chaos")[0];
                var a = document.createElement("script");
                a.src = c;
                a.type = "text/javascript";
                b.appendChild(a)
            }
        }
    }

    // 设置过的全局变量列表
    let globalVariablesList = "[ ChaosFunctions ( 基础函数库 ) ]";

    // 获取参数
    let scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1], // 当前加载的script
        config = {
            ID: ChaosFunctions.Attr(script, "chaos-id", "MQ=="), // 活动ID
            Type: ChaosFunctions.Attr(script, "chaos-type", "lingt"), // 登陆模块类型 light ( 仅定位 ) 、 a-tag ( 拦截 a 标签 ) 、 all-a-tag ( 拦截全部 a 标签 ) 、book ( 电子书 )、 callback ( 回调函数 )、 callback-phone-only ( 仅电话登陆的回调函数 )
            Page: ChaosFunctions.Attr(script, "chaos-page", "5"), // 页码 ( 电子书 )
        };

    // 判断 Dom 是否存在 Chaos 标签
    if (typeof (document.getElementsByTagName('chaos')[0]) !== "object") {
        // 向 Dom 中添加 Chaos 标签
        let chaosNode = document.createElement("chaos");
        if (config.Type !== "lingt") {
            chaosNode.setAttribute("chaos-id", config.ID)
        }
        chaosNode.setAttribute("chaos-type", config.Type)
        if (config.Type === "book") {
            chaosNode.setAttribute("chaos-page", config.Page)
        }
        document.getElementsByTagName("body")[0].appendChild(chaosNode)
    } else {
        // 设置 Chaos 标签的属性
        if (config.Type !== "lingt") {
            document.getElementsByTagName('chaos')[0].setAttribute("id", config.ID)
        }
        document.getElementsByTagName('chaos')[0].setAttribute("type", config.Type)
        if (config.Type === "book") {
            document.getElementsByTagName('chaos')[0].setAttribute("page", config.Page)
        }
    }

    // 加载 GET 模块
    ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/get.js");

    // 加载地市定位代码表
    ChaosFunctions.DynamicLoading.JS("https://api.2.jilinoffcn.com/events/?action=xgpjs");

    let initTimer = setInterval(function () {
        if (typeof ($_GET) === "object" && typeof (ChaosPlatformFind) === "function") {
            clearInterval(initTimer);

            let location = "sj"
            if ($_GET['b'] !== undefined && ChaosPlatformFind($_GET['b'])) {
                location = $_GET['b'];
            }

            ChaosLoacation = ChaosPlatformFind(location)
            globalVariablesList += " [ ChaosLoacation ( 定位详情 ) ]";

            // 设置地市定位的资源的显示状态
            ChaosFunctions.ShowByClass(ChaosLoacation.d);

            // 更新资源显示状态成功
            console.log("Chaos > 更新资源显示状态成功，当前显示的定位资源 Class 为 " + ChaosLoacation.d + " !")

            switch (config.Type) {
                case "a-tag": // 拦截 a 标签
                    ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/a-tag.js")
                    break;
                case "all-a-tag": // 拦截 a 标签
                    ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/all-a-tag.js")
                    break;
                case "book": // 电子书
                    ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/book.js")
                    break;
                case "callback": // 回调函数
                    ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/callback.js")
                    break;
                case "callback-phone-only":
                    ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/callback-phone-only.js")
                    console.warn("Chaos > 登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n" + globalVariablesList + "\n\n请注意不要覆盖！");
                    return;
                default:
                    console.warn("Chaos > 登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n" + globalVariablesList + "\n\n请注意不要覆盖！");
                    // 加载 light 模块
                    console.log("Chaos > 当前使用的登陆模块为: 轻量版");
                    // 直接结束程序执行
                    return;
            }

            // 获取get参数
            let loginType = $_GET['a'];
            // 未指定则默认登陆方式或登陆方式参数不合规则设置为手机号登陆
            if (loginType !== 'w' && loginType !== 'd') {
                loginType = 'd'
            }

            // 加载样式表
            ChaosFunctions.DynamicLoading.CSS("https://statics.jilinoffcn.com/libraries/login/style/main.css");
            // 加载登陆组件 HTML
            if (loginType === 'w') {
                // 渲染微信登陆组件
                ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/template/wechat.js");
                let initTimer = setInterval(function () {
                    if (typeof (ChaosTemplate) === "string") {
                        clearInterval(initTimer);
                        document.getElementsByTagName('chaos')[0].innerHTML += ChaosTemplate;
                        console.log("Chaos > 微信登陆模板加载成功");
                        // 加载处理函数
                        ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/template/wechat-functions.js")
                    }
                }, 500);
            } else {
                // 渲染手机号登陆组件
                ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/template/phone.js");
                let initTimer = setInterval(function () {
                    if (typeof (ChaosTemplate) === "string") {
                        clearInterval(initTimer);
                        document.getElementsByTagName('chaos')[0].innerHTML += ChaosTemplate;
                        console.log("Chaos > 手机号登陆模板加载成功");
                        // 加载处理函数
                        ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/template/phone-functions.js")
                    }
                }, 500);
            }

            ChaosLoginStatus = false;  // 设置默认登陆状态
            globalVariablesList += " [ ChaosLoginStatus ( 登陆状态 ) ]";

            ChaosForm = 2630; // 设置默认表单ID
            globalVariablesList += " [ ChaosForm ( ZG99 表单 ID ) ]";

            // 加载 Cookies 插件
            ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/js.cookie.min.js");
            // 加载 XHR 插件
            ChaosFunctions.DynamicLoading.JS("https://statics.jilinoffcn.com/libraries/login/xhr.js");
            // 等待 Cookies 插件，XHR 插件加载
            clearInterval(initTimer)
            initTimer = setInterval(function () {
                if (typeof (Cookies) === "function" && typeof ChaosXHR === "object") {
                    clearInterval(initTimer)
                    // 初始化登陆函数
                    let initLogin = function () {
                        // 根据登陆模块 ID 获取表单 ID
                        ChaosXHR.GET("https://api.2.jilinoffcn.com/events/?action=xgi&id=" + ChaosFunctions.Attr(document.getElementsByTagName('chaos')[0], "id", "MQ=="), function (xhr) {
                            //console.log(xhr)
                            if (typeof (xhr.responseJson) == "object") {
                                ChaosForm = xhr.responseJson.FormID
                                document.getElementsByTagName('chaos')[0].setAttribute("FormID", xhr.responseJson.FormID)
                                document.getElementsByTagName('chaos')[0].setAttribute("Name", xhr.responseJson.Name)
                                document.getElementsByTagName('chaos')[0].setAttribute("URL", xhr.responseJson.URL)
                            }
                            console.log("Chaos > 当前登陆表单 ID ( ChaosForm ) 为: " + ChaosForm)
                        });
                
                        let initTimer = setInterval(function () {
                            if (ChaosForm !== undefined) {
                                clearInterval(initTimer)
                                // 检查并更新登陆状态
                                let loginStatus = Cookies.get('ChaosForm_' + ChaosForm)
                                if (loginStatus !== 'isLogin') {
                                    Cookies.set('ChaosForm_' + ChaosForm, 'notLogin');
                                    ChaosLoginStatus = false;
                                } else {
                                    Cookies.set('ChaosForm_' + ChaosForm, 'isLogin');
                                    ChaosLoginStatus = true;
                                }
                            }
                        }, 500);
                    }

                    // 如果存在一次性免登陆key则校验当前key是否有效，如果有效则设置免登陆
                    if ($_GET['ticket'] !== undefined) {
                        ChaosXHR.GET("https://api.2.jilinoffcn.com/events/?action=xck&ticket=" + $_GET['ticket'], function (xhr) {
                            if (typeof (xhr.responseJson) == "object") {
                                if (xhr.responseJson.code === 0) {
                                    ChaosLoginStatus = true; // 设置为已经登陆
                                    Cookies.set('ChaosForm_' + ChaosForm, 'isLogin');// 保存注册状态
                                } else {
                                    initLogin()
                                }
                            } else {
                                console.log("Chaos > 检查一次性登陆令牌失败，请求详情：");
                                console.log(xhr);
                            }
                        });
                    } else {
                        initLogin()
                    }
                }
            }, 500)
            console.warn("Chaos > 登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n" + globalVariablesList + "\n\n请注意不要覆盖！");
        }
    }, 500)
})();
