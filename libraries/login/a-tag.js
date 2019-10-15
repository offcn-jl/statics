(function () {
    console.log("Chaos > 当前使用的登陆模块为: 拦截 a 标签版");

    // 获取get参数
    let loginType = $_GET['a'];
    // 未指定则默认登陆方式或登陆方式参数不合规则设置为手机号登陆
    if (loginType !== 'w' && loginType !== 'd') {
        loginType = 'd'
    }

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
                if (!ChaosLoginStatus) {
                    ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                    if (loginType === 'w') {
                        WechatInit() // 初始化微信登陆
                    }
                } else {
                    if ( typeof(event.target.attributes["chaos-href"]) !== "undefined" ) {
                        window.open(event.target.attributes["chaos-href"].value)
                    } else {
                        window.open(event.parentElement.attributes["chaos-href"].value)
                    }
                }
            });
        });
    });

    //console.warn("登陆模块 ( 拦截 a 标签版 ) 中定义了以下全局变量:\n\n1\n\n请注意不要覆盖！");
})();
