var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
window.DETECTTime = window.DETECTTime || {};
window.TIME_LINE = window.TIME_LINE || {};
//get currentscript
function getCurrentScript(e) {
    var DOC = document;
    //取得正在解析的script节点
    if(DOC.currentScript) { //firefox 4+
        return DOC.currentScript.src;
    }
    // 参考 https://github.com/samyk/jiagra/blob/master/jiagra.js
    var stack = e.stack;
    if(!stack && window.opera){
        //opera 9没有e.stack,但有e.Backtrace,但不能直接取得,需要对e对象转字符串进行抽取
        stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
    }
    if(stack) {
        /**e.stack最后一行在所有支持的浏览器大致如下:
        *chrome23:
        * at http://113.93.50.63/data.js:4:1
        *firefox17:
        *@http://113.93.50.63/query.js:4
        *opera12:
        *@http://113.93.50.63/data.js:4
        *IE10:
        *  at Global code (http://113.93.50.63/data.js:4:1)
        */
        stack = stack.split( /[@ ]/g).pop();//取得最后一行,最后一个空格或@之后的部分
        stack = stack[0] == "(" ? stack.slice(1,-1) : stack;
        return stack;
        //return stack.replace(/(:\d+)?:\d+$/i, "");//去掉行号与或许存在的出错字符起始位置
    }
    var nodes = DOC.getElementsByTagName("script"); //只在head标签中寻找
    for(var i = 0, node; node = nodes[i++];) {
        if(node.readyState === "interactive") {
            return node.src;
        }
    }
}
//detect browser
var uaMatch = function( ua ) {
    ua = ua.toLowerCase();
    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
        /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
        /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
        [];

    return {
        browser: match[ 1 ] || "",
        version: match[ 2 ] || "0"
    };
};
var getOs = function(){
    return (navigator.platform || "");
};
console.log(uaMatch(navigator.userAgent));
console.log(getOs());
// is debug modle
function isDebug(){
    var search = window.location.search;
    var debug = false;
    if(search){
        search = search.substr(1);
        search = search.split('&');
        for(var i = 0 , len = search.length ; i < len ; i++){
            var tempArr = search[i].split('=');
            if(tempArr[0] === 'debug' && tempArr[1] == 1){
                debug = true;
                break;
            }
        }
    } 
    return debug
}
window.DETECT = {
    ajaxUrl : '/qz/shb/detect',
    debug:isDebug(),
    toQueryString:function(o){
        var res = [],p,encode = encodeURIComponent;
        for(p in o){
            if(o.hasOwnProperty(p)){
                res.push(encode(p)+'='+encode(o[p]));
            }
        }
        return res;
    },
    beacon:function(msg){
        var img = new Image();
        img.src = DETECT.ajaxUrl+'?'+msg.join('&');
    },
    log:function(info){
        info.screen = screenWidth+'x'+screenHeight;
        info.href = window.location.href;
        DETECT.beacon(DETECT.toQueryString(info));
    },
    runMethod:function(method){
        try{
            method();
        }catch(ex){
            if(DETECT.debug){
                throw ex;
            }else{
                var info = {
                    msg:ex.message,
                    type:'try-catch',
                    screen:screenWidth+'x'+screenHeight,
                    detailMsg:getCurrentScript(ex)
                };
                DETECT.log(info);
            }
        }
    },
    timeLog:function(limitSec){
        var loadTime = window.TIME_LINE.getLogs();
        var htmlTime = loadTime['htmlLoad'] || 0;
        if(DETECT.debug || (htmlTime < limitSec*1000)){
            return this;
        }else{
            var info = {
                type:'timeOut',
                htmlTime:htmlTime
            };
            DETECT.log(info);
        }
    }
};
window.DETECT.timeLog(10);
window.onerror = function(msg,url,line){
    if(DETECT.debug){
        return false;
    }else{
        var errInfo = {
            msg : msg || 'window onerror',
            url : url || 'undefined',
            line : line || 'undefined',
            type:'window-onerror'
        };
        DETECT.log(errInfo);
        return true;
    }
};
function getClientIp(req) {  
    var ipAddress;  
    var forwardedIpsStr = req.header('x-forwarded-for');   
    if (forwardedIpsStr) {  
        var forwardedIps = forwardedIpsStr.split(',');  
        ipAddress = forwardedIps[0];  
    }  
    if (!ipAddress) {  
        ipAddress = req.connection.remoteAddress;  
    }  
    return ipAddress;  
}  