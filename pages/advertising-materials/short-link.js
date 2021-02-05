$(() => {
    // 获取基础信息 花名册
    let 花名册
    $.ajax({
        type: "GET",
        url: ChaosEnvironmentVariables.Apis.TSF + "/sso/v2/suffix/list/available",
        async: false, // 设置为同步模式
        success: (响应) => {
            花名册 = 响应
        }
    })

    // 处理花名册 设置 宣传人列表
    let 宣传人列表 = [];
    花名册.forEach(当前元素 => {
        宣传人列表.push({ id: 当前元素.ID, name: "[ " + 当前元素.Suffix + " ] " + 当前元素.Name + " | " + 当前元素.CRMOName })
    })

    // 给 宣传人列表 输入框增加监听器 完成自动补全
    $("#suffix").typeahead({ source: 宣传人列表 })

    // 监听选择宣传人事件
    let 当前选中宣传人下标 = -1;
    $("#suffix").change(() => {
        宣传人列表.forEach((当前元素, 当前元素下标) => {
            if (当前元素.name === $("#suffix").val()) {
                当前选中宣传人下标 = 当前元素下标
                $("#current-suffix span").html(花名册[当前选中宣传人下标].Suffix)
                $("#current-suffix span").css("color", "#FF3000")
                $("#current-orgnazition span").html(花名册[当前选中宣传人下标].CRMOName)
                $("#current-orgnazition span").css("color", "#FF3000")
                $("#current-name span").html(花名册[当前选中宣传人下标].Name)
                $("#current-name span").css("color", "#FF3000")
            }
        })
    })

    // 获取基础信息 物料列表
    let 物料列表
    $.ajax({
        type: "GET",
        url: ChaosEnvironmentVariables.Apis.TKE + "/events/advertising-materials/list/mini-program",
        async: false, // 设置为同步模式
        success: (响应) => {
            // 转换为小写, 因为 typeahead 库只支持小写 Key
            物料列表 = JSON.parse(JSON.stringify(响应).toLowerCase())
        }
    })

    // 给 宣传人列表 输入框增加监听器 完成自动补全
    $("#advertising-materials").typeahead({ source: 物料列表 })

    // 监听选择物料事件
    let 当前选中物料下标 = -1;
    $("#advertising-materials").change(() => {
        物料列表.forEach((当前元素, 当前元素下标) => {
            if (当前元素.name === $("#advertising-materials").val()) {
                当前选中物料下标 = 当前元素下标
                $("#current-event span").html(物料列表[当前选中物料下标].name)
                $("#current-event span").css("color", "green")
                $("#current-event-link span").html("<a href=\"./short-link.html?amid=" + 物料列表[当前选中物料下标].id + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + 物料列表[当前选中物料下标].name + "</a>")
                $("#current-event-link span").css("color", "green")
            }
        })
    })

    // 判断是否设定 物料 ID
    if (typeof $_GET["amid"] !== "undefined" && !isNaN(Number($_GET["amid"]))) {
        物料列表.forEach((当前元素, 当前元素下标) => {
            if (当前元素.id === Number($_GET["amid"])) {
                $("#advertising-materials").val(当前元素.name)
                当前选中物料下标 = 当前元素下标
                $("#current-event span").html(物料列表[当前选中物料下标].name)
                $("#current-event span").css("color", "green")
                $("#current-event-link span").html("<a href=\"./short-link.html?amid=" + 物料列表[当前选中物料下标].id + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + 物料列表[当前选中物料下标].name + "</a>")
                $("#current-event-link span").css("color", "green")
            }
        })
    }

    $("button").click(() => {
        if (当前选中宣传人下标 === -1) {
            alert("请您先选择宣传人")
            return
        }
        if (当前选中物料下标 === -1) {
            alert("请您先选择物料")
            return
        }

        let 小程序跨平台宣传链接 = "https://statics.jilinoffcn.com/pages/wechat-mini-program/handler.html?mp-username="

        switch (物料列表[当前选中物料下标].link.split(",")[0]) {
            case "wxf3103d96fec4f9b5":
                小程序跨平台宣传链接 += "gh_d52ad864c617"; // 齐趣堂
                break;
            case "wxc431ae4dffa2a8a3":
                小程序跨平台宣传链接 += "gh_a9b532feb4cb"; // OFFCN考试助手
                break;
            case "wx5e256375813b119f":
                小程序跨平台宣传链接 += "gh_146c7fa5a832"; // 中公考试助手
                break;
            default:
                alert("物料配置不正确")
                return
        }
        小程序跨平台宣传链接 += "&appid=" + 物料列表[当前选中物料下标].link.split(",")[0]
        小程序跨平台宣传链接 += "&page=" + 物料列表[当前选中物料下标].link.split(",")[1]
        小程序跨平台宣传链接 += "&scode=" + 花名册[当前选中宣传人下标].Suffix

        $(".link span").html(小程序跨平台宣传链接)
        $(".poster").show()
    })

    $(".poster-template-link").click(()=> {
        $(".poster-template-link").hide()
        $(".loading").show();
        $.ajax({
            type: "GET",
            url: ChaosEnvironmentVariables.Apis.TKE+"/events/advertising-materials/wechat/official-account/long2short?amid="+物料列表[当前选中物料下标].id+"&suffix="+花名册[当前选中宣传人下标].Suffix,
            complete: (响应) => {
                $(".loading").hide();
                if (响应.responseJSON.Code !== 0) {
                    alert(响应.responseJSON.Error)
                } else {
                    $(".short-link span").html(响应.responseJSON.ShortUrl)
                    $(".short-link").show()
                }
            }
        })

    })

    $(".loading").fadeOut(1000);
    $(".content").fadeIn(1000);
})