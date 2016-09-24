/*封装$*/
window.$=HTMLElement.prototype.$=function(selector){
    var elems=(this==window?document:this)
        .querySelectorAll(selector);
    return elems==null?null:elems.length==1?elems[0]:elems;
}
window.addEventListener("load",function() {
    floor.init();
},false);
/*页面滚动*/
window.onscroll=function(){
    floor.scroll();
}

/*获得任意元素距页面顶部的距离*/
function getElementTop(element){
    //获得当前元素距相对定位的父元素顶部的距离
    var actualTop = element.offsetTop;
    //获得当前元素相对定位的父元素
    var current = element.offsetParent;
    while (current !== null){//逐级循环累加子元素距父元素顶部距离
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

var floor= {//楼层滚动对象
    DURATION:1000,//滚动动画持续时间
    INTERVAL:20, //滚动动画时间间隔
    timer:null, //定时器序号

    fspans:null, //所有楼层楼标span
    curri:-1, //当前所在楼层
    init:function(){var self=this;
        self.fspans=$("div.floor>header>span");
        var lis=$("#elevator li");
        for(var i=0;i<lis.length;i++) {
            lis[i].onclick=function(){
                self.curri=this.dataset.idx;
                //目标高度
                var target=getElementTop(self.fspans[self.curri-1])-100;
                //现在高度
                var top=document.documentElement.scrollTop
                    ||document.body.scrollTop;
                //计算每步高度
                var step=(target-top)*self.INTERVAL/self.DURATION;
                self.startScroll(target,step);
            }
            lis[i].onmouseover=function(){//切换li状态为文字
                this.$("a:first-child").style.display="none";
                this.$(".etitle").style.display="block";
            }
            lis[i].onmouseout=function(){
                self.liState();//检查li的状态
            }
        }
    },
    scroll:function(){var self=this;
        if(self.fspans==null){//预防一加载就处在某个楼层
            self.init();
        }
        //获得页面滚动的距离
        var top=document.documentElement.scrollTop
            ||document.body.scrollTop;
        //检查每个楼层的span，是否该点亮
        for(var i=0;i<self.fspans.length;i++) {
            //获得每个span距页面顶部的距离
            var spanTop = getElementTop(self.fspans[i]);
            //如果span距顶部的距离介于滚动距离和滚动距离+显示区高之间
            // 说明楼层已显示
            if (spanTop < top + window.innerHeight-100
                && spanTop > top) {
                self.fspans[i].className = "hover";
            } else {//否则，说明未显示，或已过顶，就隐藏。
                self.fspans[i].className = "";
            }
        }
        //每次滚动完，都要重新判断电梯的状态和每个li的状态
        self.elevatorState();
        self.liState();
    },
    //根据每个楼层span是否点亮，检查电梯上所有li的状态
    liState:function(){ var self=this;
        for(var i=0;i<self.fspans.length;i++){
            $("#elevator li>a:first-child")[i].style.display=
            self.fspans[i].className=="hover"?"none":"block";
            $("#elevator li>.etitle")[i].style.display=
                self.fspans[i].className=="hover"?"block":"none";
        }
    },
    elevatorState:function(){var self=this;//根据页面总体滚动情况判断电梯是否显示
        for(var i=0;i<self.fspans.length;i++) {
            if(self.fspans[i].className=="hover") {
                $("#elevator").style.display="block";
                return;
            }
        }
        $("#elevator").style.display="none";
    },
    startScroll:function(target,step) {//开始楼层滚动
        var self=this;
        var top=document.documentElement.scrollTop
            ||document.body.scrollTop;
        console.log("target:"+target+",curr:"+top+","+step);
        window.scrollTo(0,top+step);
        //如果
        if((step>0?(top>target):(top<target))){
            clearTimeout(self.timer);
            self.timer=null;
            self.liState();
        }else{
            self.timer=setTimeout(function(){
                self.startScroll(target,step);
            },self.INTERVAL);
        }
    }
}
