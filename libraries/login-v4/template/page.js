const ChaosTemplate =
`
<div class="chaos-line">
    <label for="chaos-phone" class="chaos-phone-label">手机号</label>
    <input type="text" id="chaos-phone" autoComplete="off">
</div>
<div class="chaos-line">
    <div class="chaos-tips"></div>
</div>
<div class="chaos-line chaos-code-line" style="display:none;">
    <label for="chaos-code" class="chaos-code-label">验证码</label>
    <input type="text" id="chaos-code" autoComplete="off">
    <button id="chaos-get-code">获取验证码</button>
</div>
<div class="chaos-line">
    <button id="chaos-submit">提 交</button>
</div>
<div class="chaos-line">
    <div class="chaos-ascription">归属分部</div>
</div>
`;

ChaosFunctions.Logger({Type: 'warn', Info : '登陆模块 ( 手机号登陆模板 [ 页面版 ]  ) 中定义了全局变量 [ ChaosTemplate ( 登陆模块 HTML 模板 ) ] ，请注意不要覆盖！'});
