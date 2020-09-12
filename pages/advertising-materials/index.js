$(() => {
    // 获取基础信息 花名册
    let 花名册
    $.ajax({
        type: "GET",
        url: ChaosEnvironmentVariables.Apis.TSF+"/sso/v2/suffix/list/available",
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
                $("#current-suffix span").css("color", "green")
                $("#current-orgnazition span").html(花名册[当前选中宣传人下标].CRMOName)
                $("#current-orgnazition span").css("color", "green")
                $("#current-name span").html(花名册[当前选中宣传人下标].Name)
                $("#current-name span").css("color", "green")
            }
        })
    })

    // 获取基础信息 物料列表
    let 物料列表
    $.ajax({
        type: "GET",
        url: ChaosEnvironmentVariables.Apis.TKE+"/events/advertising-materials/list",
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
                $("#current-event-link span").html("<a href=\"./index.html?amid="+物料列表[当前选中物料下标].id+"\" target=\"_blank\" rel=\"noopener noreferrer\">"+物料列表[当前选中物料下标].name+"</a>")
                $("#current-event-link span").css("color", "green")
            }
        })
    })

    // 判断是否设定 物料 ID
    if ( typeof $_GET["amid"] !== "undefined" && !isNaN(Number($_GET["amid"])) ) {
        物料列表.forEach((当前元素, 当前元素下标) => {
            if (当前元素.id === Number($_GET["amid"])) {
                $("#advertising-materials").val(当前元素.name)
                当前选中物料下标 = 当前元素下标
                $("#current-event span").html(物料列表[当前选中物料下标].name)
                $("#current-event span").css("color", "green")
                $("#current-event-link span").html("<a href=\"./index.html?amid="+物料列表[当前选中物料下标].id+"\" target=\"_blank\" rel=\"noopener noreferrer\">"+物料列表[当前选中物料下标].name+"</a>")
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
        $("button").hide()
        $(".loading").show();
        $.ajax({
            type: "GET",
            url: ChaosEnvironmentVariables.Apis.TKE+"/events/advertising-materials/poster/amid/"+物料列表[当前选中物料下标].id+"/suffix/"+花名册[当前选中宣传人下标].Suffix,
            async: false, // 设置为同步模式
            complete: (响应) => {
                $(".loading").hide();
                if (响应.responseJSON.Code === -1) {
                    alert(响应.responseJSON.Error)
                } else {
                    $(".poster-img").attr("src",响应.responseJSON.Poster)
                    $(".poster-link").attr("href",响应.responseJSON.Poster)
                    $(".poster-link").attr("download",物料列表[当前选中物料下标].name+"-"+花名册[当前选中宣传人下标].Suffix+".jpg")
                    $(".poster-link-path span").html(响应.responseJSON.Poster)
                    $(".poster-template-link").attr("href",响应.responseJSON.PosterTemplate)
                    $(".poster-template-link").attr("download",物料列表[当前选中物料下标].name+"-模板.jpg")
                    $(".poster").show()
                }
            }
        })
    })

    $(".loading").fadeOut(1000);
    $(".content").fadeIn(1000);
    $("body").css("background", "skyblue");
})