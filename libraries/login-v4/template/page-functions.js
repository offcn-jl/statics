(function () {
    // 填充手机号码
    if (ChaosSingleSignOnModuleInfo.Phone + "".length > 10) {
        document.getElementById("chaos-phone").setAttribute("value", ChaosSingleSignOnModuleInfo.Phone)
        switchRegisterStatus(ChaosSingleSignOnModuleInfo.NeedToRegister)
    }

    // 拼接定位
    let ascriptionString = ChaosSingleSignOnModuleInfo.CRMOName.replace("分校", "分部");
    if (ChaosSingleSignOnModuleInfo.CRMID !== 0) {
        ascriptionString += " [ " + ChaosSingleSignOnModuleInfo.CRMUser + " ]";
    }

    // 填充定位
    Object.keys(document.getElementsByClassName("chaos-ascription")).forEach(function (key) {
        document.getElementsByClassName("chaos-ascription")[key].innerHTML = ascriptionString;
    });

    /* 注册监听事件 开始 */

    // 监听手机号输入
    if ("\v" == "v") { // true为IE浏览器，感兴趣的同学可以去搜下，据说是现有最流行的判断浏览器的方法
        document.getElementById("chaos-phone").onpropertychange = phoneChange;
    } else {
        document.getElementById("chaos-phone").addEventListener("input", phoneChange)
    }
    function phoneChange(event) {
        if (event.target.value.length === 11 && event.target.value !== ChaosSingleSignOnModuleInfo.Phone) {
            // 进行手机号验证
            document.getElementById("chaos-submit").innerHTML = "请 稍 候 ..."
            ChaosFunctions.XHR.GET(ChaosSingleSignOnModuleInfo.ApiPath + "/events/SSO/session/" + ChaosSingleSignOnModuleInfo.MID + "/" + ChaosSingleSignOnModuleInfo.Key419 + "/" + event.target.value, function (xhr) {
                if (typeof (xhr.responseJson) == "object") {
                    ChaosSingleSignOnModuleInfo.NeedToRegister = xhr.responseJson.NeedToRegister;
                    switchRegisterStatus(xhr.responseJson.NeedToRegister)
                    document.getElementById("chaos-submit").innerHTML = "提 交"
                }
            });
        } else {
            ChaosFunctions.HideByClass("chaos-code-line");
            Object.keys(document.getElementsByClassName("chaos-tips")).forEach(function (key) {
                document.getElementsByClassName("chaos-tips")[key].innerHTML = "";
            });
        }
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
                ChaosFunctions.XHR.POST(ChaosSingleSignOnModuleInfo.ApiPath + "/events/SSO/register/" + ChaosSingleSignOnModuleInfo.MID + "/" + ChaosSingleSignOnModuleInfo.Key419 + "/" + phone + "/" + code, { "URL": location.href, ...getOptionalParameters() }, function (xhr) {
                    if (typeof (xhr.responseJson) == "object") {
                        ChaosSingleSignOnModuleInfo.Phone = phone * 1;
                        ChaosFunctions.Cookies.Set("chaos-v4-phone", ChaosSingleSignOnModuleInfo.Phone, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                        ChaosSingleSignOnModuleInfo.IsLogin = true; // 更新登陆状态
                        ChaosSingleSignOnModuleInfo.NeedToRegister = false; // 更新注册状态
                        if ( typeof ChaosPageAfterSubmitHook === "function" ) {
                            ChaosPageAfterSubmitHook(ChaosSingleSignOnModuleInfo.Phone);
                        } else {
                            ChaosFunctions.Logger({ Type: 'info', Info: '未定义 ChaosPageAfterSubmitHook ( 提交后事件处理钩子 ) , 跳过登陆回调.' });
                            alert("提交成功！");
                        }
                        ChaosFunctions.HideByClass("chaos-login-page-form");
                        ChaosFunctions.ShowByClass("chaos-login-page-is-login");
                    } else {
                        alert("提交失败，请您稍后再试～");
                    }
                });
            } else {
                // 调用登陆接口
                ChaosFunctions.XHR.POST(ChaosSingleSignOnModuleInfo.ApiPath + "/events/SSO/login/" + ChaosSingleSignOnModuleInfo.MID + "/" + ChaosSingleSignOnModuleInfo.Key419 + "/" + phone, { "URL": location.href, ...getOptionalParameters() }, function (xhr) {
                    if (typeof (xhr.responseJson) == "object") {
                        ChaosSingleSignOnModuleInfo.Phone = phone * 1;
                        ChaosFunctions.Cookies.Set("chaos-v4-phone", ChaosSingleSignOnModuleInfo.Phone, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                        ChaosSingleSignOnModuleInfo.IsLogin = true; // 更新登陆状态
                        ChaosSingleSignOnModuleInfo.NeedToRegister = false; // 更新注册状态
                        if ( typeof ChaosPageAfterSubmitHook === "function" ) {
                            ChaosPageAfterSubmitHook(ChaosSingleSignOnModuleInfo.Phone);
                        } else {
                            ChaosFunctions.Logger({ Type: 'info', Info: '未定义 ChaosPageAfterSubmitHook ( 提交后事件处理钩子 ) , 跳过登陆回调.' });
                            alert("提交成功！");
                        }
                        ChaosFunctions.HideByClass("chaos-login-page-form");
                        ChaosFunctions.ShowByClass("chaos-login-page-is-login");
                    } else {
                        alert("提交失败，请您稍后再试～");
                    }
                });
            }
        }
    });
    
    /* 注册监听事件 结束 */

    ChaosFunctions.Logger({ Type: 'warn', Info: '手机号登陆模板 ( 页面版 ) ( 处理函数 ) 中定义了全局变量 [ ChaosCallback ( Jsonp 回调函数 ) ] [ ChaosHideLogin ( 隐藏登陆模块函数 ) ] ，请注意不要覆盖！' });
    ChaosFunctions.Logger({ Type: 'info', Info: '手机号登陆模板 ( 页面版 ) 处理函数 ( page-functions.js ) 加载成功' });

    // 加载完毕
    ChaosSingleSignOnModuleInfo.Completed = true;

    // 切换登陆状态函数
    function switchRegisterStatus(NeedToRegister) {
        let tips = '<span class="chaos-checked"></span>您的手机号已经注册, 直接点击提交即可完成操作!';
        if (NeedToRegister) {
            tips = '<span class="chaos-uncheck"></span> 您的手机号未注册, 请获取并填写验证码!';
            ChaosFunctions.ShowByClass("chaos-code-line");
        } else {
            ChaosFunctions.HideByClass("chaos-code-line");
        }
        Object.keys(document.getElementsByClassName("chaos-tips")).forEach(function (key) {
            document.getElementsByClassName("chaos-tips")[key].innerHTML = tips;
        });
    }

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

    // 获取可选参数函数
    function getOptionalParameters() {
        let optionalParameters = {}
        if ( document.getElementById("chaos-customer-name") !== null && document.getElementById("chaos-customer-name").value !== "") {
            optionalParameters.CustomerName = document.getElementById("chaos-customer-name").value;
        }
        if ( document.getElementById("chaos-customer-identity") !== null && document.getElementById("chaos-customer-identity").value * 1 !== NaN) {
            optionalParameters.CustomerIdentity = document.getElementById("chaos-customer-identity").value;
        }
        if ( document.getElementById("chaos-customer-colleage") !== null && document.getElementById("chaos-customer-colleage").value !== "") {
            optionalParameters.CustomerColleage = document.getElementById("chaos-customer-colleage").value;
        }
        if ( document.getElementById("chaos-customer-mayor") !== null && document.getElementById("chaos-customer-mayor").value !== "") {
            optionalParameters.CustomerMayor = document.getElementById("chaos-customer-mayor").value;
        }
        if ( document.getElementById("chaos-remark") !== null && document.getElementById("chaos-remark").value !== "") {
            optionalParameters.Remark = document.getElementById("chaos-remark").value;
        }
        return optionalParameters
    }
})();
