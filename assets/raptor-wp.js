(function($) {

    var SavePostPlugin = function() {
        this.name = 'savePost';
    }

    SavePostPlugin.prototype.init = function() {};
    SavePostPlugin.prototype.enable = function() {};

    SavePostPlugin.prototype.save = function(saveSections) {
        var posts = {};
        this.raptor.unify(function(raptor) {
            if (raptor.isDirty()) {
                raptor.clean();
                var id = raptor.getElement().data('raptor-id');
                if (typeof posts[id] === 'undefined') {
                    posts[id] = {};
                }
                posts[id][raptor.getElement().data('raptor-type')] = raptor.getHtml();
            }
        });
        $.ajax({
                type: 'post',
                url: RaptorWP.url,
                data: {
                    action: 'raptor_save',
                    posts: posts,
                    nonce: RaptorWP.nonce
                }
            })
            .done(this.done.bind(this))
            .fail(this.fail.bind(this));
    };

    SavePostPlugin.prototype.done = function(data, status, xhr) {
        this.raptor.unify(function(raptor) {
            if (raptor.isDirty()) {
                raptor.saved([data, status, xhr]);
            }
            raptor.disableEditing();
        });
        $.pnotify({
            text: data,
            type: 'success',
            state: 'confirmation',
            styling: 'jqueryui',
            history: false
        });
    };

    SavePostPlugin.prototype.fail = function(xhr) {
        $.pnotify({
            text: 'Failed to save content.',
            type: 'error',
            styling: 'jqueryui',
            history: false
        });
    };

    Raptor.registerPlugin(new SavePostPlugin());

    var options = {
        plugins: {
            dock: {
                docked: true,
                spacer: false
            },
            save: {
                plugin: 'savePost'
            }
        },
        bind: {
            enabling: function() {
                var element = this.getElement(),
                    source = element.attr('data-raptor-source');
                if (source) {
                    element.html(atob(source));
                }
            },
            saved: function() {
                var html = this.getHtml();
                this.getElement()
                    .attr('data-source', btoa(html));
            }
        }
    }

    $('.raptor-micro').raptor($.extend({}, options, {
        preset: 'micro'
    }));

    $('.raptor-content').raptor(options);

    $('body').on('click', 'a', function(e) {
        if ($(this).find('.raptor-editing').length) {
            e.preventDefault();
        }
    });

})(jQuery);
