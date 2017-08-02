// 匿名函数自执行
;
(function($) {
    //定义tab构造函数,一般大写
    var Tab = function(tab) {
        var _this_ = this; //保存Tab类自身
        //保存单个tab组件
        this.tab = tab;
        //默认配置参数(所有方法各种都依赖于它)
        this.config = {
            "triggerType": "click",
            "effect": "fade",
            "invoke": 2,
            "auto": 1000
        };
        //执行配置的函数
        this.getConfig();
        // console.log(this.getConfig());
        //如果配置参数存在，就扩展默认配置参数
        if (this.getConfig()) {
            $.extend(this.config, this.getConfig());
        };
        // console.log(this.config);
        //保存tab标签列表、保存对应内容列表
        this.tabItems = this.tab.find('ul.tab-nav li');
        this.contentItems = this.tab.find('div.content-wrap div.content-item');
        //保存配置参数
        var config = this.config;
        // console.log('this.config',this.tabItems);
        if (config.triggerType === 'click') {
            this.tabItems.on(config.triggerType, function() {
                _this_.invoke($(this));
            })
        } else if (config.triggerType === 'mouseover' || config.triggerType != 'click') {
            this.tabItems.on('mouseover', function() {
                _this_.invoke($(this));
            })
        };
        //自动切换功能
        if (config.auto) {
            //定义一个全局的定时器
            this.timer = null;
            //定义计数器
            this.loop = 0;
            this.autoPlay();
            this.tab.hover(function(){
            	window.clearInterval(_this_.timer);
            	// console.log(1)
            },function(){
            	_this_.autoPlay();
            });
        };
        //设置默认显示第几个tab
        if(config.invoke > 1){
        	this.invoke(this.tabItems.eq(config.invoke-1));
        };
    };
    Tab.prototype = {
            //自动间隔切换
            autoPlay: function() {
                var _this_ = this,
                    tabItems = this.tabItems,
                    tabLength = tabItems.length,
                    config = this.config;
                this.timer = window.setInterval(function() {
                    _this_.loop++;
                    // console.log(_this_.loop);
                    if (_this_.loop >= tabLength) {
                        _this_.loop = 0;
                    };
                    tabItems.eq(_this_.loop).trigger(config.triggerType);
                	if(config.triggerType == "mouseover"){
                		tabItems.eq(_this_.loop).trigger("mouseout");
                	}
                }, config.auto);
            },
            //事件驱动函数
            invoke: function(currentTab) {
                // console.log('this',this)
                var _this_ = this;
                /*
                 *要执行Tab的选中状态，当前选中的加active（标记为白底）
                 *切换对应的tab内容，要根据配置参数的effect是default还是fade
                 */
                var index = currentTab.index();
                //tab选中状态
                currentTab.addClass("actived").siblings().removeClass("actived");
                //切换对应的内容区域
                var effect = this.config.effect;
                var conItems = this.contentItems;
                // console.log(effect)
                if (effect == 'default' || effect != 'fade') {
                    conItems.eq(index).addClass('current').siblings().removeClass('current');
                } else if (effect == 'fade') {
                    conItems.eq(index).fadeIn().addClass('current').siblings().fadeOut().removeClass('current');

                };
                //loop 配置了自动切换 当前index 与 loop同步
                if(this.config.auto){
                	this.loop = index;
                };
            },
            //获取需要配置的参数
            getConfig: function() {
                //拿一下tab.elem节点上的data-config
                var config = this.tab.attr("data-config");
                // console.log(config);
                //确保有配置参数
                if (config && config != "") {
                    return $.parseJSON(config); //用于格式化完好的JSON字符,转换为与之对应的javascript对象
                } else {
                    return null;
                }
            }
        };
        Tab.init = function(tabs){
        	var _this_ = this;
        	tabs.each(function(){
        		new _this_($(this));
        	});
        };
        //注册到window对象上
    window.Tab = Tab;
})(jQuery);
