/**
 * Created by eroAlucard on 2017/4/9.
 */
//640:480 1280*720 1920*1200
//640:480 400 360
//5:3 8:5 16:9 ~ 0.6

//首先完成拼图的逻辑部分--
//考虑到图片的不同尺寸以及大小
//以面向对象的方式优化样式和逻辑
!function game($){
    //构造函数--
    var mainFuc=function(config){
        this.width=config.width;
        this.height=config.height;
        this.model=config.model;
        //必要--设置div的大小--span的个数和长宽

    }

    $.geme=function(config){
        return new game();
    }
}(jQuery);