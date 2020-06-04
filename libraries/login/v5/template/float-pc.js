// 页面模板
document.getElementsByTagName("chaos-v5")[0].innerHTML += 
`
<div class="chaos-folat">
    <a class="chaos-folat-close" href="javascript:void(0);" onclick="Chaos.Functions.HideByClass('chaos-folat')">
    </a>
    <img class="chaos-folat-girl" src="http://jl.offcn.com/zg/xiaonengpop/xiaonengPerson.png" onclick="openNtalker()" />
    <ul>
        <li class="li1">
            <a href="javascript:void(0);" onclick="openNtalker()" class="on">在线咨询</a>
        </li>
        <li class="li2">
            <a href="http://jl.offcn.com/zg/kfqrcode/v2/" target="_blank">微信咨询</a>
        </li>
        <li class="li3">
            <a href="http://jl.offcn.com/zg/ksrl/ksrlz/" target="_blank">招聘公告</a>
        </li>
        <li class="li4">
            <a href="http://jl.offcn.com/zg/gzkswbl/" target="_blank">关注中公</a>
        </li>
    </ul>
    <div class="chaos-popup">
        <img class="chaos-popup-img" src="http://jl.offcn.com/zg/xiaonengpop/xiaonengPop.png" onclick="openNtalker()" />
        <div class="chaos-popup-close chaos-popup-close-top" onclick="chaosPopupClose()"></div>
        <div class="chaos-popup-close chaos-popup-close-bottom" onclick="chaosPopupClose()"></div>
        <div class="chaos-popup-close chaos-popup-do-not-show" onclick="chaosPopupDoNotShow()">
            30天内不再提示
        </div>
    </div>
</div>
`;

// 处理函数

// 打开小能
function openNtalker() {
  NTKF.im_openInPageChat(Chaos.Infos.NTalkerGID);
  Chaos.Functions.HideByClass("chaos-popup");
  Chaos.Functions.ShowByClass("chaos-folat-girl");
}

// 关闭弹窗
function chaosPopupClose() {
  document.getElementsByClassName("chaos-popup")[0].style.left = "100%";
  document.getElementsByClassName("chaos-popup")[0].style.marginLeft = "0";
  document.getElementsByClassName("chaos-popup")[0].style.height = "0";
  setTimeout(function () {
    Chaos.Functions.ShowByClass("chaos-folat-girl");
  }, 1900);
}

// 20s 后显示弹窗
setTimeout(function () {
  if (Chaos.Functions.Cookies.Get("chaos-v5-popup") !== "disable") {
    Chaos.Functions.HideByClass("chaos-folat-girl");
    document.getElementsByClassName("chaos-popup")[0].style.left = "50%";
    document.getElementsByClassName("chaos-popup")[0].style.marginLeft = "-245px";
    document.getElementsByClassName("chaos-popup")[0].style.height = "417px";
    Chaos.Functions.Logger({ Type: "info", Info: "用户未禁用弹窗, 弹出咨询引流弹窗."});
  } else {
    Chaos.Functions.Logger({ Type: "info", Info: "用户已禁用引流弹窗." });
  }
}, 20 * 1000);

// 30天内不再提示
function chaosPopupDoNotShow() {
  Chaos.Functions.Cookies.Set(
    "chaos-v5-popup",
    "disable",
    30 * 24 * 60 * 60 * 1000
  );
  chaosPopupClose();
}
