哈士齐单点登陆模块.模板.HTML = `
<div class="hsq-login">
    <div class="hl-cover"></div>
    <div class="hl-popup hl-phone">
        <div class="hl-close"></div>
        <div class="hlp-top">
            <span class="hlpt-current">中 公 教 育</span>
        </div>
        <div class="hlp-middle">
           <div class="hlbj">
              <img src="http://jl.offcn.com/zg/ty/images/bd_icon1.png">   
              <input type="text" id="offcn-sso-phone" placeholder="手机号码" autocomplete="off">
            </div>   
            <div class="offcn-sso-tips"></div>
            <div class="hlbj">
                <div class="offcn-sso-code-line">
                    <img src="http://jl.offcn.com/zg/ty/images/bd_icon2.png"> 
                    <input type="text" id="offcn-sso-code" placeholder="验证码" required="" autocomplete="off">
                    <div id="offcn-sso-get-code">获取验证码</div>
                </div>
            </div>    
            <div class="hlpm">
                <input type="button" value="登 陆" id="offcn-sso-submit" class="submintBtn">
            </div>
            <input type="text" id="offcn-sso-location" value="" readonly>
        </div>
        <div class="hlp-bottom"></div>
    </div>
</div>`;
