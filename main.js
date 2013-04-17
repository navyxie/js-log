var Canvas = require('canvas');
var fs = require('fs');
var os=require('os');  
var mail = require('nodemailer');
var main = {
    index : function(req,res,next){
        var jadeView = 'index';
        var data = {
            title : 'blog 首页'
        };
        res.render(jadeView,data,function(err,html){
            if(err){
                throw err;
            }else{
                res.send(html);
            }
        });
    },
    about : function(req,res,next){
        var jadeView = 'about';
        var data = {
            title : 'blog 关于'
        };
        res.render(jadeView,data,function(err,html){
            if(err){
                throw err;
            }else{
                res.send(html);
            }
        });
    },
    makePng:function(req,res,next){
//        var sourceImg = 'http://hexun.com/homephoto3/20100225/6341782/bk09-26-58.png';
//        var img = new Canvas.Image;
//        img.src = sourceImg;
//        img.onload = function(){
//            res.send('<img src = "'+img.src+'" />');
//        }
        var canvas = new Canvas(200,200);
        var ctx = canvas.getContext('2d');

        ctx.font = '30px Impact';
        ctx.rotate(.1);
        ctx.fillText("Awesome!", 50, 100);

        var te = ctx.measureText('Chaobaida');
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.beginPath();
        ctx.lineTo(50, 102);
        ctx.lineTo(50 + te.width, 102);
        ctx.stroke();
        res.send('<img src="' + canvas.toDataURL() + '" />');
        //res.send('<img src="http://hexun.com/homephoto3/20100225/6341782/bk09-26-58.png" />');
    },
    test:function(req,res,next){
        var data = [
            {picSrc:'http://www.chaobaida.com/files/common/18464979102_1360985632058.png'},
            {picSrc:'http://img01.taobaocdn.com/bao/uploaded/i1/15279018839544810/T169UgXodgXXXXXXXX_!!0-item_pic.jpg_310x310.jpg'},
            {picSrc:'http://www.chaobaida.com/files/common/17592559515%20_1361014294428.png'},
            {picSrc:'http://www.chaobaida.com/files/common/17317351891_1360995537915.png'},
            {picSrc:'http://img02.taobaocdn.com/bao/uploaded/i2/T1nm.yXlBXXXbArhg3_050226.jpg_310x310.jpg'},
            {picSrc:'http://www.chaobaida.com/files/common/16406334246_1360995841587.png'}
        ]
        res.render('test', { title: 'autoLoadPage',data:data});
    },
    page:function(req,res,next){
        var data = [
            {picSrc:'http://img02.taobaocdn.com/bao/uploaded/i2/T1YnbIXoxeXXXyEJ6X_114650.jpg_310x310.jpg'},
            {picSrc:'http://img04.taobaocdn.com/bao/uploaded/i4/17977030390116374/T1vmIRXk0cXXXXXXXX_!!0-item_pic.jpg_310x310.jpg'},
            {picSrc:'http://img01.taobaocdn.com/bao/uploaded/i1/17839019457020916/T1q3kmXXlgXXXXXXXX_!!0-item_pic.jpg_310x310.jpg'},
            {picSrc:'http://img02.taobaocdn.com/bao/uploaded/i2/T1vPGAXfFGXXbXi5o0_035547.jpg_310x310.jpg'}
        ]
        res.send(data)
    },
    log:function(req,res,next){
        var query = req.query;
        query.os = os.platform();
        query.ip = req.connection.remoteAddress;
        query.userAgent = req.headers['user-agent'];
        console.log(query);
        main.sendEmail(JSON.stringify(query),function(){
            console.log('email has send!');
        });   
        res.send(query);    
    },
    sendEmail:function(content,cbf){
        var mailServer = mail.createTransport("SMTP", {
            service: "Gmail",
            auth: {
              user: "hxie@kalengo.com",
              pass: "951178609.com"
            }
        })
        var options = {
            from: 'hxie@kalengo.com',
            to: "hxie@kalengo.com",
            subject: "【系统邮件】系统检测到前端页面出问题了",
            html: content
        }
        mailServer.sendMail(options,cbf)
    }
};
module.exports = main;
