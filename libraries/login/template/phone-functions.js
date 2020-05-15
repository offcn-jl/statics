(function () {
    //document.getElementById("location").value = ChaosLoacation.n; // 注册表单地市定位字段
    document.getElementById("location").setAttribute("value", ChaosLoacation.n); // 注册表单地市定位字段
    document.getElementsByClassName("hlp-bottom")[0].setAttribute("href", ChaosLoacation.u); // 广告位URL地址
    document.getElementsByClassName("ad-button")[0].setAttribute("href", ChaosLoacation.u); // 广告位URL地址

    // 隐藏窗口函数
    ChaosHideLogin = function() {
        // 隐藏窗口
        ChaosFunctions.HideByClass("hl-cover,hl-popup");
    }

    /* 注册监听事件 开始 */
    // 注册关闭登陆框监听器
    document.getElementsByClassName("hl-cover")[0].addEventListener("click", ChaosHideLogin);
    document.getElementsByClassName("hl-close")[0].addEventListener("click", ChaosHideLogin);
    // 菜单栏登陆按钮
    document.getElementById("hlp_sign_in").addEventListener("click", function(){
        document.getElementById("hlp_sign_in").classList.add("hlpt-current");
        document.getElementById("hlp_sign_up").classList.remove("hlpt-current");
        ChaosFunctions.ShowByClass("hlpm sign-in");
        ChaosFunctions.HideByClass("hlpm sign-up");
    });
    // 菜单栏注册按钮
    document.getElementById("hlp_sign_up").addEventListener("click", function(){
        document.getElementById("hlp_sign_up").classList.add("hlpt-current");
        document.getElementById("hlp_sign_in").classList.remove("hlpt-current");
        ChaosFunctions.ShowByClass("hlpm sign-up");
        ChaosFunctions.HideByClass("hlpm sign-in");
    });
    // 登陆按钮
    document.getElementById("sign-in").addEventListener("click", function(){
        // 获取用户输入的手机号
        let phone = document.getElementById("loginPhone").value;
        // 验证手机号是否合法
        if (check(phone)) {
            Cookies.set('ChaosForm_' + ChaosForm + "_Phone", phone);// 保存手机号
            // 提交验证
            ChaosCallback = function(data) {
                if (typeof(data) === "object") {
                    if (typeof(data.status) !== "undefined") {
                        if (data.status == 1) {
                            // 存在
                            alert("登录成功！");
                            ChaosFunctions.HideByClass("hl-cover,hl-popup"); // 隐藏登陆窗口
                            ChaosLoginStatus = true;
                            Cookies.set('ChaosForm_' + ChaosForm, 'isLogin');// 保存登陆状态
                        } else {
                            // 错误
                            alert(data.msg + " ( Status Code " + data.status + " )")
                        }
                    } else {
                        alert("ZG99 接口错误");
                    }
                } else {
                    alert("请求失败");
                }
            };
            ChaosFunctions.DynamicLoading.JS("http://zg99.offcn.com/index/biaodan/getphonestatus?callback=ChaosCallback&actid=" + ChaosForm + "&phone=" + phone);
        }
        // 结束
    });
    // 注册按钮
    document.getElementById("sign-up").addEventListener("click", function(){
        // 获取用户输入的手机号
        let phone = document.getElementById("phone").value;
        // 验证手机号是否合法
        if (check(phone)) {
            let code = document.getElementById("code").value;
            // 校验验证码是否输入
            if (code === '') {
                alert('请填写验证码！');
                return false;
            }
            Cookies.set('ChaosForm_' + ChaosForm + "_Phone", phone);// 保存手机号
            // 都合法则继续提交
            ChaosCallback = function(data) {
                if (typeof(data) === "object") {
                    if (typeof(data.status) !== "undefined") {
                        if (data.status == 1) {
                            // 存在
                            alert("注册成功！");
                            ChaosFunctions.HideByClass("hl-cover,hl-popup"); // 隐藏注册窗口
                            ChaosLoginStatus = true;
                            Cookies.set('ChaosForm_' + ChaosForm, 'isLogin');// 保存注册状态
                        } else {
                            // 错误
                            alert(data.msg + " ( Status Code " + data.status + " )")
                        }
                    } else {
                        alert("ZG99 接口错误");
                    }
                } else {
                    alert("请求失败");
                }
            };
            ChaosFunctions.DynamicLoading.JS("http://zg99.offcn.com/index/biaodan/register?callback=ChaosCallback&actid=" + ChaosForm + "&phone=" + phone + "&yzm=" + code + "&ds=" + ChaosLoacation.n);
        }
    });
    // 获取验证码按钮
    document.getElementById("sendcode").addEventListener("click", function(){
        // 获取用户输入的手机号
        let phone = document.getElementById("phone").value;
        // 验证手机号是否合法
        if (check(phone)) {
            ChaosFunctions.HideByClass()
            document.getElementById("sendcode").style.display = "none";
            document.getElementById("countdown").style.display = "block";
            // 都合法则继续提交
            ChaosCallback = function(data) {
                if (typeof(data) === "object") {
                    if (typeof(data.status) !== "undefined") {
                        if (data.status == 1) {
                            alert('发送验证码成功！');
                            runCount(120); // 倒计时
                        } else if (data.status == 4) {
                            alert('您已注册,去登陆吧！');
                            document.getElementById("sendcode").style.display = "block"; // 恢复获取验证码按钮
                            document.getElementById("countdown").style.display = "none"; // 恢复获取验证码按钮
                            document.getElementById("hlp_sign_in").classList.add("hlpt-current"); // 切换顶部标签到登陆
                            document.getElementById("hlp_sign_up").classList.remove("hlpt-current"); // 切换顶部标签到登陆
                            ChaosFunctions.ShowByClass("hlpm sign-in"); // 切换中部标签到登陆
                            ChaosFunctions.HideByClass("hlpm sign-up"); // 切换中部标签到登陆
                            return false;
                        } else {
                            // 错误
                            alert(data.msg + " ( Status Code " + data.status + " )")
                        }
                    } else {
                        alert("ZG99 接口错误");
                    }
                } else {
                    alert("请求失败");
                }
            };
            ChaosFunctions.DynamicLoading.JS("http://zg99.offcn.com/index/biaodan/sendmsg?callback=ChaosCallback&actid=" + ChaosForm + "&phone=" + phone);
        }
    });
    /* 注册监听事件 结束 */

    // 验证手机号合法性函数
    function check(phone) {
        if (phone === '') {   // 验证手机号是否为空
            alert('请填写手机号！');
            return false;
        } else if (!(/^1[3456789]\d{9}$/.test(phone))) {   // 验证手机号是否正确
            alert('请填写正确的手机号！');
            return false
        } else {
            return true
        }
    }

    // 倒计时函数
    function runCount(t) {
        if (t > 0) {
            document.getElementById("countdown").innerText = t + "S后重新获取";
            t--;
            setTimeout(function () {
                runCount(t)
            }, 1000)
        } else {
            document.getElementById("sendcode").style.display = "block";
            document.getElementById("countdown").style.display = "none";
        }
    }

    ChaosFunctions.Logger({Type: 'warn', Info : '手机号登陆模块 ( 处理函数 ) 中定义了全局变量 [ ChaosCallback ( Jsonp 回调函数 ) ] [ ChaosHideLogin ( 隐藏登陆模块函数 ) ] ，请注意不要覆盖！'});
    ChaosFunctions.Logger({Type: 'info', Info : '手机号登陆模块处理函数 ( phone-functions.js ) 加载成功'});
})();
