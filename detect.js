window.DETECT = {
    ajaxUrl : '',
    debug:window.location.search('debug') ? true : false,
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
        img.src = DETECT.ajaxUrl+'?'+msg;
    },
    log:function(info){
        DETECT.beacon(DETECT.toQueryString(info));
    },
    runMethod:function(method){
        try{
            method();
        }catch(ex){
            if(DETECT.debug){
                throw ex;
            }else{
                DETECT.log({msg:ex.message,type:'try-catch'});
            }
        }
    }
};
window.onerror = function(msg,url,line){
    if(DETECT.debug){
        return false;
    }else{
        msg = msg || 'window onerror';
        url = url || 'undefined';
        line = line || 'undefined';
        DETECT.log({msg:msg,url:url,line:line,type:'window-onerror'});
        return true;
    }
};