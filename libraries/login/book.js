(function () {
    console.log("Chaos > 当前使用的登陆模块为: 电子书版");

    // 获取get参数
    let loginType = $_GET['a'];
    // 未指定则默认登陆方式或登陆方式参数不合规则设置为手机号登陆
    if (loginType !== 'w' && loginType !== 'd') {
        loginType = 'd'
    }

    // 禁止关闭弹窗
    let initTimer = setInterval(function(){
        if (typeof(ChaosHideLogin) === "function"){
            clearInterval(initTimer);
            ChaosFunctions.HideByClass("hl-close"); // 移除关闭按钮
            document.getElementsByClassName("hl-cover")[0].removeEventListener("click",ChaosHideLogin) // 解绑关闭事件
            document.getElementsByClassName("hl-close")[0].removeEventListener("click",ChaosHideLogin) // 解绑关闭事件
        }
    },500);

    // 覆盖电子书回调函数
    sendvisitinfo = function (type, page) {
        if (page >= popupPage) {
            if (!ChaosLoginStatus) {
                ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
                if (loginType == 'w') {
                    WechatInit() // 初始化微信登陆
                }
            }
        }
    };

    console.warn('Chaos > 登陆模块 ( 电子书版 ) 中定义了全局变量 [ sendvisitinfo ( 电子书回调函数 ) ] ，请注意不要覆盖！')
})();
