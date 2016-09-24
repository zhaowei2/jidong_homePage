/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems==null?null:elems.length==1?elems[0]:elems;
}
/*广告图片数组*/
var imgs=[
    {"i":0,"img":"images/index/banner_01.jpg"},
    {"i":1,"img":"images/index/banner_02.jpg"},
    {"i":2,"img":"images/index/banner_03.jpg"},
    {"i":3,"img":"images/index/banner_04.jpg"},
    {"i":4,"img":"images/index/banner_05.jpg"},
];
/*广告对象*/
var adv={
    LIWIDTH:670,//每个li的宽度
    LIHEIGHT:240,//每个li的高度
    DURATION:500,//动画总时长
    INTERVAL:25,//动画时间间隔
    WAIT:3000,//自动轮播等待时间
    timer:null, //定时器序号
    canAuto:true,//是否可以自动轮播
    init:function() {//初始化广告对象，为ul绑定事件处理函数
        var self=this;
        //设置ulImgs的宽度
        //$("#imgs").style.width=self.LIWIDTH*imgs.length+"px";
        /*生成序号ul中的每个li*/
        for (var i=0,idxs=[];i<imgs.length;idxs[i]=i++ +1);
        $("#indexs").innerHTML = '<li class="hover">'
                    + idxs.join("</li><li>")+ '</li>';
        self.updateView();//更新界面

        //当鼠标进入序号ul时，启动手动滚动动画
        $("#indexs").onmouseover=function() {
            var e = window.event || arguments[0];
            var target = e.srcElement || e.target;
            if (target.nodeName == "LI"
                && target.innerHTML != imgs[0].i + 1) {
                $("#indexs>.hover").className = "";
                this.className = "hover";
                self.move(target.innerHTML - 1 - imgs[0].i);
            }
        }
        //只要slider中只要发生进入事件，就禁止自动轮播
        $("#slider").onmouseover=function(){
            self.canAuto=false;
        }
        //只要slider最后一次发生的是移出事件，就允许自动轮播
        $("#slider").onmouseout=function(){
            self.canAuto=true;
        }
        //启动自动轮播
        self.automove();
    },
    //根据imgs数组更新广告ul界面，同时设置序号ul中li的hover
    updateView:function() {
        for(var i= 0,lis=[];i<imgs.length;i++){
            lis[i]='<li data-i="'+imgs[i].i+'">'
                     +'<img src="'+imgs[i].img+'"/></li>';
        }
        $("#imgs").innerHTML=lis.join("");
        //每次更新时找到上次hover的li，去掉hover
        $("#indexs>.hover").className="";
        //为imgs中第一个元素的i属性对应的li设置hover
        $("#indexs>li")[imgs[0].i].className="hover";
    },
    //移动任意个li的方法
    move:function(n) { var self=this;
        clearTimeout(self.timer);//任何移动前，先停止其它动画
        self.timer=null;
        if(n<0){//右移，先设置数组元素，再播放动画
            var dels=imgs.splice(imgs.length-Math.abs(n),Math.abs(n));
            imgs=dels.concat(imgs);
            self.updateView();
            $("#imgs").style.left=self.LIWIDTH*n+"px";
        }
        self.moveStep(n);//开始移动动画
    },
    automove:function(){var self=this;
        self.timer=setTimeout(function(){
            if(self.canAuto) {//如果允许自动轮播
                self.move(1);//才继续移动
            }else{//否则，空调用automove继续等待，而什么都不做
                self.automove();
            }
        },self.WAIT);
    },
    moveStep:function(n) {//动画的每一步
        var self = this;
        var step = self.LIWIDTH * n * self.INTERVAL / self.DURATION;
        var style = getComputedStyle($("#imgs"));
        var left = parseFloat(style.left) - step;
        $("#imgs").style.left = left + "px";
        if (n > 0 && left > -self.LIWIDTH * n
            || n < 0 && left < 0){//如果还未移动到位，就继续移动
            self.timer=setTimeout(function () {
                self.moveStep(n);
            }, self.INTERVAL);
        }else{//否则
            if(n>0){//如果是左移，要在移动后，将开头元素换到结尾
                var dels=imgs.splice(0,n);
                imgs=imgs.concat(dels);
                self.updateView();
            }
			$("#imgs").style.left="0px";
            self.automove();//只要移动结束，都要启动自动轮播
        }
    }
}
window.addEventListener("load",function() {
    adv.init();
},false);