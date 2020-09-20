// 页面模板
document.getElementsByTagName("chaos-v5")[0].innerHTML += `
<div class="chaos-folat chaos-fade-out">
	<p>
		<a rel="nofollow" href="http://jl.offcn.com/zg/ksrl/ksrlz/">
      招聘公告
		</a>
		<a class="chaos-float-right" rel="nofollow" href="http://jl.offcn.com/zg/gzkswbl/">
			“微”部落
		</a>
	</p>
	<a class="chaos-float-middle" onclick="NTKF.im_openInPageChat(Chaos.Infos.NTalkerGID)"><span>在线咨询</span></a>
</div>
`;

// 处理函数

// chaosFloatSwitchTimeout 用于记录切换 float 的 display 状态的定时器, 在设定新定时器前, 清除旧的定时器, 避免发生状态漂移 ( 在 if 条件的临界位置, 100ms 的定时器进行操作后, 1600ms 的定时器又进行了反向操作, 造成状态漂移 ) 
var chaosFloatSwitchTimeout
// 发生滚动后显示悬浮
// 20200920 增加 dispaly none 样式, 避免出现隐藏悬浮时, 虽然悬浮框的透明度为 0 但是元素仍然可以点击, 造成误触的清空
window.onscroll = function () {
  // 为了保证兼容性，这里取两个值，哪个有值取哪一个
  // scrollTop就是触发滚轮事件时滚轮的高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  // 判断是否大于屏幕高度的四分之一
  if (scrollTop > document.documentElement.clientHeight / 5 && (document.body.clientHeight - document.documentElement.scrollTop - document.documentElement.clientHeight) > 150) {
    // 显示悬浮
    // 增加 display block 样式, 使元素可以正常显示
    document.getElementsByClassName("chaos-folat")[0].style.display = "block"
    clearTimeout(chaosFloatSwitchTimeout)
    chaosFloatSwitchTimeout = setTimeout(function () {
      // 短暂延时后, 反转切换动画的 class , 避免 display 样式影响切换动画的效果
      document.getElementsByClassName("chaos-folat")[0].classList.remove("chaos-fade-out")
      document.getElementsByClassName("chaos-folat")[0].classList.add("chaos-fade-in")
    }, 100)
  } else {
    // 隐藏悬浮
    // 反转切换动画的样式
    document.getElementsByClassName("chaos-folat")[0].classList.remove("chaos-fade-in")
    document.getElementsByClassName("chaos-folat")[0].classList.add("chaos-fade-out")
    // 增加 display none 样式, 使元素彻底消失, 此处在动画效果结束后, 再增加短暂的延时, 避免 display 样式影响切换动画的效果
    clearTimeout(chaosFloatSwitchTimeout)
    chaosFloatSwitchTimeout = setTimeout(function () {
      document.getElementsByClassName("chaos-folat")[0].style.display = "none"
    }, 1500 + 100)
  }
};

// 适配屏幕大小函数
function chaosFloatResize() {
  var size = document.documentElement.clientWidth / 7.5
  document.getElementsByClassName("chaos-folat")[0].style.fontSize = size * 0.4 + 'px'
}

// 执行适配屏幕大小操作
chaosFloatResize()

// 在窗口大小发生改变时重新适配屏幕大小
window.addEventListener("resize", chaosFloatResize)
