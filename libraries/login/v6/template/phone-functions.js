(function () {
    // 填充签名
    var 签名 = ""
    // 向签名中间拼接空格
    for (var i = 0; i < 哈士齐单点登陆模块.公共信息.发信签名.length; i++) {
        if (i < 哈士齐单点登陆模块.公共信息.发信签名.length - 1) {
            签名 += 哈士齐单点登陆模块.公共信息.发信签名[i] + "&nbsp;"
        } else {
            签名 += 哈士齐单点登陆模块.公共信息.发信签名[i]
        }
    }
    document.getElementsByClassName("hlpt-current")[0].innerHTML = 签名

    // 填充手机号码
    if (哈士齐单点登陆模块.公共信息.用户手机号 + "".length > 10) {
        document.getElementById("offcn-sso-phone").setAttribute("value", 哈士齐单点登陆模块.公共信息.用户手机号)
        切换登陆状态(哈士齐单点登陆模块.公共信息.用户需要注册)
    }

    // 拼接定位
    var 定位 = 哈士齐单点登陆模块.公共信息.CRM.组织名称.replace("分校", "分部");
    if (哈士齐单点登陆模块.公共信息.CRM.推广人ID !== null) {
        定位 += " [ " + 哈士齐单点登陆模块.公共信息.CRM.推广人用户名 + " ]";
    }

    // 填充定位
    document.getElementById("offcn-sso-location").setAttribute("value", 定位); // 注册表单地市定位字段

    // 隐藏窗口函数
    哈士齐单点登陆模块.钩子.隐藏登陆窗口 = function () { 哈士齐单点登陆模块.公共函数.隐藏元素("hl-cover,hl-popup") }

    /* 注册监听事件 开始 */
    // 注册关闭登陆框监听器
    document.getElementsByClassName("hl-cover")[0].addEventListener("click", 哈士齐单点登陆模块.钩子.隐藏登陆窗口);
    document.getElementsByClassName("hl-close")[0].addEventListener("click", 哈士齐单点登陆模块.钩子.隐藏登陆窗口);

    // 监听手机号输入
    function 手机号发生改变(事件) {
        if (事件.target.value.length === 11 && 事件.target.value !== 哈士齐单点登陆模块.公共信息.用户手机号) {
            // 进行手机号验证
            document.getElementById("offcn-sso-submit").innerHTML = "请 稍 候 ..."
            哈士齐单点登陆模块.公共函数.XHR.GET(哈士齐单点登陆模块.公共信息.接口.GAEA + "/events/sso/sessions/" + 哈士齐单点登陆模块.公共信息.模块ID + "/" + 哈士齐单点登陆模块.公共信息.宣传后缀 + "/" + 事件.target.value, function (响应内容) {
                if (typeof (响应内容.responseJson) == "object") {
                    if (响应内容.responseJson.Message !== "Success") {
                        alert(响应内容.responseJson.Message)
                    } else {
                        哈士齐单点登陆模块.公共信息.用户需要注册 = 响应内容.responseJson.Data.NeedToRegister // 修改模块的是否需要注册状态, 如果此处不进行修改的话, 后续的登陆步骤无法正常执行
                        切换登陆状态(哈士齐单点登陆模块.公共信息.用户需要注册)
                        document.getElementById("offcn-sso-submit").innerHTML = "提 交"
                    }
                }
            });
        } else {
            哈士齐单点登陆模块.公共函数.隐藏元素("offcn-sso-code-line");
            Object.keys(document.getElementsByClassName("offcn-sso-tips")).forEach(function (下标) {
                document.getElementsByClassName("offcn-sso-tips")[下标].innerHTML = "";
            });
        }
    }
    if ("\v" == "v") { // true为IE浏览器，感兴趣的同学可以去搜下，据说是现有最流行的判断浏览器的方法
        document.getElementById("offcn-sso-phone").onpropertychange = 手机号发生改变;
    } else {
        document.getElementById("offcn-sso-phone").addEventListener("input", 手机号发生改变)
    }

    // 监听 获取验证码按钮
    document.getElementById("offcn-sso-get-code").addEventListener("click", function () {
        // 获取用户输入的手机号
        var 用户手机号码 = document.getElementById("offcn-sso-phone").value;
        // 验证手机号是否合法
        if (验证手机号(用户手机号码) && document.getElementById("offcn-sso-get-code").innerHTML === "获取验证码") {
            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if (typeof 哈士齐单点登陆模块.钩子.触发登陆事件前 === "function") {
                if (!哈士齐单点登陆模块.钩子.触发登陆事件前(用户手机号码)) {
                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: "哈士齐单点登陆模块.钩子.触发登陆事件前 ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤." });
                    return
                } else {
                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: "哈士齐单点登陆模块.钩子.触发登陆事件前 ( 提交前事件处理钩子 ) 返回 True, 继续提交." });
                }
            } else {
                哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: "未定义 哈士齐单点登陆模块.钩子.触发登陆事件前 ( 提交前事件处理钩子 ) , 跳过预检." });
            }
            // 都合法则继续提交
            哈士齐单点登陆模块.公共函数.XHR.POST(哈士齐单点登陆模块.公共信息.接口.GAEA + "/events/sso/verification-code/send/" + 哈士齐单点登陆模块.公共信息.模块ID + "/" + 用户手机号码, {}, function (响应内容) {
                if (响应内容.responseJson.Message !== "Success") {
                    alert(响应内容.responseJson.Message)
                } else {
                    alert('发送验证码成功！');
                    倒计时(120); // 倒计时
                }
            });
        }
    });

    // 监听 提交按钮
    document.getElementById("offcn-sso-submit").addEventListener("click", function () {
        // 等待检查手机号注册状态完成
        if (document.getElementById("offcn-sso-submit").innerHTML == "请 稍 候 ...") {
            alert("请 稍 候 ...")
            return
        }
        // 获取用户输入的手机号
        var 用户手机号 = document.getElementById("offcn-sso-phone").value;
        // 验证手机号是否合法
        if (验证手机号(用户手机号)) {
            // 如果存在提交前中间件，则先将手机号转交处理，若其返回 false 则停止执行后续步骤
            if (typeof 哈士齐单点登陆模块.钩子.触发登陆事件前 === "function") {
                if (!哈士齐单点登陆模块.钩子.触发登陆事件前(用户手机号)) {
                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: "哈士齐单点登陆模块.钩子.触发登陆事件前 ( 提交前事件处理钩子 ) 返回 False, 阻止后续提交步骤." });
                    return
                } else {
                    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: "哈士齐单点登陆模块.钩子.触发登陆事件前 ( 提交前事件处理钩子 ) 返回 True, 继续提交." });
                }
            } else {
                哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: "未定义 哈士齐单点登陆模块.钩子.触发登陆事件前 ( 提交前事件处理钩子 ) , 跳过预检." });
            }
            // 根据是否需要注册的状态，调用注册接口或登陆接口
            if (哈士齐单点登陆模块.公共信息.用户需要注册) {
                // 调用注册接口
                var 验证码 = document.getElementById("offcn-sso-code").value;
                // 校验验证码是否输入
                if (验证码 === '') {
                    alert('请填写验证码！');
                    return false;
                }
                // 都合法则继续提交
                哈士齐单点登陆模块.公共函数.XHR.POST(哈士齐单点登陆模块.公共信息.接口.GAEA + "/events/sso/sign-up", { MID: 哈士齐单点登陆模块.公共信息.模块ID, Suffix: 哈士齐单点登陆模块.公共信息.宣传后缀, Phone: 用户手机号, Code: 验证码 * 1 /* 修正为数字类型 */, URL: window.location.href }, function (响应内容) {
                    if (typeof (响应内容.responseJson) == "object") {
                        if (响应内容.responseJson.Message !== "Success") {
                            alert(响应内容.responseJson.Message)
                        } else {
                            哈士齐单点登陆模块.公共函数.隐藏元素("hl-cover,hl-popup"); // 隐藏注册窗口
                            哈士齐单点登陆模块.公共信息.用户手机号 = 用户手机号 * 1;
                            哈士齐单点登陆模块.公共函数.Cookies.设置("offcn-sso-v5-phone", 哈士齐单点登陆模块.公共信息.用户手机号, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                            哈士齐单点登陆模块.公共信息.用户已登陆 = true; // 更新登陆状态
                            哈士齐单点登陆模块.公共信息.用户需要注册 = false; // 更新注册状态
                            if (typeof 哈士齐单点登陆模块.钩子.触发登陆事件后 === "function") {
                                哈士齐单点登陆模块.钩子.触发登陆事件后(哈士齐单点登陆模块.公共信息.用户手机号);
                            } else {
                                哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: "未定义 哈士齐单点登陆模块.钩子.触发登陆事件后 ( 提交后事件处理钩子 ) , 跳过登陆后回调." });
                                alert("提交成功！");
                            }
                        }
                    } else {
                        alert("提交失败，请您稍后再试～");
                    }
                });
            } else {
                // 调用登陆接口
                哈士齐单点登陆模块.公共函数.XHR.POST(哈士齐单点登陆模块.公共信息.接口.GAEA + "/events/sso/sign-in", { MID: 哈士齐单点登陆模块.公共信息.模块ID, Suffix: 哈士齐单点登陆模块.公共信息.宣传后缀, Phone: 用户手机号, URL: window.location.href }, function (响应内容) {
                    if (typeof (响应内容.responseJson) == "object") {
                        if (响应内容.responseJson.Message !== "Success") {
                            alert(响应内容.responseJson.Message)
                        } else {
                            哈士齐单点登陆模块.公共函数.隐藏元素("hl-cover,hl-popup"); // 隐藏登陆窗口
                            哈士齐单点登陆模块.公共信息.用户手机号 = 用户手机号 * 1;
                            哈士齐单点登陆模块.公共函数.Cookies.设置("offcn-sso-phone", 哈士齐单点登陆模块.公共信息.用户手机号, 30 * 24 * 60 * 60 * 1000); // 保存 cookies
                            哈士齐单点登陆模块.公共信息.用户已登陆 = true; // 更新登陆状态
                            哈士齐单点登陆模块.公共信息.用户需要注册 = false; // 更新注册状态
                            if (typeof 哈士齐单点登陆模块.钩子.触发登陆事件后 === "function") {
                                哈士齐单点登陆模块.钩子.触发登陆事件后(哈士齐单点登陆模块.公共信息.用户手机号);
                            } else {
                                哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: '未定义 哈士齐单点登陆模块.钩子.触发登陆事件后 ( 提交后事件处理钩子 ) , 跳过登陆后回调.' });
                                alert("登陆成功！");
                            }
                        }
                    } else {
                        alert("提交失败，请您稍后再试～");
                    }
                });
            }
        }
    });
    /* 注册监听事件 结束 */

    哈士齐单点登陆模块.公共函数.打印日志({ 类型: '信息', 内容: '手机号登陆模块处理函数 ( phone-functions.js ) 加载成功' });

    // 登陆模块加载状态 完成
    哈士齐单点登陆模块.公共信息.加载完成 = true;

    // 验证手机号合法性函数
    function 验证手机号(手机号) {
        if (手机号 === '') {   // 验证手机号是否为空
            alert('请填写手机号！');
            return false;
        } else if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(手机号))) {   // 验证手机号是否正确
            // 正则来自 https://any86.github.io/any-rule/
            // 中国(严谨), 根据工信部2019年最新公布的手机号段
            alert('请填写正确的手机号！');
            return false
        } else {
            return true
        }
    }

    // 倒计时函数
    function 倒计时(秒) {
        if (秒 > 0) {
            document.getElementById("offcn-sso-get-code").innerHTML = 秒 + "秒后重新获取";
            秒--;
            setTimeout(function () {
                倒计时(秒)
            }, 1000);
        } else {
            document.getElementById("offcn-sso-get-code").innerHTML = "获取验证码";
        }
    }

    // 切换登陆状态函数
    function 切换登陆状态(用户需要注册) {
        var 提示内容 = '<span class="offcn-sso-checked"></span><div>您的手机号已经注册, 直接点击登陆即可!</div>';
        if (用户需要注册) {
            提示内容 = '<span class="offcn-sso-uncheck"></span><div>您的手机号未注册, 请获取并填写验证码!</div>';
            哈士齐单点登陆模块.公共函数.显示元素("offcn-sso-code-line");
            document.getElementById("offcn-sso-submit").value = "注 册"
        } else {
            哈士齐单点登陆模块.公共函数.隐藏元素("offcn-sso-code-line");
            document.getElementById("offcn-sso-submit").value = "登 陆"
        }
        Object.keys(document.getElementsByClassName("offcn-sso-tips")).forEach(function (下标) {
            document.getElementsByClassName("offcn-sso-tips")[下标].innerHTML = 提示内容;
        });
    }
})();
