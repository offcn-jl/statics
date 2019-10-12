const ChaosTemplate =
`
<div class="hsq-login">
    <div class="hl-cover"></div>
    <div class="hl-popup hl-weixin">
        <div class="hl-close"></div>
        <div class="hlw-top">微信登陆</div>
        <div class="hlw-middle"><img class="hlwm-qrcode" src="#" alt="微信扫码登陆"></div>
        <div class="hlw-bottom">
            <div class="hlwb-tips">使用微信扫码并关注公众号即可登陆</div>
        </div>
    </div>
</div>
`;

console.warn('Chaos > 登陆模块 ( 微信登陆模板 ) 中定义了全局变量 [ ChaosTemplate ( 登陆模块 HTML 模板 ) ] ，请注意不要覆盖！')
