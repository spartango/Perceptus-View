/* alias away the sync method */
Backbone._sync = Backbone.sync;

/* define a new sync method */
Backbone.sync = function(method, model, success, error) {
  /* only need a token for non-get requests */
  if (method == 'create' || method == 'update' || method == 'delete') {
    /* grab the token from the meta tag rails embeds */
    var auth_options = {};
    auth_options[$("meta[name='csrf-param']").attr('content')] =
                 $("meta[name='csrf-token']").attr('content');
    /* set it as a model attribute without triggering events */
    model.set(auth_options, {silent: true});
  }
  /* proxy the call to the old sync method */
  return Backbone._sync(method, model, success, error);
}

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
