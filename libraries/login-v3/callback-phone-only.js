(function () {
    ChaosFunctions.Logger({Type: 'info', Info : '当前使用的登陆模块为: 仅电话登陆的回调函数版'});

    // 加载样式表
    ChaosFunctions.DynamicLoading.CSS( ChaosPath + "style/main.css");
    // 渲染手机号登陆组件
    ChaosFunctions.DynamicLoading.JS( ChaosPath + "template/phone.js");
    let templateTimer = setInterval(function () {
        if (typeof (ChaosTemplate) === "string") {
            clearInterval(templateTimer);
            // 加载登陆组件 HTML
            document.getElementsByTagName('chaos')[0].innerHTML += ChaosTemplate;
            ChaosFunctions.Logger({Type: 'info', Info : '手机号登陆模板加载成功'});
            // 加载处理函数
            ChaosFunctions.DynamicLoading.JS( ChaosPath + "template/phone-functions.js")
        }
    }, 500);

    ChaosLoginStatus = false;  // 设置默认登陆状态
    let globalVariablesList = " [ ChaosLoginStatus ( 登陆状态 ) ]";

    ChaosForm = 6792; // 设置默认表单ID ( 登陆模块 V3 默认表单 )
    globalVariablesList += " [ ChaosForm ( ZG99 表单 ID ) ]";

    // 加载 Cookies 插件
    ChaosFunctions.DynamicLoading.JS( ChaosPath + "../js.cookie.min.js");
    // 加载 XHR 插件
    ChaosFunctions.DynamicLoading.JS( ChaosPath + "xhr.js");
    // 等待 Cookies 插件，XHR 插件加载
    let initTimer = setInterval(function () {
        if (typeof (Cookies) === "function" && typeof ChaosXHR === "object") {
            clearInterval(initTimer)
            // 根据登陆模块 ID 获取表单 ID ( 获取登陆模块配置 )
            ChaosXHR.GET( ChaosApiPath + "/config/" + ChaosFunctions.Attr(document.getElementsByTagName('chaos')[0], "chaos-id", "MQ=="), function (xhr) {
                // console.log(xhr)
                if (typeof (xhr.responseJson) == "object") {
                    ChaosForm = xhr.responseJson.FormID
                    document.getElementsByTagName('chaos')[0].setAttribute("chaos-form-id", xhr.responseJson.FormID)
                    document.getElementsByTagName('chaos')[0].setAttribute("chaos-name", xhr.responseJson.Name)
                    document.getElementsByTagName('chaos')[0].setAttribute("chaos-url", xhr.responseJson.URL)
                }
                ChaosFunctions.Logger({Type: 'info', Info : '当前登陆表单 ID ( ChaosForm ) 为: ' + ChaosForm});
            });

            initTimer = setInterval(function () {
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
    }, 500);

    // 登陆中间件 ( 携带电话号码 )
    ChaosHandlerWithPhone = function (callback) {
        if (!ChaosLoginStatus || Cookies.get('ChaosForm_' + ChaosForm + "_Phone") == undefined) {
            ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
        } else {
            callback(Cookies.get('ChaosForm_' + ChaosForm + "_Phone")) // 调用回调函数
        }
    };
    globalVariablesList += " [ ChaosHandlerWithPhone ( 携带电话号码的登陆中间件 ) ]";

    ChaosFunctions.Logger({Type: 'warn', Info : '登陆模块 ( 仅电话登陆的回调函数版 ) 中定义了以下全局变量:\n\n' + globalVariablesList + '\n\n请注意不要覆盖！'});
})();
