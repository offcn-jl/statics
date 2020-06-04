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

// 发生滚动后显示悬浮
window.onscroll = function () {
  // 为了保证兼容性，这里取两个值，哪个有值取哪一个
  // scrollTop就是触发滚轮事件时滚轮的高度
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  console.log("滚动距离" + scrollTop);
  // 判断是否大于屏幕高度的四分之一
  if (scrollTop > document.documentElement.clientHeight / 4 && (document.body.clientHeight - document.documentElement.scrollTop - document.documentElement.clientHeight) > 300) {
    // 显示悬浮
    document.getElementsByClassName("chaos-folat")[0].classList.remove("chaos-fade-out")
    document.getElementsByClassName("chaos-folat")[0].classList.add("chaos-fade-in")
  } else {
    // 隐藏悬浮
    document.getElementsByClassName("chaos-folat")[0].classList.remove("chaos-fade-in")
    document.getElementsByClassName("chaos-folat")[0].classList.add("chaos-fade-out")
  }
};
