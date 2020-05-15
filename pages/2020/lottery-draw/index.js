$(function () {
    // 定义程序运行所需的变量
    let 房间代码, 已经获取用户数量 = 0,
        处理错误 = (响应内容) => {
            alert("[" + 响应内容.responseJSON.Code + "] " + 响应内容.responseJSON.Error)
        },
        用户签到监听器 = (剩余未显示用户) => {
            if (剩余未显示用户.length < 1) {
                setTimeout(function () {
                    // # https://www.runoob.com/jquery/ajax-get.html
                    // $.get("https://api.chaos.jilinoffcn.com/release/events/public/2020/lottery-draw/1582963936364/users/" + 已经获取用户数量, function (响应内容, 请求状态) {
                    // $.get("https://api.chaos.jilinoffcn.com/release/events/public/2020/lottery-draw/" + 房间代码 + "/users/" + 已经获取用户数量, function (响应内容, 请求状态) {
                    //     console.log("Status: " + 请求状态 + "\nData:");
                    //     console.log(响应内容);
                    //     if (请求状态 === "success" && 响应内容.Code === 0) {
                    //         // 请求成功
                    //         用户签到监听器(响应内容.Data.data)
                    //         已经获取用户数量 += 响应内容.Data.data.length
                    //     } else {
                    //         // 请求失败
                    //         处理错误(响应内容)
                    //         用户签到监听器([])
                    //     }
                    // });
                    $.ajax({
                        url: "https://api.chaos.jilinoffcn.com/release/events/public/2020/lottery-draw/" + 房间代码 + "/users/" + 已经获取用户数量, complete(响应内容, 请求状态) {
                            console.log("Status: " + 请求状态 + "\nData:");
                            console.log(响应内容);
                            if (请求状态 === "success" && 响应内容.responseJSON.Code === 0) {
                                // 请求成功
                                用户签到监听器(响应内容.responseJSON.Data.data)
                                已经获取用户数量 += 响应内容.responseJSON.Data.data.length
                            } else {
                                // 请求失败
                                处理错误(响应内容)
                                用户签到监听器([])
                            }
                        }
                    });
                }, 2000);
            } else {
                setTimeout(function () {
                    // 填充用户
                    $(".left").prepend(' <div class="item"><img src="https://statics.jilinoffcn.com/images/public/logo.jpg"><span>' + 剩余未显示用户[0] + '</span></div>');
                    // 移除已经填充的用户
                    剩余未显示用户.splice(0, 1);
                    // 递归调用
                    用户签到监听器(剩余未显示用户)
                }, 600);
            }
        },
        逐个显示中奖用户 = (剩余中奖用户) => {
            if (剩余中奖用户.length > 0) {
                setTimeout(function () {
                    // 填充用户
                    $(".items").prepend(' <div class="item"><img src="https://statics.jilinoffcn.com/images/public/logo.jpg"><span>' + 剩余中奖用户[0] + '</span></div>');
                    // 移除已经填充的用户
                    剩余中奖用户.splice(0, 1);
                    // 递归调用
                    逐个显示中奖用户(剩余中奖用户)
                }, 600);
            }
        };

    // 生成房间代码
    $("#room").val((new Date()).valueOf());

    // 登陆
    $("#login").click(function () {
        // 获取房间代码
        房间代码 = $("#room").val();

        // 且换到抽奖页面
        $(".login").hide();
        $(".content").show();

        // 设置页面右上角到房间代码
        $(".room").html(房间代码)

        // 生成小程序码
        $(".qr-code").attr("src", "https://api.chaos.jilinoffcn.com/release/events/public/2020/lottery-draw/" + 房间代码 + "/qr-code");

        // 开始监听用户签到
        用户签到监听器([])
    })

    // 抽奖
    $("#do").click(function () {
        if ($("#num").val() * 1 > 0) {
            if ( $("#do").val() !== "抽 奖" ) {
                alert("正在抽奖中, 请稍候！")
                return
            }
            $("#do").val("抽奖中...");
            let 开奖代码 = (new Date()).valueOf();
            // $.get("https://api.chaos.jilinoffcn.com/release/events/public/2020/lottery-draw/" + 房间代码 + "/lottery/" + 开奖代码 + "/" + $("#num").val() * 1, function (响应内容, 请求状态) {
            //     console.log("Status: " + 请求状态 + "\nData:");
            //     console.log(响应内容);
            //     if (请求状态 === "success" && 响应内容.Code === 0) {
            //         // 请求成功
            //         $(".items").html("");
            //         $(".before").hide();
            //         $(".after").show();
            //         $(".round").html(房间代码 + " - " + 开奖代码);
            //         逐个显示中奖用户(响应内容.Data)
            //     } else {
            //         // 请求失败
            //         处理错误(响应内容)
            //     }
            // });
            $.ajax({
                url: "https://api.chaos.jilinoffcn.com/release/events/public/2020/lottery-draw/" + 房间代码 + "/lottery/" + 开奖代码 + "/" + $("#num").val() * 1, complete(响应内容, 请求状态) {
                    console.log("Status: " + 请求状态 + "\nData:");
                    console.log(响应内容);
                    if (请求状态 === "success" && 响应内容.responseJSON.Code === 0) {
                        // 请求成功
                        $(".items").html("");
                        $(".before").hide();
                        $(".after").show();
                        $(".round").html(房间代码 + " - " + 开奖代码);
                        逐个显示中奖用户(响应内容.responseJSON.Data)
                    } else {
                        // 请求失败
                        处理错误(响应内容)
                    }
                    $("#do").val("抽 奖");
                }
            });
        } else {
            alert("请输入正确的奖品个数！")
        }
    })
});

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return;
    }
}