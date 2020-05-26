(function () {
    // 填充手机号码
    if (Chaos.Infos.Phone + "".length > 10) {
        document.getElementById("chaos-phone").setAttribute("value", Chaos.Infos.Phone)
        switchRegisterStatus(Chaos.Infos.NeedToRegister)
    }

    // 拼接定位
    var ascriptionString = Chaos.Infos.CRM.OName.replace("分校", "分部");
    if (Chaos.Infos.CRM.UID !== null) {
        ascriptionString += " [ " + Chaos.Infos.CRM.User + " ]";
    }

    // 填充定位
    Object.keys(document.getElementsByClassName("chaos-ascription")).forEach(function (key) {
        document.getElementsByClassName("chaos-ascription")[key].innerHTML = ascriptionString;
    });

    /* 注册监听事件 开始 */

    // 监听手机号输入
    function phoneChange(event) {
        if (event.target.value.length === 11 && event.target.value !== Chaos.Infos.Phone) {
            // 进行手机号验证
            document.getElementById("chaos-submit").innerHTML = "请 稍 候 ..."
            Chaos.Functions.XHR.GET(Chaos.Infos.Apis.TSF + "/sso/v2/sessions/info/" + Chaos.Infos.ID + "/" + Chaos.Infos.Suffix + "/" + event.target.value, function (XHR) {
                if (typeof (XHR.responseJson) == "object") {
                    Chaos.Infos.NeedToRegister = XHR.responseJson.NeedToRegister // 修改模块的是否需要注册状态, 如果此处不进行修改的话, 后续的登陆步骤无法正常执行
                    switchRegisterStatus(XHR.responseJson.NeedToRegister)
                    document.getElementById("chaos-submit").innerHTML = "提 交"
                }
            });
        } else {
            Chaos.Functions.HideByClass("chaos-code-line");
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
        var phone = document.getElementById("chaos-phone").value;
        // 验证手机号是否合法
        if (check(phone) && document.getElementById("chaos-get-code").innerHTML === "获取验证码") {
            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if (typeof Chaos.Hooks.BeforeSubmit === "function") {
                if (!Chaos.Hooks.BeforeSubmit(phone)) {
                    Chaos.Functions.Logger({ Type: "info", Info: "Chaos.Hooks.BeforeSubmit ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤." });
                    return
                } else {
                    Chaos.Functions.Logger({ Type: "info", Info: "Chaos.Hooks.BeforeSubmit ( 提交前事件处理钩子 ) 返回 True, 继续提交." });
                }
            } else {
                Chaos.Functions.Logger({ Type: "info", Info: "未定义 Chaos.Hooks.BeforeSubmit ( 提交前事件处理钩子 ) , 跳过预检." });
            }
            // 都合法则继续提交
            Chaos.Functions.XHR.POST(Chaos.Infos.Apis.SCF + "/sso/v2/verification-code/send/" + Chaos.Infos.ID + "/" + phone, {}, function (XHR) {
                alert('发送验证码成功！');
                countdown(120); // 倒计时
            });
        }
    });

    // 监听 提交按钮
    document.getElementById("chaos-submit").addEventListener("click", function () {
        // 等待检查手机号注册状态完成
        if (document.getElementById("chaos-submit").innerHTML == "请 稍 候 ...") {
            alert("请 稍 候 ...")
            return
        }
        // 获取用户输入的手机号
        var phone = document.getElementById("chaos-phone").value;
        // 验证手机号是否合法
        if (check(phone)) {
            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if (typeof Chaos.Hooks.BeforeSubmit === "function") {
                if (!Chaos.Hooks.BeforeSubmit(phone)) {
                    Chaos.Functions.Logger({ Type: "info", Info: "Chaos.Hooks.BeforeSubmit ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤." });
                    return
                } else {
                    Chaos.Functions.Logger({ Type: "info", Info: "Chaos.Hooks.BeforeSubmit ( 提交前事件处理钩子 ) 返回 True, 继续提交." });
                }
            } else {
                Chaos.Functions.Logger({ Type: "info", Info: "未定义 Chaos.Hooks.BeforeSubmit ( 提交前事件处理钩子 ) , 跳过预检." });
            }
            // 根据是否需要注册的状态，调用注册接口或登陆接口
            if (Chaos.Infos.NeedToRegister) {
                // 调用注册接口
                var code = document.getElementById("chaos-code").value;
                // 校验验证码是否输入
                if (code === '') {
                    alert('请填写验证码！');
                    return false;
                }
                // 拼接请求 Body
                // 将基本的参数对象与可选参数对象进行合并
                var data = Object.assign({
                    MID: Chaos.Infos.ID,
                    Suffix: Chaos.Infos.Suffix,
                    Phone: phone,
                    Code: code * 1, // 修正为数字类型
                }, getOptionalParameters())
                // 都合法则继续提交
                Chaos.Functions.XHR.POST(Chaos.Infos.Apis.SCF + "/sso/v2/auth/sign-up", data, function (XHR) {
                    if (typeof (XHR.responseJson) == "object") {
                        Chaos.Infos.Phone = phone * 1;
                        Chaos.Functions.Cookies.Set("chaos-v5-phone", Chaos.Infos.Phone, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                        Chaos.Infos.IsLogin = true; // 更新登陆状态
                        Chaos.Infos.NeedToRegister = false; // 更新注册状态
                        if (typeof Chaos.Hooks.AfterSubmit === "function") {
                            Chaos.Hooks.AfterSubmit(Chaos.Infos.Phone);
                        } else {
                            Chaos.Functions.Logger({ Type: 'info', Info: '未定义 Chaos.Hooks.AfterSubmit ( 提交后事件处理钩子 ) , 跳过登陆回调.' });
                            alert("提交成功！");
                        }
                        Chaos.Functions.HideByClass("chaos-login-page-form");
                        Chaos.Functions.ShowByClass("chaos-login-page-is-login");
                    } else {
                        alert("提交失败，请您稍后再试～");
                    }
                });
            } else {
                // 拼接请求 Body
                // 将基本的参数对象与可选参数对象进行合并
                var data = Object.assign({
                    MID: Chaos.Infos.ID,
                    Suffix: Chaos.Infos.Suffix,
                    Phone: phone,
                }, getOptionalParameters())
                // 调用登陆接口
                Chaos.Functions.XHR.POST(Chaos.Infos.Apis.SCF + "/sso/v2/auth/sign-in", data, function (XHR) {
                    if (typeof (XHR.responseJson) == "object") {
                        Chaos.Infos.Phone = phone * 1;
                        Chaos.Functions.Cookies.Set("chaos-v5-phone", Chaos.Infos.Phone, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                        Chaos.Infos.IsLogin = true; // 更新登陆状态
                        Chaos.Infos.NeedToRegister = false; // 更新注册状态
                        if (typeof Chaos.Hooks.AfterSubmit === "function") {
                            Chaos.Hooks.AfterSubmit(Chaos.Infos.Phone);
                        } else {
                            Chaos.Functions.Logger({ Type: 'info', Info: '未定义 Chaos.Hooks.AfterSubmit ( 提交后事件处理钩子 ) , 跳过登陆后回调.' });
                            alert("提交成功！");
                        }
                        Chaos.Functions.HideByClass("chaos-login-page-form");
                        Chaos.Functions.ShowByClass("chaos-login-page-is-login");
                    } else {
                        alert("提交失败，请您稍后再试～");
                    }
                });
            }
        }
    });
    /* 注册监听事件 结束 */

    Chaos.Functions.Logger({ Type: "info", Info: "页面嵌入式登陆中间件处理函数 ( page-functions.js ) 加载成功" });

    // 登陆模块加载状态 完成
    Chaos.Infos.Completed = true;

    // 切换登陆状态函数
    function switchRegisterStatus(NeedToRegister) {
        var tips = '<span class="chaos-checked"></span>您的手机号已经注册, 直接点击提交即可完成操作!';
        if (NeedToRegister) {
            tips = '<span class="chaos-uncheck"></span> 您的手机号未注册, 请获取并填写验证码!';
            Chaos.Functions.ShowByClass("chaos-code-line");
        } else {
            Chaos.Functions.HideByClass("chaos-code-line");
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
        } else if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(phone))) {   // 验证手机号是否正确
            // 正则来自 https://any86.github.io/any-rule/
            // 中国(严谨), 根据工信部2019年最新公布的手机号段
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
        var optionalParameters = {}
        if (document.getElementById("chaos-customer-name") !== null && document.getElementById("chaos-customer-name").value !== "") {
            optionalParameters.CustomerName = document.getElementById("chaos-customer-name").value;
        }
        if (document.getElementById("chaos-customer-identity") !== null && document.getElementById("chaos-customer-identity").value * 1 !== 0 && !isNaN(document.getElementById("chaos-customer-identity").value * 1)) {
            optionalParameters.CustomerIdentityID = document.getElementById("chaos-customer-identity").value*1;
        }
        if (document.getElementById("chaos-customer-colleage") !== null && document.getElementById("chaos-customer-colleage").value !== "") {
            optionalParameters.CustomerColleage = document.getElementById("chaos-customer-colleage").value;
        }
        if (document.getElementById("chaos-customer-mayor") !== null && document.getElementById("chaos-customer-mayor").value !== "") {
            optionalParameters.CustomerMayor = document.getElementById("chaos-customer-mayor").value;
        }
        if (document.getElementById("chaos-remark") !== null && document.getElementById("chaos-remark").value !== "") {
            optionalParameters.Remark = document.getElementById("chaos-remark").value;
        }
        return optionalParameters
    }
})();
