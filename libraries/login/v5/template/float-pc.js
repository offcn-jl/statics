// 页面模板
document.getElementsByTagName("chaos-v5")[0].innerHTML += 
`
<div class="chaos-folat">
    <a class="chaos-folat-close" href="javascript:void(0);" onclick="Chaos.Functions.HideByClass('chaos-folat')">
    </a>
    <ul>
        <li class="li1">
            <a href="javascript:void(0);" onclick="openZhiChi()">在线咨询</a>
        </li>
        <li class="li2">
            <a href="http://jl.offcn.com/zg/kfqrcode/v2/" target="_blank">微信咨询</a>
        </li>
        <li class="li3">
            <a href="http://jl.offcn.com/zg/ksrl/ksrlz/" target="_blank">招聘公告</a>
        </li>
        <li class="li4">
            <a href="http://jl.offcn.com/zg/xmtpt/" target="_blank">中公官媒</a>
        </li>
        <li class="li5">
            <a href="http://jl.offcn.com/zg/gzkswbl/" target="_blank">关注中公</a>
        </li>
    </ul>
    <div class="chaos-popup">
        <img class="chaos-popup-close chaos-popup-close-top" src="https://statics.jilinoffcn.com/images/login-module/close.png" onclick="chaosPopupClose()" />
        <img class="chaos-popup-img" src="https://statics.jilinoffcn.com/images/login-module/pc-popup-20210520.png" onclick="openZhiChi()" />
        <div class="chaos-popup-input">您可以直接在此处输入您的问题</div>
        <div class="chaos-popup-close chaos-popup-do-not-show" onclick="chaosPopupDoNotShow()">30天内不再显示</div>
    </div>
</div>
`;

// 处理函数

// 打开智齿
function openZhiChi() {
  zc('config', {
    custom: true,
    reload: true,
    groupid: Chaos.Infos.NTalkerGID,
    refresh: true, // 是否每次展开聊天组件都刷新 默认false
  });
  zc('frame_status', function(data) {
    if (data.code === '000002') {
      zc('frame_manual', function(res) {
        if (res.code === '000000') {
          zc('frame_status');
        }
      })
    } else if (data === 'expand') {
        zc('frame_status');
    }
  });
  Chaos.Functions.HideByClass("chaos-popup");
}

// 关闭弹窗
function chaosPopupClose() {
  document.getElementsByClassName("chaos-popup")[0].style.left = "100%";
  document.getElementsByClassName("chaos-popup")[0].style.marginLeft = "0";
  document.getElementsByClassName("chaos-popup")[0].style.height = "0";
  // 清空弹窗文字输入提示, 避免影响关闭弹窗动画效果
  document.getElementsByClassName("chaos-popup-input")[0].innerHTML = ""
  // 关闭弹窗文字输入提示动画
  clearInterval(chaosPopupInputInterval);
}

// 20s 后显示弹窗
setTimeout(function () {
  if (Chaos.Functions.Cookies.Get("chaos-v5-popup") !== "disable") {
    document.getElementsByClassName("chaos-popup")[0].style.left = "50%";
    document.getElementsByClassName("chaos-popup")[0].style.marginLeft = "-166.5px";
    document.getElementsByClassName("chaos-popup")[0].style.height = "402px";
    Chaos.Functions.Logger({ Type: "info", Info: "用户未禁用弹窗, 弹出咨询引流弹窗."});
  } else {
    Chaos.Functions.Logger({ Type: "info", Info: "用户已禁用引流弹窗." });
  }
  setTimeout(function () {
    document.getElementsByClassName("chaos-popup-input")[0].style.display = "block"
  }, 2 * 1000);
}, 20 * 1000);

// 弹窗文字输入动画
var chaosPopupInputInterval = setInterval(function () {
  // 如果有 6 个 '.' 则清空全部 '.'
  if ( document.getElementsByClassName("chaos-popup-input")[0].innerHTML === "您可以直接在此处输入您的问题......" ) {
    document.getElementsByClassName("chaos-popup-input")[0].innerHTML = "您可以直接在此处输入您的问题"
  }
  // 增加 1 个 '.'
  document.getElementsByClassName("chaos-popup-input")[0].innerHTML += "."
}, 1000);

// 30天内不再提示
function chaosPopupDoNotShow() {
  Chaos.Functions.Cookies.Set(
    "chaos-v5-popup",
    "disable",
    30 * 24 * 60 * 60 * 1000
  );
  chaosPopupClose();
}

// 跑马灯效果
(function(){
  var chaosFloatRun = true;
  var chaosFloatNow = 0;
  function nextMove() {
    setTimeout(function(){
      if (chaosFloatRun) {
        for (var i = 0; i < document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li").length; i++){
          if ( i !== chaosFloatNow ) {
            // 移除效果
            document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li")[i].getElementsByTagName("a")[0].classList.remove("hover");
          } else {
            // 添加效果
            document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li")[i].getElementsByTagName("a")[0].classList.add("hover");
          }
        }
        // 归零
        if (++chaosFloatNow > document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li").length) {
          chaosFloatNow = 0;
        }
      }
      // 递归
      nextMove()
    },1000);
  }
  // 触发跑马灯
  nextMove()
  // 鼠标经过时暂停跑马灯
  setTimeout(function(){
    // 添加鼠标经过事件
    for (var i = 0; i < document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li").length; i++){
      document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li")[i].onmouseover=function(){
        // 暂停跑马灯
        chaosFloatRun = false;
        // 熄灭已经点亮的元素
        for (var i = 0; i < document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li").length; i++){
          // 移除效果
          document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li")[i].getElementsByTagName("a")[0].classList.remove("hover");
        }
        // 记录当前位置
        chaosFloatNow = this.classList[0].slice(2) - 1;
      };
    }
    // 添加鼠标离开事件
    for (var i = 0; i < document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li").length; i++){
      document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li")[i].onmouseleave=function(){
        // 开启跑马灯
        chaosFloatRun = true;
        // 保持当前元素点亮
        document.getElementsByClassName("chaos-folat")[0].getElementsByTagName("li")[chaosFloatNow].getElementsByTagName("a")[0].classList.add("hover");
      };
    }
  },500)
}());