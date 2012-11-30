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
    defaults: {
        imageId: '',
        tag: '', 
        x: 0,
        y: 0,
        width: 1,
        height: 1
    }
});
