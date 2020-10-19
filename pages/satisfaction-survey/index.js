window.onresize = auto;
auto()
function auto() {
    var deviceWidth = document.documentElement.clientWidth;
    if (deviceWidth > 750) deviceWidth = 750;
    document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
}

$(() => {
    // 从 URL 中获取 ID
    // 判断是否设定 ID
    if (typeof $_GET["sscid"] !== "undefined" && !isNaN(Number($_GET["sscid"]))) {
        let sscid = Number($_GET["sscid"])
        // 获取配置
        // 需要使用 ajax 方法写, 因为 get 方法无法捕获返回的状态码不是 200 的请求
        $.ajax({
            url: ChaosEnvironmentVariables.Apis.TKE + "/events/internal-tools/satisfaction-survey/info/" + sscid,
            complete: (响应) => {
                if (响应.responseJSON.Code !== 0) {
                    alert(响应.responseJSON.Error)
                    $("body").html(响应.responseJSON.Error)
                } else {
                    // 填充调查配置到页面中
                    $(".class-info").html("[ " + 响应.responseJSON.Result.Project + " ] " + 响应.responseJSON.Result.Name + " ( " + (new Date(响应.responseJSON.Result.Time)).getFullYear() + "年" + ((new Date(响应.responseJSON.Result.Time)).getMonth() + 1 + "").padStart(2, "0") + "月" + ((new Date(响应.responseJSON.Result.Time)).getDate() + "").padStart(2, "0") + "日 " + ((new Date(响应.responseJSON.Result.Time)).getHours() + "").padStart(2, "0") + "时" + ((new Date(响应.responseJSON.Result.Time)).getMinutes() + "").padStart(2, "0") + "分 ) ")
                    // 获取配置完成, 显示表单页面
                    $(".loading").toggle("normal")
                    $(".zgBox").toggle("normal")
                }
            }
        })

        //表单提交
        $("#dosubmit").click(function () {
            $.ajax({
                url: ChaosEnvironmentVariables.Apis.TKE + "/events/internal-tools/satisfaction-survey/survey/" + sscid,
                type: "POST",
                data: JSON.stringify({
                    Teacher: Number($("input:radio[name='teacher']:checked").val()),
                    Course: Number($("input:radio[name='course']:checked").val()),
                    Service: Number($("input:radio[name='service']:checked").val())
                }),
                complete: (响应) => {
                    console.log(响应)
                    if (响应.responseJSON.Code !== 0) {
                        alert(响应.responseJSON.Error)
                    } else {
                        $(".rating").toggle("normal")
                        $(".rated").toggle("normal")
                    }
                }
            })
        });
    } else {
        alert("缺少参数")
        $("body").html("缺少参数")
    }
})
