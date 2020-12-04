document.getElementsByTagName("chaos-v5")[0].innerHTML += `
<loading class="loading-container">
	<div class="loading"><span></span>&nbsp;<span></span>&nbsp;<span></span>&nbsp;<span></span>&nbsp;<span></span><div class="loading-tips">加载中...</div></div>
</loading>
`

var 加载定时器=setInterval(function(){if(Chaos.Infos.Completed){clearInterval(加载定时器);document.getElementsByTagName("loading")[0].style.display="none"}},100);