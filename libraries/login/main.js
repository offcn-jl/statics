(function () {
    ChaosFunctions = {
        Logger: function (log) {
            // log = {Type: ''( log / info / warn / error / table ), Info : ''}
            // https://www.runoob.com/w3cnote/javascript-console-object.html
            // 日志组件等待时间
            let waitMillisecond = 1000*5;
            // 初始化日志对象
            if (typeof ChaosFunctions.Logs !== 'object') {
                ChaosFunctions.Logs = {
                    Log: [],
                    Timer: null
                }
            }
            if (ChaosFunctions.Logs.Timer === null) {
                // console.log('初始化日志打印定时器');
                ChaosFunctions.Logs.Timer = setInterval(function(){
                    // 判断最后一条日志距离入栈时间是否足够
                    // console.log((new Date()).valueOf() < (ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond));
                    // console.log((ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond));
                    // console.log((new Date()).valueOf());
                    if ( (new Date()).valueOf() < (ChaosFunctions.Logs.Log[ChaosFunctions.Logs.Log.length - 1].Time.valueOf() + waitMillisecond)) {
                        // console.log("跳过打印");
                        return
                    }
                    // console.log('开始打印日志');
                    clearInterval(ChaosFunctions.Logs.Timer); // 结束定时器
                    ChaosFunctions.Logs.Timer = null; // 清空定时器
                    // 将显示的信息分组
                    console.group('哈士齐登陆模块 ( Base on Project Chaos @ 20191115 1155)');
                    // 遍历日志对象
                    ChaosFunctions.Logs.Log.forEach(function(log){
                        switch (log.Type) {
                            case 'info':
                                console.info(log.Time + ' >> ' + log.Info)
                                break;
                            case 'warn':
                                console.warn(log.Time + ' >> ' + log.Info)
                                break;
                            case 'error':
                                console.error(log.Time + ' >> ' + log.Title)
                                console.error(log.Info)
                                break;
                            case 'table':
                                console.info(log.Time + ' >> ' + log.Title)
                                console.table(log.Info)
                                break;
                            default:
                                console.log(log.Time + ' >> ' + log.Info)
                        }
                    });
                    // 结束分组
                    console.groupEnd();
                    // 清空日志对象
                    ChaosFunctions.Logs.Log = [];
                },1000*5);
            }
            // console.log(this) // == ChaosFunctions
            log.Time = (new Date()); // 直接使用 Date() 返回的是当前时间的字符串， (new Date()) 才可以获取到当前时间的对象。
            ChaosFunctions.Logs.Log.push(log);
        },
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

    // 模块路径
    ChaosPath = ChaosFunctions.Attr(script, "src", "./").split("main.js")[0];
    globalVariablesList += " [ ChaosPath ( 模块路径 ) ]";
    
    // 接口路径
    ChaosApiPath = "https://api.2.jilinoffcn.com/events/";  // 默认
    if (ChaosPath.split(".")[0].split("https://")[1] === "test") {
        ChaosApiPath = "https://api.2.jilinoffcn.com/events/";  // 测试环境
    } else if (ChaosPath.split(".")[0].split("https://")[1] === "statics") {
        ChaosApiPath = "https://api.2.jilinoffcn.com/events/";  // 生产环境
    } else {
        ChaosApiPath = "https://api.2.jilinoffcn.com/events/";  // 本地环境
    }
    globalVariablesList += " [ ChaosPath ( 接口路径 ) ]";

    let initTimer = setInterval(function () {
        // 等待 Body 被加载到 DOM 树
        if (typeof (document.getElementsByTagName("body")[0]) === "object") {
            clearInterval(initTimer);

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
                    document.getElementsByTagName('chaos')[0].setAttribute("chaos-id", config.ID)
                }
                document.getElementsByTagName('chaos')[0].setAttribute("chaos-type", config.Type)
                if (config.Type === "book") {
                    document.getElementsByTagName('chaos')[0].setAttribute("chaos-page", config.Page)
                }
            }

            // 加载 GET 模块
            ChaosFunctions.DynamicLoading.JS( ChaosPath + "../get.js");

            // 加载地市定位代码表
            ChaosFunctions.DynamicLoading.JS( ChaosApiPath + "?action=xgpjs");

            initTimer = setInterval(function () {
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
                    ChaosFunctions.Logger({Type: 'info', Info : '更新资源显示状态成功，当前显示的定位资源 Class 为 ' + ChaosLoacation.d + ' !'});

                    // 填充定位链接 ( 分为 '19 课堂' 和 '专题' 两种 )
                    if (typeof ChaosLoacation._19 === 'string') {
                        // 19 课堂
                        ChaosFunctions.Logger({Type: 'info', Info : '开始填充 「 19 课堂 」 定位链接'});
                        let count = 0;
                        Object.keys(document.getElementsByClassName("chaos-link-19")).forEach(function (key) {
                            document.getElementsByClassName("chaos-link-19")[key].href = document.getElementsByClassName("chaos-link-19")[key].href + ChaosLoacation._19;
                            count++;
                        });
                        ChaosFunctions.Logger({Type: 'info', Info : '「 19 课堂 」 定位链接成功，共填充 ' + count + ' 个'});
                        // 专题
                        ChaosFunctions.Logger({Type: 'info', Info : '开始填充 「 专题 」 定位链接'});
                        count = 0;
                        Object.keys(document.getElementsByClassName("chaos-link-article")).forEach(function (key) {
                            document.getElementsByClassName("chaos-link-article")[key].href = document.getElementsByClassName("chaos-link-article")[key].href + ChaosLoacation.d;
                            count++;
                        });
                        ChaosFunctions.Logger({Type: 'info', Info : '「 专题 」 定位链接成功，共填充 ' + count + ' 个'});
                    }

                    switch (config.Type) {
                        case "a-tag": // 拦截 a 标签
                            ChaosFunctions.DynamicLoading.JS( ChaosPath + "a-tag.js")
                            break;
                        case "all-a-tag": // 拦截 a 标签
                            ChaosFunctions.DynamicLoading.JS( ChaosPath + "all-a-tag.js")
                            break;
                        case "book": // 电子书
                            ChaosFunctions.DynamicLoading.JS( ChaosPath + "book.js")
                            break;
                        case "callback": // 回调函数
                            ChaosFunctions.DynamicLoading.JS( ChaosPath + "callback.js")
                            break;
                        case "callback-phone-only":
                            ChaosFunctions.DynamicLoading.JS( ChaosPath + "callback-phone-only.js");
                            ChaosFunctions.Logger({Type: 'warn', Info : '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！'});
                            return;
                        default:
                            ChaosFunctions.Logger({Type: 'warn', Info : '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！'});
                            // 加载 light 模块
                            ChaosFunctions.Logger({Type: 'info', Info : '当前使用的登陆模块为: 轻量版'});
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
                    ChaosFunctions.DynamicLoading.CSS( ChaosPath + "style/main.css");
                    // 加载登陆组件 HTML
                    if (loginType === 'w') {
                        // 渲染微信登陆组件
                        ChaosFunctions.DynamicLoading.JS( ChaosPath + "template/wechat.js");
                        let initTimer = setInterval(function () {
                            if (typeof (ChaosTemplate) === "string") {
                                clearInterval(initTimer);
                                document.getElementsByTagName('chaos')[0].innerHTML += ChaosTemplate;
                                ChaosFunctions.Logger({Type: 'info', Info : '微信登陆模板加载成功'});
                                // 加载处理函数
                                ChaosFunctions.DynamicLoading.JS( ChaosPath + "template/wechat-functions.js")
                            }
                        }, 500);
                    } else {
                        // 渲染手机号登陆组件
                        ChaosFunctions.DynamicLoading.JS( ChaosPath + "template/phone.js");
                        let initTimer = setInterval(function () {
                            if (typeof (ChaosTemplate) === "string") {
                                clearInterval(initTimer);
                                document.getElementsByTagName('chaos')[0].innerHTML += ChaosTemplate;
                                ChaosFunctions.Logger({Type: 'info', Info : '手机号登陆模板加载成功'});
                                // 加载处理函数
                                ChaosFunctions.DynamicLoading.JS( ChaosPath + "template/phone-functions.js")
                            }
                        }, 500);
                    }

                    ChaosLoginStatus = false;  // 设置默认登陆状态
                    globalVariablesList += " [ ChaosLoginStatus ( 登陆状态 ) ]";

                    ChaosForm = 2630; // 设置默认表单ID
                    globalVariablesList += " [ ChaosForm ( ZG99 表单 ID ) ]";

                    // 加载 Cookies 插件
                    ChaosFunctions.DynamicLoading.JS( ChaosPath + "../js.cookie.min.js");
                    // 加载 XHR 插件
                    ChaosFunctions.DynamicLoading.JS( ChaosPath + "xhr.js");
                    // 等待 Cookies 插件，XHR 插件加载
                    clearInterval(initTimer)
                    initTimer = setInterval(function () {
                        if (typeof (Cookies) === "function" && typeof ChaosXHR === "object") {
                            clearInterval(initTimer)
                            // 初始化登陆函数
                            let initLogin = function () {
                                // 根据登陆模块 ID 获取表单 ID
                                ChaosXHR.GET( ChaosApiPath + "?action=xgi&id=" + ChaosFunctions.Attr(document.getElementsByTagName('chaos')[0], "chaos-id", "MQ=="), function (xhr) {
                                    //console.log(xhr)
                                    if (typeof (xhr.responseJson) == "object") {
                                        ChaosForm = xhr.responseJson.FormID
                                        document.getElementsByTagName('chaos')[0].setAttribute("chaos-form-id", xhr.responseJson.FormID)
                                        document.getElementsByTagName('chaos')[0].setAttribute("chaos-name", xhr.responseJson.Name)
                                        document.getElementsByTagName('chaos')[0].setAttribute("chaos-url", xhr.responseJson.URL)
                                    }
                                    ChaosFunctions.Logger({Type: 'info', Info : '当前登陆表单 ID ( ChaosForm ) 为: ' + ChaosForm});
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
                                ChaosXHR.GET( ChaosApiPath + "?action=xck&ticket=" + $_GET['ticket'], function (xhr) {
                                    if (typeof (xhr.responseJson) == "object") {
                                        if (xhr.responseJson.code === 0) {
                                            ChaosLoginStatus = true; // 设置为已经登陆
                                            Cookies.set('ChaosForm_' + ChaosForm, 'isLogin');// 保存注册状态
                                        } else {
                                            initLogin()
                                        }
                                    } else {
                                        ChaosFunctions.Logger({Type: 'error', Title: "检查一次性登陆令牌失败，请求详情：", Info : xhr});
                                    }
                                });
                            } else {
                                initLogin()
                            }
                        }
                    }, 500)
                    ChaosFunctions.Logger({Type: 'warn', Info : '登陆模块 ( 主程序 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！'});
                }
            }, 500);
        }
    }, 500);
})();
