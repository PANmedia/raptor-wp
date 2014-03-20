(function($) {
$.ui.dialog.prototype.options.autoReposition = true;
$.ui.dialog.prototype.options.autoResize = true;

var processResize = function() {
	$('.ui-dialog-content:visible').each(function() {
		var content = $(this),
			dialog = content.data('ui-dialog');
		if (dialog.options.modal === true) {
			if (dialog.options.autoReposition) {
				dialog.option('position', dialog.options.position);
			}
			if (dialog.options.autoResize) {
				content.height('auto');
				var parent = content.parent();
				if (content.height() > $(window).height()) {
					content.height($(window).height() - (parent.height() - content.height()) - 20);
				}
			}
		}
	});
};

$(window).resize(processResize);

$.widget('ui.dialog', $.ui.dialog, {
    open: function() {
        var result = this._super();
        processResize();
        setTimeout(processResize, 1);
        return result;
    }
});
})(jQuery);