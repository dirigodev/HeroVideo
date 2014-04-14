/*!
* HeroVideo 1.0.0
*
* Copyright 2014, Dirigo Design & Development http://github.com/dirigodev
* Released under the MIT license
*/

(function ($) {

    $.fn.heroVideo = function (options) {

        // Setup options
        var settings = $.extend({
            'fade'       : 3,
            'controls'   : '.controls',
            // Classes
            'mute'       : '.mute',
            'pause'      : '.pause',
            'close'      : '.close',
            'replay'     : '.replay',
            'closeClass' : 'closed',
            // Callbacks
            'onMute'     : null,
            'onPause'    : null,
            'onClose'    : null
        }, options);

        var methods = {
            fadeOut: function (el, $parent, force, cb) {
                var callback = cb;
                
                if (typeof force === 'function' && !cb) {
                    callback = force;
                    force = false;
                }
                
                if (force || el.currentTime >= el.duration - settings.fade) {
                    $parent.addClass(settings.closeClass);
                }
                
                if (typeof callback === 'function') {
                    callback(el.muted);
                }
            },
            mute: function (el, force, cb) {
                var callback = cb;

                if (typeof force === 'function' && !cb) {
                    callback = force;
                    force = false;
                }
                
                el.muted = force ? el.muted : !el.muted;
                
                if (typeof callback === 'function') {
                    callback(el.muted);
                }

                return el.muted;
            },
            pause: function (el, force, cb) {
                var callback = cb;

                if (typeof force === 'function' && !cb) {
                    callback = force;
                    force = false;
                }
                
                if (el.paused && !force) {
                    el.play();
                } else {
                    el.pause();
                }
                
                if (typeof callback === 'function') {
                    callback(el.paused);
                }

                return el.paused;
            },
            close: function (el, cb) {
                methods.mute(el, true);
                methods.pause(el, true);
                methods.fadeOut(el, $(el).parent(), true);
                
                if (typeof cb === 'function') {
                    cb();
                }
            },
            replay: function (el, $parent) {
                el.currentTime = 0;
                el.play();
                $parent.removeClass(settings.closeClass);
            }
        };

        return this.each(function () {

            var $this = $(this),
                video = this.getElementsByTagName("video")[0],
                trackTime = window.setInterval(methods.fadeOut, 250, video, $this);

            $(settings.mute).on('click', function () {
                methods.mute(video, settings.onMute);
                return false;
            });

            $(settings.pause).on('click', function () {
                methods.pause(video, settings.onPause);
                return false;
            });

            $(settings.close).on('click', function () {
                methods.close(video, settings.onClose);
                window.clearInterval(trackTime);
                return false;
            });

            $(settings.replay).on('click', function () {
                trackTime = window.setInterval(methods.fadeOut, 250, video, $this);
                methods.replay(video, $this);
                return false;
            });

            video.onended = function () {
                window.clearInterval(trackTime);
            };

        });

    };

})(jQuery);
