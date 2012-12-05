/* alias away the sync method */
Backbone._sync = Backbone.sync;

/* define a new sync method */
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            var token = $('meta[name="csrf-token"]').attr('content');
            if (token) xhr.setRequestHeader('X-CSRF-Token', token);
        }
    }, options)
    return Backbone._sync(method, model, new_options);
};

/**
 * ROI
 *
 * Model for a region of interest (ROI) 
 * that's rectangular and associated with a certain feature (tag)
 * of a particular image (imageId)
 * 
 * Can be persisted to and loaded from a server
 */
ROI = Backbone.Model.extend({
    urlRoot: '/roi',
    defaults: {
        imageId: '',
        tag: '', 
        x: 0,
        y: 0,
        width: 1,
        height: 1
    }
});
