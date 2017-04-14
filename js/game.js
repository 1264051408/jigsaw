/**
 * Created by eroAlucard on 2017/4/10.
 */

!(function($){

    var Game=function(config){

        this.parameter(config);
        this.defaultCss();
        this.eventList();
        this.progressBar();
    }

    Game.prototype={

        constructor:Game,

        parameter:function(config){
            //需要的参数部分
            this.n= config.model||4;//n
            this.imageWidth= config.imageWidth||640;//width
            this.imageHeight= config.imageHeight||480;//height
            this.Pad= config.Pad || 3;//pad
            this.url= config.url || 'image/1.jpg';
            this.boxPad= 20;
            //设置处理的参数部分
            //逻辑宽高
            this.total = this.Pad * this.n;
            this.frameWidth= this.imageWidth+this.total;//W
            this.frameHeight= this.imageHeight+this.total;//H
            this.spanWidth= this.imageWidth/this.n;//w
            this.spanHeight= this.imageHeight/this.n; //h
            //逻辑开关
            this.isEnter = false;
            this.isSwitch= false;
            //逻辑处理坐标
            this.start_x=0;
            this.start_y=0;
            this.end_x=0;
            this.end_y=0;
            this.move_x=0;
            this.move_y=0;
            //逻辑序号--操作值
            this.index=0;//按下span对象的index
            this.mIndex=0;//拖动到span对象的index
            //位置数据
            this.data=[];//操作数据
            this.dataSave=[];//保存的数据
            //时间参数
            this.time= config.time||500;//动画时间
            //don 参数--
            this.spanNumber=Math.pow(this.n,2);//span个数
            this.ulobj= $('#ulist');//ul标签
            this.box = $('#box');
            this.dgzBtn= $('#disorganize');//打乱按钮
            this.rstBtn = $('#restore');//恢复按钮
            this.proBtn= $('#progress');
            this.gameText= $('#gameText');
            this.target=$('#target');
            this.targetText=$('#targetText');
            this.gameFlag=false;
        },
        defaultCss:function(){
            var that=this;

            for(var i=0;i<this.spanNumber;i++){
                $('<li order='+i+'><span index='+i+'></span></li>').appendTo(this.ulobj);
            }

            this.li = $('#box li');
            this.span = $('#box span');

            this.proBtn.css({
                width:'0%'
            });

            this.box.css({
                width: this.frameWidth + 'px',
                height: this.frameHeight + 'px',
                padding : this.boxPad + 'px'
            });

            this.li.css({
                width: this.spanWidth + this.Pad +'px',
                height: this.spanHeight + this.Pad +'px',
                padding: '0'+ this.Pad +'px'
            });

            this.data=null;
            this.dataSave=null;
            this.data=[];
            this.dataSave=[];

            this.span.each(function(i,e){

                var row=parseInt(i/that.n),
                    col=i% that.n;

                that.data[i] ={index:i,Left:(that.spanWidth+that.Pad)*col+that.Pad,Top:(that.spanHeight+that.Pad)*row+that.Pad};
                //保存数据----
                that.dataSave[i]={index:i,Left:(that.spanWidth+that.Pad)*col+that.Pad,Top:(that.spanHeight+that.Pad)*row+that.Pad};

                //$(e).appendTo(that.box);

                $(e).css({zIndex:10,width:that.spanWidth+'px',height:that.spanHeight+'px',background:'url('+ that.url +') no-repeat '+(-col*that.spanWidth)+'px '+(-row*that.spanHeight)+'px',left:(that.spanWidth+that.Pad)*col+that.boxPad+'px',top:(that.spanHeight+that.Pad)*row+that.boxPad+'px'});

            });//end
        },

        eventList:function(){
            var that=this;
            this.dgzBtn.click(function(){
                that.disorganize();//√
            });
            this.rstBtn.click(function(){
                that.restore();//√
            });
            this.box.on({mousedown:function(){
                that.index=+$(this).attr('index');
                $(this).attr('click',true);
                that.box.find('span').eq(that.index).css({zIndex:2});
            },mouseenter:function(){
                that.mIndex=+$(this).attr('index');
                that.isSwitch=that.isEnter?true:false;
            }},'span');
            this.box.mousedown(function(e){
                that.boxMouseDown(e);
            });
            this.box.mouseup(function(){
                that.boxMouseUp();
            });
            this.box.mousemove(function(e){
                that.boxMouseMove(e);
            });
            this.box.mouseleave(function(){
                that.boxMouseLeave();
            });
        },

        moveAnimate:function(i){
            this.box.find('span').eq(i).stop().animate({
                top:this.data[i].Top+this.boxPad-this.Pad,
                left:this.data[i].Left+this.boxPad-this.Pad
            },this.time);
        },

        completePercent:function(data,num){
            var m= 0, imgOfTruePositionNumber= 0, completePercent= 0;
            data.forEach(function(e){
                if(e.index===m++){
                    imgOfTruePositionNumber++;
                }
            });
            completePercent=imgOfTruePositionNumber/num;
            return completePercent;
        },

        randomArr:function(a,b){
            var arr=[];
            for(var i=0;i<a;i++){
                var num=parseInt(Math.random()*b);
                var flag=false;
                for(var j=0;j<a;j++){
                    if(num==arr[j]){
                        flag=true;
                    };
                };
                if(flag){
                    i--;
                }
                else {
                    arr[i]=num;
                }
            };
            return arr;
        },

        disorganize: function(){
            var arr=this.randomArr(this.spanNumber,this.spanNumber);
            var that=this;
            this.dataSave.forEach(function(e,i){
                that.data[i].index= that.dataSave[arr[i]].index;
                that.data[i].Left= that.dataSave[arr[i]].Left;
                that.data[i].Top= that.dataSave[arr[i]].Top;
            });

            this.span.each(function(i,e){
                $(e).animate({
                    top:that.data[i].Top+that.boxPad-that.Pad,
                    left:that.data[i].Left+that.boxPad-that.Pad
                },this.time);
            });

            this.progressBar();
            this.gameFlag=true;
        },

        restore:function(){
            var that=this;
            this.dataSave.forEach(function(e,i){
                that.data[i].index= e.index;
                that.data[i].Left= e.Left;
                that.data[i].Top= e.Top;
            });

            this.span.each(function(i,e){
                $(e).animate({
                    top:that.data[i].Top+that.boxPad-that.Pad,
                    left:that.data[i].Left+that.boxPad-that.Pad
                },this.time);
            });

            this.progressBar();
            this.gameFlag=false;
        },

        boxMouseDown:function(e){

            e.preventDefault();

            this.isEnter=true;

            this.start_x= e.clientX;
            this.start_y= e.clientY;

        },

        boxMouseUp:function(){

            var flag=this.box.find('span').eq(this.index).attr('click');

            var item=this.data[this.index],
                sItem=this.data[this.mIndex];

            this.isEnter=false;

            if(!this.isSwitch){

                this.moveAnimate(this.index);

            }else if(this.isSwitch&&flag==='true'){

                var temp_l,temp_t,temp_i;
                temp_i= item.index,item.index=sItem.index,sItem.index=temp_i;
                temp_l= item.Left,item.Left=sItem.Left,sItem.Left=temp_l;
                temp_t= item.Top,item.Top=sItem.Top,sItem.Top=temp_t;

                this.moveAnimate(this.index);
                this.moveAnimate(this.mIndex);

                this.box.find('span').css({zIndex:10});
                //判断成功的部分
                if(this.progressBar()===1&&this.gameFlag){
                    this.targetText.html('拼图完成√');
                    this.target.click();
                    this.gameFlag=false;
                    //console.log('拼图拼好了');
                };
            }

            this.box.find('span').eq(this.index).attr('click',false);
        },

        boxMouseMove:function(e){

            e.stopPropagation();

            var flag=this.box.find('span').eq(this.index).attr('click');
            //console.log(flag);
            if(this.isEnter&&flag==="true"){

                this.end_x= e.clientX;
                this.end_y= e.clientY;

                this.move_x=this.end_x-this.start_x;
                this.move_y=this.end_y-this.start_y;

                this.box.find('span').eq(this.index).css({
                    top: this.data[this.index].Top+ this.move_y+this.boxPad+'px',
                    left: this.data[this.index].Left+ this.move_x+this.boxPad+'px'
                });

            }
        },

        boxMouseLeave:function(){

            this.isEnter=false;

            this.moveAnimate(this.index);

            this.box.find('span').css({zIndex:10});
        },
        //操作进度条部分
        progressBar:function(){
            var percent=this.completePercent(this.data,this.spanNumber);

            this.proBtn.css({
                width: percent*100+'%'
            });
            this.gameText.html('完成度：'+(percent*100).toFixed(2)+'%');

            return percent;
        }
    };

    $.game=function(config){

        return new Game(config);
    }

})(jQuery);