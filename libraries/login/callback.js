(function () {
    // 获取get参数
    let loginType = $_GET['a'];
    // 未指定则默认登陆方式或登陆方式参数不合规则设置为手机号登陆
    if (loginType !== 'w' && loginType !== 'd') {
        loginType = 'd'
    }

    // 登陆中间件
    ChaosHandler = function (callback) {
        if (!ChaosLoginStatus) {
            ChaosFunctions.ShowByClass("hl-cover,hl-popup"); // 弹出登陆窗口
            if (loginType === 'w') {
                WechatInit() // 初始化微信登陆
            }
        } else {
            callback() // 调用回调函数
        }
    };
})();

(function () {
    let initTimerCount = 0;
    let initTimer = setInterval(function () {
        if (initTimerCount++ > 20) {
            clearInterval(initTimer);
            console.log('Chaos > 当前使用的登陆模块为: 回调函数版');
            console.warn('Chaos > 登陆模块 ( 回调函数版 ) 中定义了全局变量 [ ChaosHandler ( 登陆中间件 ) ] ，请注意不要覆盖！')
        }
        if (typeof ChaosFunctions === "object") {
            clearInterval(initTimer);
            ChaosFunctions.Logger({ Type: 'info', Info: '当前使用的登陆模块为: 回调函数版' });
            ChaosFunctions.Logger({ Type: 'warn', Info: '登陆模块 ( 回调函数版 ) 中定义了全局变量 [ ChaosHandler ( 登陆中间件 ) ] ，请注意不要覆盖！' });
        }
    }, 500);
})();
