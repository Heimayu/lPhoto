/**
 * @name     LPhoto.js
 * @desc     图片画廊
 * @depend   jQuery
 * @author   Heimayu
 * @date     2016-6-25
 * @URL      http://webhmy.com
 * @reutn    {jQuery}
 * @version  1.0.1
 *
 */
(function($) {

    var LPhoto = function(elem, option) {

        this.config = $.extend({}, this.defaults, option);
        this.elem = $(elem);
        this.num = this.elem.find('ul').find('li').length;
        this.elem.addClass('lPhoto');
        this._init();
    };

    LPhoto.prototype = {
        /**
         * 默认配置
         * @type {Object}
         */
        defaults: {
            title: '这是黑玛鱼的图片画廊案例', //相册封面名称
            prevUrl: 'images/prev.png', //左箭头图片源图片路径
            nextUrl: 'images/next.png', //右箭头图片源图片路径
            closeUrl: 'images/close.png' //关闭按钮图片源图片路径
        },

        _init: function() {

            this._changeDom()
                ._showPhoto();
        },

        _changeDom: function() {

            var lPcount = '<div class="lPcount">' + this.num + '</div>',
                lPtitle = '<div class="lPtitle">' + this.config.title + '</div>',
                lPlock = '<div id="lPlock"></div>',
                lPbox = '<div id="lPbox">' +
                '<a href="javascript:;" id="lPbox_pic"></a>' +
                '</div>';

            this.elem.append(lPcount, lPtitle);
            $('body').append(lPlock, lPbox);

            return this;
        },

        //点击相册
        _showPhoto: function() {

            var _this = this,
                box = _this.tpl,
                role = _this.elem.find('ul');

            //相册封面点击显示第一张图片
            role.off('click').on('click', function() {

                _this._showSingle(0);
            });
        },

        //图片显示
        _showSingle: function(n) {

            var _this = this,
                lPli = _this.elem.find('ul').find('li'),
                showImg = lPli.eq(n).find('img'),
                showBg = '<span class="lPsubbg"></span>',
                showTitle = '<span class="lPsubtitle">' + showImg.data('rel') + '   (' + (n + 1) + '/' + _this.num + ')' + '</span>',

                cloneImg = showImg.clone(),
                pic = $('#lPbox_pic');

            pic.html(cloneImg).css({
                'position': 'absolute',
                'left': '50 %',
                'top': 0
            }).append(showBg, showTitle);

            var pWidth = pic.find('img').width(), //图片宽度
                pHeight = pic.find('img').height(), //图片高度
                dWidth = $(document).width(), //屏幕可视区域宽
                dHeight = $(document).height(); //屏幕可视区域高度

            var bWidth,
                bHeight;

            if (pWidth >= dWidth) {
                bWidth = dWidth * 0.8;
                pic.find('img').css('width', '100%');
            } else {
                bWidth = pWidth;
                pic.find('img').css('width', 'auto');
            };

            if (pHeight > dHeight) {
                bHeight = dHeight * 0.9;
                pic.find('img').css('height', '100%');
            } else {
                bHeight = pHeight;
                pic.find('img').css('height', 'auto');
            };

            var bLeft = (dWidth - bWidth) / 2,
                bTop = (dHeight - bHeight) / 2;

            $('#lPlock').show().next().animate({
                'width': bWidth,
                'height': bHeight,
                'left': bLeft,
                'top': bTop
            }, 400, function() {

                if (!n) {

                    //左右箭头图片
                    $('#lPbox').append(LPhoto.tpl);
                    $('#lPleft').find('img').attr('src', _this.config.prevUrl);
                    $('#lPright').find('img').attr('src', _this.config.nextUrl);
                    $('#lPclose').find('img').attr('src', _this.config.closeUrl);

                    //左右箭头出现
                    $('#lPbox').hover(function() {
                        $('.lPnav').fadeIn();
                    }, function() {
                        $('.lPnav').fadeOut();
                    });
                };

                //左右箭头位置
                var _top = ($('#lPbox').height() - $('#lPleft').height()) / 2;
                $('#lPleft,#lPright').css('top', _top);

                //左右箭头触发
                _this._closeView()
                    ._turnDirect(n);
            });
        },

        //左右切换
        _turnDirect: function(n) {
            var _this = this;

            $('#lPleft').off('click').on('click', function() {

                var m = (n == 0) ? _this.num - 1 : --n;
                _this._showSingle(m);
            });

            $('#lPright').off('click').on('click', function() {

                var q = n == _this.num - 1 ? 0 : ++n;
                _this._showSingle(q);
            });

            return this;
        },

        //关闭预览
        _closeView: function() {
            var _this = this;

            $('#lPclose').hover(function() {
                $('.lPnav').hide();
            }, function() {
                $('.lPnav').show();
            });

            $('#lPclose').off('click').on('click', function() {

                $('#lPleft,#lPright,#lPclose').remove();
                $('#lPbox').animate({
                    'left': '20%',
                    'top': '-100%'
                }, 1, function() {
                    $('#lPbox_pic').html('');
                    $('#lPlock').fadeOut();
                });
            });

            return this;
        }

    };

    LPhoto.tpl = '<a href="javascript:;" id="lPleft" class="lPnav" title="向左切换"><img src=""/></a><a href="javascript:;" id="lPright" class="lPnav"  title="向右切换"><img src=""/></a><a href="javascript:;" id="lPclose"  title="关闭预览"><img src=""/></a>';


    $.fn.LPhoto = function(option) {

        return this.each(function() {
            new LPhoto(this, option);
        });
    };

})(jQuery);