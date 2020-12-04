document.getElementsByTagName("chaos-v5")[0].innerHTML += `
<div class="loading-container">
	<div class="loading"><span></span>&nbsp;<span></span>&nbsp;<span></span>&nbsp;<span></span>&nbsp;<span></span><div class="loading-tips">加载中...</div></div>
</div>
`

var 加载定时器=setInterval(function(){if(Chaos.Infos.Completed){clearInterval(加载定时器);document.getElementsByClassName("loading-container")[0].style.display="none"}},100);