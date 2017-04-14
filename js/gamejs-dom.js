/**
 * Created by eroAlucard on 2017/4/11.
 */
$(function(){
    //652=640+3*4 492=480+3+4
    var n= 4, width=640, height= 480,Pad= 3,total=Pad*n, W= width+total, H= height+total, w=width/ n, h= height/ n, i= 0, isEnter=false, end_x= 0, end_y= 0, start_x= 0, start_y= 0, move_x= 0, move_y=0, data= [], index= 0 ,isSwitch=false,time= 500 , mIndex= 0 , dataSave=[] ;

    //1.�������Ĭ����ֹ�¼�--���
    //2.λ�÷��ء�����--���ݴ洢
    //3.�Ƿ񽻻����Ƿ������ж�--�����ı�
    //4.�¼���--�߼�������������
    //5.�����������ִ��Ӱ������--stop
    //6.ѡ�����ȥ�������еķ�ʽ--
    //7.ͨ�����ҵķ�ʽ����������--
    //8.��δ��Һ�ʵ���ٻָ����жϵĹ���--

    //����span��ǩ
    for(;i<n*n;i++){
        $('<li order='+i+'><span index='+i+'></span></li>').appendTo($('#ulist'));
    }

    var box=$('#box');

    //������������--
    function moveAnimate(i){
        box.find('span').eq(i).stop().animate({
            top:data[i].Top,
            left:data[i].Left
        },time);
    }
    //ȷ���Ƿ���ɵķ���
    function completePercent(data,num){
        var n= 0, img= 0, percent= 0;
        data.forEach(function(e){
            if(e.index===n++){
                img++;
            }
        });
        percent=img/Math.pow(num,2);
        console.log(percent);
        return percent;
    }

    function randomArr(a,b){
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
    }
    //���ҵķ���--����--��������
    $('#disorganize').click(function(){
        var arr=randomArr(n*n,n*n);
        dataSave.forEach(function(e,i){
            data[i].index= dataSave[arr[i]].index;
            data[i].Left= dataSave[arr[i]].Left;
            data[i].Top= dataSave[arr[i]].Top;
        });

        $('#box span').each(function(i,e){
            $(e).animate({
                top:data[i].Top,
                left:data[i].Left
            },time);
        });

    });

    $('#restore').click(function(){

        dataSave.forEach(function(e,i){
            data[i].index= e.index;
            data[i].Left= e.Left;
            data[i].Top= e.Top;
        });

        console.log(data);
        $('#box span').each(function(i,e){
            $(e).animate({
                top:data[i].Top,
                left:data[i].Left
            },time);
        });
    });
    //box��ʽ����
    $('#box').css({
        width: W + 'px',
        height: H + 'px'
    });
    //li��ǩ��ʽ����
    $('#box li').css({
        width: w + Pad +'px',
        height: h + Pad +'px',
        padding: '0'+ Pad +'px'
    });

    //span��ʽ����
    $('#box span').each(function(i,e){

        var row=parseInt(i/n),
            col=i% n;

        data[i] ={index:i,Left:(w+Pad)*col,Top:(h+Pad)*row};
        //��������----
        dataSave[i]={index:i,Left:(w+Pad)*col,Top:(h+Pad)*row};

        $(e).appendTo(box);

        $(e).css({zIndex:10,width:w+'px',height:h+'px',background:'url(image/1.jpg) no-repeat '+(-col*w)+'px '+(-row*h)+'px',left:(w+Pad)*col+'px',top:(h+Pad)*row+'px'});

    });//end

    //box--���к����ݴ�����ص��¼�
    box.mousedown(function(e){

        e.preventDefault();

        isEnter=true;

        start_x= e.clientX;
        start_y= e.clientY;

    }).mouseup(function(){

        isEnter=false;

        if(!isSwitch){

            moveAnimate(index);

        }else{

            var temp_l,temp_t,temp_i;
            temp_i= data[index].index,data[index].index=data[mIndex].index,data[mIndex].index=temp_i;
            temp_l= data[index].Left,data[index].Left=data[mIndex].Left,data[mIndex].Left=temp_l;
            temp_t= data[index].Top,data[index].Top=data[mIndex].Top,data[mIndex].Top=temp_t;

            moveAnimate(index);
            moveAnimate(mIndex);

            box.find('span').css({zIndex:10});

            if(completePercent(data,n)===1){
                console.log('ƴͼƴ����');
            };
        }

    }).mousemove(function(e){

        e.stopPropagation();

        if(isEnter){

            end_x= e.clientX;
            end_y= e.clientY;

            move_x=end_x-start_x;
            move_y=end_y-start_y;

            //console.log(index);
            $(this).find('span').eq(index).css({
                top: data[index].Top+ move_y+'px',
                left: data[index].Left+ move_x+'px'
            });
        }

    }).mouseleave(function(){

        isEnter=false;

        moveAnimate(index);

        box.find('span').css({zIndex:10});

    });

    //span--������������ֵ�ϵĻ�ȡ
    box.on({mousedown:function(){

        index=+$(this).attr('index');
        box.find('span').eq(index).css({zIndex:2});

    },mouseenter:function(){

        mIndex=+$(this).attr('index');
        isSwitch=isEnter?true:false;

    }},'span');

});