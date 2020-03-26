(function () {
    // 填充手机号码
    if (ChaosSingleSignOnModuleInfo.Phone + "".length > 10) {
        document.getElementById("chaos-phone").setAttribute("value", ChaosSingleSignOnModuleInfo.Phone)
        switchRegisterStatus(ChaosSingleSignOnModuleInfo.NeedToRegister)
    }

    // 拼接定位
    let locationString = ChaosSingleSignOnModuleInfo.CRMOName.replace("分校", "分部");
    if (ChaosSingleSignOnModuleInfo.CRMID !== 0) {
        locationString += " [ " + ChaosSingleSignOnModuleInfo.CRMUser + " ]";
    }

    // 填充定位
    document.getElementById("location").setAttribute("value", locationString); // 注册表单地市定位字段

    // 隐藏窗口函数
    ChaosHideLogin = function () {
        // 隐藏窗口
        ChaosFunctions.HideByClass("hl-cover,hl-popup");
    }

    /* 注册监听事件 开始 */
    // 注册关闭登陆框监听器
    document.getElementsByClassName("hl-cover")[0].addEventListener("click", ChaosHideLogin);
    document.getElementsByClassName("hl-close")[0].addEventListener("click", ChaosHideLogin);

    // 监听手机号输入
    function phoneChange(event) {
        if (event.target.value.length === 11 && event.target.value !== ChaosSingleSignOnModuleInfo.Phone) {
            // 进行手机号验证
            document.getElementById("chaos-submit").value = "请 稍 候 ..."
            ChaosFunctions.XHR.GET(ChaosSingleSignOnModuleInfo.ApiPath + "/events/SSO/session/" + ChaosSingleSignOnModuleInfo.MID + "/" + ChaosSingleSignOnModuleInfo.Key419 + "/" + event.target.value, function (xhr) {
                if (typeof (xhr.responseJson) == "object") {
                    ChaosSingleSignOnModuleInfo.NeedToRegister = xhr.responseJson.NeedToRegister;
                    switchRegisterStatus(xhr.responseJson.NeedToRegister)
                }
            });
        } else {
            ChaosFunctions.HideByClass("chaos-code-line");
            Object.keys(document.getElementsByClassName("chaos-tips")).forEach(function (key) {
                document.getElementsByClassName("chaos-tips")[key].innerHTML = "";
            });
        }
    }
    if ("\v" == "v") { // true为IE浏览器，感兴趣的同学可以去搜下，据说是现有最流行的判断浏览器的方法
        document.getElementById("chaos-phone").onpropertychange = phoneChange;
    } else {
        document.getElementById("chaos-phone").addEventListener("input", phoneChange)
    }

    // 监听 获取验证码按钮
    document.getElementById("chaos-get-code").addEventListener("click", function () {
        // 获取用户输入的手机号
        let phone = document.getElementById("chaos-phone").value;
        // 验证手机号是否合法
        if (check(phone) && document.getElementById("chaos-get-code").innerHTML === "获取验证码") {
            // 都合法则继续提交
            ChaosCallback = function (data) {
                if (typeof (data) === "object") {
                    if (typeof (data.status) !== "undefined") {
                        if (data.status == 1) {
                            alert('发送验证码成功！');
                            countdown(120); // 倒计时
                        } else if (data.status == 4) {
                            // 发送验证码次数达到上限
                            console.log('您已注册,去登陆吧！');
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
            ChaosFunctions.DynamicLoading.JS("http://zg99.offcn.com/index/biaodan/sendmsg?callback=ChaosCallback&actid=11396&phone=" + phone);
        }
    });

    // 监听 提交按钮
    document.getElementById("chaos-submit").addEventListener("click", function () {
        // 等待检查手机号注册状态完成
        if ( document.getElementById("chaos-submit").innerHTML == "请 稍 候 ..." ) {
            alert("请 稍 候 ...")
            return
        }
        // 获取用户输入的手机号
        let phone = document.getElementById("chaos-phone").value;
        // 验证手机号是否合法
        if (check(phone)) {
            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if ( typeof ChaosPageBeforeSubmitHook === "function") {
                if (!ChaosPageBeforeSubmitHook(phone)) {
                    ChaosFunctions.Logger({ Type: 'info', Info: 'ChaosPageBeforeSubmitHook ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤.' });
                    return
                } else {
                    ChaosFunctions.Logger({ Type: 'info', Info: 'ChaosPageBeforeSubmitHook ( 提交前事件处理钩子 ) 返回 True, 继续提交.' });
                }
            } else {
                ChaosFunctions.Logger({ Type: 'info', Info: '未定义 ChaosPageBeforeSubmitHook ( 提交前事件处理钩子 ) , 跳过预检.' });
            }
            // 根据是否需要注册的状态，调用注册接口或登陆接口
            if (ChaosSingleSignOnModuleInfo.NeedToRegister) {
                // 调用注册接口
                let code = document.getElementById("chaos-code").value;
                // 校验验证码是否输入
                if (code === '') {
                    alert('请填写验证码！');
                    return false;
                }
                // 都合法则继续提交
                ChaosFunctions.XHR.POST(ChaosSingleSignOnModuleInfo.ApiPath + "/events/SSO/register/" + ChaosSingleSignOnModuleInfo.MID + "/" + ChaosSingleSignOnModuleInfo.Key419 + "/" + phone + "/" + code, { "URL": location.href }, function (xhr) {
                    if (typeof (xhr.responseJson) == "object") {
                        ChaosFunctions.HideByClass("hl-cover,hl-popup"); // 隐藏注册窗口
                        ChaosSingleSignOnModuleInfo.Phone = phone * 1;
                        ChaosFunctions.Cookies.Set("chaos-v4-phone", ChaosSingleSignOnModuleInfo.Phone, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                        ChaosSingleSignOnModuleInfo.IsLogin = true; // 更新登陆状态
                        ChaosSingleSignOnModuleInfo.NeedToRegister = false; // 更新注册状态
                        if ( typeof ChaosPageAfterSubmitHook === "function" ) {
                            ChaosPageAfterSubmitHook(ChaosSingleSignOnModuleInfo.Phone);
                        } else {
                            ChaosFunctions.Logger({ Type: 'info', Info: '未定义 ChaosPageAfterSubmitHook ( 提交后事件处理钩子 ) , 跳过登陆回调.' });
                            alert("注册成功！");
                        }
                        ChaosFunctions.HideByClass("chaos-login-page-form");
                        ChaosFunctions.ShowByClass("chaos-login-page-is-login");
                    } else {
                        alert("注册失败，请您稍后再试～");
                    }
                });
            } else {
                // 调用登陆接口
                ChaosFunctions.XHR.POST(ChaosSingleSignOnModuleInfo.ApiPath + "/events/SSO/login/" + ChaosSingleSignOnModuleInfo.MID + "/" + ChaosSingleSignOnModuleInfo.Key419 + "/" + phone, { "URL": location.href }, function (xhr) {
                    if (typeof (xhr.responseJson) == "object") {
                        ChaosFunctions.HideByClass("hl-cover,hl-popup"); // 隐藏注册窗口
                        ChaosSingleSignOnModuleInfo.Phone = phone * 1;
                        ChaosFunctions.Cookies.Set("chaos-v4-phone", ChaosSingleSignOnModuleInfo.Phone, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                        ChaosSingleSignOnModuleInfo.IsLogin = true; // 更新登陆状态
                        ChaosSingleSignOnModuleInfo.NeedToRegister = false; // 更新注册状态
                        if ( typeof ChaosPageAfterSubmitHook === "function" ) {
                            ChaosPageAfterSubmitHook(ChaosSingleSignOnModuleInfo.Phone);
                        } else {
                            ChaosFunctions.Logger({ Type: 'info', Info: '未定义 ChaosPageAfterSubmitHook ( 提交后事件处理钩子 ) , 跳过登陆回调.' });
                            alert("登陆成功！");
                        }
                        ChaosFunctions.HideByClass("chaos-login-page-form");
                        ChaosFunctions.ShowByClass("chaos-login-page-is-login");
                    } else {
                        alert("登陆失败，请您稍后再试～");
                    }
                });
            }
        }
    });

    /* 注册监听事件 结束 */

    ChaosFunctions.Logger({ Type: 'warn', Info: '手机号登陆模块 ( 处理函数 ) 中定义了全局变量 [ ChaosCallback ( Jsonp 回调函数 ) ] [ ChaosHideLogin ( 隐藏登陆模块函数 ) ] ，请注意不要覆盖！' });
    ChaosFunctions.Logger({ Type: 'info', Info: '手机号登陆模块处理函数 ( phone-functions.js ) 加载成功' });

    // 加载完毕
    ChaosSingleSignOnModuleInfo.Completed = true;

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
    function countdown(second) {
        if (second > 0) {
            document.getElementById("chaos-get-code").innerHTML = second + "秒后重新获取";
            second--;
            setTimeout(function () {
                countdown(second)
            }, 1000);
        } else {
            document.getElementById("chaos-get-code").innerHTML = "获取验证码";
        }
    }

    // 切换登陆状态函数
    function switchRegisterStatus(NeedToRegister) {
        let tips = '<span class="chaos-checked"></span><div>您的手机号已经注册, 直接点击登陆即可!</div>';
        if (NeedToRegister) {
            tips = '<span class="chaos-uncheck"></span><div>您的手机号未注册, 请获取并填写验证码!</div>';
            ChaosFunctions.ShowByClass("chaos-code-line");
            document.getElementById("chaos-submit").value = "注 册"

        } else {
            ChaosFunctions.HideByClass("chaos-code-line");
            document.getElementById("chaos-submit").value = "登 陆"
        }
        Object.keys(document.getElementsByClassName("chaos-tips")).forEach(function (key) {
            document.getElementsByClassName("chaos-tips")[key].innerHTML = tips;
        });
    }
})();
