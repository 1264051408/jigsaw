/**
 * Created by eroAlucard on 2017/4/9.
 */
//640:480 1280*720 1920*1200
//640:480 400 360
//5:3 8:5 16:9 ~ 0.6

//�������ƴͼ���߼�����--
//���ǵ�ͼƬ�Ĳ�ͬ�ߴ��Լ���С
//���������ķ�ʽ�Ż���ʽ���߼�
!function game($){
    //���캯��--
    var mainFuc=function(config){
        this.width=config.width;
        this.height=config.height;
        this.model=config.model;
        //��Ҫ--����div�Ĵ�С--span�ĸ����ͳ���

    }

    $.geme=function(config){
        return new game();
    }
}(jQuery);