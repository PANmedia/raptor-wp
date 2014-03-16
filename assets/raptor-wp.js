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
                var id = raptor.getElement().closest('article').attr('id').replace(/[^0-9]+/, '');
                if (typeof posts[id] === 'undefined') {
                    posts[id] = {};
                }
                posts[id][raptor.getPlugin('savePost').options.type] = raptor.getHtml();
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

    $('.entry-title a').raptor({
        preset: 'micro',
        plugins: {
            dock: {
                docked: true,
                spacer: false
            },
            save: {
                plugin: 'savePost'
            },
            savePost: {
                type: 'title'
            }
        }
    });

    $('.entry-content').raptor({
        plugins: {
            dock: {
                docked: true,
                spacer: false
            },
            save: {
                plugin: 'savePost'
            },
            savePost: {
                type: 'content'
            }
        }
    });

})(jQuery);
