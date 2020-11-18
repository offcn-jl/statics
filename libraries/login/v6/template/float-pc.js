// 页面模板
document.getElementsByTagName("offcn-sso")[0].innerHTML +=`
<div class="offcn-sso-folat">
    <a class="offcn-sso-folat-close" href="javascript:void(0);" onclick="哈士齐单点登陆模块.公共函数.隐藏元素('offcn-sso-folat')">
    </a>
    <ul>
        <li class="li1">
            <a href="javascript:void(0);" onclick="打开小能()">在线咨询</a>
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
    <div class="offcn-sso-popup">
        <img class="offcn-sso-popup-close offcn-sso-popup-close-top" src="https://statics.jilinoffcn.com/images/login-module/close.png" onclick="关闭单点登陆弹窗()" />
        <img class="offcn-sso-popup-img" src="https://statics.jilinoffcn.com/images/login-module/pc-popup-20200705.png" onclick="打开小能()" />
        <div class="offcn-sso-popup-input">您可以直接在此处输入您的问题</div>
        <div class="offcn-sso-popup-close offcn-sso-popup-do-not-show" onclick="不再显示弹窗()">30天内不再显示</div>
    </div>
</div>`;

// 处理函数

// 打开小能
function 打开小能() {
  NTKF.im_openInPageChat(哈士齐单点登陆模块.公共信息.小能咨询组);
  哈士齐单点登陆模块.公共函数.隐藏元素("offcn-sso-popup");
}

// 关闭弹窗
function 关闭单点登陆弹窗() {
  document.getElementsByClassName("offcn-sso-popup")[0].style.left = "100%";
  document.getElementsByClassName("offcn-sso-popup")[0].style.marginLeft = "0";
  document.getElementsByClassName("offcn-sso-popup")[0].style.height = "0";
  // 清空弹窗文字输入提示, 避免影响关闭弹窗动画效果
  document.getElementsByClassName("offcn-sso-popup-input")[0].innerHTML = ""
  // 关闭弹窗文字输入提示动画
  clearInterval(弹窗文字输入动画);
}

// 20s 后显示弹窗
setTimeout(function () {
  if (哈士齐单点登陆模块.公共函数.Cookies.获取("offcn-sso-popup") !== "disable") {
    document.getElementsByClassName("offcn-sso-popup")[0].style.left = "50%";
    document.getElementsByClassName("offcn-sso-popup")[0].style.marginLeft = "-166.5px";
    document.getElementsByClassName("offcn-sso-popup")[0].style.height = "402px";
    哈士齐单点登陆模块.公共函数.打印日志({ 类型: "info", 内容: "用户未禁用弹窗, 弹出咨询引流弹窗." });
  } else {
    哈士齐单点登陆模块.公共函数.打印日志({ 类型: "info", 内容: "用户已禁用引流弹窗." });
  }
  setTimeout(function () {
    document.getElementsByClassName("offcn-sso-popup-input")[0].style.display = "block"
  }, 2 * 1000);
}, 20 * 1000);

// 弹窗文字输入动画
var 弹窗文字输入动画 = setInterval(function () {
  // 如果有 6 个 '.' 则清空全部 '.'
  if (document.getElementsByClassName("offcn-sso-popup-input")[0].innerHTML === "您可以直接在此处输入您的问题......") {
    document.getElementsByClassName("offcn-sso-popup-input")[0].innerHTML = "您可以直接在此处输入您的问题"
  }
  // 增加 1 个 '.'
  document.getElementsByClassName("offcn-sso-popup-input")[0].innerHTML += "."
}, 1000);

// 30天内不再提示
function 不再显示弹窗() {
  哈士齐单点登陆模块.公共函数.Cookies.设置("offcn-sso-popup", "disable", 30 * 24 * 60 * 60 * 1000);
  关闭单点登陆弹窗();
}

// 跑马灯效果
(function () {
  var 开启跑马灯 = true;
  var 当前点亮元素下标 = 0;
  function 点亮下一个元素() {
    setTimeout(function () {
      if (开启跑马灯) {
        for (var i = 0; i < document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li").length; i++) {
          if (i !== 当前点亮元素下标) {
            // 移除效果
            document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li")[i].classList.remove("hover");
          } else {
            // 添加效果
            document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li")[i].classList.add("hover");
          }
        }
        // 归零
        if (++当前点亮元素下标 > document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li").length) {
          当前点亮元素下标 = 0;
        }
      }
      // 递归
      点亮下一个元素()
    }, 1000);
  }
  // 触发跑马灯
  点亮下一个元素()
  // 鼠标经过时暂停跑马灯
  setTimeout(function () {
    // 添加鼠标经过事件
    for (var i = 0; i < document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li").length; i++) {
      document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li")[i].onmouseover = function () {
        // 暂停跑马灯
        开启跑马灯 = false;
        // 熄灭已经点亮的元素
        for (var i = 0; i < document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li").length; i++) {
          // 移除效果
          document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li")[i].classList.remove("hover");
        }
        // 记录当前位置
        当前点亮元素下标 = this.classList[0].slice(2) - 1;
      };
    }
    // 添加鼠标离开事件
    for (var i = 0; i < document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li").length; i++) {
      document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li")[i].onmouseleave = function () {
        // 开启跑马灯
        开启跑马灯 = true;
        // 保持当前元素点亮
        document.getElementsByClassName("offcn-sso-folat")[0].getElementsByTagName("li")[当前点亮元素下标].classList.add("hover");
      };
    }
  }, 500)
}());