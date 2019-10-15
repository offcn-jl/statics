(function () {
    console.log("Chaos > 当前使用的登陆模块为: 拦截全部 a 标签版");

    // 获取get参数
    let loginType = $_GET['a'];
    // 未指定则默认登陆方式或登陆方式参数不合规则设置为手机号登陆
    if (loginType !== 'w' && loginType !== 'd') {
        loginType = 'd'
    }

    Object.keys(document.getElementsByTagName("a")).forEach(function (key) {
        // 向 a 标签增加新属性 chaos-href
        document.getElementsByTagName("a")[key].setAttribute("chaos-href", document.getElementsByTagName("a")[key].getAttribute("href"));
        // 移除 a 标签原有的属性 href
        document.getElementsByTagName("a")[key].setAttribute("href", "#");
        // 移除 a 标签原有的属性 target
        document.getElementsByTagName("a")[key].setAttribute("target", "");
        // 监听点击事件
        document.getElementsByTagName("a")[key].addEventListener("click", function (event) {
            //console.log(event)
            event.preventDefault() // 阻止a标签默认事件
            if (!ChaosLoginStatus) {
                ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                if (loginType === 'w') {
                    WechatInit() // 初始化微信登陆
                }
            } else {
                window.open(event.target.attributes["chaos-href"].value)
            }
        });
    });

})();
