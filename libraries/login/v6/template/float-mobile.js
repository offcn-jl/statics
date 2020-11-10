// 页面模板
document.getElementsByTagName("offcn-sso")[0].innerHTML += `
<div class="offcn-sso-folat offcn-sso-fade-out">
	<p>
		<a rel="nofollow" href="http://jl.offcn.com/zg/ksrl/ksrlz/">招聘公告</a>
		<a class="offcn-sso-float-right" rel="nofollow" href="http://jl.offcn.com/zg/gzkswbl/">“微”部落</a>
	</p>
	<a class="offcn-sso-float-middle" onclick="NTKF.im_openInPageChat(哈士齐单点登陆模块.公共信息.小能咨询组)"><span>在线咨询</span></a>
</div>
`;

// 处理函数

// 用于记录切换 float 的 display 状态的定时器, 在设定新定时器前, 清除旧的定时器, 避免发生状态漂移 ( 在 if 条件的临界位置, 100ms 的定时器进行操作后, 1600ms 的定时器又进行了反向操作, 造成状态漂移 ) 
var 登陆模块浮动窗口定时器

// 发生滚动后显示浮动窗口
// 20200920 增加 dispaly none 样式, 避免出现隐藏浮动窗口时, 虽然浮动窗口框的透明度为 0 但是元素仍然可以点击, 造成误触的清空
window.onscroll = function () {
  // 判断是否大于屏幕高度的四分之一
  if (document.documentElement.scrollTop > document.documentElement.clientHeight / 5 && (document.body.clientHeight - document.documentElement.scrollTop - document.documentElement.clientHeight) > 150) {
    // 显示浮动窗口
    // 增加 display block 样式, 使元素可以正常显示
    document.getElementsByClassName("offcn-sso-folat")[0].style.display = "block"
    clearTimeout(登陆模块浮动窗口定时器)
    登陆模块浮动窗口定时器 = setTimeout(function () {
      // 短暂延时后, 反转切换动画的 class , 避免 display 样式影响切换动画的效果
      document.getElementsByClassName("offcn-sso-folat")[0].classList.remove("offcn-sso-fade-out")
      document.getElementsByClassName("offcn-sso-folat")[0].classList.add("offcn-sso-fade-in")
    }, 100)
  } else {
    // 隐藏浮动窗口
    // 反转切换动画的样式
    document.getElementsByClassName("offcn-sso-folat")[0].classList.remove("offcn-sso-fade-in")
    document.getElementsByClassName("offcn-sso-folat")[0].classList.add("offcn-sso-fade-out")
    // 增加 display none 样式, 使元素彻底消失, 此处在动画效果结束后, 再增加短暂的延时, 避免 display 样式影响切换动画的效果
    clearTimeout(登陆模块浮动窗口定时器)
    登陆模块浮动窗口定时器 = setTimeout(function () {
      document.getElementsByClassName("offcn-sso-folat")[0].style.display = "none"
    }, 1500 + 100)
  }
};

// 适配屏幕大小函数
function 适配屏幕() {
  var size = document.documentElement.clientWidth / 7.5
  document.getElementsByClassName("offcn-sso-folat")[0].style.fontSize = size * 0.4 + 'px'
}

// 执行适配屏幕大小操作
适配屏幕()

// 在窗口大小发生改变时重新适配屏幕大小
window.addEventListener("resize", 适配屏幕)
