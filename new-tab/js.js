;
(function(w) {
    'use strict';
    var Tab = function(tab,obj) {
        var that = this;
        //保存单个tab组件
        this.Xtab = tab;
        this.userConfig = obj;
        this.default = {
            "triggerType": "click",
            "effect": "fade",
            "invoke": 1,
            "auto": 1000
        };
        //如果默认参数存在，就拓展,(this.default拓展了！)
        if (this.getConfig()) {
            $.extend(this.default, this.getConfig());
        };
        //保存标签列表和div,用this是为了方便下面调用,全局li和div
        // this.li = this.Xtab.find('ul.tab-nav li');
        this.li = $(this.Xtab).find('ul.tab-nav li');
        // this.div = this.Xtab.find('div.content-wrap div.content-item');
        this.div = $(this.Xtab).find('div.content-wrap div.content-item');
        //保存配置参数
        var Xconfig = this.default;
        //绑定事件
        if (Xconfig.triggerType == 'click') {
            this.li.on(Xconfig.triggerType, function() {
                that.invoke($(this));
            });
        } else if (Xconfig.triggerType == 'mouseover' || Xconfig.triggerType != 'click') {
            this.li.on('mouseover', function() {
                that.invoke($(this));
            });
        };
        //自动播放
        if (Xconfig.auto) {
            //定义全局定时器
            this.timer = null;
            //计数器
            this.loop = 0;
            //自动播放函数
            this.autoPlay();
            //鼠标悬停的时候停止自动轮播
            $(this.Xtab).hover(function(){
            	window.clearInterval(that.timer);
            },function(){
            	that.autoPlay();
            });
        };
        //设置默认显示第几个tab
       	if(Xconfig.invoke > 1){
       		this.invoke(this.li.eq(Xconfig.invoke-1));
       	}
    };
    Tab.prototype = {
        //写一个拓展方法 获取默认参数和传过来的参数
        getConfig: function() {
            //拿到设置的参数
            // var Xconfig = this.Xtab.attr("data-config");
            var Xconfig = this.userConfig;
            //确保有配置参数，并且转义
            // if (Xconfig && Xconfig != '') {
            //     return $.parseJSON(Xconfig);
            // } else {
            //     return null;
            // };
            if (Xconfig && Xconfig != '') {
                return Xconfig;
            } else {
                return null;
            };
        },
        //事件驱动函数
        invoke: function(currentLi) {
            var index = currentLi.index();
            //选项切换
            currentLi.addClass('actived').siblings().removeClass('actived');
            var effect = this.default.effect;
            var newdiv = this.div;
            //内容切换
            if (effect == 'default') {
                // console.log(newdiv.eq(index))
                newdiv.eq(index).addClass('current').siblings().removeClass('current');
            } else if (effect == 'fade') {
                newdiv.eq(index).fadeIn().addClass('current').siblings().fadeOut().removeClass('current');
            };
            //如果loop 配置了自动切换，鼠标操作的时候 当前index 与loop同步
            if(this.default.auto){
            	this.loop = index;
            }
        },
        //自动播放
        autoPlay:function(){
        	var config = this.default,
        		li = this.li,
        		div = this.div,
        		liLength = li.length,
        		loop = this.loop,
        		auto = this.default.auto;

        	this.timer = window.setInterval(function(){
        		loop++;
        		if(loop>=liLength){
        			loop = 0;
        		};
        		li.eq(loop).trigger(config.triggerType);
        		if(config.triggerType == 'mouseover'){
        			li.eq(loop).trigger('mouseout');
        		}
        	},auto);
        	// console.log(1212)
        }
    };
    Tab.init = function(tabs){
        var that = this;
        tabs.each(function(){
            new that($(this));
        });
    };
    //注册成jquery 方法
    $.fn.extend({
        tab:function(){
            this.each(function(){
                new Tab($(this));
            });
            return this;
        }
    })
    window.WTab = Tab;
})(window)
