$(function() {
    $.widget( "od.mSlide", {
        
        options: {
            slideMarginLeft: 50,
            change: null /* callback function for change event */
        },

        _create: function() {
            var e = this.element;
            var self = this;

            if(typeof e[0].addEventListener == 'function') {
                e[0].addEventListener("touchstart", this._touchHandler, false);
            	e[0].addEventListener("touchmove", this._touchHandler, false);
            	e[0].addEventListener("touchend", this._touchHandler, false);
            	e[0].addEventListener("touchcancel", this._touchHandler, false);
            }

            e.data('allSlidesWidth',0).css({
                'position':'relative',
                'overflow':'hidden'
            });
            
            e.find('div.slide').each(function(){
                $(this).css('float','left').data({
                    'pos_x' : e.data('allSlidesWidth'),
                    'slide_num' : $(this).prevAll('.slide').size() 
                });
                e.data('allSlidesWidth',e.data('allSlidesWidth')+$(this).width());
            });

            e.wrapInner($('<div class="mSlide_innerWrap" />').css('width',e.data('allSlidesWidth'))); 
            e.append($('<div class="mSlide_btnLeft" />').hide());
            e.append($('<div class="mSlide_btnRight" />'));
            
            i = e.find('.mSlide_innerWrap'); // inner

            e.find('.mSlide_btnRight').click(function(){
                self.slideNext();                
            });

            e.find('.mSlide_btnLeft').click(function(){
                self.slidePrev();                
            });

            i.draggable({
                axis: 'x',
                cursor: 'pointer',
                scroll: true,
                stop: function(event, ui) {
                    if($(this).position().left > 0) {
                        $(this).animate({
                          left:0
                        }, 500, 'easeOutBounce', function(){
                            self._refresh(true);
                        });
                    } else if(e.width() > (i.width() + i.position().left)){
                        $(this).animate({
                          left: (i.width()-e.width())*-1
                        }, 500, 'easeOutBounce', function(){
                            self._refresh(true);
                        });
                    } else {
                        self._refresh(true);
                    } 
                }
            });
            this._refresh(false);
        },
        
        _touchHandler: function(event) {
            var touches = event.changedTouches;
            var first = touches[0];
            var type = '';
            switch(event.type) {
                case "touchstart":
                    type="mousedown";
                    break;
                case "touchmove":
                    type="mousemove";
                    event.preventDefault();
                    break;
                case "touchend":
                    type="mouseup";
                    break;
                default: return;
            }
            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0/*left*/, null);
            first.target.dispatchEvent(simulatedEvent);
        },

        slideTo: function(slide_num){
            var e = this.element;
            var i = e.find('.mSlide_innerWrap');
            var self = this;
            switch(slide_num) {
                case 'first' : slide_num = 0; break;
                case 'last'  : slide_num = e.find('div.slide').size()-1; break; 
            }
            e.find('div.slide').each(function() {
                if ($(this).data('slide_num') == slide_num  ) {
                    if ((i.width()-($(this).data('pos_x'))) > e.width()) {
                        var slideTo = $(this).data('pos_x')*-1 + self.options.slideMarginLeft;
                    } else {
                        var slideTo = -1*(i.width()-e.width());
                    }
                    i.animate({
                        'left' : ((slideTo >0)?0:slideTo)
                    },500, null, function(){
                        self._refresh();
                    });
                    return false;
                }
            });
        },
        
        slideNext: function(){
            var e = this.element;
            var i = e.find('.mSlide_innerWrap');
            var self = this;
            var current_pos = -1*i.position().left;
            e.find('div.slide').each(function(){
                if (($(this).data('pos_x')) > current_pos+self.options.slideMarginLeft) {
                    if ((i.width()-($(this).data('pos_x'))) > e.width()) {
                        var slideTo = -1*($(this).data('pos_x')-self.options.slideMarginLeft);
                    } else {
                        var slideTo = -1*(i.width()-e.width());
                    }
                    i.animate({
                        'left' : slideTo
                    },500, null, function(){
                        self._refresh(true);
                    });
                    return false;  
                }                
            });
        },
        
        slidePrev: function(){
            var e = this.element;
            var i = e.find('.mSlide_innerWrap');
            var self = this;
            var current_pos = -1*i.position().left;  
            e.find('div.slide').each(function(){
                if (current_pos <= $(this).data('pos_x')) {
                    var slideTo = -1*($(this).prev('.slide').data('pos_x')-self.options.slideMarginLeft);
                    i.animate({
                        'left' : ((slideTo >0)?0:slideTo)
                    },500, null, function(){
                        self._refresh(true);
                    });
                    return false;
                } 
            });                
        },

        // called when created, and later when changing options or slide stops
        _refresh: function(triggerChange) {
            var e = this.element;
            var i = e.find('.mSlide_innerWrap');
            var posLeft = i.position().left;
            // hide left button if position is first slide
            if(posLeft >= 0){
                e.find('.mSlide_btnLeft').fadeOut();
            } else{
                e.find('.mSlide_btnLeft').fadeIn();
            }
            // hide right button if position is last slide
            if(e.width() >= i.width() + posLeft){
                e.find('.mSlide_btnRight').fadeOut();
            } else{
                e.find('.mSlide_btnRight').fadeIn();
            }
            if (triggerChange) {
                this._trigger("change", null, -1*posLeft);
            }
        },

        _destroy: function() {
        },

        _setOptions: function() {
            $.Widget.prototype._setOptions.apply( this, arguments );
            this._refresh(true);
        },

        _setOption: function( key, value ) {
            $.Widget.prototype._setOption.call( this, key, value );
            this._refresh(true);
        }
    });
});
