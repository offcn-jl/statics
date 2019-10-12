const ChaosTemplate =
`
<div class="hsq-login">
    <div class="hl-cover"></div>
    <div class="hl-popup hl-phone">
        <div class="hl-close"></div>
        <div class="hlp-top">
            <span id="hlp_sign_in" class="hlpt-current">登录</span>
            <span id="hlp_sign_up" class="">注册</span>
        </div>
        <div class="hlp-middle">
            <div class="hlpm sign-in">
                <input type="text" name="Phone" id="loginPhone" placeholder="手机号码" AUTOCOMPLETE="off">
                <input type="button" value="登 录" id="sign-in" class="submintBtn">
            </div>
            <div class="hlpm sign-up" style="display: none;">
                <form>
                    <input type="text" id="phone" placeholder="手机号码" required="" AUTOCOMPLETE="off">
                    <div class="hlpm-yzm"><input type="text" id="code" placeholder="验证码" required="" AUTOCOMPLETE="off">
                        <div id="sendcode">获取</div>
                        <div id="countdown" style="display:none;">120s后重新获取</div>
                    </div>
                    <input type="button" id="sign-up" value="免费注册" class="submintBtn">
                    <input type="text" id="location" value="" readonly style="text-align: center;border: 0px;margin-bottom: -20px;">
                </form>
            </div>
        </div>
        <div class="hlp-bottom">
            <h3></h3>
            关注中公教育，获取新鲜考试资讯与备考服务<br>免费咨询答疑，中公承诺5分钟内给出满意答复
            <br><br>
            <a href="#" target="_blank" rel="nofollow" class="ad-button">点击关注</a>
        </div>
    </div>
</div>
`;

console.warn('Chaos > 登陆模块 ( 手机号登陆模板 ) 中定义了全局变量 [ ChaosTemplate ( 登陆模块 HTML 模板 ) ] ，请注意不要覆盖！')
