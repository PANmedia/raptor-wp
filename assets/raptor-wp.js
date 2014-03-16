/*
jQuery('.wp-editor-area').raptor({
    preset: 'inline',
    plugins: {

    }
});
*/
(function($) {

    var SaveWpPlugin = function() {
        this.name = 'saveWp';
    }

    SaveWpPlugin.prototype.init = function() {};
    SaveWpPlugin.prototype.enable = function() {};

    SaveWpPlugin.prototype.save = function(saveSections) {
        $.ajax({
                type: 'post',
                dataType: 'json',
                url: RaptorWP.url,
                data: {
                    action: 'raptor_save',
                    posts: this.raptor.getHtml(),
                    nonce: RaptorWP.nonce
                }
            })
            .done(this.done.bind(this))
            .fail(this.fail.bind(this));
    };

    SaveWpPlugin.prototype.done = function(data, status, xhr) {
        this.raptor.unify(function(raptor) {
            if (raptor.isDirty()) {
                raptor.saved([data, status, xhr]);
            }
        });
        $.pnotify({
            text: 'Successfully saved content.',
            type: 'success',
            state: 'confirmation',
            styling: 'jqueryui',
            history: false
        });
        if (!this.options.retain) {
            this.raptor.unify(function(raptor) {
                raptor.disableEditing();
            });
        }
    };

    SaveWpPlugin.prototype.fail = function(xhr) {
        $.pnotify({
            text: 'Failed to save content.',
            type: 'error',
            styling: 'jqueryui',
            history: false
        });
    };

    Raptor.registerPlugin(new SaveWpPlugin());

    $('.entry-content').raptor({
        plugins: {
            dock: {
                docked: true,
                spacer: false
            },
            save: {
                plugin: 'saveWp'
            },
            saveJson: {
                id: RaptorWP.id,
                url: RaptorWP.url,
                postName: 'raptor-content',
                data: function(id, contentData) {
                    console.log(id, contentData);
                    var data = {
                        action: 'save_post',
                        posts: contentData,
                        nonce: RaptorWP.nonce
                    };
                    return data;
                }
            }
        }
    });

})(jQuery);
